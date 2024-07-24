import { useObjectQuery } from "../hooks/useObjectQuery"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { Text, Button } from "@radix-ui/themes";

const REFETCH_INTERVAL = 5000
const queryKey = ["Record"]

let count = 1;

export function Account ({AccountID}) {
    const packageId = useNetworkVariable('packageId');
    const account = useCurrentAccount();
	const [response, invalidate] = useObjectQuery(
        "getOwnedObjects",
		{
			owner:account.address,
            filter:{
                StructType: `${packageId}::crypto_will::Record`,
            },
			options: { showType: true, showContent: true },
		},
		{
			queryKey:["Record"]
		}
    );
    if (response.isPending) return <Text>Loading...</Text>;

    if (response.error) return <Text>Error: {error.message}</Text>;

    if (!response.data.data) return <Text>Not found</Text>;
    console.log(count++)
    return (
        <div>
            <Button onClick={()=>{console.log(response.refetch);response.refetch().then(data=>console.log(data))}}>Revalidate</Button>
        </div>

    )
}

