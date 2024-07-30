import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { encryptAES } from "../utils/encryptionAES"
import { encryptAssym } from "../utils/encryptionAssym"
import { AccordionRecord } from './AccordionRecord';
import { CreateTrustee } from './CreateTrustee';
import { UploadInput } from './UploadInput';
import { ListTrustee } from './ListTrustee';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { LogStatus, useLogin } from './UserContext';
import { useEnokiFlow } from "@mysten/enoki/react";
import { useEffect, useState } from "react";

export function AccountWrapper ({encryptionPhrase, setAccountExist, page}) {
    const packageId = useNetworkVariable('packageId');
    const account = useCurrentAccount()
  const enoki = useEnokiFlow()
	const { isLoggedIn, userDetails, login, logOut } = useLogin();
	const [ address, setAddress ] = useState(null)
	  const response = useObjectQuery(
      'getOwnedObjects',
      {
			owner: isLoggedIn === LogStatus.wallet? account.address : userDetails.address,
              filter:{
                  StructType: `${packageId}::crypto_will::Record`,
              },
        options: { showType: true, showContent: true },
      },
      {
      }
    );

	// useEffect(() => {
	// 	if (isLoggedIn === LogStatus.zk) {
	// 		setAddress(userDetails.address)
	// 	} else if (isLoggedIn === LogStatus.wallet) {
	// 		setAddress(account?.address)
	// 	} else {
	// 		setAddress(null)
	// 	}
	// }, [])

	useEffect(() => {
		if (isLoggedIn === LogStatus.zk) {
			setAddress(userDetails.address)
		} else if (isLoggedIn === LogStatus.wallet) {
			setAddress(account?.address)
		} else {
			setAddress(null)
		}
	}, [isLoggedIn])
    let ComponentToRender;
    
    if (response.isPending) return <Alert style={{backgroundColor: "white"}} variant='dark'>Loading...</Alert>;

    if (response.error) return <Alert style={{backgroundColor: "white"}} variant='dark'>Error: {response.error.message}</Alert>
      
    if (response.data.data.length === 0) {setAccountExist(false); return (<CreateAccount refetch={response.refetch}/>)}
    if (response.data.data.length !== 0) setAccountExist(true)
    
    const RecordComponent = ()=>
      (<>
          {encryptionPhrase? 
          (<Container style={{padding: "0px", height: "100%"}} className="record-container">
            <Row style={{paddingTop: "10px"}}>
              <Col style={{paddingRight: "0px"}}><Image src="ghost-head.png" rounded style={{width: "70px", float: "inline-end"}}/></Col>
              <Col><h5 className="mb-3" style={{float: "left", padding: "15px", paddingLeft: "0px"}}>Record</h5></Col>
            </Row>
            <AccordionRecord encryptionPhrase={encryptionPhrase} response={response}/>
          </Container>
          ):null
          }
      </>)

    const RecordActionComponent = ()=>
      (<Container style={{padding: "0px", height: "100%"}} className="record-container">
          <Row style={{paddingTop: "10px"}}>
            <Col style={{paddingRight: "0px"}}><Image src="ghost-angel.png" rounded style={{width: "70px", float: "inline-end"}}/></Col>
            <Col><h5 className="mb-3" style={{float: "left", padding: "15px", paddingLeft: "0px"}}>Action</h5></Col>
          </Row>
          <CreateTrustee account={account} response={response}/>
          <ListTrustee encryptionPhrase={encryptionPhrase} accountResponse={response} trusteeResponse={response}/>
      </Container>)

  const RecordUploadComponent = ()=>
  (<>
      {encryptionPhrase? 
        <UploadInput encryptionPhrase={encryptionPhrase} response={response}/>:null}
    </>
  )
    
    if (page === "Record")
      ComponentToRender = RecordComponent;
    else if (page === "RecordAction")
      ComponentToRender = RecordActionComponent;
    else if (page === "RecordUpload")
      ComponentToRender = RecordUploadComponent;

    return (
      <ComponentToRender/>
    )
}


   


