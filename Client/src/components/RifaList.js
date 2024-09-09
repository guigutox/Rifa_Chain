import React, { useEffect, useState } from 'react';

const RifaList = () => {
  const [rifas, setRifas] = useState([]);
  const [error, setError] = useState('');

  const fetchURL = 'https://k2u52s2tc6.execute-api.us-east-1.amazonaws.com/dev';
  
  useEffect(() => {
    const fetchRifas = async () => {
      try {
        const response = await fetch(`${fetchURL}/rifas`);
        if (!response.ok) {
          throw new Error('Erro ao buscar rifas');
        }

        const responseData = await response.json();
        const data = JSON.parse(responseData.body);
        
        // Verifique se 'data' é um array, caso contrário, lança um erro
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('❌ Nenhuma rifa disponível no momento. ❌');
        }

        setRifas(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Erro desconhecido');
        setRifas([]); // Garante que 'rifas' seja um array vazio em caso de erro
      }
    };

    fetchRifas();
  }, []);

  return (
    <div>
      <h2>Lista de Rifas</h2>
      {error && <p className="messageError">{error}</p>}
      {rifas.length === 0 && !error ? (
        <p>Nenhuma rifa disponível</p>
      ) : (
        <div className="RifaConteiner">
          {Array.isArray(rifas) && rifas.map((rifa) => ( // Verifica se 'rifas' é um array
            <ul key={rifa._id} className="ListaRifa">
              <li>Endereço: {rifa.address}</li>
              <li>Valor da Entrada: {rifa.valorEntrada}</li>
              <li>Entradas Restantes: {rifa.entradasRestantes}</li>
              <li>Sorteio Realizado: {rifa.sorteioRealizado ? 'Sim' : 'Não'}</li>
              <li>Tokens Acumulados: {rifa.tokensAcumulados}</li>
            </ul>
          ))}
        </div>
      )}
    </div>
  );
};

export default RifaList;
