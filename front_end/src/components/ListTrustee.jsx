import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { sendTrusteeRecord } from "../utils/sendTrusteeRecord";
import { useSignature } from "../hooks/useSignature";
import { decryptAES,encryptAES } from "../utils/encryptionAES"
import { useState, useEffect } from 'react'

export function ListTrustee({encryptionPhrase, accountResponse, trusteeResponse}) {
    const [error, setError]= useState(null)
    const [loading, setLoading]= useState(false);
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

    function handleTransfer(objectID, publicKey) {
        const category = accountResponse.data.data[0].data.content.fields.category;
        const description = accountResponse.data.data[0].data.content.fields.description;
        const accountEncryptedCID = accountResponse.data.data[0].data.content.fields.encryptedCID;
        const accountDecryptedCID = accountEncryptedCID.map(CID=>decryptAES(encryptionPhrase,CID, setError));
        const trusteeEncryptedCID = accountDecryptedCID.map(CID=>encryptAES(publicKey,CID))
        const filename = accountResponse.data.data[0].data.content.fields.filename;
        const timestamp = accountResponse.data.data[0].data.content.fields.timestamp;
        sendTrusteeRecord(response, objectID, category, description, trusteeEncryptedCID, filename, timestamp, packageId, signAndExecute)
    }
   
    function matchPublicKey(address) {
        let match
        if (response && response.data && response.data.data.length !== 0) {
            match = response.data.data.filter(data=> 
                 data.data.content.fields.trusteeAddress === address)
        }
        
        return (
            <>
                {match && match.length>0?<Button onClick={()=>handleTransfer(match[0].data.objectId, match[0].data.content.fields.publicKey)} >Send Trustee Records</Button>:null}
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
                    {error? <Alert>{"Incorrect passphrase. Can't decrypt File to be sent to Trustee"}</Alert>:null}
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