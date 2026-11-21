import { dataISO, hojeISO } from './frequencia';

export const paraData = (iso) => new Date(`${iso}T12:00:00`);
export const diasEntre = (a, b) => Math.round((paraData(b) - paraData(a)) / 86400000);
export const fmt = (n, casas = 1) => Number(n).toFixed(casas).replace('.', ',');
export const formatarData = (iso) => iso.split('-').reverse().join('/');
export const dataCurta = (iso) => {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
};
export const sinal = (n, casas = 1) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${fmt(Math.abs(n), casas)}`;

export function dataMenosDias(dias, base = hojeISO()) {
  const d = paraData(base);
  d.setDate(d.getDate() - dias);
  return dataISO(d);
}

// Série de medidas; se ainda não há registros, usa o peso do cadastro como ponto inicial.
export function serieMedidas(medidas, perfil) {
  if (medidas.length) return medidas;
  if (perfil?.peso) {
    return [{ id: 'inicial', data: perfil.criadoEm || hojeISO(), peso: perfil.peso, gordura: null, cintura: null }];
  }
  return [];
}

export const antesDe = (serie, iso) => {
  let r = null;
  for (const m of serie) if (m.data <= iso) r = m;
  return r;
};

export const massaGorda = (m) => (m && m.gordura != null && m.peso ? (m.peso * m.gordura) / 100 : null);

export function resumoEvolucao(serie) {
  if (!serie.length) return null;
  const inicial = serie[0];
  const atual = serie[serie.length - 1];
  const deltaKg = atual.peso - inicial.peso;
  const comGordura = serie.filter((m) => m.gordura != null);
  let gordura = null;
  if (comGordura.length) {
    const g0 = comGordura[0];
    const g1 = comGordura[comGordura.length - 1];
    const dois = comGordura.length > 1;
    gordura = {
      atual: g1.gordura,
      delta: g1.gordura - g0.gordura,
      kgPerdidos: dois ? massaGorda(g0) - massaGorda(g1) : null,
      magraDelta: dois ? g1.peso - massaGorda(g1) - (g0.peso - massaGorda(g0)) : null,
    };
  }
  return { inicial, atual, deltaKg, deltaPct: inicial.peso ? (deltaKg / inicial.peso) * 100 : 0, gordura, registros: serie.length };
}

// Diz se a variação vai na direção do objetivo da pessoa.
export function sentido(objetivo, delta) {
  if (!delta) return 'neutro';
  if (['emagrecer', 'definicao'].includes(objetivo)) return delta < 0 ? 'bom' : 'ruim';
  if (objetivo === 'hipertrofia') return delta > 0 ? 'bom' : 'ruim';
  return 'neutro';
}

export function conquistas({ presencas, serie, sessoes, fotos, perfil }) {
  const r = resumoEvolucao(serie);
  return [
    { id: 'c1', icone: 'flag-checkered', titulo: 'Primeiro check-in', ok: presencas.length >= 1 },
    { id: 'c2', icone: 'fire', titulo: '5 treinos', ok: presencas.length >= 5 },
    { id: 'c3', icone: 'trophy-outline', titulo: '20 treinos', ok: presencas.length >= 20 },
    { id: 'c4', icone: 'scale-bathroom', titulo: '3 medidas', ok: serie.length >= 3 },
    { id: 'c5', icone: 'camera-outline', titulo: 'Foto de progresso', ok: fotos.length >= 1 },
    { id: 'c6', icone: 'heart-pulse', titulo: 'Treino no relógio', ok: sessoes.length >= 1 },
    { id: 'c7', icone: 'target', titulo: '1 kg rumo à meta', ok: !!r && sentido(perfil.objetivo, r.deltaKg) === 'bom' && Math.abs(r.deltaKg) >= 1 },
  ];
}
