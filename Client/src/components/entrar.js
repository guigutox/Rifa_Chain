import React, { useState } from 'react';
import { ethers } from 'ethers'; // Importar ethers para o frontend

const EnterRaffle = () => {
  const [rifaId, setRifaId] = useState('');
  const [quantidadeRifas, setQuantidadeRifas] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEnterRaffle = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask não está instalada');
      }

      // Solicitar a conexão da MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Criar o provider e o signer da MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Usando "await provider.getSigner()" para obter o signer da conta conectada na MetaMask
      const signer = await provider.getSigner();

      // Obter os dados da rifa a partir do backend (endereço do contrato e ABI)
      const response = await fetch(`/rifa/${rifaId}`);
      const { address: rifaAddress, abi: rifaAbi } = await response.json();

      // Criar uma instância do contrato usando o endereço da rifa e a ABI
      const rifaContract = new ethers.Contract(rifaAddress, rifaAbi, signer);

      // Interagir com o contrato chamando a função `entrar`
      const tx = await rifaContract.entrar(quantidadeRifas);

      // Aguardar a confirmação da transação
      await tx.wait();

      setMessage('Você entrou na rifa com sucesso!');
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Entrar na Rifa</h2>
      <label>ID da Rifa</label>
      <input
        type="text"
        placeholder="0x1234567890123456789012345678901234567890"
        value={rifaId}
        onChange={(e) => setRifaId(e.target.value)}
      />
      <label>Quantidade de Rifas</label>
      <input
        type="number"
        placeholder="20"
        value={quantidadeRifas}
        onChange={(e) => setQuantidadeRifas(e.target.value)}
      />
      <button onClick={handleEnterRaffle}>Entrar na Rifa</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default EnterRaffle;
