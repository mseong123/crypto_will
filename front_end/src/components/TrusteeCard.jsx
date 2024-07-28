import Card from 'react-bootstrap/Card';
import { downloadIPFS } from "../utils/downloadIPFS"

export function TrusteeCard({decryptedCID, decrypted,match,index,setError,encryptedPhrase}) {
    return (
        <>
        {decrypted?<Card.Link className="me-2" style={{cursor:"pointer"}} onClick={()=>{downloadIPFS(decryptedCID[index], setError, match[0].data.content.fields.filename[index])}}>
            {match[0].data.content.fields.filename[index]}
        </Card.Link>:<Card.Text className="me-2">
            {match[0].data.content.fields.filename[index]}
        </Card.Text>}
        
        </>)
}

