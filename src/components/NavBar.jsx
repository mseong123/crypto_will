import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import NavDropdown from 'react-bootstrap/NavDropdown';







export function NavBar ({page, setPage}) {
    let ComponentToRender;

    const SelectionNavComponent = ()=>
        (<>
        </>)
    
    const RecordNavComponent = ()=>
        (<>
            <Nav.Link onClick={()=>setPage("Record")}>Record Summary</Nav.Link>
            <Nav.Link><span onClick={()=>setPage("RecordAction")}>Action</span></Nav.Link>
        </>)
    
    const TrusteeNavComponent = ()=>
        (<>
            <Nav.Link><span onClick={()=>setPage("TrusteeSummary")}>Trustee Summary</span></Nav.Link>
            <Nav.Link><span onClick={()=>setPage("TrusteeAction")}>Action</span></Nav.Link>
        </>)
    
    const CondolencesDonationNavComponent = ()=>
        (<>
            
        </>)

    if (page === "SelectionScreen")
        ComponentToRender = SelectionNavComponent
    else if (page === "Record")
        ComponentToRender = RecordNavComponent;
    else if (page === "RecordAction")
        ComponentToRender = RecordNavComponent;
    else if (page === "TrusteeSummary")
        ComponentToRender = TrusteeNavComponent;
    else if (page === "TrusteeAction")
        ComponentToRender = TrusteeNavComponent;
    else if (page === "CondolenceDonation")
        ComponentToRender = CondolencesDonationNavComponent;

    return (
        <Navbar expand="md" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand> 
                    <div onClick={()=>setPage("SelectionScreen")} style={{cursor:"pointer"}}><img style={{width:"100px"}} src="/crypto_will.png"/></div>
                </Navbar.Brand>
                <Navbar.Toggle/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <ComponentToRender/>
                    </Nav>
                    <ConnectButton style={{backgroundColor:"#ffffff"}}/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  )
}
