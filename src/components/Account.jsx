import { useObjectQuery } from "../hooks/useObjectQuery"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { Text, Button } from "@radix-ui/themes";


import { useSuiClientQuery, useSuiClientContext } from '@mysten/dapp-kit';

const REFETCH_INTERVAL = 5000

let count = 1;

export function Account ({AccountID}) {
    const packageId = useNetworkVariable('packageId');
    const account = useCurrentAccount();
	const response = useObjectQuery(
        'getOwnedObjects',
		{
			owner:account.address,
            // filter:{
            //     StructType: `${packageId}::crypto_will::Record`,
            // },
			// options: { showType: true, showContent: true },
		},
		{
            // queryKey:["hello"],
			// refetchInterval:5000
		}
    );
    console.log("here")
    if (response.isPending) return <Text>Loading...</Text>;

    if (response.error) return <Text>Error: {response.error.message}</Text>;
    
    if (!response.data.data) return <Text>Not found</Text>;
   
    return (
        <div>
            <Button onClick={()=>{response.refetch(); console.log(response)}}>Revalidate</Button>
        </div>

    )
}

