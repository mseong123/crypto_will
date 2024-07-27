import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletStatus } from "./WalletStatus";
import { useState } from "react"
import { AccountWrapper } from "./components/AccountWrapper";
import { TrusteeSummary } from "./components/TrusteeSummary";
import { TrusteeAction } from "./components/TrusteeAction";
import { NavBar } from "./components/NavBar";
import { GoogleAuth } from './components/GoogleAuth';
import Container from 'react-bootstrap/Container';
import { EncryptionPhrase } from "./components/EncryptionPhrase";


function App() {
  const currentAccount = useCurrentAccount();
  const [accountExist, setAccountExist] = useState(false)
  const [accountState, setAccountState] = useState(false)
  const [page, setPage] = useState("Record")
  const [encryptionPhrase,setEncryptionPhrase] = useState("");
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

  if (page === "Record" || page === "AccountAction")
    ComponentToRender = AccountWrapperComponent;
  else if (page === "TrusteeSummary")
    ComponentToRender = TrusteeSummaryComponent;
  else if (page === "TrusteeAction")
    ComponentToRender = TrusteeActionComponent;
  
  return (
    <Container>
        <NavBar setPage={setPage}/>
		<GoogleAuth/>
        <WalletStatus/>
        {currentAccount? <ComponentToRender/>: null}
        
    </Container>
    
  );
}

export default App;
