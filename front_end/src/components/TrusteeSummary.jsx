import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { DisplayTrusteeRecord } from "./DisplayTrusteeRecord"
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

export function TrusteeSummary() {
    const packageId = useNetworkVariable('packageId');
    const account = useCurrentAccount()
	  const response = useObjectQuery(
      'getOwnedObjects',
      {
        owner:account.address,
              filter:{
                  StructType: `${packageId}::crypto_will::Trustee`,
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
                    <Col className="" style={{paddingRight: "0px"}}><Image src="ghost-love.png" rounded style={{width: "70px", float: "inline-end"}}/></Col>
                    <Col><h5 className="mb-3" style={{float: "left", padding: "15px", paddingLeft: "0px"}}>Trustee Summary</h5></Col>
                </Row>
                <Card className="mb-2 mx-2">
                    <Card.Body>
                        <Card.Title>Not a Trustee</Card.Title>
                        <Card.Text>
                        You are currently not acting as a trustee for anyone. To become a trustee, provide your account address to an account owner for nomination.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>


        )
    }
    const TrusteeList = () =>{
        const trusteeCards = response.data.data.map((data,index)=>{
        return (
            <Container>
                <Card key={index} className="mb-2 mx-2">
                    <Card.Body style={{color: "rgb(96, 96, 96)"}}>
                        <Row><Col className='col-md-1'><Image src="home.png" rounded style={{width: "25px"}}/></Col>
                        <Col><h6 style={{float: "left"}}>{data.data.content.fields.owner}</h6></Col></Row>
                        <Row><Col className='col-md-1'><Image src="calendar.png" rounded style={{width: "25px"}}/></Col>
                        <Col><h6 style={{ float: "left", marginTop: "6px"}}>{Date(data.data.content.fields.timestamp).toString()}</h6></Col></Row>
                        <Row><Col className='col-md-1'><Image src="approve.png" rounded style={{width: "25px"}}/></Col>
                        <Col><h6 style={{ float: "left", marginTop: "6px"}}>{data.data.content.fields.testator_alias}</h6></Col></Row>
                        <DisplayTrusteeRecord address={data.data.content.fields.owner}/>
                    </Card.Body>
                </Card>
            </Container>
            )
        })
        
        return <>{trusteeCards}</>;
    }
    return (
        <Container style={{padding: "0px", height: "100%"}} className="record-container">
            <Row style={{paddingTop: "10px"}}>
                <Col className="col-md-3" style={{paddingRight: "0px"}}><Image src="ghost-love.png" rounded style={{width: "70px", float: "inline-end"}}/></Col>
                <Col><h5 className="mb-3" style={{float: "left", padding: "15px", paddingLeft: "0px"}}>You are the Trustee for the following Accounts:</h5></Col>
            </Row>
            <TrusteeList/>
        </Container>
    )
}
