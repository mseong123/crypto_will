import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { Transaction } from "@mysten/sui/transactions";
import { useSignature } from "../hooks/useSignature";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { encryptAES } from "../utils/encryptionAES"
import { encryptAssym } from "../utils/encryptionAssym"
import { Upload } from "./Upload"
import { AccordionRecord } from './AccordionRecord';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

export function Account ({encryptionPhrase,setEncryptionPhrase}) {
    const packageId = useNetworkVariable('packageId');
    const signAndExecute = useSignature()
    const account = useCurrentAccount()
	  const response = useObjectQuery(
      'getOwnedObjects',
      {
        owner:account.address,
              filter:{
                  StructType: `${packageId}::crypto_will::Record`,
              },
        options: { showType: true, showContent: true },
      },
      {
      }
    );
    
    if (response.isPending) return <Alert>Loading...</Alert>;

    if (response.error) return <Alert>Error: {response.error.message}</Alert>
      
    console.log(response)
    if (response.data.data.length === 0) return <CreateAccount refetch={response.refetch}/>

    return (
        <div>
            <h4>Account</h4>
            <Card>
              <Card.Body>
              {!encryptionPhrase? (
                <>
                  <Card.Title>Please enter Encryption Phrase</Card.Title>
                  <hr></hr>
                  <Card.Text>
                    Encryption Phrase is used to encrypt your files on the blockchain to ensure confidentiality and security of your data.
                    Please use a memorable and unique passphrase <span style={{color:"orange"}}>(your wallet's private key is a good example)</span>
                  </Card.Text>
                  
                </>):<Card.Title>Encryption phrase: {encryptionPhrase}</Card.Title>}
                <Form onSubmit={(e)=>{e.preventDefault();
                        setEncryptionPhrase(document.getElementById("passphrase").value);
                        document.getElementById("passphrase").value = ""}}>
                    <InputGroup>
                      
                        <Form.Control
                            id="passphrase"
                            type="text"
                            size="sm"
                            placeholder="Encryption Passphrase (max size 30)"
                            maxLength={30}
                        />
                     
                      <Button type="submit">
                          {encryptionPhrase? "Change":"Enter"}
                      </Button>
                    </InputGroup>
                </Form>
                
              </Card.Body>
            </Card>
            <AccordionRecord/>
            <Upload/>
            <Button onClick={()=>UploadSui(response, packageId, signAndExecute)}>Upload SUI</Button>
        </div>
    )
}

function UploadSui(response, packageID, signAndExecute) {
  const tx = new Transaction();

  tx.moveCall({
    arguments: [tx.object(response.data.data[0].data.objectId), tx.pure.string("CID3"), tx.pure.string("description3")],
    target: `${packageID}::crypto_will::upload`,
  });

  signAndExecute(
    {
      transaction: tx,
    },
    {
      onSuccess: (result) => {
        console.log(result)
       
      },
    },
  );
}
   


