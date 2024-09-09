import React, { useState } from 'react';

function MetaMaskConnect() {
  const [walletAddress, setWalletAddress] = useState(''); 

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]); 
      } catch (error) {
        console.error('🦊 Erro ao conectar com MetaMask:', error);
      }
    } else {
      alert('🦊 MetaMask não detectada. Por favor, instale a extensão.');
    }
  };

  return (
      <button onClick={connectWallet}>
        {walletAddress ? `Conectado: ${walletAddress}` : 'Conectar MetaMask'}
      </button> 
  );
}

export default MetaMaskConnect;
