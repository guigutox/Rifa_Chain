import React, { useState } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';

const Message = styled.p`
  color: green;
  font-size: 1.2em;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 1.2em;
  font-weight: bold;
  background-color: #fdd;
  padding: 10px;
  border-radius: 5px;
`;

const CreateRaffle = () => {
  const [maxEntradas, setMaxEntradas] = useState('');
  const [valorEntrada, setValorEntrada] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateRaffle = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask não está instalada');

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const realDigitalResponse = await fetch('/real-digital-info');
      const { address: realDigitalAddress} = await realDigitalResponse.json();

      const rifaAbiResponse = await fetch('/rifa-abi-bytecode');
      const { abi: rifaAbi, bytecode: rifaBytecode } = await rifaAbiResponse.json();

      const RifaFactory = new ethers.ContractFactory(rifaAbi, rifaBytecode, signer);
      const rifa = await RifaFactory.deploy(realDigitalAddress, maxEntradas, ethers.parseUnits(valorEntrada, 18));
      await rifa.waitForDeployment();

      const rifaAddress = await rifa.getAddress();

      // Enviar os dados da nova rifa para o backend para salvar no banco de dados
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

      setMessage('Rifa criada com sucesso!');
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
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
      {message && <Message>{message}</Message>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default CreateRaffle;
