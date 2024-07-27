import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { encryptAES } from "../utils/encryptionAES"
import { encryptAssym } from "../utils/encryptionAssym"
import { AccordionRecord } from './AccordionRecord';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

export function Account ({encryptionPhrase}) {
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
      <>
            {encryptionPhrase? 
            (<>
              <h3 className="mb-3">Record</h3>
              <AccordionRecord encryptionPhrase={encryptionPhrase} response={response}/>
             </>
            ):null
            }
      </>
       
    )
}


   


