import React, { useState } from 'react';
import { ethers } from 'ethers';

const SorteioRaffle = () => {
  const [rifaId, setRifaId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSorteio = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask não está instalada');

      // Solicitar a conexão da MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();

      // Obter os dados da rifa a partir do backend
      const response = await fetch(`/rifa/${rifaId}`);
      const { address: rifaAddress, abi: rifaAbi } = await response.json();

      // Criar uma instância do contrato usando o endereço da rifa e a ABI
      const rifaContract = new ethers.Contract(rifaAddress, rifaAbi, signer);

      // Interagir com o contrato chamando a função `sorteio`
      const tx = await rifaContract.sorteio();
      await tx.wait();

      setMessage('Sorteio realizado com sucesso!');
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
      <input
        type="text"
        placeholder="ID da Rifa"
        value={rifaId}
        onChange={(e) => setRifaId(e.target.value)}
      />
      <button onClick={handleSorteio}>Realizar Sorteio</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SorteioRaffle;
