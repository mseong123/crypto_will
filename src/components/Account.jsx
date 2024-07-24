import { useObjectQuery } from "../hooks/useObjectQuery"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { CreateAccount } from "./CreateAccount"
import { Text, Button } from "@radix-ui/themes";

import { useNetworkVariable } from "../networkConfig"
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";

const REFETCH_INTERVAL = 5000

let count = 1;

export function Account ({AccountID}) {
    const suiClient = useSuiClient();
    const packageID = useNetworkVariable("packageId");
    const { mutate: signAndExecute } = useSignAndExecuteTransaction({
        execute: async ({ bytes, signature }) =>
          await suiClient.executeTransactionBlock({
            transactionBlock: bytes,
            signature,
            options: {
              // Raw effects are required so the effects can be reported back to the wallet
              showRawEffects: true,
              showEffects: true,
            },
          }),
      });



    const packageId = useNetworkVariable('packageId');
    const account = useCurrentAccount();
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
            // queryKey:["hello"],
			// refetchInterval:5000
		}
    );
    console.log(response)
    if (response.isPending) return <Text>Loading...</Text>;

    if (response.error) return <Text>Error: {response.error.message}</Text>;
    
    if (response.data.data.length === 0) return <CreateAccount/>
    
    return (
        <div>
            <Button onClick={()=>{Upload(response,packageID)}}>Upload</Button>
        </div>

    )
}

function Upload(response,packageID) {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [response.data.data[0].data.objectId, "First upload", "CID"],
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
        onFailure: () => {
         
          console.log("error")
        }
      },
    );
  }


