import React, { useState, useEffect } from 'react';
import './App.css';
import ConnectButton from './ConnectButton';
const ethers = require('ethers');
const contractAddress = '0xD11074EBDcaD20F1CfC596355482449Cdcd226A4'; // Replace with your contract address
const contractABI = [ {
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "addAdminRole",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "checkAdmin",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "getValue",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "getValueView",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "initializeA",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "initializeB",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "removeAdminRole",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "renounceAdminRole",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_value",
      "type": "uint256"
    }
  ],
  "name": "setValue",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    }
  ],
  "name": "transferAdminRole",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
}]

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState(null);

  useEffect(() => {
    const connectToMetaMask = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setAccount(accounts[0]);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const deployedContract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(deployedContract);
        }
      }
    };

    connectToMetaMask();
  }, []);

  const getValueFromContract = async () => {
    if (contract) {
      try {
        const retrievedValue = await contract.getValueView(); // Replace with your function name
        setValue(retrievedValue.toString()); // Assuming the function returns a string value
      } catch (error) {
        console.error('Error fetching value:', error);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {isConnected ? (
          <>
            <h1>Connected to MetaMask</h1>
            <p>Your account: {account}</p>
            <button onClick={getValueFromContract} disabled={!contract}>
              Get Value
            </button>
            {value && <p>Contract value: {value}</p>}
          </>
        ) : (
          <ConnectButton />
        )}
      </header>
    </div>
  );
}

export default App;
