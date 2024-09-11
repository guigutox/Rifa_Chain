import React, { useState } from 'react';
import rifaJson from './contracts/Rifa.json';
import { ethers } from 'ethers';
import '../App.css';


const SorteioRaffle = () => {
  const [rifaAddress, setrifaAddress] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSorteio = async () => {
    try {
      setMessage('');
      setError('');

      if (!rifaAddress) {
        setError('🛑 Endereço da rifa não informado 🛑');
        return;
      }

      if (!window.ethereum) {
        throw new Error('🦊 MetaMask não está instalada 🦊');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const rifaContract = new ethers.Contract(rifaAddress, rifaJson.abi, signer);

      const tx = await rifaContract.escolherVencedor();
      await tx.wait();

      const backendResponse = await fetch('/sorteio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rifaAddress
        }),
      });
  
      const backendData = await backendResponse.json();
  
      if (!backendResponse.ok) {
        throw new Error(backendData.error || 'Erro ao atualizar a rifa');
      }
  
      setMessage('✔️ Sorteio realizado com sucesso! ✔️');
      setError('');
    } catch (err) {
      console.error(err);
      setError('❌ Endereço da rifa não encontrado ❌');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Realizar Sorteio</h2>
      <label>Endereço da Rifa</label>
      <input
        type="text"
        placeholder="0x1234567890123456789012345678901234567890"
        value={rifaAddress}
        onChange={(e) => setrifaAddress(e.target.value)}
      />
      <button onClick={handleSorteio}>Realizar Sorteio</button>
      {message && <p class = "messageSucess">{message}</p>}
      {error && <p class = "messageError">{error}</p>}
    </div>
  );
};

export default SorteioRaffle;
