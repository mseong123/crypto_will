
import { useState } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { createTrustee } from "../utils/createTrustee"
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

import { LogStatus, useLogin } from './UserContext';
import { Transaction } from "@mysten/sui/transactions";
import { useEnokiFlow } from "@mysten/enoki/react";

export function CreateTrustee({ account, response }) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const signAndExecute = useSignature();
	const packageId = useNetworkVariable('packageId');

	const url = import.meta.env.VITE_APP_SUI_FULLNODE_URL;
	const suiClient = useSuiClient()
	const { isLoggedIn, userDetails, login, logOut } = useLogin();

	const [txnDigest, setTxnDigest] = useState("");
	const enoki = useEnokiFlow()

	async function createTrusteeZK(response, trusteeAddress, trusteeDescription, testatorAlias, packageID, enoki,setLoading, id_trusteeAddress, id_trusteeDescription, id_testatorAlias) {
		const keypair = await enoki.getKeypair({network: "testnet"})
		const tx = new Transaction();
		tx.moveCall({
			arguments: [tx.object(response.data.data[0].data.objectId), tx.pure.address(trusteeAddress), tx.pure.string(trusteeDescription), tx.pure.string(testatorAlias), tx.pure.string(String(Date.now()))],
			target: `${packageID}::crypto_will::addTrustee`,
		});


		try {
			const txnRes = await suiClient.signAndExecuteTransaction({
				transaction: tx,
				signer: keypair,
			})

			if (txnRes && txnRes?.digest) {
				setTxnDigest(txnRes?.digest);
				alert(`Transfer Success. Digest: ${txnRes?.digest}`);
				
			}
		} catch (err) {
			console.log("Error transferring SUI.", err);
			alert("Error transferring SUI. Check logs for details.");
		}
	}

	return (
		<Card className="mb-3 mx-2">
			<Card.Body>
				<h6 style={{ fontWeight: "bold" }}>Nominate Trustee</h6>
				<hr />
				<Form onSubmit={async (e) => {
					e.preventDefault();
					setError(null);
					setLoading(true);
					const trusteeAddress = document.getElementById("trusteeAddress").value
					const trusteeDescription = document.getElementById("trusteeDescription").value
					const testatorAlias = document.getElementById("testatorAlias").value
					if (response.data.data[0].data.content.fields.trustee.includes(trusteeAddress))
						setError("Nominee is already your trustee. Use a different address")
					else {
						if (isLoggedIn === LogStatus.wallet)
							createTrustee(response, trusteeAddress, trusteeDescription, testatorAlias, packageId, signAndExecute, setLoading, "trusteeAddress", "trusteeDescription", "testatorAlias")
						else
							createTrusteeZK(response, trusteeAddress, trusteeDescription, testatorAlias, packageId, enoki, setLoading, "trusteeAddress", "trusteeDescription", "testatorAlias")
					}
				}}
				>
					<Container>
						<Row>
							<Col><Container><Form.Group controlId={"trusteeAddress"}>
								<Row>
									<Col><Form.Label>Trustee's blockchain address</Form.Label></Col>
									<Col><Form.Control
										type="text"
										size="sm"
									/></Col>
								</Row>
							</Form.Group></Container>
								<Container><Form.Group controlId={"trusteeDescription"}>
									<Row>
										<Col><Form.Label>Description for your Trustee</Form.Label></Col>
										<Col><Form.Control
											type="text"
											size="sm"
										/></Col>
									</Row>
								</Form.Group>
								</Container>
								<Container><Form.Group controlId={"testatorAlias"}>
									<Row>
										<Col><Form.Label>Your alias (to identify yourself to Trustee)</Form.Label></Col>
										<Col><Form.Control
											type="text"
											size="sm"
										/></Col>
									</Row>
								</Form.Group>
								</Container></Col>
							<Col className="col-md-2 float-right mt-4"><Button type="submit">
								<Image src="add.png" rounded style={{ width: "25px" }} />
							</Button></Col>
						</Row>
					</Container>
					{loading ? <Alert className="mt-3" variant="dark">Uploading...</Alert> : null}
					{error ? <Alert className="mt-3" variant="dark">{error}</Alert> : null}
				</Form>
			</Card.Body>
		</Card>
	)
}
