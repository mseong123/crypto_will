
import { useNetworkVariable } from "../networkConfig";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { useSignature } from '../hooks/useSignature';
import { createAccount } from '../utils/createAccount'
import { SuiClient } from "@mysten/sui/client";
import { LogStatus, useLogin } from './UserContext';
import { Transaction } from "@mysten/sui/transactions";
import { useEnokiFlow } from "@mysten/enoki/react";
import { useState } from "react";




export function CreateAccount({ refetch }) {
	const packageID = useNetworkVariable("packageId");
	const account = useCurrentAccount();
	const signAndExecute = useSignature()

	const url = import.meta.env.VITE_APP_SUI_FULLNODE_URL;
	const suiClient = useSuiClient()
	const { isLoggedIn, userDetails, login, logOut } = useLogin();

	  const [txnDigest, setTxnDigest] = useState("");
	  const [loading, setLoading] = useState(false);
	  const enoki = useEnokiFlow()

	async function createAccountZK(packageId, enoki) {
		const keypair = await enoki.getKeypair({network: "testnet"})
		const tx = new Transaction();
		tx.moveCall({
			arguments: [],
			target: `${packageId}::crypto_will::new`
		});

		try {
			const txnRes = await suiClient.signAndExecuteTransaction({
				transaction: tx,
				signer: keypair,
			})

			if (txnRes && txnRes?.digest) {
				setTxnDigest(txnRes?.digest);
				alert(`Transfer Success. Digest: ${txnRes?.digest}`);
				getBalance(userDetails.address);
			}
		} catch (err) {
			console.log("Error transferring SUI.", err);
			alert("Error transferring SUI. Check logs for details.");
		}
	}




	return (
		<Card className="center w-75" >
			<Card.Body>
				<Card.Title>No Account exist</Card.Title>
				<Card.Subtitle className="mb-2 text-muted">Account Creation</Card.Subtitle>
				<Card.Text>
					Your account is used to store and manage your personal records on SUI's blockchain.
				</Card.Text>
				<Card.Link style={{ cursor: "pointer" }} onClick={() => isLoggedIn === LogStatus.wallet ?createAccount(packageID, signAndExecute, refetch): createAccountZK(packageID, enoki) }>Create Account</Card.Link>
			</Card.Body>
		</Card>
	);
}
