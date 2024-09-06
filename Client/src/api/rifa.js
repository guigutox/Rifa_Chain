import api from 'axios';

// essas funcoes funcionam, mas quem chama elas é a conta que esta registrada no .env do backend
const _api = api.create({
    baseURL: 'http://localhost:3000', // Verifique se esta URL está correta
});






  export const getRemainingSlots = async (address) => {
    const response = await _api.get(`/rifa/${address}/vagas-restantes`);
    return response.data;
  };
  
  export const chooseWinner = async (rifaId) => {
    const response = await _api.post('/sorteio', { rifaId });
    return response.data;
  };
  
  export const getBalance = async (address) => {
    const response = await _api.get(`/balance/${address}`);
    return response.data;
  };
  
  export const mintTokens = async (to, amount) => {
    const response = await _api.post('/mint', { to, amount });
    return response.data;
  };
