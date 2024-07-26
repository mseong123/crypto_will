import Card from 'react-bootstrap/Card';
import { decryptAES } from "../utils/encryptionAES"

export function Record({fields,index}) {
    return (
        <Card id={index}>
            <Card.Body>
                <Card.Text>
                    <Card.Link href={decryptAES(fields.encryptedCID[index])}></Card.Link>
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>
    )

}