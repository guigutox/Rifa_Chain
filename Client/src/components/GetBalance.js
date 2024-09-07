import React, { useState } from 'react';
import '../App.css';
import { ethers } from 'ethers';  
import { CONTRACT_ADDRESSES } from './config';
import realDigitalJson from './contracts/RealDigital.json';

const GetBalance = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  const handleGetBalance = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask não está instalada');
      }
      
      if (!address) {
        throw new Error('🛑 O endereço é obrigatório 🛑');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();


      const realDigitalContract = new ethers.Contract(CONTRACT_ADDRESSES.REAL_DIGITAL, realDigitalJson.abi,signer);

      const balance = await realDigitalContract.balanceOf(address);

      const formattedBalance = ethers.formatUnits(balance, 18);

      setBalance(formattedBalance);
      setError('');
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao tentar obter o saldo de tokens. Verifique se voce esta passando o endereço correto.");
      setBalance('');
    }
  };

  return (
    <div>
      <h2>Obter Saldo de Tokens</h2>
      <label htmlFor="address">Endereço</label>
      <input
        type="text"
        placeholder="0x1234567890123456789012345678901234567890"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleGetBalance}>Verificar Saldo</button>
      {balance && <p className="messageSucess">Saldo: {balance} tokens</p>}
      {error && <p className="messageError">{error}</p>}
    </div>
  );
};

export default GetBalance;
