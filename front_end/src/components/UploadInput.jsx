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
                {loading? <Alert className="mt-3" variant="info">Uploading...</Alert>:null}
                {error? <Alert className="mt-3" variant="warning">{error}</Alert>:null}
            </Form> 
        </Container>
    )
}



function downloadFile() {
    const ipfsUrl = 'https://amber-real-catfish-990.mypinata.cloud/ipfs/QmPNwNG34VxbaTvoVzjM9biU9zsdFEd3RrEGf3doTvVpjT';

            fetch(ipfsUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob(); // Convert response to Blob
                })
                .then(blob => {
                    // Create a link element
                    const a = document.createElement('a');
                    a.style.display = 'none';

                    // Create a URL for the Blob object
                    const url = window.URL.createObjectURL(blob);
                    a.href = url;
                    
                    // Set the default file name
                    a.download = 'file.txt'; // Specify the file name here

                    // Append the link to the body
                    document.body.appendChild(a);

                    // Programmatically click the link to trigger the download
                    a.click();

                    // Clean up
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                })
                .catch(error => {
                    console.error('Error downloading file:', error);
                });
}