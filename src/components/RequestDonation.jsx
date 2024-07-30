import { useState } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";
import { useObjectQuery } from "../hooks/useObjectQuery"
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { requestDonation } from "../utils/requestDonation"
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import { LogStatus, useLogin } from './UserContext';
import { Transaction } from "@mysten/sui/transactions";
import { useEnokiFlow } from "@mysten/enoki/react";

export function RequestDonation() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const signAndExecute = useSignature();
	const account = useCurrentAccount();
	const packageId = useNetworkVariable('packageId');
	const url = import.meta.env.VITE_APP_SUI_FULLNODE_URL;
	const suiClient = useSuiClient()
	const { isLoggedIn, userDetails, login, logOut } = useLogin();

	const [txnDigest, setTxnDigest] = useState("");
	const enoki = useEnokiFlow()
	const response = useObjectQuery(
		'getOwnedObjects',
		{
			owner: isLoggedIn === LogStatus.wallet? account.address : userDetails.address,
			filter: {
				StructType: `${packageId}::crypto_will::Donated`,
			},
			options: { showType: true, showContent: true },
		},
		{
		}
	);


	async function requestDonationZK(response, donorAddress, donorAlias, donorDescription, packageID, enoki, setLoading, id_donorAddress, id_donorAlias, id_donorDescription) {
		const keypair = await enoki.getKeypair({network: "testnet"});
		const tx = new Transaction();
		tx.moveCall({
			arguments: [tx.pure.address(donorAddress), tx.pure.string(donorAlias), tx.pure.string(donorDescription)],
			target: `${packageID}::crypto_will::sendDonationCap`,
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

	const DonorList = () => {
		if (response.data && response.data.data.length > 0) {
			const donorCards = response.data.data.map((data, index) => {
				return (
					<Container>
						<Card key={index} className="mb-2 mx-2">
							<Card.Body style={{ color: "rgb(96, 96, 96)" }}>
								<Row><Col className='col-md-1'><Image src="home.png" rounded style={{ width: "25px" }} /></Col>
									<Col><h6 style={{ float: "left", overflowWrap: "break-word" }}>{data.data.content.fields.donorAddress}</h6></Col></Row>
								<Row><Col className='col-md-1'><Image src="calendar.png" rounded style={{ width: "25px" }} /></Col>
									<Col><h6 style={{ float: "left", marginTop: "6px" }}>{data.data.content.fields.donorAlias}</h6></Col></Row>
								<Row><Col className='col-md-1'><Image src="donation.png" rounded style={{ width: "25px" }} /></Col>
									<Col><h6 style={{ float: "left", marginTop: "6px" }}>{data.data.content.fields.amount + " SUI"}</h6></Col></Row>
							</Card.Body>
						</Card>
					</Container>
				)
			})

			return <>{donorCards}</>;
		}
		else return <></>
	}

	return (
		<>
			<Container style={{ padding: "0px", height: "100%" }} className="record-container mb-3">
				<Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
					<Col className="col-md-5" style={{ paddingRight: "0px" }}><Image src="small.png" rounded style={{ width: "70px", float: "inline-end" }} /></Col>
					<Col><h5 className="mb-3" style={{ float: "left", padding: "15px", paddingLeft: "0px" }}>Request Donation</h5></Col>
				</Row>
				<Card className="mb-3 mx-2">
					<Card.Body>
						<Form onSubmit={async (e) => {
							e.preventDefault();
							setError(null);
							setLoading(true);
							const donorAddress = document.getElementById("donorAddress").value
							const donorAlias = document.getElementById("donorAlias").value
							const donorDescription = document.getElementById("donorDescription").value
							if (isLoggedIn === LogStatus.wallet) {
								requestDonation(response, donorAddress, donorAlias, donorDescription, packageId, signAndExecute, setLoading, "donorAddress", "donorAlias", "donorDescription")
							}
							if (isLoggedIn === LogStatus.zk) {
								requestDonationZK(response, donorAddress, donorAlias, donorDescription, packageId, enoki, setLoading, "donorAddress", "donorAlias", "donorDescription")
							}
						}}
						>
							<Container>
								<Row>
									<Col><Container><Form.Group controlId={"donorAddress"}>
										<Row>
											<Col><Form.Label>Donor blockchain address</Form.Label></Col>
											<Col><Form.Control
												type="text"
												size="sm"
												required="true"
											/></Col>
										</Row>
									</Form.Group></Container>
										<Container><Form.Group controlId={"donorAlias"}>
											<Row>
												<Col><Form.Label>Donor Alias</Form.Label></Col>
												<Col><Form.Control
													type="text"
													size="sm"
													required="true"
												/></Col>
											</Row>
										</Form.Group>
										</Container>
										<Container><Form.Group controlId={"donorDescription"}>
											<Row>
												<Col><Form.Label>Message to Donor</Form.Label></Col>
												<Col><Form.Control
													as="textarea"
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
			</Container>
			<Container style={{ padding: "0px", height: "100%" }} className="record-container">
				<Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
					<Col style={{ paddingRight: "0px" }}><Image src="wink.png" rounded style={{ width: "70px", float: "inline-end" }} /></Col>
					<Col><h5 className="mb-3" style={{ float: "left", padding: "15px", paddingLeft: "0px" }}>Donations</h5></Col>
				</Row>
				<hr></hr>
				<DonorList />
			</Container>
		</>
	)

}
