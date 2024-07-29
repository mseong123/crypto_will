import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import NavDropdown from 'react-bootstrap/NavDropdown';


export function NavBar ({setPage}) {

    return (
        <Navbar expand="md" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand> 
                    <div onClick={()=>setPage("Record")} style={{cursor:"pointer"}}><img style={{width:"100px"}} src="/crypto_will.png"/></div>
                </Navbar.Brand>
                <Navbar.Toggle/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Account">
                            <NavDropdown.Item>
                                <span onClick={()=>setPage("Record")} style={{cursor:"pointer"}}>Record</span>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <span onClick={()=>setPage("AccountAction")} style={{cursor:"pointer"}}>Account Action</span>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Trustee">
                            <NavDropdown.Item>
                                <span onClick={()=>setPage("TrusteeSummary")} style={{cursor:"pointer"}}>Trustee Sumary</span>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <span onClick={()=>setPage("TrusteeAction")} style={{cursor:"pointer"}}>Trustee Action</span>
                            </NavDropdown.Item>
                        </NavDropdown>
						<Nav.Link>
							<span onClick={()=>setPage("CondolenceDonation")} style={{cursor:"pointer"}}>Condolence Donation</span>
						</Nav.Link>
                    </Nav>
                    <ConnectButton style={{backgroundColor:"#ffffff"}}/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  )
}
