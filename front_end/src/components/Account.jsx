import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { encryptAES } from "../utils/encryptionAES"
import { encryptAssym } from "../utils/encryptionAssym"
import { AccordionRecord } from './AccordionRecord';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export function Account ({encryptionPhrase}) {
    const packageId = useNetworkVariable('packageId');
    const account = useCurrentAccount()
	  const response = useObjectQuery(
      'getOwnedObjects',
      {
        owner:account.address,
              filter:{
                  StructType: `${packageId}::crypto_will::Record`,
              },
        options: { showType: true, showContent: true },
      },
      {
      }
    );
    
    if (response.isPending) return <Alert style={{backgroundColor: "#ffffff", borderColor: "#ffffff", color: "black"}}>Loading...</Alert>;

    if (response.error) return <Alert style={{backgroundColor: "#ffffff", borderColor: "#ffffff", color: "black"}}>Error: {response.error.message}</Alert>
      
    if (response.data.data.length === 0) return <CreateAccount refetch={response.refetch}/>

    return (
      <>
        {encryptionPhrase? 
        (<Container style={{padding: "0px"}}>
          <Row>
            <Col style={{paddingRight: "0px"}}><Image src="ghost-head.png" rounded style={{width: "70px", float: "inline-end"}}/></Col>
            <Col><h5 className="mb-3" style={{float: "left", padding: "10px", paddingLeft: "0px"}}>Record</h5></Col>
          </Row>
          <AccordionRecord encryptionPhrase={encryptionPhrase} response={response}/>
        </Container>
        ):null
        }
      </>
    )
}


   


