import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { Text, Button } from "@radix-ui/themes";
import { useNetworkVariable } from "../networkConfig"
import { Transaction } from "@mysten/sui/transactions";
import { useSignature } from "../hooks/useSignature";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { encryptAES } from "../utils/encryptionAES"
import { encryptAssym } from "../utils/encryptionAssym"
import { Upload } from "./Upload"
import { AccordionRecord } from './AccordionRecord';
import Alert from 'react-bootstrap/Alert';



export function Account ({AccountID}) {
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
            <AccordionRecord/>
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
   


