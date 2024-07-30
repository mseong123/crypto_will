import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LogStatus, useLogin } from './UserContext';



export function NavBar({ page, setPage }) {

	let ComponentToRender;
	let ButtonToRender;
	const { isLoggedIn, userDetails, login, logOut } = useLogin();

	const LoginButton = () => (<NavDropdown title="Connect" id="basic-nav-dropdown">
		<NavDropdown.Item onClick={login}>zkLogin</NavDropdown.Item>
		<ConnectButton style={{ backgroundColor: "#ffffff" }} />
	</NavDropdown>)

	const WalletButton = () => (
		<ConnectButton style={{ backgroundColor: "#ffffff" }} />
	)

	const ZkButton = () => (
		<NavDropdown title={`Welcome, ${userDetails.address}`} id="basic-nav-dropdown">
			<NavDropdown.Item onClick={logOut}>Log Out</NavDropdown.Item>
		</NavDropdown>
	)

	const SelectionNavComponent = () =>
	(<>
	</>)

	const RecordNavComponent = () =>
	(<>
		<Nav.Link onClick={() => setPage("Record")}>Record Summary</Nav.Link>
		<Nav.Link onClick={() => setPage("RecordUpload")}>Upload</Nav.Link>
		<Nav.Link onClick={() => setPage("RecordAction")}>Action</Nav.Link>
	</>)

	const TrusteeNavComponent = () =>
	(<>
		<Nav.Link onClick={() => setPage("TrusteeSummary")}>Trustee Summary</Nav.Link>
		<Nav.Link onClick={() => setPage("TrusteeAction")}>Action</Nav.Link>
		<Nav.Link onClick={() => setPage("RequestDonation")}>Request Donation</Nav.Link>
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
