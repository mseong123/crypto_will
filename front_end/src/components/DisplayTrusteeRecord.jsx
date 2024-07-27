import { useState } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";
import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { TrusteeCard } from "./TrusteeCard"
import { useCurrentAccount } from "@mysten/dapp-kit";
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export function DisplayTrusteeRecord({address}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const signAndExecute = useSignature();
    const packageId = useNetworkVariable('packageId');
    const account = useCurrentAccount()
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

      function groupItemsByCategory(category) {
        if (category.length > 1)
            return category.reduce((acc, item) => {
                acc[item] = acc[item] ? [...acc[item], item] : [item];
                return acc;
            }, {});
        return null;
      }
      let groupedItems;
      let match;
      function matchRecord(address) {
            
            if (response && response.data && response.data.data.length !== 0) {
                match = response.data.data.filter(data=> 
                    data.data.content.fields.testatorAddress === address)
            }
            
            if (match && match.length>0) {
                groupedItems = groupItemsByCategory(match[0].data.content.fields.category);
            }
        }
        matchRecord(address)

        const WillCard = match[0].data.content.fields.category.map((category,index)=>{
            if (category === "Will") {
                return <TrusteeCard  key={index + "Will"} match={match} index={index}/>
            }
        })
        const AssetCard = match[0].data.content.fields.category.map((category,index)=>{
            if (category === "Asset") {
                return <TrusteeCard  key={index + "Asset"} match={match} index={index}/>
            }
        })
        const VideoCard = match[0].data.content.fields.category.map((category,index)=>{
            if (category === "Video") {
                return  <TrusteeCard  key={index + "Video"} match={match} index={index}/>
            }
        })
        const PersonalCard = match[0].data.content.fields.category.map((category,index)=>{
            if (category === "Personal") {
                return  <TrusteeCard key={index + "Personal"} match={match} index={index}/>
            }
        })
    
    return (
        <div>
            <h5>Unencrypted Records</h5>
            <Card>
                <Card.Body>
                    <Card.Title>File</Card.Title>
                    {WillCard}
                </Card.Body>
                <hr className="my-1"/>
                <Card.Body>
                    <Card.Title>Asset</Card.Title>
                    {AssetCard}
                </Card.Body>
                <hr className="my-1"/>
                <Card.Body>
                    <Card.Title>Video</Card.Title>
                    {VideoCard}
                </Card.Body>
                <hr className="my-1"/>
                <Card.Body>
                    <Card.Title>Personal</Card.Title>
                    {PersonalCard}
                </Card.Body>
            </Card>
        </div>
    )
}