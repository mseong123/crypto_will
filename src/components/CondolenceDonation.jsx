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

export function CondolenceDonation() {
	const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
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

	return (
		<>
			{/* <Card className="mb-2">
				<Card.Body>
					<Card className="mb-2">
						<Card.Header> Donation </Card.Header>
						<Card.Body>
							<Card.Text><span style={{ fontWeight: 500 }}>Donation</span></Card.Text>
							<Form onSubmit={async (e) => {
								e.preventDefault();
								const amount = document.getElementById("donation").value
								sendSui(zkLoginAddress, ephemeralSecretKey, amount);

							}}
							>
								<Form.Group className="mx-2" controlId={"donation"}>
									<Form.Label>Enter SUI to transfer</Form.Label>
									<Form.Control
										type="number"
										size="sm"
										className='mb-2'
									/>
								</Form.Group>
								<Button type="submit">
									Send
								</Button>
							</Form>
						</Card.Body>

						{result && (
							<div style={{
								position: 'absolute',
								top: '-30px',
								left: '50%',
								transform: 'translateX(-50%)',
								backgroundColor: '#eeeeee',
								color: 'black',
								padding: '5px 10px',
								borderRadius: '5px',
								width: '200px',
								zIndex: 1,
							}}>
								{result}
							</div>
						)}
					</Card>
				</Card.Body>
			</Card> */}
			<div>
				condolences
			</div>
		</>
	)

}