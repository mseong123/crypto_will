import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { decryptAES } from "../utils/encryptionAES"
import { IPFS_Gateway } from "../constants"
import { downloadIPFS } from "../utils/downloadIPFS"
import { deleteRecord } from "../utils/deleteRecord"
import { useState, useEffect } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

export function Record({encryptionPhrase,response, fields,index}) {
    const [error, setError]= useState(null)
    const [loading, setLoading]= useState(false);
    let decrypted;
    if (!error) {
        decrypted = decryptAES(encryptionPhrase,fields.encryptedCID[index], setError, index);
    }
    const signAndExecute = useSignature();
    const packageId = useNetworkVariable('packageId');

    

    return (
        <Container>
            <Card className="mb-3 mx-2">
                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Text className="d-inline-block float-left me-3">
                                <h6 style={{fontWeight:500, float: "left"}}>{Date(fields.timestamp[index]).toString()}</h6>
                            </Card.Text>
                            <Card.Text className="d-inline-block float-left me-3">
                                Title: <span style={{fontWeight:500}}>{fields.description[index]}</span>
                            </Card.Text>
                            <Card.Text className="d-inline-block float-left me-3">
                                Filename: <span style={{fontWeight:500}}>{fields.filename[index]}</span>
                            </Card.Text>
                        </Col>
                        <Col className="col-md-2">
                            {error? (
                                <>
                                    <Alert className="mt-3" variant="warning">{error}</Alert>
                                    <Button variant="primary" type="button" onClick={()=>{
                                        deleteRecord(index, packageId, response, signAndExecute, setLoading)
                                    }}>
                                        Delete File
                                    </Button>
                                </>)
                                :(
                                <>
                                    <Card.Text>
                                        <Button style={{marginBottom: "5px"}} target={"_blank"} href={IPFS_Gateway+decrypted}><Image src="preview.png" rounded style={{width: "20px"}}/></Button>
                                        <Button style={{cursor:"pointer", marginBottom: "5px"}} onClick={()=>{downloadIPFS(decrypted, setError, fields.filename[index])}}><Image src="download.png" rounded style={{width: "20px"}}/></Button>
                                        <Button variant="primary" className="d-inline-block" type="button" onClick={()=>{
                                            deleteRecord(index, packageId, response, signAndExecute, setLoading)
                                        }}>
                                            <Image src="delete.png" rounded style={{width: "20px"}}/>
                                        </Button>
                                    </Card.Text>
                                </>
                            )}
                        </Col>
                        {loading? <Alert className="mt-3" variant="info">Deleting...</Alert>:null}
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )

}