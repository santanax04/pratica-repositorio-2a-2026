import { criarArmazenamento } from './armazenamento';

// Cada contratação: { id, personal, pacote, dias:[1..6], horario, forma, total, data }
const loja = criarArmazenamento('@volt:personais', []);

export const useContratos = () => loja.usar();
export const contratarPersonal = (contrato) => loja.definir((lista) => [...lista, contrato]);
export const cancelarContrato = (id) => loja.definir((lista) => lista.filter((c) => c.id !== id));
export const limparContratos = () => loja.definir([]);
