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
    
    if (response.isPending) return <Alert>Loading...</Alert>;

    if (response.error) return <Alert>Error: {response.error.message}</Alert>

    if (response.data.data.length === 0) return <Alert>No Actions needed</Alert>
    

    const Request = () =>{
        const requestCards = response.data.data.map((data,index)=>{
        return (
            <Card key={index}>
                <Card.Body>
                    <Card.Title>Send Request to Account Owner For Encrypted Record</Card.Title>
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
                        <Card.Text>
                            <span style={{fontWeight:500}}>Account Alias: </span>{data.data.content.fields.testatorAlias}
                        </Card.Text>
                        <Form.Group className="mb-2 d-inline-block me-3" controlId={"trusteeEncryptionPhrase-"+index}>
                            <Form.Label>Provide Encryption Phrase</Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                width="50%"
                                required={true}
                            />
                        </Form.Group>
                        <Button type="submit">
                            Request
                        </Button>
                        {loading? <Alert className="mt-3" variant="info">Uploading...</Alert>:null}
                        {error? <Alert className="mt-3" variant="warning">{error}</Alert>:null}
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