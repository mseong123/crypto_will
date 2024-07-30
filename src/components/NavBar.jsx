import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LogStatus, useLogin } from './UserContext';
import Button from 'react-bootstrap/Button';

export function NavBar({ page, setPage }) {

	let ComponentToRender;
	let ButtonToRender;
	const { isLoggedIn, userDetails, login, logOut } = useLogin();

	const LoginButton = () => (<>
		<Button  className="button-nav" onClick={login}>zkLogin</Button>
		<ConnectButton style={{ marginRight: "10px", background: "white", borderColor: "#eeeeee", color: "black", boxShadow: "0 5px 3px rgba(9, 2, 10, .4)" }} />
	</>)

	const WalletButton = () => (
		<ConnectButton style={{ backgroundColor: "#ffffff" }} />
	)

	const ZkButton = () => (
		<NavDropdown className="button-nav" title={`${userDetails.address.slice(0,20)}`} >
			<NavDropdown.Item onClick={logOut}>Log Out</NavDropdown.Item>
		</NavDropdown>
	)

	const SelectionNavComponent = () =>
	(<>
	</>)

	const RecordNavComponent = () =>
	(<>
		<Nav.Link onClick={() => setPage("Record")}>Record summary</Nav.Link>
		<Nav.Link onClick={() => setPage("RecordUpload")}>Upload</Nav.Link>
		<Nav.Link onClick={() => setPage("RecordAction")}>Action</Nav.Link>
	</>)

	const TrusteeNavComponent = () =>
	(<>
		<Nav.Link onClick={() => setPage("TrusteeSummary")}>I'm a trustee</Nav.Link>
		<Nav.Link onClick={() => setPage("TrusteeAction")}>Action</Nav.Link>
		<Nav.Link onClick={() => setPage("RequestDonation")}>Request donation</Nav.Link>
	</>)

	const CondolencesDonationNavComponent = () =>
	(<>

	</>)

	if (isLoggedIn === LogStatus.loggedOut) {
		ButtonToRender = LoginButton
	} else if (isLoggedIn === LogStatus.wallet) {
		ButtonToRender = WalletButton
	} else {
		ButtonToRender = ZkButton
	}

	if (page === "SelectionScreen")
		ComponentToRender = SelectionNavComponent
	else if (page === "Record")
		ComponentToRender = RecordNavComponent;
	else if (page === "RecordUpload")
		ComponentToRender = RecordNavComponent;
	else if (page === "RecordAction")
		ComponentToRender = RecordNavComponent;

	else if (page === "TrusteeSummary")
		ComponentToRender = TrusteeNavComponent;
	else if (page === "TrusteeAction")
		ComponentToRender = TrusteeNavComponent;
	else if (page === "RequestDonation")
		ComponentToRender = TrusteeNavComponent;
	else if (page === "CondolenceDonation")
		ComponentToRender = CondolencesDonationNavComponent;

	return (
		<Navbar expand="md" className="bg-body-tertiary">
			<Container>
				<Navbar.Brand>
					<div onClick={() => setPage("SelectionScreen")} style={{ cursor: "pointer" }}><img style={{ width: "100px" }} src="/crypto_will.png" /></div>
				</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<ComponentToRender />
					</Nav>
					<Nav>
						<ButtonToRender />
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}
