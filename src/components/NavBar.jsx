import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";


export function NavBar ({setPage}) {
    return (
        <Navbar expand="md" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>
                    {/* Crypto Wills */}
                    <span onClick={()=>console.log("here")} style={{cursor:"pointer"}}>Crypto Wills</span>
                </Navbar.Brand>
                <Navbar.Toggle/>
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link>
                        Account
                        {/* <span onClick={()=>console.log("here")} style={{cursor:"pointer"}}>Account</span> */}
                    </Nav.Link>
                    <Nav.Link className="me-auto">
                        <div onClick={()=>console.log("here")} style={{cursor:"pointer"}}>Executor</div>
                    </Nav.Link>
                    
                    
                </Nav>
                <ConnectButton style={{backgroundColor:"turquoise"}}/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  )
}