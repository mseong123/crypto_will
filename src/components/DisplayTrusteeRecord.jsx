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
import Form from 'react-bootstrap/Form';
import { decryptAES } from '../utils/encryptionAES';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { LogStatus, useLogin } from './UserContext';

export function DisplayTrusteeRecord({address}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [decrypted, setDecrypted] = useState(null)
    const [decryptedCID, setDecryptedCID] = useState(null)
    const signAndExecute = useSignature();
    const packageId = useNetworkVariable('packageId');
	const { isLoggedIn, userDetails, login, logOut } = useLogin();
    const account = useCurrentAccount()
    const response = useObjectQuery(
        'getOwnedObjects',
        {
			owner: isLoggedIn === LogStatus.wallet? account.address : userDetails.address,
                filter:{
                    StructType: `${packageId}::crypto_will::TrusteeRecord`,
                },
          options: { showType: true, showContent: true },
        },
        {
        }
      );
      
      if (response.isPending) return <Alert style={{backgroundColor: "white"}} variant='dark'>Loading...</Alert>;
  
      if (response.error) return <Alert style={{backgroundColor: "white"}} variant='dark'>Error: {response.error.message}</Alert>

      function groupItemsByCategory(category) {
        if (category.length > 1)
            return category.reduce((acc, item) => {
                acc[item] = acc[item] ? [...acc[item], item] : [item];
                return acc;
            }, {});
        return null;
      }
      let match;
      let WillCard;
      let AssetCard;
      let VideoCard;
      let PersonalCard;


      function matchRecord(address) {
            
            if (response && response.data && response.data.data.length !== 0) {
                match = response.data.data.filter(data=> 
                    data.data.content.fields.testatorAddress === address)
            }
        }
        matchRecord(address)
        if (match && match.length>0) {
            WillCard = match[0].data.content.fields.category.map((category,index)=>{
                if (category === "Will") {
                    return <TrusteeCard decryptedCID={decryptedCID} decrypted={decrypted} key={index + "Will"} match={match} index={index} setError={setError}/>
                }
            })
            AssetCard = match[0].data.content.fields.category.map((category,index)=>{
                if (category === "Asset") {
                    return <TrusteeCard decryptedCID={decryptedCID} decrypted={decrypted} key={index + "Asset"} match={match} index={index} setError={setError}/>
                }
            })
            VideoCard = match[0].data.content.fields.category.map((category,index)=>{
                if (category === "Video") {
                    return  <TrusteeCard decryptedCID={decryptedCID} decrypted={decrypted} key={index + "Video"} match={match} index={index} setError={setError}/>
                }
            })
            PersonalCard = match[0].data.content.fields.category.map((category,index)=>{
                if (category === "Personal") {
                    return  <TrusteeCard decryptedCID={decryptedCID} decrypted={decrypted} key={index + "Personal"} match={match} index={index} setError={setError}/>
                }
            })
        }
    
    return (
        <>
        {match && match.length>0? (
            <>
                <hr/>
                {decrypted?<h6 style={{fontWeight: "bold", margin: "20px"}}>Decrypted Records</h6>:<h6 style={{fontWeight: "bold"}}>Unencrypted records</h6>}
                <Tabs
                    defaultActiveKey="0"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="0" title="File" >
                        {WillCard}
                    </Tab>
                    <hr className="my-1"/>
                    <Tab eventKey="1" title="Asset">
                        {AssetCard}
                    </Tab>
                    <hr className="my-1"/>
                    <Tab eventKey="2" title="Video">
                        {VideoCard}
                    </Tab>
                    <hr className="my-1"/>
                    <Tab eventKey="3" title="Personal">
                        {PersonalCard}
                    </Tab>
                </Tabs>
                {!decrypted? <Form onSubmit={(e)=>{e.preventDefault();
                
                    let decryptedCID = match[0].data.content.fields.encryptedCID.map(CID=>{
                        return decryptAES(document.getElementById("decryptionPhrase").value, CID, setError)
                    })
                    setDecryptedCID(decryptedCID);
                    setDecrypted(true);
                    document.getElementById("decryptionPhrase").value = ""}}>
                    <hr/>
                    <Form.Group className="d-inline-block m-2" controlId={"decryptionPhrase"}>
                        <Form.Label>Enter Encryption Phrase</Form.Label>
                        <Form.Control
                            type="text"
                            size="sm"
                        />
                    </Form.Group>
                    <Button type="submit">
                        Decrypt
                    </Button>
                </Form>:null}
                
            </>
            ):null}
        </>
    )
}

