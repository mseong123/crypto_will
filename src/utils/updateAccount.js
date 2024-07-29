import { Transaction } from "@mysten/sui/transactions";

export function updateAccount(encryptedCID, response, packageID, signAndExecute, setLoading, setInput) {
    const tx = new Transaction();
    for (let i = 0; i < encryptedCID.length; i++) {
      const formData = new FormData();
      const file = document.getElementById("file-" + i).files[0]; 
      const description = document.getElementById("description-" + i).value;
      const category = document.getElementById("category-" + i).value;
      tx.moveCall({
        arguments: [tx.object(response.data.data[0].data.objectId), tx.pure.string(category), tx.pure.string(description), tx.pure.string(encryptedCID[i]), tx.pure.string(file.name), tx.pure.string(String(Date.now()))],
        target: `${packageID}::crypto_will::upload`,
      });
    }
  
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          setLoading(false)
          
          setInput([]);
          response.refetch();

        },
      },
    );
  }
