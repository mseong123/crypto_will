import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { useCurrentAccount } from "@mysten/dapp-kit";

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
    
    if (response.isPending) return <Alert>Loading...</Alert>;

    if (response.error) return <Alert>Error: {response.error.message}</Alert>
      
    if (response.data.data.length === 0) {
        return (
            <>
                <h4>Trustee Summary</h4>
                <Card>
                    <Card.Body>
                        <Card.Title>Not a Trustee</Card.Title>
                        <Card.Text>
                        You are currently not acting as a trustee for anyone. To become a trustee, provide your account address to an account owner for nomination.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </>
        )
    }
    const TrusteeList = () =>{
        const trusteeCards = response.data.data.map((data,index)=>{
        return (
            <Card key={index} className="mb-2">
                <Card.Body>
                    <Card.Text><span style={{fontWeight:500}}>Address: </span>{data.data.content.fields.owner}</Card.Text>
                    <Card.Text className="d-inline-block me-2"><span style={{fontWeight:500}}>Account Alias: </span>{data.data.content.fields.testator_alias}</Card.Text>
                    <Card.Text className="d-inline-block"><span style={{fontWeight:500}}>Timestamp: </span>{Date(data.data.content.fields.timestamp).toString()}</Card.Text>
                </Card.Body>
            </Card>
            )
        })
        return <>{trusteeCards}</>;
    }
    
    return (
        <>
            <h4>You are the Trustee for the following Accounts:</h4>
            <TrusteeList/>
        </>
    )
}