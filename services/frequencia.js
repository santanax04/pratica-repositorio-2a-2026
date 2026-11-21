import { criarArmazenamento } from './armazenamento';

// Cada presença: { data: 'AAAA-MM-DD', treino: 'id-do-treino' | null }
const loja = criarArmazenamento('@volt:frequencia', []);

export const useFrequencia = () => loja.usar();

export const dataISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const hojeISO = () => dataISO(new Date());

export function registrarPresenca(treino = null) {
  const hoje = hojeISO();
  return loja.definir((lista) => {
    const existe = lista.find((p) => p.data === hoje);
    if (existe) {
      return lista.map((p) => (p.data === hoje ? { ...p, treino: treino || p.treino } : p));
    }
    return [...lista, { data: hoje, treino }];
  });
}

export const desfazerPresencaHoje = () => {
  const hoje = hojeISO();
  return loja.definir((lista) => lista.filter((p) => p.data !== hoje));
};

export const limparFrequencia = () => loja.definir([]);

// Datas (AAAA-MM-DD) de segunda a domingo da semana atual.
export function diasDaSemana(base = new Date()) {
  const desloc = (base.getDay() + 6) % 7;
  const segunda = new Date(base.getFullYear(), base.getMonth(), base.getDate() - desloc);
  return Array.from({ length: 7 }, (_, i) =>
    dataISO(new Date(segunda.getFullYear(), segunda.getMonth(), segunda.getDate() + i))
  );
}
