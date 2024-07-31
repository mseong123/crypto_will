import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';


export function SelectionScreen ({setPage}) {
    return (
    <Container>
        <h5>Select services</h5>
        <Row>
            <Card className="my-2" style={{width: "200px", marginRight: "36px"}}>
                <Card.Body>
                    <Card.Img variant="top" src="idea.png" className="my-2 center" style={{width: "40px", alignSelf: "center"}}/>
                    <Card.Title><Button onClick={()=>setPage("Record")}>Record Management</Button></Card.Title>
                </Card.Body>
            </Card>
            <Card className="my-2" style={{width: "200px", marginRight: "36px"}}>
                <Card.Body>
                    <Card.Img variant="top" src="approve.png" className="my-2 center" style={{width: "40px", alignSelf: "center"}}/>
                    <Card.Title><Button onClick={()=>setPage("TrusteeSummary")}>Trustee</Button></Card.Title>
                </Card.Body>
            </Card>
            <Card className="my-2" style={{width: "200px", padding: "10px 20px"}}>
                <Card.Img variant="top" src="donation.png" className="my-2 center" style={{width: "40px", alignSelf: "center"}}/>
                <Card.Title><Button onClick={()=>setPage("CondolenceDonation")}>Condolences Donation</Button></Card.Title>
            </Card>
        </Row>
    </Container>
    )
}