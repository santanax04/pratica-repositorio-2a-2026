import { criarArmazenamento } from './armazenamento';

// Cada foto: { id, data, lado:'frente'|'lado'|'costas', uri:'data:image/jpeg;base64,...' }
const loja = criarArmazenamento('@volt:fotos', []);

export const MAX_FOTOS = 24;
export const useFotos = () => loja.usar();
export const adicionarFoto = (foto) => loja.definir((lista) => [...lista, foto]);
export const removerFoto = (id) => loja.definir((lista) => lista.filter((f) => f.id !== id));
export const limparFotos = () => loja.definir([]);
