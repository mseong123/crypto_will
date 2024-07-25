import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { Text, Button } from "@radix-ui/themes";
import { useNetworkVariable } from "../networkConfig"
import { Transaction } from "@mysten/sui/transactions";
import { useSignature } from "../hooks/useSignature";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { encrypt } from "../utils/encryption"

encrypt()

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
    
    if (response.isPending) return <Text>Loading...</Text>;

    if (response.error) 
      return (
        <Box>
          <Text>Error: {response.error.message}</Text>
          <CreateAccount refetch={response.refetch}/>
          </Box>
      );
    
    if (response.data.data.length === 0) return <CreateAccount refetch={response.refetch}/>
    
    return (
        <div>
            <Button onClick={()=>{response.refetch()}}>Upload</Button>
        </div>
    )
}

function Upload(response, packageID, signAndExecute) {
  const tx = new Transaction();

  tx.moveCall({
    arguments: [tx.object(response.data.data[0].data.objectId), tx.pure.string("CID"), tx.pure.string("description")],
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
   


