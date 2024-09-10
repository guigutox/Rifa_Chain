import React, { useEffect, useState } from 'react';

const RifaList = () => {
  const [rifas, setRifas] = useState([]);
  const [error, setError] = useState('');

  const fetchURL = 'https://56ib5h7qx5.execute-api.us-east-1.amazonaws.com/default/rifa-chain-rifas'; 
  
  useEffect(() => {
    const fetchRifas = async () => {
      try {
        const response = await fetch(fetchURL);
        if (!response.ok) {
          throw new Error('Erro ao buscar rifas');
        }

        const responseData = await response.json(); 
        

        if (!Array.isArray(responseData)) {
          throw new Error('❌ Nenhuma rifa disponível no momento. ❌');
        }

        setRifas(responseData);
        setError('');
      } catch (err) {
        setError(err.message || 'Erro desconhecido');
        setRifas([]); 
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
          {Array.isArray(rifas) && rifas.map((rifa) => ( 
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
