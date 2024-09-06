import React, { useState } from 'react';
import { getBalance } from '../api/rifa';
import '../App.css';


const GetBalance = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [message, setMessage] = useState('');
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
      {message && <p class = "messageSucess">{message}</p>}
      {error && <p class = "messageError">{error}</p>}
    </div>
  );
};

export default GetBalance;
