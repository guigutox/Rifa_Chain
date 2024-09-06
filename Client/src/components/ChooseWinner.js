import React, { useState } from 'react';
import { ethers } from 'ethers';
import '../App.css';


const SorteioRaffle = () => {
  const [rifaId, setRifaId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSorteio = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask não está instalada');
      if (!rifaId) throw new Error('🛑O ID da rifa é obrigatório🛑');

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const response = await fetch(`/rifa/${rifaId}`);
      const data = await response.json();

      if (!data.address) {
        throw new Error('❌ Endereço da rifa não encontrado ❌');
      }

      const { address: rifaAddress, abi: rifaAbi } = await response.json();
      
     

      const rifaContract = new ethers.Contract(rifaAddress, rifaAbi, signer);

      // Interagir com o contrato chamando a função `sorteio`
      const tx = await rifaContract.escolherVencedor();
      await tx.wait();

      // Se a transação for bem-sucedida, faça a requisição ao backend
      const backendResponse = await fetch('/sorteio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rifaId
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
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Realizar Sorteio</h2>
      <label>ID da Rifa</label>
      <input
        type="text"
        placeholder="0x1234567890123456789012345678901234567890"
        value={rifaId}
        onChange={(e) => setRifaId(e.target.value)}
      />
      <button onClick={handleSorteio}>Realizar Sorteio</button>
      {message && <p class = "messageSucess">{message}</p>}
      {error && <p class = "messageError">{error}</p>}
    </div>
  );
};

export default SorteioRaffle;
