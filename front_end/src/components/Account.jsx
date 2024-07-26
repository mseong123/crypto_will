import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { Transaction } from "@mysten/sui/transactions";
import { useSignature } from "../hooks/useSignature";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { encryptAES } from "../utils/encryptionAES"
import { encryptAssym } from "../utils/encryptionAssym"
import { AccordionRecord } from './AccordionRecord';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

export function Account ({encryptionPhrase,setEncryptionPhrase}) {
    const packageId = useNetworkVariable('packageId');
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
      
    if (response.data.data.length === 0) return <CreateAccount refetch={response.refetch}/>

    return (
        <div>
            <h4>Account</h4>
            <Card className="mb-3">
              <Card.Body>
              {!encryptionPhrase? (
                <>
                  <Card.Title>Please enter Encryption Phrase</Card.Title>
                  <hr></hr>
                  <Card.Text>
                    Encryption Phrase is used to encrypt, view and manage your files on the blockchain to ensure confidentiality and security of your data.
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
            {encryptionPhrase? <AccordionRecord encryptionPhrase={encryptionPhrase} response={response}/>:null}
        </div>
    )
}


   


