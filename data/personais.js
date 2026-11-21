export const DIAS_SEMANA = [
  { n: 1, curto: 'Seg', ordinal: '2ª' },
  { n: 2, curto: 'Ter', ordinal: '3ª' },
  { n: 3, curto: 'Qua', ordinal: '4ª' },
  { n: 4, curto: 'Qui', ordinal: '5ª' },
  { n: 5, curto: 'Sex', ordinal: '6ª' },
  { n: 6, curto: 'Sáb', ordinal: 'Sáb' },
];

export const PERSONAIS = [
  {
    id: 'rafael', nome: 'Rafael Moura', unidade: 'paulista', anos: 8, nota: 4.9, preco: 120,
    especialidades: ['Hipertrofia', 'Força'], dias: [1, 2, 3, 4, 5], horarios: ['06:00', '07:00', '18:00', '19:00', '20:00'],
    bio: 'Especialista em ganho de massa e força. Monta treinos progressivos com foco em técnica e segurança.',
  },
  {
    id: 'camila', nome: 'Camila Duarte', unidade: 'paulista', anos: 6, nota: 4.8, preco: 110,
    especialidades: ['Emagrecimento', 'Condicionamento'], dias: [1, 3, 5, 6], horarios: ['07:00', '08:00', '12:00', '17:00'],
    bio: 'Trabalha com treinos dinâmicos para queimar gordura, melhorar o fôlego e criar o hábito de treinar.',
  },
  {
    id: 'bruno', nome: 'Bruno Tavares', unidade: 'vila-madalena', anos: 10, nota: 5.0, preco: 130,
    especialidades: ['Funcional', 'Mobilidade'], dias: [2, 3, 4, 6], horarios: ['06:00', '09:00', '16:00', '18:00'],
    bio: 'Foco em movimento funcional, postura e prevenção de lesões. Ótimo para quem está voltando a treinar.',
  },
  {
    id: 'juliana', nome: 'Juliana Prado', unidade: 'campinas', anos: 5, nota: 4.7, preco: 95,
    especialidades: ['Definição', 'Glúteos e pernas'], dias: [1, 2, 4, 5], horarios: ['06:00', '07:00', '19:00', '20:00'],
    bio: 'Treinos intensos de definição e membros inferiores, com acompanhamento de evolução semana a semana.',
  },
  {
    id: 'thiago', nome: 'Thiago Ramos', unidade: 'curitiba', anos: 7, nota: 4.8, preco: 100,
    especialidades: ['Iniciantes', 'Saúde'], dias: [1, 2, 3, 4, 5, 6], horarios: ['08:00', '10:00', '15:00', '17:00'],
    bio: 'Paciente e didático, ensina do zero como usar cada equipamento com segurança.',
  },
];

export const personalPorId = (id) => PERSONAIS.find((p) => p.id === id);

// validade em dias e desconto por pacote
export const PACOTES = [
  { id: 'avulsa', nome: 'Aula avulsa', aulas: 1, desconto: 0, validade: 7, maxParcelas: 1 },
  { id: 'p4', nome: '4 aulas', aulas: 4, desconto: 0.05, validade: 30, maxParcelas: 1 },
  { id: 'p8', nome: '8 aulas', aulas: 8, desconto: 0.1, validade: 45, maxParcelas: 2 },
  { id: 'p12', nome: '12 aulas', aulas: 12, desconto: 0.15, validade: 60, maxParcelas: 3 },
];

export const pacotePorId = (id) => PACOTES.find((p) => p.id === id);
