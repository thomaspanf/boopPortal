import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/BoopPortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * Create a varaible here that holds the contract address after you deploy!
   */
  const contractAddress = "0x034895B37E18f7319c18ae755D3DaD8F1b310C89";
  const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const boop = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const boopPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await boopPortalContract.getTotalBoops();
        console.log("Retrieved total boop count...", count.toNumber());

        const boopTxn = await boopPortalContract.boop();
        console.log("Mining...", boopTxn.hash);

        await boopTxn.wait();
        console.log("Mined -- ", boopTxn.hash);

        count = await boopPortalContract.getTotalBoops();
        console.log("Retrieved total boop count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there! 
        </div>
    
        <div className="bio">
          Hello! My name is Thomas and I am a third year computer science student. Log in with your metamask wallet to boop me through the blockchain network.
        </div>
    
        <button className="boopButton" onClick={boop}>
          boop!
        </button>

          {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="boopButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
    );
  }
export default App