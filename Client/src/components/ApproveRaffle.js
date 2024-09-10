import React, { useState } from 'react';
import realDigitalJson from './contracts/RealDigital.json';
import { CONTRACT_ADDRESSES } from './config';
import { ethers } from 'ethers';
import '../App.css';


const ApproveRaffle = () => {
  const [amount, setAmount] = useState('');
  const [rifaAddress, setRifaId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleApprove = async () => {
    try {
      setMessage('');
      setError('');

      if (!window.ethereum) {
        throw new Error('🦊 MetaMask não está instalada 🦊');
      }

      if (!rifaAddress) {
        setError('🛑 Endereço da rifa não informado 🛑');
        return;
      }

      if (!amount) {
        setError('🛑 Quantidade de tokens não informada 🛑');
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();


      const RealDigitalContract = new ethers.Contract(CONTRACT_ADDRESSES.REAL_DIGITAL, realDigitalJson.abi, signer);
      const amountToApprove = ethers.parseUnits(amount, 18);

      const tx = await RealDigitalContract.approve(rifaAddress, amountToApprove);
      await tx.wait();

      setMessage('✔️ Aprovação realizada com sucesso! ✔️');
      setError('');
    } catch (err) {
      console.error(err);
      setError('🗑️ Limpe o cache do seu metamask e verifique se o endereço da rifa esta correto ❌');
    }
  };

  return (
    <div>
      <h2>Aprovar Rifa</h2>
      <label>Endereço da Rifa</label>
      <input
        type="text"
        placeholder="0x1234567890123456789012345678901234567890"
        value={rifaAddress}
        onChange={(e) => setRifaId(e.target.value)}
      />
      <label>Quantidade</label>
      <input
        type="text"
        placeholder="100"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleApprove}>Aprovar</button>
      {message && <p className = "messageSucess">{message}</p>}
      {error && <p className = "messageError">{error}</p>}
    </div>
  );
};

export default ApproveRaffle;
