import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { useCurrentAccount } from "@mysten/dapp-kit";

export function ListTrustee({trusteeResponse}) {
    const packageId = useNetworkVariable('packageId');
    const account = useCurrentAccount()
	const response = useObjectQuery(
      'getOwnedObjects',
      {
        owner:account.address,
              filter:{
                  StructType: `${packageId}::crypto_will::PublicKeyCap`,
              },
        options: { showType: true, showContent: true },
      },
      {
      }
    );
   
    function matchPublicKey(address) {
        let match
        if (response && response.data && response.data.data.length !== 0) {
            match = response.data.data.filter(data=> 
                 data.data.content.fields.trusteeAddress === address)
        }
        
        return (
            <>
                {match && match.length>0?<Button >Send Trustee Records</Button>:null}
            </>
        )
    }

    const TrusteeList = () =>{
        const trusteeCards = trusteeResponse.data.data[0].data.content.fields.trustee.map((data,index)=>{
        return (
            <Card key={index} className="mb-2">
                <Card.Body>
                    <Card.Text><span style={{fontWeight:500}}>Address: </span>{data}</Card.Text>
                    <Card.Text className="d-inline-block me-2"><span style={{fontWeight:500}}>Trustee Description: </span>{trusteeResponse.data.data[0].data.content.fields.trusteeDescription[index]}</Card.Text>
                    <Card.Text className="d-inline-block"><span style={{fontWeight:500}}>Timestamp: </span>{Date(trusteeResponse.data.data[0].data.content.fields.trusteeTimestamp[index]).toString()}</Card.Text>
                    {matchPublicKey(data)}
                </Card.Body>
            </Card>
            )
        })
        return <>{trusteeCards}</>;
    }


    return (
        <>
            <h4>Trustee Nominies for your Account</h4>
            <TrusteeList/>
        </>
    )
}