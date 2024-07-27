import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { useCurrentAccount } from "@mysten/dapp-kit";

export function TrusteeAction() {
    const packageId = useNetworkVariable('packageId');
    const account = useCurrentAccount()
	  const response = useObjectQuery(
      'getOwnedObjects',
      {
        owner:account.address,
              filter:{
                  StructType: `${packageId}::crypto_will::TrusteeCap`,
              },
        options: { showType: true, showContent: true },
      },
      {
      }
    );
    
    if (response.isPending) return <Alert>Loading...</Alert>;

    if (response.error) return <Alert>Error: {response.error.message}</Alert>
    return (
        <div>
            TrusteeAction
        </div>
    )
}