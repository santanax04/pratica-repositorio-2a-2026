import { criarArmazenamento } from './armazenamento';

const loja = criarArmazenamento('@volt:perfil', null);

export const usePerfil = () => loja.usar();
export const salvarPerfil = (dados) => loja.definir((atual) => ({ ...(atual || {}), ...dados }));
export const apagarPerfil = () => loja.definir(null);

export function calcularImc(peso, alturaCm) {
  const m = alturaCm / 100;
  if (!peso || !m) return null;
  return peso / (m * m);
}

export function classificarImc(imc) {
  if (imc == null) return '';
  if (imc < 18.5) return 'Abaixo do peso';
  if (imc < 25) return 'Peso adequado';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidade';
}
