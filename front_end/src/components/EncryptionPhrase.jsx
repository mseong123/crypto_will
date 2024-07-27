import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';


export function EncryptionPhrase({encryptionPhrase, setEncryptionPhrase}) {
    return(
        <Card className="mb-3">
            <Card.Body>
            {!encryptionPhrase? (
            <>
                <Card.Title>Please enter Encryption Phrase</Card.Title>
                <hr></hr>
                <Card.Text>
                Encryption Phrase is used to encrypt, view and manage your files on the blockchain to ensure confidentiality and security of your data.
                Please use a memorable and unique passphrase <span style={{color:"orange"}}>(your wallet's private key is a good example)</span>
                </Card.Text>
                
            </>):<Card.Title>Encryption phrase: {encryptionPhrase}</Card.Title>}
            <Form onSubmit={(e)=>{e.preventDefault();
                    setEncryptionPhrase(document.getElementById("passphrase").value);
                    document.getElementById("passphrase").value = ""}}>
                <InputGroup>
                    <Form.Control
                        id="passphrase"
                        type="text"
                        size="sm"
                        placeholder="Encryption Passphrase (max size 30)"
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