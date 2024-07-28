import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image';
import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export function EncryptionPhrase({encryptionPhrase, setEncryptionPhrase}) {
    const [isTextVisible, setIsTextVisible] = useState(true);

    const toggleTextVisibility = () => {
        setIsTextVisible(!isTextVisible);
    };

    return(
        <Card className="mb-3">
            <Card.Body>
            {!encryptionPhrase? (
            <>
                <h4>Account</h4>
                <Image className="center" src="hello-ghost.png" rounded style={{width: "100px"}}/>
                <Card.Title>Please enter encryption phrase</Card.Title>
                <hr></hr>
                <Card.Text>
                Encryption phrase is used to encrypt, view and manage your files on the blockchain to ensure confidentiality and security of your data.
                Please use a memorable and unique passphrase <span style={{color:"black", fontWeight:"bold"}}>(your wallet's private key is a good example)</span>
                </Card.Text>
                
            </>):<Container style={{paddingLeft: "0px"}}>
                    <Row>
                        <Col className="col-md-3"><h6 style={{paddingTop: "10px", float: "left"}}>Encryption phrase:</h6></Col>
                        <Col>{isTextVisible && (
                            <p style={{paddingTop: "10px", float: "left", marginBottom: "0px"}}>{encryptionPhrase}</p>
                        )}</Col>
                        <Col className="col-md-2"><Button onClick={toggleTextVisibility} style={{float: "right"}}>
                            {isTextVisible ? <Image src="eye.png" rounded style={{width: "20px"}}/> : <Image src="eyehide.png" rounded style={{width: "20px"}}/>}
                        </Button></Col>
                    </Row>
                </Container>
            }
            <Form onSubmit={(e)=>{e.preventDefault();
                    setEncryptionPhrase(document.getElementById("passphrase").value);
                    document.getElementById("passphrase").value = ""}}>
                <InputGroup style={{marginTop: "20px"}}>
                    <Form.Control
                        id="passphrase"
                        type="text"
                        size="sm"
                        placeholder="Encryption passphrase (max size 30)"
                        maxLength={30}
                    />
                    
                    <Button type="submit">
                        {encryptionPhrase? "Change":"Enter"}
                    </Button>
                </InputGroup>
            </Form>
            </Card.Body>
        </Card>
        )
}