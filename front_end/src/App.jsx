import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletStatus } from "./WalletStatus";
import { useState } from "react"
import { Account } from "./components/Account";
import { AccountAction } from "./components/AccountAction";
import { TrusteeSummary } from "./components/TrusteeSummary";
import { TrusteeAction } from "./components/TrusteeAction";
import { NavBar } from "./components/NavBar";
import Container from 'react-bootstrap/Container';
import { EncryptionPhrase } from "./components/EncryptionPhrase";


function App() {
  const currentAccount = useCurrentAccount();
  const [page, setPage] = useState("Record")
  const [theme, setTheme] = useState("light")
  const [encryptionPhrase,setEncryptionPhrase] = useState("");
  let ComponentToRender;
  const RecordComponent = ()=>
  (<>
      <EncryptionPhrase encryptionPhrase={encryptionPhrase} setEncryptionPhrase={setEncryptionPhrase}/>
      <Account encryptionPhrase={encryptionPhrase}/>
  </>)
  const AccountActionComponent = ()=>
    (<>
        <EncryptionPhrase encryptionPhrase={encryptionPhrase} setEncryptionPhrase={setEncryptionPhrase}/>
        <AccountAction/>
    </>)
  const TrusteeSummaryComponent = ()=>
    (<>
        <TrusteeSummary/>
    </>)
  const TrusteeActionComponent = ()=>
    (<>
        <TrusteeAction/>
    </>)

  if (page === "Record")
    ComponentToRender = RecordComponent;
  else if (page === "AccountAction")
    ComponentToRender = AccountActionComponent;
  else if (page === "TrusteeSummary")
    ComponentToRender = TrusteeSummaryComponent;
  else if (page === "TrusteeAction")
    ComponentToRender = TrusteeActionComponent;
  
  return (
    <Container data-bs-theme={theme}>
        <NavBar setPage={setPage}/>
        <WalletStatus/>
        {currentAccount? <ComponentToRender/>: null}
        
    </Container>
    
  );
}

export default App;
