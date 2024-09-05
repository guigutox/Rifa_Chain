import api from 'axios';

const _api = api.create({
    baseURL: 'http://localhost:3000', // Verifique se esta URL está correta
});

export const enterRaffle = async (rifaId, quantidadeRifas) => {
    const response = await _api.post('/entrar', { rifaId, quantidadeRifas });
    return response.data;
};

export const getRaffleEntries = async (rifaId) => {
    const response = await _api.get('/rifa/entradas', { rifaId });
    return response.data;
  };
  
  export const approveTokens = async (rifaId, amount) => {
    const response = await _api.post('/approve', { rifaId, amount });
    return response.data;
  };

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
