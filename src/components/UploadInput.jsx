import { pinFileToIPFS } from "../utils/uploadIPFS"
import { updateAccount } from "../utils/updateAccount"
import { encryptAES } from "../utils/encryptionAES"
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

export function UploadInput({encryptionPhrase, response, category}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const signAndExecute = useSignature();
    const packageId = useNetworkVariable('packageId');

    return (
        <Container>
            <Form onSubmit={async (e)=>{
                e.preventDefault();
                setError(null);
                setLoading(true);
                const result = await pinFileToIPFS(setError,category + "_file")
                if (result) {
                    const encryptedCID = encryptAES(encryptionPhrase, result.IpfsHash)
                    const description = document.getElementById(category + "_description").value
                    const formData = new FormData();
                    const file = document.getElementById(category + "_file").files[0]; 
                    updateAccount(category, description, encryptedCID, file.name, response, packageId, signAndExecute, setLoading, category + "_description", category + "_file")
                }
            }} 
            >
                <Row>
                    <Col>
                        <Container>
                            <Form.Group className="mb-3" controlId={category + "_description"}>
                                <Row>
                                    <Col className="col-6 col-md-2"><Form.Label style={{float: "left"}}>Title:</Form.Label></Col>
                                    <Col style={{width: "550px", float: "left",}}><Form.Control
                                        as="textarea"
                                        size="sm"
                                        style={{ height: "1vh"}}
                                    /></Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId={category + "_file"}>
                                <Form.Control
                                    type="file"
                                    size="sm"
                                    required={true}
                                />
                            </Form.Group>
                        </Container>
                    </Col>
                    <Col style={{paddingTop: "20px"}}>
                        <Button type="submit">
                            <Image src="add.png" rounded style={{width: "25px"}}/>
                        </Button>
                    </Col>
                </Row>
                {loading? <Alert className="mt-3" variant="dark">Uploading...</Alert>:null}
                {error? <Alert className="mt-3" variant="dark">{error}</Alert>:null}
            </Form> 
        </Container>
    )
}



