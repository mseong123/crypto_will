import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { decryptAES } from "../utils/encryptionAES"
import { IPFS_Gateway } from "../constants"
import { downloadIPFS } from "../utils/downloadIPFS"
import { deleteRecord } from "../utils/deleteRecord"
import { useState, useEffect } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";
import { LogStatus, useLogin } from './UserContext';
import { Transaction } from "@mysten/sui/transactions";
import { useEnokiFlow } from "@mysten/enoki/react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Tooltip from './Tooltip';
import { useSuiClient } from '@mysten/dapp-kit';

export function Record({ encryptionPhrase, response, fields, index }) {
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false);
	let decrypted;
	if (!error) {
		decrypted = decryptAES(encryptionPhrase, fields.encryptedCID[index], setError, index);
	}
	const signAndExecute = useSignature();
	const packageId = useNetworkVariable('packageId');

	const url = import.meta.env.VITE_APP_SUI_FULLNODE_URL;
	const suiClient = useSuiClient()
	const { isLoggedIn, userDetails, login, logOut } = useLogin();

	const [txnDigest, setTxnDigest] = useState("");
	const enoki = useEnokiFlow()


	async function deleteRecordZK(index, packageID, response, enoki, setLoading) {
		const keypair = await enoki.getKeypair()
		const tx = new Transaction();
		console.log(response.data.data[0].data.objectId)
		console.log(index)
		tx.moveCall({
			arguments: [tx.object(response.data.data[0].data.objectId), tx.pure.u64(index)],
			target: `${packageID}::crypto_will::delete`,
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
			console.log("Error deleting record.", err);
			alert("Error deleting record. Check logs for details.");
		}
	}

	return (
		<Container>
			<Card className="mb-3 mx-2">
				<Card.Body>
					<Row>
						<Col style={{ float: "left" }}>
							<Container>
								<Row className="float-left me-3">
									<Col className="col-md-2"><Image src="tag.png" rounded style={{ width: "20px" }} /></Col>
									<Col><h6 style={{ fontWeight: 500, float: "left" }}>{fields.description[index]}</h6></Col>
								</Row>
								<Row className="float-left me-3">
									<Col className="col-md-2"><Image src="folder.png" rounded style={{ width: "20px" }} /></Col>
									<Col ><h6 style={{ fontWeight: 500, float: "left" }}>{fields.filename[index]}</h6></Col>
								</Row>
								<Row className="float-left me-3">
									<Col className="col-md-2"><Image src="calendar.png" rounded style={{ width: "20px" }} /></Col>
									<Col><h6 style={{ fontWeight: 500, float: "left" }}>{Date(fields.timestamp[index]).toString()}</h6></Col>
								</Row>
							</Container>
						</Col>
						<Col className="col-md-2">
							{error ? (
								<>
									<Tooltip text={error}>
										<Image src="padlock.png" rounded style={{ width: "20px" }} />
									</Tooltip>
									<Button variant="primary" type="button" onClick={() => {
										isLoggedIn === LogStatus.wallet ?deleteRecord(index, packageId, response, signAndExecute, setLoading) : deleteRecordZK(index, packageId, response, enoki, setLoading)
									}}>
										<Image src="delete.png" rounded style={{ width: "20px" }} />
									</Button>
								</>)
								: (
									<>
										<Card.Text>
											<Button style={{ marginBottom: "5px" }} target={"_blank"} href={IPFS_Gateway + decrypted}><Image src="preview.png" rounded style={{ width: "20px" }} /></Button>
											<Button style={{ cursor: "pointer", marginBottom: "5px" }} onClick={() => { downloadIPFS(decrypted, setError, fields.filename[index]) }}><Image src="download.png" rounded style={{ width: "20px" }} /></Button>
											<Button variant="primary" className="d-inline-block" type="button" onClick={() => {
												deleteRecord(index, packageId, response, signAndExecute, setLoading)
											}}>
												<Image src="delete.png" rounded style={{ width: "20px" }} />
											</Button>
										</Card.Text>
									</>
								)}
						</Col>
						{loading ? <Alert className="mt-3" variant="dark">Deleting...</Alert> : null}
					</Row>
				</Card.Body>
			</Card>
		</Container>
	)

}
