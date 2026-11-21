import { criarArmazenamento } from './armazenamento';

// Cada medida: { id, data:'AAAA-MM-DD', peso, gordura|null, cintura|null }
const loja = criarArmazenamento('@volt:medidas', []);

export const useMedidas = () => loja.usar();

export const adicionarMedida = (medida) =>
  loja.definir((lista) => {
    const existente = lista.find((m) => m.data === medida.data);
    const preenchidos = Object.fromEntries(Object.entries(medida).filter(([, v]) => v != null));
    const nova = { ...(existente || {}), ...preenchidos };
    return [...lista.filter((m) => m.data !== medida.data), nova].sort((a, b) => a.data.localeCompare(b.data));
  });

export const removerMedida = (id) => loja.definir((lista) => lista.filter((m) => m.id !== id));
export const limparMedidas = () => loja.definir([]);
