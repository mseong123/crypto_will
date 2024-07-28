import { useState } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { sendRequestForRecord } from "../utils/sendRequestForRecord"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useObjectQuery } from "../hooks/useObjectQuery"
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';


export function SendRequestForRecord({trusteeResponse}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const signAndExecute = useSignature();
    const packageId = useNetworkVariable('packageId');
    const account = useCurrentAccount()

	  const response = useObjectQuery(
      'getOwnedObjects',
      {
        owner:account.address,
              filter:{
                  StructType: `${packageId}::crypto_will::TrusteeCap`,
              },
        options: { showType: true, showContent: true },
      },
      {
      }
    );
    
    if (response.isPending) return <Alert style={{backgroundColor: "white"}} variant='dark'>Loading...</Alert>;

    if (response.error) return <Alert style={{backgroundColor: "white"}} variant='dark'>Error: {response.error.message}</Alert>

    if (response.data.data.length === 0) return <Alert style={{backgroundColor: "white", margin: "10px"}} variant='dark'>No actions needed</Alert>
    

    const Request = () =>{
        const requestCards = response.data.data.map((data,index)=>{
        return (
            <Card key={index} className="mb-3 mx-2">
                <Card.Body>
                    <h6 style={{fontWeight: "bold"}}>Send request to account owner for encrypted record</h6>
                    <hr/>
                    <Form onSubmit={async (e)=>{
                        e.preventDefault();
                        setError(null);
                        setLoading(true);
                        const encryptionPhrase = document.getElementById("trusteeEncryptionPhrase-"+index).value
                        const trusteeAddress = account.address;
                        const testatorAlias = data.data.content.fields.testatorAlias;
                        
                        sendRequestForRecord(response,encryptionPhrase,trusteeAddress, packageId, signAndExecute, "trusteeEncryptionPhrase-"+index, index, setLoading)
                        
                    }} 
                    >
                        <Row><Col className="col-md-3" >
                            <Image src="approve.png" rounded style={{width: "30px", margin: "5px 56px"}}/>
                            <h6>{data.data.content.fields.testatorAlias}</h6></Col>
                        <Col><Form.Group className="mb-2  me-3" controlId={"trusteeEncryptionPhrase-"+index}>
                            <Form.Label>Provide encryption phrase</Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                width="50%"
                                required={true}
                            />
                        </Form.Group></Col>
                        <Col className="col-md-2"><Button type="submit" style={{margin: "15px"}}>
                            <Image src="add.png" rounded style={{width: "20px"}}/>
                        </Button></Col>
                        </Row>
                        {loading? <Alert className="mt-3" variant="dark">Uploading...</Alert>:null}
                        {error? <Alert className="mt-3" variant="dark">{error}</Alert>:null}
                    </Form> 
                </Card.Body>
            </Card>
            )
        })
        return <>{requestCards}</>;
    }

    return (
        <>
            <Request/>
        </>
    )
}