import { Transaction } from "@mysten/sui/transactions";

export function updateAccount(index, packageID, signAndExecute, setLoading) {
    const tx = new Transaction();
    
    tx.moveCall({
      arguments: [tx.object(response.data.data[0].data.objectId), tx.pure.string(category), tx.pure.string(description), tx.pure.string(encryptedCID), tx.pure.string(filename), tx.pure.string(String(Date.now()))],
      target: `${packageID}::crypto_will::upload`,
    });
  
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          setLoading(false)
          response.refetch();

        },
      },
    );
  }