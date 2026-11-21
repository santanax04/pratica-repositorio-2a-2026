// Unidades e empresas parceiras de exemplo (fictícias, para o projeto escolar).
export const UNIDADES = [
  {
    id: 'paulista', nome: 'VOLT Paulista', cidade: 'São Paulo', uf: 'SP', bairro: 'Bela Vista',
    endereco: 'Av. Paulista, 1500', telefone: '(11) 4000-1001', area: '2.400 m²',
    horario: 'Seg a sex 05h–23h · Sáb 08h–18h · Dom 08h–14h',
    destaques: ['Musculação completa', 'Aulas coletivas', 'Estacionamento', 'Vestiários com armário'],
  },
  {
    id: 'vila-madalena', nome: 'VOLT Vila Madalena', cidade: 'São Paulo', uf: 'SP', bairro: 'Vila Madalena',
    endereco: 'Rua Harmonia, 820', telefone: '(11) 4000-1002', area: '1.600 m²',
    horario: 'Seg a sex 06h–22h · Sáb 08h–16h · Dom fechado',
    destaques: ['Funcional', 'Studio de spinning', 'Café fit'],
  },
  {
    id: 'campinas', nome: 'VOLT Cambuí', cidade: 'Campinas', uf: 'SP', bairro: 'Cambuí',
    endereco: 'Rua Coronel Quirino, 410', telefone: '(19) 4000-2001', area: '1.900 m²',
    horario: 'Seg a sex 05h–23h · Sáb 08h–17h · Dom 08h–13h',
    destaques: ['Piscina aquecida', 'Musculação completa', 'Estacionamento'],
  },
  {
    id: 'ribeirao', nome: 'VOLT Ribeirão Shopping', cidade: 'Ribeirão Preto', uf: 'SP', bairro: 'Nova Ribeirânia',
    endereco: 'Av. Coronel Fernando Ferreira Leite, 1540', telefone: '(16) 4000-3001', area: '2.100 m²',
    horario: 'Seg a sex 05h–23h · Sáb 08h–18h · Dom 08h–14h',
    destaques: ['Aulas coletivas', 'Área de lutas', 'Estacionamento'],
  },
  {
    id: 'curitiba', nome: 'VOLT Batel', cidade: 'Curitiba', uf: 'PR', bairro: 'Batel',
    endereco: 'Av. do Batel, 1230', telefone: '(41) 4000-4001', area: '1.800 m²',
    horario: 'Seg a sex 06h–22h · Sáb 08h–16h · Dom 09h–13h',
    destaques: ['Musculação completa', 'Funcional', 'Vestiários com sauna'],
  },
];

export const unidadePorId = (id) => UNIDADES.find((u) => u.id === id);

export const mapaUrl = (u) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${u.endereco}, ${u.cidade} - ${u.uf}`)}`;

export const PARCEIROS = [
  { id: 'p1', nome: 'NutriPro Suplementos', tipo: 'Suplementos e nutrição', beneficio: '10% de desconto para alunos', icone: 'food-apple-outline' },
  { id: 'p2', nome: 'FisioMove Clínica', tipo: 'Fisioterapia e recuperação', beneficio: 'Primeira avaliação grátis', icone: 'bandage' },
  { id: 'p3', nome: 'RunStore Esportes', tipo: 'Tênis e roupas esportivas', beneficio: '15% em toda a loja', icone: 'shoe-sneaker' },
  { id: 'p4', nome: 'Hidra+ Bebidas', tipo: 'Isotônicos e água', beneficio: 'Brinde na primeira compra', icone: 'water-outline' },
];
