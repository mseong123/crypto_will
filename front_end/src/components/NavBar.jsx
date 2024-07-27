import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";


export function NavBar ({setPage}) {
    return (
        <Navbar expand="md" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand> 
                    <div onClick={()=>setPage("Account")} style={{cursor:"pointer"}}><img style={{width:"100px"}} src="/crypto_will.png"/></div>
                </Navbar.Brand>
                <Navbar.Toggle/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link>
                            <span onClick={()=>setPage("Account")} style={{cursor:"pointer"}}>Account</span>
                        </Nav.Link>
                        <Nav.Link className="me-auto">
                            <div onClick={()=>setPage("Trustee")} style={{cursor:"pointer"}}>Trustee</div>
                        </Nav.Link>
                    </Nav>
                    <ConnectButton style={{backgroundColor:"#ffffff"}}/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  )
}