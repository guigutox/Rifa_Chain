import React, { useState } from 'react';
import { getBalance } from '../api/rifa';

const GetBalance = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  const handleGetBalance = async () => {
    try {
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
      <input
        type="text"
        placeholder="Endereço"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleGetBalance}>Verificar Saldo</button>
      {balance && <p>Saldo: {balance}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default GetBalance;
