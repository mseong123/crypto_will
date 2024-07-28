// src/components/GoogleAuth.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import {
	generateNonce,
	generateRandomness,
	jwtToAddress,
	getExtendedEphemeralPublicKey,
	genAddressSeed,
	getZkLoginSignature,
} from '@mysten/zklogin';
// import { AuthProvider, AuthState, initialState, UserSpecificData } from './AuthContext';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI } from '../constants';
import CryptoJS from "crypto-js";
import {
	decodeSuiPrivateKey,
	encodeSuiPrivateKey,
} from "@mysten/sui/cryptography";

import { useAuth, AuthState } from './AuthContext';
import { Transaction } from '@mysten/sui/transactions';
export type PartialZkLoginSignature = Omit<
	Parameters<typeof getZkLoginSignature>['0']['inputs'],
	'addressSeed'
>;

export const MIST_PER_SUI = 1000000000n;

export async function createKeypairFromBech32(
	bech32SecretKey: string,
): Promise<Ed25519Keypair> {
	try {
		// Decode the Bech32 string
		// const decoded = bech32.decode(bech32SecretKey);
		const { schema, secretKey } = decodeSuiPrivateKey(bech32SecretKey);
		// Convert the decoded words back to a Uint8Array
		// const decodedUint8Array = new Uint8Array(bech32.fromWords(decoded.words));
		return Ed25519Keypair.fromSecretKey(secretKey);
	} catch (error) {
		console.error("Error creating keypair from Bech32:", error);
		throw error;
	}
}


function generateUserSalt(sub: string) {
	const hash = CryptoJS.SHA256(sub);
	// Convert the hash to a WordArray and then to a byte array
	const hashBytes = CryptoJS.enc.Hex.parse(hash.toString());
	const hashArray = Array.from(CryptoJS.enc.Hex.stringify(hashBytes), (char) =>
		parseInt(char, 16)
	);

	// Get the first 16 bytes
	const saltArray = hashArray.slice(0, 16);
	const salt = new Uint8Array(saltArray);
	let decimalString = '';
	for (const byte of salt) {
		decimalString += byte.toString();
	}

	return decimalString;
	// return salt;
}



