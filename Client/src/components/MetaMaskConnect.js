import React, { useState } from 'react';

function MetaMaskConnect() {
  const [walletAddress, setWalletAddress] = useState(''); // Estado para armazenar o endereço da carteira

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Solicita contas da MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]); // Armazena o endereço da carteira conectada
      } catch (error) {
        console.error('Erro ao conectar com MetaMask:', error);
      }
    } else {
      alert('MetaMask não detectada. Por favor, instale a extensão.');
    }
  };

  return (
      <button onClick={connectWallet}>
        {walletAddress ? `Conectado: ${walletAddress}` : 'Conectar MetaMask'}
      </button> 
  );
}

export default MetaMaskConnect;
