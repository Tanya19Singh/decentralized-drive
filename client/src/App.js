import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useRef,useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";
function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [vantaEffect, setVantaEffect] = useState(null); // To store Vanta instance
  const vantaRef = useRef(null); // Reference to the div element

  // Use useEffect to initialize Vanta after component mounts
  useEffect(() => {
    if (window.VANTA&&!vantaEffect) {
      setVantaEffect(
        window.VANTA.CLOUDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          backgroundColor: 0x10101
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy(); // Cleanup the effect on unmount
    };
  }, [vantaEffect]);


  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}

      <div className="App">
      <div
      ref={vantaRef}
      style={{ height: "100%", width: "100%" }} // Full-screen container for Vanta effect
    >

        <h1 style={{ color: "#5B42F3" }}>Pic-Cloud</h1>
              <p style={{ color: "#5B42F3" }}>
          Account : {account ? account : "Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={account}></Display>
      </div>
      </div>
    </>
  );
}

export default App; 