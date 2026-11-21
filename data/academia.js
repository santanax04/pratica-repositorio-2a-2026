import { exercicioPorId } from './exercicios';

export const OBJETIVOS = [
  {
    id: 'emagrecer', nome: 'Emagrecer', icone: 'fire', resumo: 'Queimar gordura e ganhar fôlego',
    frase: 'Constância vale mais do que intensidade. Um treino de cada vez!',
    treinos: ['fullbody-a', 'queima', 'fullbody-b', 'mobilidade'],
  },
  {
    id: 'hipertrofia', nome: 'Ganhar massa', icone: 'arm-flex', resumo: 'Aumentar força e músculos',
    frase: 'Progressão de carga, boa alimentação e descanso: a receita do ganho de massa.',
    treinos: ['peito-triceps', 'costas-biceps', 'pernas', 'ombros-abdomen'],
  },
  {
    id: 'definicao', nome: 'Definição', icone: 'lightning-bolt', resumo: 'Secar e marcar o corpo',
    frase: 'Treino forte + cardio inteligente deixam o resultado aparecer.',
    treinos: ['peito-triceps', 'costas-biceps', 'pernas', 'queima'],
  },
  {
    id: 'condicionamento', nome: 'Condicionamento', icone: 'run-fast', resumo: 'Mais energia e resistência',
    frase: 'Seu fôlego de hoje é o menor que você terá daqui pra frente.',
    treinos: ['fullbody-a', 'queima', 'fullbody-b', 'pernas'],
  },
  {
    id: 'saude', nome: 'Saúde e mobilidade', icone: 'heart-pulse', resumo: 'Bem-estar, postura e flexibilidade',
    frase: 'Cuidar do corpo é um hábito. Comece leve e vá evoluindo.',
    treinos: ['fullbody-a', 'mobilidade', 'fullbody-b'],
  },
];

export const NIVEIS = ['Iniciante', 'Intermediário', 'Avançado'];

export const TREINOS = [
  {
    id: 'fullbody-a', nome: 'Full Body A', foco: 'Corpo inteiro', nivel: 'Iniciante', duracao: 50,
    descricao: 'Treino completo para quem está começando: um pouco de cada grupo muscular.',
    itens: [
      { id: 'leg-press', series: 3, reps: '12', descanso: '60s' },
      { id: 'flexao', series: 3, reps: '10', descanso: '60s' },
      { id: 'puxada-frontal', series: 3, reps: '12', descanso: '60s' },
      { id: 'elevacao-lateral', series: 3, reps: '12', descanso: '45s' },
      { id: 'prancha', series: 3, reps: '30 s', descanso: '45s' },
    ],
  },
  {
    id: 'fullbody-b', nome: 'Full Body B', foco: 'Corpo inteiro', nivel: 'Iniciante', duracao: 55,
    descricao: 'Segundo treino de corpo inteiro, com exercícios diferentes para variar o estímulo.',
    itens: [
      { id: 'agachamento', series: 3, reps: '10', descanso: '75s' },
      { id: 'supino-inclinado', series: 3, reps: '10', descanso: '60s' },
      { id: 'remada-baixa', series: 3, reps: '12', descanso: '60s' },
      { id: 'rosca-direta', series: 2, reps: '12', descanso: '45s' },
      { id: 'triceps-corda', series: 2, reps: '12', descanso: '45s' },
      { id: 'abdominal', series: 3, reps: '15', descanso: '30s' },
    ],
  },
  {
    id: 'peito-triceps', nome: 'Peito e Tríceps', foco: 'Empurrar', nivel: 'Intermediário', duracao: 55,
    descricao: 'Treino de força e volume para peitoral e tríceps.',
    itens: [
      { id: 'supino-reto', series: 4, reps: '8-10', descanso: '90s' },
      { id: 'supino-inclinado', series: 3, reps: '10', descanso: '75s' },
      { id: 'crucifixo', series: 3, reps: '12', descanso: '60s' },
      { id: 'triceps-corda', series: 3, reps: '12', descanso: '60s' },
      { id: 'triceps-testa', series: 3, reps: '10', descanso: '60s' },
    ],
  },
  {
    id: 'costas-biceps', nome: 'Costas e Bíceps', foco: 'Puxar', nivel: 'Intermediário', duracao: 55,
    descricao: 'Desenvolve a largura e a espessura das costas, com bíceps no final.',
    itens: [
      { id: 'puxada-frontal', series: 4, reps: '10', descanso: '75s' },
      { id: 'remada-curvada', series: 4, reps: '8-10', descanso: '90s' },
      { id: 'remada-baixa', series: 3, reps: '12', descanso: '60s' },
      { id: 'rosca-direta', series: 3, reps: '10', descanso: '60s' },
      { id: 'rosca-martelo', series: 3, reps: '12', descanso: '60s' },
    ],
  },
  {
    id: 'pernas', nome: 'Pernas Completo', foco: 'Membros inferiores', nivel: 'Intermediário', duracao: 60,
    descricao: 'Treino de pernas completo: quadríceps, posteriores, glúteos e panturrilha.',
    itens: [
      { id: 'agachamento', series: 4, reps: '8-10', descanso: '90s' },
      { id: 'leg-press', series: 4, reps: '12', descanso: '75s' },
      { id: 'extensora', series: 3, reps: '12', descanso: '60s' },
      { id: 'stiff', series: 3, reps: '10', descanso: '75s' },
      { id: 'afundo', series: 3, reps: '10', descanso: '60s' },
      { id: 'panturrilha', series: 4, reps: '15', descanso: '45s' },
    ],
  },
  {
    id: 'ombros-abdomen', nome: 'Ombros e Abdômen', foco: 'Ombros e core', nivel: 'Intermediário', duracao: 45,
    descricao: 'Ombros mais largos e core forte em um treino mais curto.',
    itens: [
      { id: 'desenvolvimento', series: 4, reps: '10', descanso: '75s' },
      { id: 'elevacao-lateral', series: 4, reps: '12', descanso: '45s' },
      { id: 'abdominal', series: 3, reps: '15', descanso: '30s' },
      { id: 'elevacao-pernas', series: 3, reps: '12', descanso: '30s' },
      { id: 'prancha', series: 3, reps: '45 s', descanso: '30s' },
    ],
  },
  {
    id: 'queima', nome: 'Queima Total', foco: 'Cardio e core', nivel: 'Intermediário', duracao: 40,
    descricao: 'Cardio em circuito para acelerar o metabolismo e melhorar o condicionamento.',
    itens: [
      { id: 'esteira', series: 1, reps: '15 min', descanso: '—' },
      { id: 'burpee', series: 4, reps: '10', descanso: '30s' },
      { id: 'corda', series: 4, reps: '1 min', descanso: '30s' },
      { id: 'bicicleta', series: 1, reps: '10 min', descanso: '—' },
      { id: 'prancha', series: 3, reps: '40 s', descanso: '30s' },
    ],
  },
  {
    id: 'mobilidade', nome: 'Mobilidade e Bem-estar', foco: 'Flexibilidade', nivel: 'Iniciante', duracao: 30,
    descricao: 'Treino leve para soltar o corpo, melhorar a postura e recuperar entre os dias de treino.',
    itens: [
      { id: 'gato-camelo', series: 2, reps: '10', descanso: '20s' },
      { id: 'mobilidade-quadril', series: 2, reps: '45 s', descanso: '20s' },
      { id: 'alongamento-posterior', series: 3, reps: '30 s', descanso: '20s' },
      { id: 'esteira', series: 1, reps: '15 min', descanso: '—' },
      { id: 'prancha', series: 2, reps: '20 s', descanso: '30s' },
    ],
  },
];

