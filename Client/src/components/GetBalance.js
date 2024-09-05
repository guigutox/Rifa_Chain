import React, { useState } from 'react';
import styled from 'styled-components';
import { getBalance } from '../api/rifa';

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

const GetBalance = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  const handleGetBalance = async () => {
    try {
      if (!address) {
        throw new Error('🛑 O endereço é obrigatório 🛑');
      }
      const response = await getBalance(address);
      setBalance(response.balance);
      setError('');
    } catch (err) {
      setError(err.message);
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
      {balance && <Message>Saldo: {balance}</Message>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default GetBalance;
