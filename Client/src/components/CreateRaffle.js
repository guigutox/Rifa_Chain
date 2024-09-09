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

  const fetchURL = 'https://k2u52s2tc6.execute-api.us-east-1.amazonaws.com/dev'; // URL base
  
  const handleCreateRaffle = async () => {
    try {
      if (!window.ethereum) throw new Error('🦊 MetaMask não está instalada 🦊');
      if (!maxEntradas) throw new Error('🛑 Máximo de entradas não informado 🛑');
      if (!valorEntrada) throw new Error('🛑 Valor por entrada não informado 🛑');
  
      await window.ethereum.request({ method: 'eth_requestAccounts' });
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      const RifaFactory = new ethers.ContractFactory(rifaJson.abi, rifaJson.bytecode, signer);
      const rifa = await RifaFactory.deploy(CONTRACT_ADDRESSES.REAL_DIGITAL, maxEntradas, ethers.parseUnits(valorEntrada, 18));
      await rifa.waitForDeployment();
  
      const rifaAddress = await rifa.getAddress();
  
      // Enviar os dados da nova rifa para o backend para salvar no banco de dados
      const response = await fetch(`${fetchURL}/criar-rifa`, {
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
        const errorResponse = await response.text();
        console.error('Erro ao salvar a rifa no banco de dados:', errorResponse);
        throw new Error(`Erro ao salvar a rifa no banco de dados: ${errorResponse}`);
      }
  
      setMessage('✔️ Rifa criada com sucesso! ✔️');
      setError('');
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message || 'Erro desconhecido');
      setMessage('');
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
      {message && <p className="messageSucess">{message}</p>}
      {error && <p className="messageError">{error}</p>}
    </div>
  );
};

export default CreateRaffle;