export const treinoPorId = (id) => TREINOS.find((t) => t.id === id);
export const objetivoPorId = (id) => OBJETIVOS.find((o) => o.id === id);

export const exerciciosDoTreino = (treino) =>
  treino.itens.map((item) => ({ ...item, ex: exercicioPorId(item.id) })).filter((i) => i.ex);

export const PLANOS = [
  {
    id: 'mensal', nome: 'Mensal', periodo: '1 mês', dias: 30, maxParcelas: 1, porMes: 119.9, total: 119.9, selo: null,
    beneficios: ['Acesso livre à musculação', 'Ficha de treino personalizada', 'Avaliação física inicial'],
  },
  {
    id: 'trimestral', nome: 'Trimestral', periodo: '3 meses', dias: 90, maxParcelas: 3, porMes: 99.9, total: 299.7, selo: 'Mais popular',
    beneficios: ['Tudo do plano mensal', 'Aulas coletivas (spinning, funcional)', 'Reavaliação física a cada mês', '1 convidado por mês'],
  },
  {
    id: 'anual', nome: 'Anual', periodo: '12 meses', dias: 365, maxParcelas: 12, porMes: 79.9, total: 958.8, selo: 'Melhor custo',
    beneficios: ['Tudo do plano trimestral', 'Acompanhamento nutricional', 'Camiseta VOLT', 'Congelamento por até 30 dias'],
  },
];

export { dinheiro } from './pagamentos';

// Horário de funcionamento: 0 = domingo ... 6 = sábado
export const HORARIOS = [
  { dias: 'Segunda a sexta', horas: '05h às 23h', semana: [1, 2, 3, 4, 5], abre: 5, fecha: 23 },
  { dias: 'Sábado', horas: '08h às 18h', semana: [6], abre: 8, fecha: 18 },
  { dias: 'Domingo e feriados', horas: '08h às 14h', semana: [0], abre: 8, fecha: 14 },
];

export function abertoAgora(data = new Date()) {
  const faixa = HORARIOS.find((h) => h.semana.includes(data.getDay()));
  const hora = data.getHours();
  return !!faixa && hora >= faixa.abre && hora < faixa.fecha;
}

export const NOVIDADES = [
  { id: 'n1', icone: 'bike', titulo: 'Spinning às 18h', texto: 'Aulas de segunda a quinta, com música e muita energia.' },
  { id: 'n2', icone: 'clipboard-check-outline', titulo: 'Avaliação física grátis', texto: 'Agende com um instrutor e acompanhe sua evolução.' },
  { id: 'n3', icone: 'trophy-outline', titulo: 'Desafio 30 dias', texto: 'Faça check-in em 20 dias e concorra a brindes.' },
];
