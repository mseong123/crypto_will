import Card from 'react-bootstrap/Card';
import { downloadIPFS } from "../utils/downloadIPFS"

export function TrusteeCard({match,index}) {
    return (
        <Card.Link className="me-2" style={{cursor:"pointer"}} onClick={()=>{downloadIPFS(decrypted, setError, fields.filename[index])}}>
            {match[0].data.content.fields.filename[index]}
        </Card.Link>
    )
}

