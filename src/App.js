import React, { useState, useEffect } from 'react';
import './App.css';
import ConnectButton from './ConnectButton';
const ethers = require('ethers');
const contractAddress = '0x5bb74bA054C30e05c1Eb69a015a8ab3c3b5D7A46';
const contractABI = [{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "theValue",
  "type": "event"
},
{
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
  "outputs": [],
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
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        const tx = await contract.getValue(); 
        const reciept = await tx.wait()
        
        const decimalValue = parseInt(reciept.logs[0].data,16)
        setValue(decimalValue); 
  
      } catch (error) {
        console.error('Error fetching value:', error);
      }
    }
  };

  const setValueOnContract = async () => {
    if (contract && inputValue) {
      try {
        setIsLoading(true);
        const parsedValue = inputValue; 
        const tx = await contract.setValue(parsedValue);
        console.log('Transaction hash:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt.confirmationNumber);
        setValue('Value has been set');
        setInputValue(''); 
      } catch (error) {
        console.error('Error setting value:', error);
      } finally {
        setIsLoading(false);
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
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value (in ether)"
              disabled={isLoading}
            />
            <button onClick={setValueOnContract} disabled={!contract || isLoading}>
              {isLoading ? 'Setting Value...' : 'Set Value'}
            </button>
            {value && <p>{value}</p>}
          </>
        ) : (
          <ConnectButton />
        )}
        </header>
      </div>
    );
  }

  export default App;
