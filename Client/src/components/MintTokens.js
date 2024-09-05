import React, { useState } from 'react';
import { ethers } from 'ethers';

const MintTokens = () => {
  const [to, setTo] = useState(''); // Estado para armazenar o endereço do destinatário
  const [amount, setAmount] = useState(''); // Estado para armazenar a quantidade de tokens
  const [message, setMessage] = useState(''); // Estado para exibir mensagens de sucesso
  const [error, setError] = useState(''); // Estado para exibir mensagens de erro

  const handleMint = async () => {
    try {
      if (!to) throw new Error('🛑 O endereço é obrigatório 🛑'); // Verifica se o endereço foi preenchido
      if (!amount) throw new Error('🛑 A quantidade é obrigatória 🛑'); // Verifica se a quantidade foi preenchida
      
      if (!window.ethereum) throw new Error('MetaMask não está instalada'); // Verifica se a MetaMask está instalada
  
      await window.ethereum.request({ method: 'eth_requestAccounts' }); // Solicita a conexão com a MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Busca as informações do contrato RealDigital
      const realDigitalResponse = await fetch('/real-digital-info');
      const { address: realDigitalAddress, abi: realDigitalAbi } = await realDigitalResponse.json();

      // Instancia o contrato RealDigital
      const RealDigitalContract = new ethers.Contract(realDigitalAddress, realDigitalAbi, signer);
  
      const amountToMint = ethers.parseUnits(amount, 18); // Converte a quantidade para 18 decimais
      const tx = await RealDigitalContract.mint(to, amountToMint); // Realiza a mintagem dos tokens
      await tx.wait();
  
      setMessage('Tokens mintados com sucesso!'); // Mensagem de sucesso
      setError(''); // Reseta o erro
    } catch (err) {
      console.error(err);
      setError(err.message); // Exibe o erro
    }
  };

  return (
    <div>
      <h2>Mintar Novos Tokens</h2>
      <label>Endereço</label>
      <input
        type="text"
        placeholder="0x1234567890123456789012345678901234567890"
        value={to}
        onChange={(e) => setTo(e.target.value)} // Atualiza o endereço do destinatário
      />
      <label>Quantidade</label>
      <input
        type="number"
        placeholder="100"
        value={amount}
        onChange={(e) => setAmount(e.target.value)} // Atualiza a quantidade de tokens
      />
      <button onClick={handleMint}>Mintar Tokens</button> {/* Botão para mintar tokens */}
      {message && <p>{message}</p>} {/* Exibe mensagem de sucesso */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe mensagem de erro */}
    </div>
  );
};

export default MintTokens;
