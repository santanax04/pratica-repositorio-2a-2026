// Catálogo local de exercícios (sem API). `icone` usa MaterialCommunityIcons.
export const GRUPOS = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Abdômen', 'Cardio', 'Mobilidade'];

export const EXERCICIOS = [
  // PEITO
  {
    id: 'supino-reto', nome: 'Supino reto', grupo: 'Peito', equipamento: 'Barra e banco', nivel: 'Intermediário',
    icone: 'weight-lifter', sugestao: '4 x 8-10',
    descricao: 'Exercício base para o peitoral. Deitado no banco, você empurra a barra para cima trabalhando peito, ombros e tríceps.',
    dicas: ['Mantenha os pés firmes no chão e as escápulas juntas.', 'Desça a barra até a linha do peito, com controle.', 'Não tire o glúteo do banco ao empurrar.'],
  },
  {
    id: 'supino-inclinado', nome: 'Supino inclinado com halteres', grupo: 'Peito', equipamento: 'Halteres e banco inclinado', nivel: 'Intermediário',
    icone: 'dumbbell', sugestao: '3 x 10',
    descricao: 'Variação que enfatiza a parte superior do peitoral. Os halteres permitem uma amplitude maior de movimento.',
    dicas: ['Use inclinação de 30° a 45°.', 'Aproxime os halteres no topo sem bater um no outro.', 'Controle a descida por cerca de 2 segundos.'],
  },
  {
    id: 'crucifixo', nome: 'Crucifixo na máquina', grupo: 'Peito', equipamento: 'Máquina (peck deck)', nivel: 'Iniciante',
    icone: 'arm-flex', sugestao: '3 x 12',
    descricao: 'Isolador de peitoral, ótimo para sentir o músculo trabalhando com segurança.',
    dicas: ['Ajuste o banco para os cotovelos ficarem na altura do peito.', 'Abra sem forçar o ombro para trás.', 'Faça uma pequena pausa com os braços fechados.'],
  },
  {
    id: 'flexao', nome: 'Flexão de braço', grupo: 'Peito', equipamento: 'Peso do corpo', nivel: 'Iniciante',
    icone: 'arm-flex', sugestao: '3 x 10',
    descricao: 'Clássico que trabalha peito, ombros, tríceps e abdômen. Pode ser feito em qualquer lugar.',
    dicas: ['Corpo em linha reta da cabeça aos calcanhares.', 'Cotovelos a cerca de 45° do tronco.', 'Se estiver difícil, apoie os joelhos no chão.'],
  },
  // COSTAS
  {
    id: 'puxada-frontal', nome: 'Puxada frontal', grupo: 'Costas', equipamento: 'Polia alta', nivel: 'Iniciante',
    icone: 'rowing', sugestao: '4 x 10',
    descricao: 'Puxa a barra em direção ao peito, trabalhando principalmente o grande dorsal. Ótima preparação para a barra fixa.',
    dicas: ['Puxe com os cotovelos, não com as mãos.', 'Peito aberto e tronco levemente inclinado para trás.', 'Volte devagar, sem soltar o peso.'],
  },
  {
    id: 'remada-baixa', nome: 'Remada baixa', grupo: 'Costas', equipamento: 'Polia baixa', nivel: 'Iniciante',
    icone: 'rowing', sugestao: '3 x 12',
    descricao: 'Fortalece o meio das costas e melhora a postura.',
    dicas: ['Mantenha a coluna neutra, sem arredondar.', 'Aproxime as escápulas ao puxar.', 'Evite balançar o tronco.'],
  },
  {
    id: 'remada-curvada', nome: 'Remada curvada', grupo: 'Costas', equipamento: 'Barra', nivel: 'Avançado',
    icone: 'weight-lifter', sugestao: '4 x 8-10',
    descricao: 'Exercício completo para costas, que exige boa técnica e estabilidade do tronco.',
    dicas: ['Incline o tronco a cerca de 45° com a coluna reta.', 'Leve a barra em direção ao umbigo.', 'Comece leve até dominar o movimento.'],
  },
  {
    id: 'barra-fixa', nome: 'Barra fixa', grupo: 'Costas', equipamento: 'Barra fixa', nivel: 'Avançado',
    icone: 'human-handsup', sugestao: '3 x máximo',
    descricao: 'Um dos melhores exercícios de peso corporal para costas e bíceps.',
    dicas: ['Comece pendurado, com os ombros ativados.', 'Suba até o queixo passar da barra.', 'Use elástico de apoio se ainda não conseguir.'],
  },
  // PERNAS
  {
    id: 'agachamento', nome: 'Agachamento livre', grupo: 'Pernas', equipamento: 'Barra ou peso do corpo', nivel: 'Intermediário',
    icone: 'weight-lifter', sugestao: '4 x 8-10',
    descricao: 'Rei dos exercícios de perna: trabalha quadríceps, glúteos e posteriores, além do core.',
    dicas: ['Pés na largura dos ombros, pontas levemente para fora.', 'Joelhos acompanham a direção dos pés.', 'Desça até onde mantiver a coluna reta.'],
  },
  {
    id: 'leg-press', nome: 'Leg press 45°', grupo: 'Pernas', equipamento: 'Máquina', nivel: 'Iniciante',
    icone: 'run', sugestao: '4 x 12',
    descricao: 'Permite carregar peso nas pernas com segurança e bom apoio para as costas.',
    dicas: ['Costas e quadril colados no encosto.', 'Não estique totalmente os joelhos no topo.', 'Empurre pelos calcanhares.'],
  },
  {
    id: 'afundo', nome: 'Afundo (passada)', grupo: 'Pernas', equipamento: 'Halteres ou peso do corpo', nivel: 'Iniciante',
    icone: 'run-fast', sugestao: '3 x 10 por perna',
    descricao: 'Trabalha cada perna individualmente, melhorando força e equilíbrio.',
    dicas: ['Dê um passo longo e desça com o tronco ereto.', 'O joelho da frente não passa muito da ponta do pé.', 'Empurre o chão para voltar.'],
  },
  {
    id: 'extensora', nome: 'Cadeira extensora', grupo: 'Pernas', equipamento: 'Máquina', nivel: 'Iniciante',
    icone: 'run', sugestao: '3 x 12',
    descricao: 'Isola o quadríceps, a parte da frente da coxa.',
    dicas: ['Ajuste o encosto para o joelho ficar alinhado ao eixo.', 'Estenda sem bater o peso.', 'Segure 1 segundo no topo.'],
  },
  {
    id: 'stiff', nome: 'Stiff com halteres', grupo: 'Pernas', equipamento: 'Halteres', nivel: 'Intermediário',
    icone: 'kettlebell', sugestao: '3 x 10',
    descricao: 'Foca nos posteriores da coxa e glúteos, com bom alongamento na descida.',
    dicas: ['Joelhos levemente flexionados e fixos.', 'Leve o quadril para trás, como se fechasse uma porta.', 'Mantenha os halteres próximos às pernas.'],
  },
  {
    id: 'panturrilha', nome: 'Elevação de panturrilha', grupo: 'Pernas', equipamento: 'Máquina ou degrau', nivel: 'Iniciante',
    icone: 'stairs', sugestao: '4 x 15',
    descricao: 'Fortalece as panturrilhas, importantes para corrida, saltos e equilíbrio.',
    dicas: ['Suba o máximo que conseguir na ponta dos pés.', 'Desça alongando bem o músculo.', 'Movimentos lentos rendem mais.'],
  },
  // OMBROS
  {
    id: 'desenvolvimento', nome: 'Desenvolvimento com halteres', grupo: 'Ombros', equipamento: 'Halteres', nivel: 'Intermediário',
    icone: 'dumbbell', sugestao: '4 x 10',
    descricao: 'Empurrada acima da cabeça que constrói ombros fortes e largos.',
    dicas: ['Abdômen firme para não arquear a lombar.', 'Cotovelos um pouco à frente do corpo.', 'Suba sem bater os halteres no topo.'],
  },
  {
    id: 'elevacao-lateral', nome: 'Elevação lateral', grupo: 'Ombros', equipamento: 'Halteres', nivel: 'Iniciante',
    icone: 'dumbbell', sugestao: '4 x 12',
    descricao: 'Isola a parte lateral do ombro, dando aquele formato mais largo.',
    dicas: ['Use carga leve e controle o movimento.', 'Suba até a altura dos ombros, não mais.', 'Cotovelos levemente flexionados.'],
  },
  // BRAÇOS
  {
    id: 'rosca-direta', nome: 'Rosca direta', grupo: 'Braços', equipamento: 'Barra ou halteres', nivel: 'Iniciante',
    icone: 'arm-flex', sugestao: '3 x 10',
    descricao: 'Exercício clássico para o bíceps.',
    dicas: ['Cotovelos colados ao corpo.', 'Evite balançar o tronco.', 'Desça devagar até estender o braço.'],
  },
  {
    id: 'rosca-martelo', nome: 'Rosca martelo', grupo: 'Braços', equipamento: 'Halteres', nivel: 'Iniciante',
    icone: 'arm-flex', sugestao: '3 x 12',
    descricao: 'Trabalha bíceps e antebraço, com as palmas voltadas uma para a outra.',
    dicas: ['Mantenha os punhos retos.', 'Alterne os braços ou faça juntos.', 'Sem impulso do corpo.'],
  },
  {
    id: 'triceps-corda', nome: 'Tríceps na polia (corda)', grupo: 'Braços', equipamento: 'Polia alta', nivel: 'Iniciante',
    icone: 'arm-flex', sugestao: '3 x 12',
    descricao: 'Isola o tríceps, responsável por boa parte do volume do braço.',
    dicas: ['Cotovelos fixos ao lado do corpo.', 'Abra a corda no final do movimento.', 'Suba até 90° do cotovelo.'],
  },
  {
    id: 'triceps-testa', nome: 'Tríceps testa', grupo: 'Braços', equipamento: 'Barra W e banco', nivel: 'Intermediário',
    icone: 'dumbbell', sugestao: '3 x 10',
    descricao: 'Exercício de isolamento que trabalha forte as três cabeças do tríceps.',
    dicas: ['Apenas os antebraços se movem.', 'Desça a barra em direção à testa, com controle.', 'Comece com pouca carga.'],
  },
  // ABDÔMEN
  {
    id: 'prancha', nome: 'Prancha', grupo: 'Abdômen', equipamento: 'Peso do corpo', nivel: 'Iniciante',
    icone: 'yoga', sugestao: '3 x 30-45 s',
    descricao: 'Exercício isométrico que fortalece todo o core e ajuda a proteger a coluna.',
    dicas: ['Cotovelos abaixo dos ombros.', 'Corpo reto, sem afundar o quadril.', 'Respire de forma contínua.'],
  },
  {
    id: 'abdominal', nome: 'Abdominal supra', grupo: 'Abdômen', equipamento: 'Peso do corpo', nivel: 'Iniciante',
    icone: 'human-handsup', sugestao: '3 x 15-20',
    descricao: 'Trabalha a parte superior do abdômen.',
    dicas: ['Não puxe o pescoço com as mãos.', 'Suba só até as escápulas saírem do chão.', 'Expire ao subir.'],
  },
  {
    id: 'elevacao-pernas', nome: 'Elevação de pernas', grupo: 'Abdômen', equipamento: 'Banco ou colchonete', nivel: 'Intermediário',
    icone: 'human-handsup', sugestao: '3 x 12',
    descricao: 'Foca na parte inferior do abdômen.',
    dicas: ['Lombar apoiada no chão.', 'Desça as pernas devagar, sem encostar.', 'Dobre levemente os joelhos se sentir a lombar.'],
  },
  // CARDIO
  {
    id: 'esteira', nome: 'Esteira', grupo: 'Cardio', equipamento: 'Esteira', nivel: 'Iniciante',
    icone: 'run', sugestao: '15-30 min',
    descricao: 'Caminhada ou corrida em ritmo ajustável. Ótima para aquecer ou queimar calorias.',
    dicas: ['Comece em ritmo leve por 3 a 5 minutos.', 'Não segure nos apoios o tempo todo.', 'Hidrate-se durante o treino.'],
  },
  {
    id: 'bicicleta', nome: 'Bicicleta ergométrica', grupo: 'Cardio', equipamento: 'Bicicleta', nivel: 'Iniciante',
    icone: 'bike', sugestao: '10-20 min',
    descricao: 'Cardio de baixo impacto, ótimo para quem tem articulações sensíveis.',
    dicas: ['Ajuste o banco: joelho levemente dobrado no ponto mais baixo.', 'Mantenha as costas retas.', 'Varie a carga para intensificar.'],
  },
  {
    id: 'corda', nome: 'Pular corda', grupo: 'Cardio', equipamento: 'Corda', nivel: 'Intermediário',
    icone: 'jump-rope', sugestao: '4 x 1 min',
    descricao: 'Cardio intenso que melhora fôlego, coordenação e queima muitas calorias.',
    dicas: ['Pule baixo, com saltos pequenos.', 'Punhos giram a corda, não os braços.', 'Aterrisse suave na ponta dos pés.'],
  },
  {
    id: 'burpee', nome: 'Burpee', grupo: 'Cardio', equipamento: 'Peso do corpo', nivel: 'Avançado',
    icone: 'fire', sugestao: '4 x 10',
    descricao: 'Exercício de corpo inteiro que eleva muito a frequência cardíaca.',
    dicas: ['Mantenha o abdômen firme na prancha.', 'Faça mais devagar se perder a técnica.', 'Pule no final com os braços acima da cabeça.'],
  },
  // MOBILIDADE
  {
    id: 'alongamento-posterior', nome: 'Alongamento de posteriores', grupo: 'Mobilidade', equipamento: 'Colchonete', nivel: 'Iniciante',
    icone: 'yoga', sugestao: '3 x 30 s',
    descricao: 'Alonga a parte de trás das coxas e ajuda a aliviar a tensão na lombar.',
    dicas: ['Mantenha a coluna alongada, sem curvar.', 'Alongue até sentir tensão, nunca dor.', 'Respire fundo e devagar.'],
  },
  {
    id: 'mobilidade-quadril', nome: 'Mobilidade de quadril (90/90)', grupo: 'Mobilidade', equipamento: 'Colchonete', nivel: 'Iniciante',
    icone: 'meditation', sugestao: '2 x 45 s',
    descricao: 'Melhora a rotação do quadril, ajudando em agachamentos e na postura.',
    dicas: ['Sente com as duas pernas em 90°.', 'Incline o tronco sobre a perna da frente.', 'Troque de lado com calma.'],
  },
  {
    id: 'gato-camelo', nome: 'Gato-camelo', grupo: 'Mobilidade', equipamento: 'Colchonete', nivel: 'Iniciante',
    icone: 'meditation', sugestao: '2 x 10',
    descricao: 'Movimento suave que aquece e mobiliza toda a coluna.',
    dicas: ['Em quatro apoios, mãos sob os ombros.', 'Arredonde e depois estenda a coluna, alternando.', 'Sincronize com a respiração.'],
  },
];

export const exercicioPorId = (id) => EXERCICIOS.find((e) => e.id === id);
