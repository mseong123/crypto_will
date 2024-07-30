import { Transaction } from "@mysten/sui/transactions";


export function sendTrusteeRecord(response, objectID, category, description, encryptedCID, filename, timestamp, packageID, signAndExecute) {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.object(objectID), tx.pure.vector('string', category),tx.pure.vector('string', description),tx.pure.vector('string', encryptedCID),tx.pure.vector('string', filename),tx.pure.vector('string', timestamp)],
      target: `${packageID}::crypto_will::transferRecord`,
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
