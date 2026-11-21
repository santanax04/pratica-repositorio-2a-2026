import { criarArmazenamento } from './armazenamento';

const loja = criarArmazenamento('@volt:favoritos', []);

export const useFavoritos = () => {
  const { valor, carregado } = loja.usar();
  return { ids: valor, carregado, ehFavorito: (id) => valor.includes(id) };
};

export const alternarFavorito = (id) =>
  loja.definir((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

export const limparFavoritos = () => loja.definir([]);
