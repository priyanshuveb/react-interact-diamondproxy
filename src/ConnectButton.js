import React from 'react';
//const ethers = require('ethers');

const ConnectButton = ({ onConnect }) => {
  const connectToMetaMask = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        onConnect(accounts[0]);
      } else {
        console.log('Connection rejected');
      }
    } else {
      console.log('MetaMask not installed');
    }
  };

  return (
    <button onClick={connectToMetaMask}>Connect with MetaMask</button>
  );
};

export default ConnectButton;