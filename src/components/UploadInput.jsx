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
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

function Input({index}) {
    return (
        <Card key={index} className="my-3">
            <Form.Select required className="my-2 w-75 center" id={"desription-"+index}>
                <option value="">Select category</option>
                <option value="Will">Will</option>
                <option value="Asset">Asset</option>
                <option value="Video">Video</option>
                <option value="Personal">Personal</option>
            </Form.Select>
            <Form.Group className="my-2" controlId={"desription-"+index}>
                <Form.Label style={{verticalAlign:"text-bottom"}}className="d-inline-block me-2">Description:</Form.Label>
                <Form.Control className="d-inline-block w-50"
                        as="textarea"
                        size="sm"
                        style={{ height: "1vh"}}
                    />
            </Form.Group>
            
            <Form.Group className="my-2 w-75 center" controlId={"file-" + index}>
                <Form.Control
                    type="file"
                    size="sm"
                    required={true}
                />
            </Form.Group>
            
        </Card>
    )
}


export function UploadInput({encryptionPhrase, response}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const signAndExecute = useSignature();
    const packageId = useNetworkVariable('packageId');
    const [input, setInput] = useState([]);
    console.log(input.length)
    return (
        <>
            <Form className="my-3" onSubmit={async (e)=>{
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
            <Col className="my-3">
                <Button type="submit" style={{backgroundColor:"#B0B0B0", color:"#707070"}}>
                    Upload Records
                </Button>
            </Col>
            {input}
            <Container>
                <Button type="button" className="my-2" onClick={()=>setInput([...input,<Input index={input.length}/>])}>
                    <Image src="add.png" rounded style={{width: "45px"}}/>
                </Button>
                <Button type="button" className="my-2" onClick={()=>setInput(input.slice(0, -1))}>
                    <Image src="delete.png" rounded style={{width: "45px"}}/>
                </Button>
            </Container>
            {loading? <Alert className="mt-3" variant="dark">Uploading...</Alert>:null}
            {error? <Alert className="mt-3" variant="dark">{error}</Alert>:null}
            </Form>
        </>
    )
}



