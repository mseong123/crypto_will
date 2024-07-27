import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { encryptAES } from "../utils/encryptionAES"
import { encryptAssym } from "../utils/encryptionAssym"
import { AccordionRecord } from './AccordionRecord';
import { CreateTrustee } from './CreateTrustee';
import { ListTrustee } from './ListTrustee';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

export function AccountWrapper ({encryptionPhrase, setAccountExist, page}) {
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
    let ComponentToRender;
    
    if (response.isPending) return <Alert>Loading...</Alert>;

    if (response.error) return <Alert>Error: {response.error.message}</Alert>
      
    if (response.data.data.length === 0) {setAccountExist(false); return <CreateAccount refetch={response.refetch}/>}
    if (response.data.data.length !== 0) setAccountExist(true)
    
    const RecordComponent = ()=>
      (<>
          {encryptionPhrase? 
          (<>
            <h3 className="mb-3">Record</h3>
            <AccordionRecord encryptionPhrase={encryptionPhrase} response={response}/>
            </>
          ):null
          }
      </>)

    const AccountActionComponent = ()=>
      (<>
          <h3 className="mb-3">Account Action</h3>
          <CreateTrustee account={account} response={response}/>
          <hr/>
          <ListTrustee accountResponse={response} trusteeResponse={response}/>
      </>)
    
    if (page === "Record")
      ComponentToRender = RecordComponent;
    else if (page === "AccountAction")
      ComponentToRender = AccountActionComponent;

    return (
      <>
          <ComponentToRender/>
      </>
       
    )
}


   


