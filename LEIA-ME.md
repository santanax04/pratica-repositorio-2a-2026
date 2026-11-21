# VOLT Academia (web mobile + celular)

App de academia feito com Expo + React Native + Expo Router. **Não usa API**: exercícios, treinos, planos, unidades e
personais ficam no próprio projeto, e o que a pessoa preenche é salvo no aparelho (AsyncStorage / localStorage no navegador).

## Como rodar
1. `npm install` (se o Expo avisar de versões, rode `npx expo install --fix`)
2. `npx expo start`
3. Pressione `w` para o navegador (fica no formato de celular) ou leia o QR Code com o Expo Go.

## Telas
- **Intro**: animação de entrada (raio pulsando, nome e barra de carregamento) e boas-vindas para quem ainda não tem cadastro.
- **Cadastro** (3 passos): nome, idade, sexo, peso, altura, objetivo, nível e dias por semana.
- **Início**: marca, próximo treino, semana, atalhos, novidades e horários da unidade.
- **Treinos**: plano por objetivo em "Dia 1, Dia 2...", com checklist e check-in.
- **Exercícios / Equipamentos**: busca, filtros, vídeo-aula, passo a passo e favoritos.
- **Evolução**: peso, % de gordura e cintura com gráficos, comparativos (30 dias, 90 dias, 1 ano), meta, conquistas e fotos antes/depois.
- **Relógio**: batimentos em tempo real, zona de treino, calorias e gordura estimadas (Bluetooth no Chrome/Edge ou modo demonstração).
- **Frequência**: check-in, calendário com números dos dias e histórico.
- **Unidades**: 5 unidades (nome, endereço, horário, telefone, mapa) e empresas parceiras.
- **Planos**: 30, 90 e 365 dias, com Pix, crédito (parcelado), débito, boleto e dinheiro.
- **Personais**: contratar pacote de aulas (dias, horário e pagamento) e ver/cancelar contratações.
- **Perfil**: dados, IMC, plano, unidade, personais e favoritos.

## Vídeos
Cada exercício e equipamento tem um botão que abre a busca do YouTube por "como fazer/usar ...".
Para embutir um vídeo específico, preencha o campo `videoId` (ex.: `'AbCdEfGhIjK'`) no item de
`data/exercicios.js` ou `data/equipamentos.js`: no navegador ele toca dentro do app.

## Onde mexer
- `constants/marca.js` → nome da academia
- `constants/tema.js` → cores
- `data/` → exercícios, equipamentos, treinos, planos, pagamentos, unidades e personais
- `services/` → dados salvos no aparelho

Unidades, endereços, empresas e personais são fictícios (projeto escolar).

## Relógio inteligente
- **Navegador (Chrome/Edge, computador ou Android):** botão "Conectar por Bluetooth" lê o serviço padrão de frequência cardíaca
  (cintas e relógios que transmitem batimentos). Precisa de `localhost` ou HTTPS.
- **Modo demonstração:** simula um treino para apresentar o app sem relógio.
- **Apple Watch / Galaxy Watch no celular:** exige módulos nativos (HealthKit / Health Connect) e um "development build"
  do Expo; não funciona no Expo Go. A tela já está pronta para receber esses dados.

## Fundo com pessoas treinando
Por padrão o app usa uma ilustração animada de atletas (sem arquivos de imagem). Para usar uma foto real,
coloque-a em `assets/` e edite `FOTO_FUNDO` em `constants/marca.js`.

## Figuras dos exercícios
Cada um dos 30 exercícios tem um boneco desenhado (início e fim do movimento, com barra, halteres, banco etc.),
animado na tela de detalhes. Para usar uma **foto real**, coloque a imagem em `assets/exercicios/` e registre em
`data/fotos-exercicios.js`; a foto passa a aparecer no lugar do desenho. Os desenhos ficam em `data/figuras.js`.
