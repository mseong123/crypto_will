import { Transaction } from "@mysten/sui/transactions";

export function createTrustee(response, trusteeAddress, trusteeDescription, testatorAlias, packageID, signAndExecute, setLoading, id_trusteeAddress, id_trusteeDescription, id_testatorAlias) {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [tx.object(response.data.data[0].data.objectId), tx.pure.address(trusteeAddress), tx.pure.string(trusteeDescription), tx.pure.string(testatorAlias), tx.pure.string(String(Date.now()))],
      target: `${packageID}::crypto_will::addTrustee`,
    });
  
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          setLoading(false)
          
          document.getElementById(id_trusteeAddress).value = ""
          document.getElementById(id_trusteeDescription).value = ""
          document.getElementById(id_testatorAlias).value = ""
          response.refetch();

        },
      },
    );
  }
