import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Barra, Botao, Campo, Chip, IconeTile, Tela } from '@/components/fit';
import { FundoTreino } from '@/components/fit/FundoTreino';
import { MARCA } from '@/constants/marca';
import { cores, raio } from '@/constants/tema';
import { NIVEIS, OBJETIVOS } from '@/data/academia';
import { hojeISO } from '@/services/frequencia';
import { adicionarMedida } from '@/services/medidas';
import { salvarPerfil, usePerfil } from '@/services/perfil';

const numero = (v) => Number(String(v).replace(',', '.'));
const TITULOS = ['Sobre você', 'Seu corpo', 'Seus objetivos'];

export default function Cadastro() {
  const router = useRouter();
  const { valor: perfil, carregado } = usePerfil();
  const edicao = !!perfil;

  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [nivel, setNivel] = useState('Iniciante');
  const [dias, setDias] = useState(3);
  const [erros, setErros] = useState({});

  // Ao editar, preenche os campos com os dados já salvos (uma única vez).
  const [preenchido, setPreenchido] = useState(false);
  useEffect(() => {
    if (carregado && perfil && !preenchido) {
      setNome(perfil.nome);
      setIdade(String(perfil.idade));
      setSexo(perfil.sexo || '');
      setPeso(String(perfil.peso).replace('.', ','));
      setAltura(String(perfil.altura));
      setObjetivo(perfil.objetivo);
      setNivel(perfil.nivel);
      setDias(perfil.diasSemana);
      setPreenchido(true);
    }
  }, [carregado, perfil, preenchido]);

  function validar(p) {
    const novo = {};
    if (p === 0) {
      if (nome.trim().length < 2) novo.nome = 'Digite seu nome.';
      const i = numero(idade);
      if (!Number.isInteger(i) || i < 12 || i > 100) novo.idade = 'Informe uma idade entre 12 e 100.';
      if (!sexo) novo.sexo = 'Escolha uma opção.';
    }
    if (p === 1) {
      const pe = numero(peso);
      if (!pe || pe < 25 || pe > 300) novo.peso = 'Informe um peso entre 25 e 300 kg.';
      const a = numero(altura);
      if (!a || a < 100 || a > 230) novo.altura = 'Informe a altura em cm (ex.: 170).';
    }
    if (p === 2 && !objetivo) novo.objetivo = 'Escolha seu objetivo.';
    setErros(novo);
    return Object.keys(novo).length === 0;
  }

  async function avancar() {
    if (!validar(passo)) return;
    if (passo < 2) {
      setPasso(passo + 1);
      return;
    }
    const pesoNovo = numero(peso);
    if (!edicao || Math.abs(pesoNovo - perfil.peso) > 0.001) {
      await adicionarMedida({ id: hojeISO(), data: hojeISO(), peso: pesoNovo, gordura: null, cintura: null });
    }
    await salvarPerfil({
      ...(edicao ? {} : { criadoEm: hojeISO() }),
      nome: nome.trim(),
      idade: Math.round(numero(idade)),
      sexo,
      peso: numero(peso),
      altura: Math.round(numero(altura)),
      objetivo,
      nivel,
      diasSemana: dias,
    });
    router.replace(edicao ? '/perfil' : '/');
  }

  function voltar() {
    if (passo > 0) {
      setErros({});
      setPasso(passo - 1);
    } else if (edicao) {
      router.back();
    }
  }

  return (
    <Tela exigirCadastro={false}>
      <FundoTreino altura={132} raio={24}>
        <View style={s.marca}>
          <View style={s.raio}>
            <MaterialCommunityIcons name="lightning-bolt" size={22} color={cores.fundo} />
          </View>
          <Text style={s.marcaTxt}>{MARCA.nome} {MARCA.sub.toUpperCase()}</Text>
        </View>
      </FundoTreino>
      <View style={{ height: 22 }} />

      <Text style={s.titulo}>
        {edicao ? 'Editar cadastro' : passo === 0 ? 'Vamos começar!' : TITULOS[passo]}
      </Text>
      <Text style={s.sub}>
        {passo === 0 && 'Conte um pouco sobre você para montarmos seu plano de treino.'}
        {passo === 1 && 'Esses dados ajudam a acompanhar sua evolução.'}
        {passo === 2 && 'Com isso, indicamos os treinos ideais para você.'}
      </Text>

      <View style={s.progresso}>
        <Barra valor={passo + 1} total={3} altura={6} />
        <Text style={s.passoTxt}>Passo {passo + 1} de 3 · {TITULOS[passo]}</Text>
      </View>

      {passo === 0 && (
        <View>
          <Campo rotulo="Nome" valor={nome} onChange={setNome} placeholder="Como podemos te chamar?" erro={erros.nome} maxLength={40} />
          <Campo rotulo="Idade" valor={idade} onChange={setIdade} placeholder="Ex.: 17" teclado="numeric" sufixo="anos" erro={erros.idade} maxLength={3} />
          <Text style={s.rotulo}>Sexo</Text>
          <View style={s.linhaChips}>
            {['Feminino', 'Masculino', 'Outro'].map((op) => (
              <Chip key={op} texto={op} ativo={sexo === op} onPress={() => setSexo(op)} />
            ))}
          </View>
          {!!erros.sexo && <Text style={s.erro}>{erros.sexo}</Text>}
        </View>
      )}

      {passo === 1 && (
        <View>
          <Campo rotulo="Peso" valor={peso} onChange={setPeso} placeholder="Ex.: 68,5" teclado="decimal-pad" sufixo="kg" erro={erros.peso} maxLength={6} />
          <Campo rotulo="Altura" valor={altura} onChange={setAltura} placeholder="Ex.: 170" teclado="numeric" sufixo="cm" erro={erros.altura} maxLength={3} />
        </View>
      )}

      {passo === 2 && (
        <View>
          <Text style={s.rotulo}>Qual é o seu objetivo?</Text>
          {OBJETIVOS.map((o) => {
            const ativo = objetivo === o.id;
            return (
              <Pressable key={o.id} onPress={() => setObjetivo(o.id)} style={[s.objetivo, ativo && s.objetivoAtivo]}>
                <IconeTile nome={o.icone} tamanho={46} cor={ativo ? cores.fundo : cores.lima} fundo={ativo ? cores.lima : cores.limaFundo} />
                <View style={{ flex: 1 }}>
                  <Text style={s.objNome}>{o.nome}</Text>
                  <Text style={s.objResumo}>{o.resumo}</Text>
                </View>
                {ativo && <MaterialCommunityIcons name="check-circle" size={22} color={cores.lima} />}
              </Pressable>
            );
          })}
          {!!erros.objetivo && <Text style={s.erro}>{erros.objetivo}</Text>}

          <Text style={[s.rotulo, { marginTop: 18 }]}>Seu nível</Text>
          <View style={s.linhaChips}>
            {NIVEIS.map((n) => (
              <Chip key={n} texto={n} ativo={nivel === n} onPress={() => setNivel(n)} />
            ))}
          </View>

          <Text style={[s.rotulo, { marginTop: 18 }]}>Quantos dias por semana quer treinar?</Text>
          <View style={s.linhaChips}>
            {[2, 3, 4, 5, 6].map((d) => (
              <Chip key={d} texto={`${d}x`} ativo={dias === d} onPress={() => setDias(d)} />
            ))}
          </View>
        </View>
      )}

      <View style={s.acoes}>
        {(passo > 0 || edicao) && (
          <Botao texto="Voltar" variante="secundario" onPress={voltar} style={{ flex: 1 }} />
        )}
        <Botao
          texto={passo < 2 ? 'Continuar' : edicao ? 'Salvar alterações' : 'Começar a treinar'}
          icone={passo < 2 ? 'arrow-forward' : 'checkmark'}
          onPress={avancar}
          style={{ flex: 2 }}
        />
      </View>
    </Tela>
  );
}

