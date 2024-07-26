import { Transaction } from "@mysten/sui/transactions";

export function updateAccount(response, packageID, signAndExecute) {
    const tx = new Transaction();
  
    tx.moveCall({
      arguments: [tx.object(response.data.data[0].data.objectId), tx.pure.string(), tx.pure.string("description3")],
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
