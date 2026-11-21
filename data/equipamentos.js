// Equipamentos da academia: como usar, segurança e exercícios relacionados.
// Para embutir um vídeo específico, preencha `videoId` com o ID do YouTube (ex.: 'dQw4w9WgXcQ').
export const TIPOS_EQUIP = ['Cardio', 'Máquinas', 'Pesos livres'];

export const EQUIPAMENTOS = [
  {
    id: 'esteira', nome: 'Esteira', tipo: 'Cardio', icone: 'run', musculos: 'Pernas e sistema cardiovascular',
    descricao: 'Permite caminhar ou correr em ritmo e inclinação ajustáveis. Ótima para aquecer e queimar calorias.',
    comoUsar: ['Prenda o clipe de segurança na roupa.', 'Pise nas laterais, inicie a esteira em velocidade baixa e só então suba.', 'Aumente a velocidade e a inclinação aos poucos.', 'Ao terminar, diminua o ritmo por 2 a 3 minutos antes de parar.'],
    seguranca: ['Olhe para frente, não para os pés.', 'Evite se segurar nos apoios o tempo todo.', 'Use tênis firme e bem amarrado.'],
    exercicios: ['esteira'],
  },
  {
    id: 'bicicleta', nome: 'Bicicleta ergométrica', tipo: 'Cardio', icone: 'bike', musculos: 'Pernas e coração, com baixo impacto',
    descricao: 'Cardio de baixo impacto, ideal para quem tem articulações sensíveis ou está começando.',
    comoUsar: ['Ajuste a altura do banco: joelho levemente dobrado no ponto mais baixo.', 'Posicione os pés firmes nos pedais, com as tiras ajustadas.', 'Comece sem carga por 3 minutos e vá aumentando a resistência.', 'Mantenha as costas retas e o abdômen firme.'],
    seguranca: ['Não pedale com os joelhos para dentro.', 'Hidrate-se durante o treino.', 'Desça só com os pedais parados.'],
    exercicios: ['bicicleta'],
  },
  {
    id: 'leg-press', nome: 'Leg press 45°', tipo: 'Máquinas', icone: 'stairs', musculos: 'Quadríceps, glúteos e posteriores',
    descricao: 'Máquina para trabalhar as pernas com bom apoio para as costas, permitindo usar bastante carga com segurança.',
    comoUsar: ['Sente com as costas e o quadril totalmente apoiados.', 'Posicione os pés na plataforma na largura dos ombros.', 'Destrave os apoios e desça até cerca de 90° nos joelhos.', 'Empurre pelos calcanhares sem esticar totalmente os joelhos.', 'Ao final, trave os apoios de segurança antes de sair.'],
    seguranca: ['Nunca deixe o quadril descolar do banco.', 'Não apoie as mãos nos joelhos.', 'Aumente a carga aos poucos e com ajuda de um instrutor.'],
    exercicios: ['leg-press'],
  },
  {
    id: 'extensora', nome: 'Cadeira extensora', tipo: 'Máquinas', icone: 'seat-recline-normal', musculos: 'Quadríceps (frente da coxa)',
    descricao: 'Isola o quadríceps estendendo as pernas contra uma resistência.',
    comoUsar: ['Ajuste o encosto para o joelho ficar alinhado ao eixo da máquina.', 'Posicione o rolo na parte baixa da canela, perto do tornozelo.', 'Estenda as pernas de forma controlada.', 'Desça devagar, sem deixar o peso bater.'],
    seguranca: ['Não use impulso.', 'Evite travar o joelho com força no topo.', 'Comece com pouca carga.'],
    exercicios: ['extensora'],
  },
  {
    id: 'polia', nome: 'Polia (crossover/puxador)', tipo: 'Máquinas', icone: 'rowing', musculos: 'Costas, braços e peito, conforme o acessório',
    descricao: 'Sistema de cabos com pesos e vários acessórios (barra, corda, triângulo) que permite muitos exercícios.',
    comoUsar: ['Escolha o acessório e prenda-o bem ao cabo.', 'Regule a altura da polia para o exercício.', 'Selecione a carga pelo pino na pilha de pesos.', 'Faça o movimento com controle, sem balançar o corpo.', 'Devolva o peso devagar ao final.'],
    seguranca: ['Confira se o pino está bem encaixado.', 'Não solte o cabo de uma vez.', 'Mantenha a postura da coluna neutra.'],
    exercicios: ['puxada-frontal', 'remada-baixa', 'triceps-corda'],
  },
  {
    id: 'peck-deck', nome: 'Peck deck (crucifixo)', tipo: 'Máquinas', icone: 'arm-flex', musculos: 'Peitoral e parte posterior do ombro',
    descricao: 'Máquina guiada que simula o movimento do crucifixo, ótima para iniciantes sentirem o peitoral.',
    comoUsar: ['Ajuste o banco para os cotovelos ficarem na altura do peito.', 'Apoie bem as costas no encosto.', 'Feche os braços à frente do corpo, de forma controlada.', 'Volte devagar até sentir o alongamento, sem forçar o ombro.'],
    seguranca: ['Evite abrir demais os braços.', 'Não tire as costas do encosto.', 'Use carga moderada.'],
    exercicios: ['crucifixo'],
  },
  {
    id: 'banco-supino', nome: 'Banco reto com barra (supino)', tipo: 'Pesos livres', icone: 'weight-lifter', musculos: 'Peito, ombros e tríceps',
    descricao: 'Banco com suporte para barra, usado no supino. Exige técnica e, de preferência, um parceiro de treino.',
    comoUsar: ['Deite com os olhos alinhados à barra e os pés firmes no chão.', 'Segure a barra um pouco mais larga que os ombros.', 'Retire a barra do suporte, desça até o peito e empurre para cima.', 'Ao terminar, devolva a barra ao suporte com cuidado.'],
    seguranca: ['Sempre treine com um parceiro ou instrutor observando.', 'Use presilhas nos pesos.', 'Nunca coloque o polegar do mesmo lado dos dedos.'],
    exercicios: ['supino-reto'],
  },
  {
    id: 'halteres', nome: 'Halteres', tipo: 'Pesos livres', icone: 'dumbbell', musculos: 'Todo o corpo, conforme o exercício',
    descricao: 'Pesos de mão de várias cargas. Versáteis, permitem treinar todos os grupos musculares.',
    comoUsar: ['Escolha uma carga com a qual consiga fazer todas as repetições com boa técnica.', 'Pegue os halteres dobrando os joelhos, não a coluna.', 'Execute o movimento de forma controlada.', 'Devolva os halteres ao suporte, sem jogá-los no chão.'],
    seguranca: ['Cuide dos pés ao apoiar os halteres.', 'Guarde no lugar certo para ninguém tropeçar.', 'Aumente a carga gradualmente.'],
    exercicios: ['supino-inclinado', 'desenvolvimento', 'elevacao-lateral', 'rosca-martelo', 'afundo', 'stiff'],
  },
  {
    id: 'smith', nome: 'Smith machine', tipo: 'Máquinas', icone: 'dumbbell', musculos: 'Pernas, peito e ombros',
    descricao: 'Barra guiada por trilhos, que oferece mais estabilidade. Boa para aprender movimentos como o agachamento.',
    comoUsar: ['Ajuste a altura da barra e os suportes de segurança.', 'Posicione-se sob a barra com os pés um pouco à frente.', 'Gire a barra para destravar e faça o movimento.', 'Ao terminar, gire a barra para travar nos ganchos.'],
    seguranca: ['Mantenha sempre os ganchos de segurança ajustados.', 'Peça ajuda de um instrutor na primeira vez.', 'Não perca o alinhamento da coluna.'],
    exercicios: ['agachamento', 'supino-reto'],
  },
];

export const equipamentoPorId = (id) => EQUIPAMENTOS.find((e) => e.id === id);
