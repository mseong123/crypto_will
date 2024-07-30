import { useState } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";
import { useObjectQuery } from "../hooks/useObjectQuery"
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { requestDonation } from "../utils/requestDonation"
import { useCurrentAccount } from "@mysten/dapp-kit";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import { SuiBalance } from "./SuiBalance";
import { sendDonation } from "../utils/sendDonation";


export function CondolenceDonation() {
	const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [suiBalance, setSuiBalance] = useState(0)
    const signAndExecute = useSignature();
    const account = useCurrentAccount();
    const packageId = useNetworkVariable('packageId');
    const response = useObjectQuery(
        'getOwnedObjects',
        {
          owner:account.address,
                filter:{
                    StructType: `${packageId}::crypto_will::DonationCap`,
                },
          options: { showType: true, showContent: true },
        },
        {
        }
      );
	
	if (response.isPending) return <Alert style={{backgroundColor: "white"}} variant='dark'>Loading...</Alert>;

	if (response.error) return <Alert style={{backgroundColor: "white"}} variant='dark'>Error: {response.error.message}</Alert>

	if (response.data.data.length === 0) {
        return (
            <Container style={{padding: "0px", height: "100%"}} className="record-container">
                <Row style={{paddingTop: "10px"}}>
                    <Col className="" style={{paddingRight: "0px"}}><Image src="donation.png" rounded style={{width: "70px", float: "inline-end"}}/></Col>
                    <Col><h5 className="mb-3" style={{float: "left", padding: "15px", paddingLeft: "0px"}}>Condolences Donation</h5></Col>
                </Row>
				<SuiBalance donatedResponse={response} setSuiBalance={setSuiBalance}/>
                <Card className="my-2 mx-2">
                    <Card.Body>
                        <Card.Text>No Pending Donation Request</Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        )
    }

	const DonationList = () =>{
        const donationCards = response.data.data.map((data,index)=>{
        return (
            <Container key={index}>
                <Card className="mb-2 mx-2">
                    <Card.Body style={{color: "rgb(96, 96, 96)"}}>
                        <Row><Col className='col-md-1'><Image src="home.png" rounded style={{width: "25px"}}/></Col>
                        <Col><h6 style={{float: "left", overflowWrap: "break-word"}}>{data.data.content.fields.trusteeAddress}</h6></Col></Row>
                        <Row><Col className='col-md-1'><Image src="preview.png" rounded style={{width: "25px"}}/></Col>
                        <Col><h6 style={{ float: "left", marginTop: "6px"}}>{data.data.content.fields.description}</h6></Col></Row>
                        <Form onSubmit={async (e) => {
								e.preventDefault();
                                setError(null);
                                
								const amount = document.getElementById("sendDonation").value
                                if (parseFloat(amount) >= parseFloat(suiBalance))
                                    setError("Insufficient SUI coins to send.");
                                else {
                                    setLoading(true);
                                    sendDonation(response, data, parseFloat(amount), packageId, signAndExecute, setLoading, "sendDonation")
                                }
								
							}}
							>
								<Form.Group className="mx-2" controlId="sendDonation">
									<Form.Label>Enter SUI coins to transfer</Form.Label>
									<Form.Control
										type="number"
										size="sm"
										className='mb-2'
                                        step="0.000000000001"
                                        required={true}
									/>
								</Form.Group>
								<Button type="submit">
									Send Donation
								</Button>
							</Form>
                    </Card.Body>
                </Card>
            </Container>
            )
        })
        
        return <>{donationCards}</>;
    }

	return (
			<Container style={{padding: "0px", height: "100%"}} className="record-container">
					<Row style={{paddingTop: "10px"}}>
						<Col className="" style={{paddingRight: "0px"}}><Image src="donation.png" rounded style={{width: "70px", float: "inline-end"}}/></Col>
						<Col><h5 className="mb-3" style={{float: "left", padding: "15px", paddingLeft: "0px"}}>Condolences Donation</h5></Col>
					</Row>
					<SuiBalance donatedResponse={response} setSuiBalance={setSuiBalance}/>
                    {loading? <Alert className="mt-3" variant="dark">Uploading...</Alert>:null}
                    {error? <Alert className="mt-3" variant="dark">{error}</Alert>:null}
					<DonationList/>
			</Container>
	)

}