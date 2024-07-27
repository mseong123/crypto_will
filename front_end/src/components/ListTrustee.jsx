import Card from 'react-bootstrap/Card';

export function ListTrustee({response}) {
    console.log(response)
    const TrusteeList = () =>{
        const trusteeCards = response.data.data[0].data.content.fields.trustee.map((data,index)=>{
        return (
            <Card key={index} className="mb-2">
                <Card.Body>
                    <Card.Text><span style={{fontWeight:500}}>Address: </span>{data}</Card.Text>
                    <Card.Text className="d-inline-block me-2"><span style={{fontWeight:500}}>Trustee Description: </span>{response.data.data[0].data.content.fields.trusteeDescription[index]}</Card.Text>
                    <Card.Text className="d-inline-block"><span style={{fontWeight:500}}>Timestamp: </span>{Date(response.data.data[0].data.content.fields.trusteeTimestamp[index]).toString()}</Card.Text>
                </Card.Body>
            </Card>
            )
        })
        return <>{trusteeCards}</>;
    }


    return (
        <>
            <h4>Trustee Nominies for your Account</h4>
            <TrusteeList/>
        </>
    )
}