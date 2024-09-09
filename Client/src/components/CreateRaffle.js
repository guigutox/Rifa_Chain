import React, { useState } from 'react';
import { ethers } from 'ethers';
import '../App.css';
import rifaJson from './contracts/Rifa.json';
import { CONTRACT_ADDRESSES } from './config';

const CreateRaffle = () => {
  const [maxEntradas, setMaxEntradas] = useState('');
  const [valorEntrada, setValorEntrada] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateRaffle = async () => {
    try {
      setMessage('');
      setError('');

      if (!maxEntradas) {
        setError('🛑 Máximo de entradas não informado 🛑');
        return; 
      }
      if (!valorEntrada) {
        setError('🛑 Valor por entrada não informado 🛑');
        return; 
      }

      if (!window.ethereum) {
        throw new Error('🦊 MetaMask não está instalada 🦊');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Configura o provedor e o signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Cria o contrato da rifa
      const RifaFactory = new ethers.ContractFactory(rifaJson.abi, rifaJson.bytecode, signer);
      const rifa = await RifaFactory.deploy(CONTRACT_ADDRESSES.REAL_DIGITAL, maxEntradas, ethers.parseUnits(valorEntrada, 18));
      await rifa.waitForDeployment();

      const rifaAddress = await rifa.getAddress();

      // Enviar os dados da nova rifa para o backend
      const response = await fetch('/criar-rifa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rifaAddress,
          maxEntradas,
          valorEntrada,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar a rifa no banco de dados');
      }

      setMessage('✔️ Rifa criada com sucesso! ✔️');
    } catch (err) {
      console.error(err);
      setError("🗑️ Limpe o cache do seu metamask 🗑️");
    }
  };

  return (
    <div>
      <h2>Criar Nova Rifa</h2>
      <label>Máximo de Entradas</label>
      <input
        type="text"
        placeholder="10"
        value={maxEntradas}
        onChange={(e) => setMaxEntradas(e.target.value)}
      />
      <label>Valor por Entrada (DREX)</label>
      <input
        type="text"
        placeholder="1"
        value={valorEntrada}
        onChange={(e) => setValorEntrada(e.target.value)}
      />
      <button onClick={handleCreateRaffle}>Criar Rifa</button>
      {message && <p class="messageSucess">{message}</p>}
      {error && <p class="messageError">{error}</p>}
    </div>
  );
};

export default CreateRaffle;
