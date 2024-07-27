import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { sendTrusteeRecord } from "../utils/sendTrusteeRecord";
import { useSignature } from "../hooks/useSignature";

export function ListTrustee({accountResponse, trusteeResponse}) {
    const packageId = useNetworkVariable('packageId');
    const account = useCurrentAccount()
    const signAndExecute = useSignature();
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

    function handleTransfer(objectID) {
        const category = accountResponse.data.data[0].data.content.fields.category;
        const description = accountResponse.data.data[0].data.content.fields.description;
        const encryptedCID = accountResponse.data.data[0].data.content.fields.encryptedCID;
        const filename = accountResponse.data.data[0].data.content.fields.filename;
        const timestamp = accountResponse.data.data[0].data.content.fields.timestamp;
        sendTrusteeRecord(objectID, category, description, encryptedCID, filename, timestamp, packageId, signAndExecute)
    }
   
    function matchPublicKey(address) {
        let match
        if (response && response.data && response.data.data.length !== 0) {
            match = response.data.data.filter(data=> 
                 data.data.content.fields.trusteeAddress === address)
        }
        console.log(match)
        return (
            <>
                {match && match.length>0?<Button onClick={()=>handleTransfer(match[0].data.objectId)} >Send Trustee Records</Button>:null}
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