const s = StyleSheet.create({
  marca: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  raio: { width: 36, height: 36, borderRadius: 12, backgroundColor: cores.lima, alignItems: 'center', justifyContent: 'center' },
  marcaTxt: { color: cores.texto, fontSize: 16, fontWeight: '900', letterSpacing: 3 },
  titulo: { color: cores.texto, fontSize: 30, fontWeight: '900', letterSpacing: -0.7 },
  sub: { color: cores.texto2, fontSize: 14, lineHeight: 20, marginTop: 8 },
  progresso: { marginTop: 22, marginBottom: 26, gap: 10 },
  passoTxt: { color: cores.texto3, fontSize: 12, fontWeight: '700' },
  rotulo: { color: cores.texto2, fontSize: 12, fontWeight: '800', marginBottom: 10, letterSpacing: 0.6, textTransform: 'uppercase' },
  linhaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  erro: { color: cores.erro, fontSize: 12, marginTop: 8, fontWeight: '600' },
  objetivo: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, marginBottom: 10,
    backgroundColor: cores.superficie, borderRadius: raio.g, borderWidth: 1, borderColor: cores.borda,
  },
  objetivoAtivo: { borderColor: cores.lima, backgroundColor: 'rgba(198,255,61,0.06)' },
  objNome: { color: cores.texto, fontSize: 15, fontWeight: '800' },
  objResumo: { color: cores.texto2, fontSize: 12, marginTop: 2 },
  acoes: { flexDirection: 'row', gap: 12, marginTop: 28 },
});
