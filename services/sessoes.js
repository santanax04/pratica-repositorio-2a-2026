import { criarArmazenamento } from './armazenamento';

// Treinos monitorados pelo relógio:
// { id, data, segundos, media, max, kcal, gorduraG, fonte }
const loja = criarArmazenamento('@volt:sessoes', []);

export const useSessoes = () => loja.usar();
export const salvarSessao = (s) => loja.definir((lista) => [...lista, s]);
export const limparSessoes = () => loja.definir([]);
