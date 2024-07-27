import { useCurrentAccount } from "@mysten/dapp-kit";
import Alert from 'react-bootstrap/Alert';
import { AuthState, useAuth } from "./components/AuthContext";
import { useEffect, useState } from "react";
import { useZk } from "./components/ZkProvider";

export function WalletStatus() {
	const { authState, jwt, userSpecificData, zkLoginSignature, zkLoginAddress, ephemeralSecretKey, walletAccount, logout, setJwt, setUserSpecificData, setZkLoginSignature, setZkLoginAddress, setEphemeralSecretKey, setAuthState, } = useAuth();
	// const [zkLoginSignature, setZkLoginSignature] = useState<string | undefined>(undefined);
	// const [zkLoginAddress, setZkLoginAddress] = useState<string | undefined>(undefined);
	// const [ephemeralSecretKey, setEphemeralSecretKey] = useState<string | undefined>(undefined);
	const account = useCurrentAccount();

	useEffect(() => {
		console.log(authState)
	}, [])


	return (
		<>
			{account || authState === AuthState.ZK ?
				<Alert style={{ overflowWrap: "break-word", backgroundColor: "turquoise", color: "#606060" }}>
					<Alert.Heading >Wallet connected.</Alert.Heading>
					Address: {account ? account.address : zkLoginAddress}
				</Alert> : <Alert variant="warning">
					Wallet not connected. Please Connect your Wallet
				</Alert>
			}
		</>
	);
}
