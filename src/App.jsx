import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletStatus } from "./WalletStatus";
import { useEffect, useState } from "react"
import { SelectionScreen } from "./components/SelectionScreen";
import { AccountWrapper } from "./components/AccountWrapper";
import { TrusteeSummary } from "./components/TrusteeSummary";
import { TrusteeAction } from "./components/TrusteeAction";
import { RequestDonation } from "./components/RequestDonation";
import { CondolenceDonation } from "./components/CondolenceDonation";
import { NavBar } from "./components/NavBar";
import Container from 'react-bootstrap/Container';
import { EncryptionPhrase } from "./components/EncryptionPhrase";


function App() {
  const currentAccount = useCurrentAccount();
  const [accountExist, setAccountExist] = useState(false)
  const [accountState, setAccountState] = useState(false)
  // const [page, setPage] = useState(currentPage)
	// const cp = sessionStorage.getItem('currentPage')
  // const [page, setPage] = useState(cp ? cp : "SelectionScreen")
  const [page, setPage] = useState("SelectionScreen")
  const [encryptionPhrase,setEncryptionPhrase] = useState("");
	// useEffect(() => {
	// 	sessionStorage.setItem('currentPage', page);
	// 	
	// 	setCurrentPage(page);
	// }, [page])
  let ComponentToRender;
  useEffect(() => {
    setEncryptionPhrase("")
		setPage("SelectionScreen")
	}, [currentAccount])

  const SelectionScreenComponent = ()=>
  (<SelectionScreen setPage={setPage}/>)

  const RecordComponent = ()=>
  (<>
      {accountExist && page==="Record"? <EncryptionPhrase encryptionPhrase={encryptionPhrase} setEncryptionPhrase={setEncryptionPhrase}/>:null}
      <AccountWrapper page={page} setAccountExist={setAccountExist} encryptionPhrase={encryptionPhrase}/>
  </>)

  const RecordActionComponent = ()=>
  (<>
      <AccountWrapper page={page} setAccountExist={setAccountExist} encryptionPhrase={encryptionPhrase}/>
  </>)
  const RecordUploadComponent = ()=>
    (<>
        {accountExist && page==="RecordUpload"? <EncryptionPhrase encryptionPhrase={encryptionPhrase} setEncryptionPhrase={setEncryptionPhrase}/>:null}
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
  const RequestDonationComponent = () =>
    (<>
        <RequestDonation/>
    </>)
	const CondolenceDonationComponent = () =>
    (<>
        <CondolenceDonation/>
    </>)

  if (page === "SelectionScreen")
    ComponentToRender = SelectionScreenComponent;
  else if (page === "Record")
    ComponentToRender = RecordComponent;
  else if (page === "RecordAction")
    ComponentToRender = RecordActionComponent;
  else if (page === "RecordUpload")
    ComponentToRender = RecordUploadComponent;
  else if (page === "TrusteeSummary")
    ComponentToRender = TrusteeSummaryComponent;
  else if (page === "TrusteeAction")
    ComponentToRender = TrusteeActionComponent;
  else if (page === "RequestDonation")
    ComponentToRender = RequestDonationComponent;
  else if (page === "CondolenceDonation")
    ComponentToRender = CondolenceDonationComponent;

  return (
    <Container className="main-container">
        <NavBar page={page} setPage={setPage}/>
        <WalletStatus/>
        {currentAccount? <ComponentToRender/>: null}

    </Container>

  );
}

export default App;