export function GoogleAuth() {
	// const { authState, setAuthState, logout } = useAuth();
	// const [token, setToken] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [code, setCode] = useState<string | null>(null);

	const { authState, jwt, userSpecificData, zkLoginSignature, zkLoginAddress, ephemeralSecretKey, walletAccount, logout, setJwt, setUserSpecificData, setZkLoginSignature, setZkLoginAddress, setEphemeralSecretKey, setAuthState, proof, setProof, seed, setSeed} = useAuth();


	const rpcUrl = getFullnodeUrl('devnet');
	const suiClient = new SuiClient({ url: rpcUrl });
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		if (code) {
			const usd_string = sessionStorage.getItem("userSpecificData")
			let usd = null;
			if (usd_string) {
				usd = JSON.parse(usd_string);
			}
			const fetchToken = async () => {
				try {
					const tokenResponse = await axios.post(
						'https://oauth2.googleapis.com/token',
						null,
						{
							params: {
								code: code as string,
								client_id: GOOGLE_CLIENT_ID,
								client_secret: GOOGLE_CLIENT_SECRET,
								redirect_uri: REDIRECT_URI,
								grant_type: 'authorization_code',
							},
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
							},
						}
					);

					const { id_token } = tokenResponse.data;
					setJwt(id_token)
					sessionStorage.setItem("jwt", id_token)
					if (id_token && usd) {
						const decodedJwt = jwtDecode(id_token) as JwtPayload;
						try {
							if (!decodedJwt.sub) {
								throw new Error("Missing sub in payload");
							}
							const userSaltString: string = decodedJwt.sub;
							const userSalt = generateUserSalt(userSaltString);
							const zkLoginUserAddress = jwtToAddress(id_token, userSalt);
							sessionStorage.setItem('zkLoginAddress', zkLoginUserAddress)
							setZkLoginAddress(zkLoginUserAddress)
							const ephemeralKeyPair = await createKeypairFromBech32(usd.privateKey);
							sessionStorage.setItem('ephemeralSecretKey', usd.privateKey)
							setEphemeralSecretKey(usd.privateKey)

							const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(
								ephemeralKeyPair.getPublicKey(),
							);

							const prover_url = "https://prover-dev.mystenlabs.com/v1";

							const maxEpoch = usd.maxEpoch;
							const payload = {
								jwt: id_token as string,
								extendedEphemeralPublicKey: extendedEphemeralPublicKey,
								maxEpoch: maxEpoch as string,
								jwtRandomness: usd.randomness as string,
								salt: userSalt,
								keyClaimName: "sub",
							};

							const proofResponse = await axios.post(prover_url, JSON.stringify(payload), {
								headers: { "Content-Type": "application/json" },
							});
							const proof = proofResponse.data;
							const proofString =JSON.stringify(proof);
							setProof(proofString);
							sessionStorage.setItem("proof", proofString);


							console.log(proof)
							const partialZkLoginSignature = proof as PartialZkLoginSignature;
							const txb = new Transaction();
							const [coin] = txb.splitCoins(txb.gas, [MIST_PER_SUI * 1n])

							txb.setSender(zkLoginUserAddress)
							txb.transferObjects(
								[coin],
								// "0x6af474423e9ecd218e026616247ae4f5147957967ff0dbe612b2719209d99f86"
								"0x665f5ee73869cf9bd800b69a069bb9f2610f71ee02e29162de55b03aa042131b"
							);
							const { bytes, signature: userSignature } = await txb.sign({ client: suiClient, signer: ephemeralKeyPair });
							if (!decodedJwt.aud) {
								throw new Error("Aud missing")
							}
							const addressSeed: string = genAddressSeed(BigInt(userSalt!), "sub", decodedJwt.sub, decodedJwt.aud.toString()).toString();
							setSeed(addressSeed);
							sessionStorage.setItem('seed', addressSeed)
							const zkLoginSignature = getZkLoginSignature({
								inputs: {
									...partialZkLoginSignature,
									addressSeed,
								},
								maxEpoch,
								userSignature,
							})
							sessionStorage.setItem('zkLoginSignature', zkLoginSignature);
							setZkLoginSignature(zkLoginSignature)

							suiClient.executeTransactionBlock({
								transactionBlock: bytes,
								signature: zkLoginSignature,
							});
							setIsAuthenticated(true);
							console.log("SUCCESSS BITCH")

						} catch (err) {
							console.error(err)
						}
					}
				} catch (error) {
					console.error('Error during OAuth process:', error);
				}
			};

			fetchToken();
			setIsAuthenticated(true)
			setAuthState(AuthState.ZK)
			// console.log("decoded jwt", state)
		}
	}, []);

	async function getMaxEpoch(suiClient: SuiClient): Promise<number | null> {
		try {
			const { epoch } = await suiClient.getLatestSuiSystemState();
			console.log(epoch)
			return (Number(epoch) + 10); // this means the ephemeral key will be active for 2 epochs from now.
		} catch (e) {
			console.error("error trying to get epoch", e)
			return null;
		}
	}

	async function generateUserSpecificData(suiClient: SuiClient): Promise<UserSpecificData> {
		const maxEpoch = await getMaxEpoch(suiClient);
		if (maxEpoch === null) {
			throw new Error("Error getting epoch");
		}
		const ephemeralKeyPair = new Ed25519Keypair();
		const privateKey = ephemeralKeyPair.getSecretKey();
		// const publicKey = ephemeralKeyPair.getPublicKey();
		// console.log("BEFORE------------------------------------------");
		// console.log(privateKey, "|");
		// console.log(publicKey);
		const randomness = generateRandomness();
		// console.log(randomness)
		const nonce = generateNonce(
			ephemeralKeyPair.getPublicKey(),
			maxEpoch,
			randomness,
		);
		return { maxEpoch, privateKey, randomness, nonce };
	}


	const googleAuth = async () => {
		const userSpecificData = await generateUserSpecificData(suiClient);
		setUserSpecificData(userSpecificData);
		sessionStorage.setItem('userSpecificData', JSON.stringify(userSpecificData));
		const AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=openid email profile&nonce=${userSpecificData.nonce}`;
		window.location.href = AUTH_URL;
	};

	return (
		<div>
			<h1>Google Authentication with zkLogin</h1>
			{isAuthenticated && zkLoginAddress && ephemeralSecretKey ? (
				<>
					<button onClick={logout} style={{ color: 'black' }}>
						Logout
					</button>
				</>
			) : (
				<button onClick={googleAuth} style={{ color: 'black' }}>
					Login with Google
				</button>
			)}
		</div>
	);
}







// function testAuth() {
//
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get('code');
//
//     if (code) {
//       const fetchToken = async () => {
//         try {
//           const tokenResponse = await axios.post(
//             'https://oauth2.googleapis.com/token',
//             null,
//             {
//               params: {
//                 code,
//                 client_id: GOOGLE_CLIENT_ID,
//                 client_secret: GOOGLE_CLIENT_SECRET,
//                 redirect_uri: REDIRECT_URI,
//                 grant_type: 'authorization_code',
//               },
//               headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//               },
//             }
//           );
//
//           const { id_token } = tokenResponse.data;
//           setEncodedJWT(id_token);
//
//           if (id_token) {
//             const decodedJwt = jwtDecode<JwtPayload>(id_token);
//             if (!decodedJwt.sub) {
//               throw new Error("Missing 'sub' in payload");
//             }
//
//             const maxEpoch = 100; // Example value, replace with actual logic
//             const ephemeralKeyPair = new Ed25519Keypair();
//             const privateKey = ephemeralKeyPair.getSecretKey().toString('hex');
//             const publicKey = ephemeralKeyPair.getPublicKey();
//             const randomness = generateRandomness();
//             const nonce = generateNonce(publicKey, maxEpoch, randomness);
//
//             setUserSpecificData({ maxEpoch, privateKey, randomness, nonce });
//
//             const userSaltString = decodedJwt.sub;
//             const userSalt = crypto.createHash('sha256').update(userSaltString).digest().subarray(0, 16);
//             const zkLoginUserAddress = jwtToAddress(id_token, userSaltString);
//             const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(publicKey);
//
//             console.log('Decoded JWT:', decodedJwt);
//             console.log('User Specific Data:', { maxEpoch, privateKey, randomness, nonce });
//             console.log('zkLogin User Address:', zkLoginUserAddress);
//             console.log('Extended Ephemeral Public Key:', extendedEphemeralPublicKey);
//           }
//         } catch (error) {
//           console.error('Error during OAuth or zkLogin process:', error);
//         }
//       };
//
//       fetchToken();
//     } else {
//       const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=openid email profile&nonce=${generateRandomness()}`;
//       window.location.href = authUrl;
//     }
//   }
