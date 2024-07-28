import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletStatus } from "./WalletStatus";
import { useEffect, useState } from "react"
import { AccountWrapper } from "./components/AccountWrapper";
import { TrusteeSummary } from "./components/TrusteeSummary";
import { TrusteeAction } from "./components/TrusteeAction";
import { CondolenceDonation } from "./components/CondolenceDonation";
import { NavBar } from "./components/NavBar";
import Container from 'react-bootstrap/Container';
import { EncryptionPhrase } from "./components/EncryptionPhrase";
import { useAuth, AuthState } from './components/AuthContext';


function App() {
	const { authState, jwt, userSpecificData, zkLoginSignature, zkLoginAddress, ephemeralSecretKey, walletAccount, logout, setJwt, setUserSpecificData, setZkLoginSignature, setZkLoginAddress, setEphemeralSecretKey, setAuthState, currentPage, setCurrentPage} = useAuth();
  const currentAccount = useCurrentAccount();
  const [accountExist, setAccountExist] = useState(false)
  const [accountState, setAccountState] = useState(false)
  // const [page, setPage] = useState(currentPage)
	const cp = sessionStorage.getItem('currentPage')
  const [page, setPage] = useState(cp ? cp : "Record")
  const [encryptionPhrase,setEncryptionPhrase] = useState("");
	useEffect(() => {
		sessionStorage.setItem('currentPage', page);
		console.log(page)
		setCurrentPage(page);
	}, [page])
  let ComponentToRender;
  const AccountWrapperComponent = ()=>
  (<>
      {accountExist && page==="Record"? <EncryptionPhrase encryptionPhrase={encryptionPhrase} setEncryptionPhrase={setEncryptionPhrase}/>:null}
      <AccountWrapper page={page} setAccountExist={setAccountExist} encryptionPhrase={encryptionPhrase}/>
  </>)
 
  const TrusteeSummaryComponent = ()=>
    (<>
        <TrusteeSummary/>
    </>)
  const TrusteeActionComponent = ()=>
    (<>
        <TrusteeAction/>
    </>)
	const CondolenceDonationComponent = () => 
    (<>
        <CondolenceDonation/>
    </>)

  if (page === "Record" || page === "AccountAction")
    ComponentToRender = AccountWrapperComponent;
  else if (page === "TrusteeSummary")
    ComponentToRender = TrusteeSummaryComponent;
  else if (page === "TrusteeAction")
    ComponentToRender = TrusteeActionComponent;
  else if (page === "CondolenceDonation")
    ComponentToRender = CondolenceDonationComponent;
  
  return (
    <Container>
        <NavBar setPage={setPage}/>
        <WalletStatus/>
        {currentAccount || ComponentToRender === CondolenceDonationComponent? <ComponentToRender/>: null}
        
    </Container>
    
  );
}

export default App;
