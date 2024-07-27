import { useState } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";

export function DisplayTrusteeRecord({address}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const signAndExecute = useSignature();
    const packageId = useNetworkVariable('packageId');
    const response = useObjectQuery(
        'getOwnedObjects',
        {
          owner:account.address,
                filter:{
                    StructType: `${packageId}::crypto_will::TrusteeRecord`,
                },
          options: { showType: true, showContent: true },
        },
        {
        }
      );
      
      if (response.isPending) return <Alert>Loading...</Alert>;
  
      if (response.error) return <Alert>Error: {response.error.message}</Alert>

      function matchPublicKey(address) {
        let match
        if (response && response.data && response.data.data.length !== 0) {
            match = response.data.data.filter(data=> 
                 data.data.content.fields.trusteeAddress === address)
        }
        return (
            <>
                {match && match.length>0?<Button onClick={()=>handleTransfer(match[0].data.objectId)} >Send Trustee Records</Button>:null}
            </>
        )
    }

    return (
        <div>
            DisplayTrusteeRecord
        </div>
    )
}