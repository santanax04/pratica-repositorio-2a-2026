import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Botao, Cartao, Secao, Tela } from '@/components/fit';
import { cores } from '@/constants/tema';
import { fmt, formatarData } from '@/services/evolucao';
import { hojeISO } from '@/services/frequencia';
import { usePerfil } from '@/services/perfil';
import {
  ZONAS, bluetoothDisponivel, conectarBluetooth, fcMaxima, iniciarDemo, kcalPorMinuto, zonaAtual,
} from '@/services/saude';
import { salvarSessao, useSessoes } from '@/services/sessoes';

const nativo = Platform.OS !== 'web';
const tempo = (seg) => `${String(Math.floor(seg / 60)).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;

export default function Relogio() {
  const { valor: perfil } = usePerfil();
  const { valor: sessoes } = useSessoes();
  const [fonte, setFonte] = useState(null); // 'bluetooth' | 'demo'
  const [nomeDispositivo, setNomeDispositivo] = useState('');
  const [bpm, setBpm] = useState(0);
  const [erro, setErro] = useState('');
  const [sessao, setSessao] = useState(null);
  const bpmRef = useRef(0);
  const conexao = useRef(null);
  const pulso = useRef(new Animated.Value(1)).current;

  const sessaoAtiva = !!sessao;
  const fcMax = fcMaxima(perfil?.idade);
  const zona = bpm ? zonaAtual(bpm, fcMax) : null;

  const aoBpm = useCallback((v) => {
    bpmRef.current = v;
    setBpm(v);
  }, []);

  // Coração pulsando no ritmo dos batimentos.
  const faixa = bpm ? Math.round(bpm / 8) : 0;
  useEffect(() => {
    if (!bpm) {
      pulso.setValue(1);
      return undefined;
    }
    const dur = Math.max(250, Math.min(900, 30000 / bpm));
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, { toValue: 1.2, duration: dur, easing: Easing.out(Easing.quad), useNativeDriver: nativo }),
        Animated.timing(pulso, { toValue: 1, duration: dur, easing: Easing.in(Easing.quad), useNativeDriver: nativo }),
      ])
    );
    anim.start();
    return () => anim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faixa, pulso]);

  // Treino monitorado: a cada segundo soma calorias e gordura estimadas.
  useEffect(() => {
    if (!sessaoAtiva || !perfil) return undefined;
    const t = setInterval(() => {
      const b = bpmRef.current;
      setSessao((s) => {
        if (!s) return s;
        if (!b) return { ...s, segundos: s.segundos + 1 };
        const kcal = kcalPorMinuto({ bpm: b, peso: perfil.peso, idade: perfil.idade, sexo: perfil.sexo }) / 60;
        const z = zonaAtual(b, fcMaxima(perfil.idade));
        return {
          ...s,
          segundos: s.segundos + 1,
          kcal: s.kcal + kcal,
          gorduraG: s.gorduraG + (kcal * z.gordura) / 9,
          soma: s.soma + b,
          n: s.n + 1,
          max: Math.max(s.max, b),
        };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [sessaoAtiva, perfil]);

  useEffect(() => () => conexao.current?.desconectar?.(), []);

  async function conectarPorBluetooth() {
    setErro('');
    try {
      const c = await conectarBluetooth(aoBpm, () => {
        conexao.current = null;
        setFonte(null);
        setBpm(0);
        bpmRef.current = 0;
        setErro('O relógio foi desconectado.');
      });
      conexao.current = c;
      setNomeDispositivo(c.nome);
      setFonte('bluetooth');
    } catch (e) {
      setErro(
        e?.name === 'NotFoundError'
          ? 'Nenhum dispositivo foi selecionado.'
          : 'Não foi possível conectar. Ative a transmissão de batimentos no relógio e tente de novo.'
      );
    }
  }

  function conectarDemo() {
    setErro('');
    conexao.current = { nome: 'Relógio (demonstração)', desconectar: iniciarDemo(aoBpm) };
    setNomeDispositivo('Relógio (demonstração)');
    setFonte('demo');
  }

  async function finalizar() {
    const s = sessao;
    setSessao(null);
    if (s && s.segundos >= 10) {
      await salvarSessao({
        id: String(Date.now()),
        data: hojeISO(),
        segundos: s.segundos,
        media: s.n ? Math.round(s.soma / s.n) : 0,
        max: s.max,
        kcal: Math.round(s.kcal),
        gorduraG: Math.round(s.gorduraG),
        fonte,
      });
    }
  }

  function desconectar() {
    conexao.current?.desconectar?.();
    conexao.current = null;
    if (sessao) finalizar();
    setFonte(null);
    setBpm(0);
    bpmRef.current = 0;
  }

  if (!perfil) return <Tela />;

  const mediaAtual = sessao && sessao.n ? Math.round(sessao.soma / sessao.n) : 0;
  const ultimas = [...sessoes].reverse().slice(0, 5);

  return (
    <Tela titulo="Relógio inteligente" subtitulo="Batimentos, calorias e queima de gordura" voltar>
      {!fonte ? (
        <Cartao style={s.conectar}>
          <MaterialCommunityIcons name="watch-variant" size={56} color={cores.lima} />
          <Text style={s.tituloCard}>Conecte seu relógio</Text>
          <Text style={s.texto}>
            Acompanhe seus batimentos em tempo real durante o treino e veja uma estimativa das calorias e da gordura queimadas.
          </Text>
          <Botao
            texto="Conectar por Bluetooth"
            icone="bluetooth"
            desativado={!bluetoothDisponivel()}
            onPress={conectarPorBluetooth}
            style={{ alignSelf: 'stretch', marginTop: 8 }}
          />
          {!bluetoothDisponivel() && (
            <Text style={s.aviso}>
              {Platform.OS === 'web'
                ? 'Este navegador não permite Bluetooth. Use o Chrome ou o Edge (computador ou Android).'
                : 'No celular, a conexão direta com Apple Watch, Galaxy Watch e similares precisa de um app nativo. Veja o LEIA-ME.'}
            </Text>
          )}
          <Botao texto="Testar em modo demonstração" icone="play-circle-outline" variante="secundario" onPress={conectarDemo} style={{ alignSelf: 'stretch' }} />
          {!!erro && <Text style={s.erro}>{erro}</Text>}
        </Cartao>
      ) : (
        <View>
          <Cartao style={s.monitor}>
            <View style={s.topoMonitor}>
              <View style={s.status}>
                <View style={s.ponto} />
                <Text style={s.statusTxt}>{nomeDispositivo}{fonte === 'demo' ? ' · simulado' : ''}</Text>
              </View>
              <Text onPress={desconectar} style={s.desconectar} accessibilityRole="button">Desconectar</Text>
            </View>
            <Animated.View style={{ transform: [{ scale: pulso }], marginTop: 10 }}>
              <MaterialCommunityIcons name="heart" size={60} color={zona?.cor ?? cores.lima} />
            </Animated.View>
            <Text style={s.bpm}>{bpm || '--'}<Text style={s.bpmUn}> bpm</Text></Text>
            <Text style={[s.zona, { color: zona?.cor ?? cores.texto2 }]}>{zona ? zona.nome : 'Aguardando batimentos...'}</Text>

            <View style={s.zonas}>
              {ZONAS.map((z) => (
                <View key={z.id} style={[s.zonaBarra, { backgroundColor: zona?.id === z.id ? z.cor : cores.superficie2 }]} />
              ))}
            </View>
            <Text style={s.fcMax}>FC máxima estimada: {fcMax} bpm</Text>
          </Cartao>

          <Secao titulo="Treino monitorado" />
          {sessao ? (
            <View>
              <View style={s.grade}>
                <Cartao style={s.metrica}><Text style={s.metricaNum}>{tempo(sessao.segundos)}</Text><Text style={s.metricaRot}>tempo</Text></Cartao>
                <Cartao style={s.metrica}><Text style={s.metricaNum}>{Math.round(sessao.kcal)}</Text><Text style={s.metricaRot}>kcal</Text></Cartao>
              </View>
              <View style={[s.grade, { marginTop: 10 }]}>
                <Cartao style={s.metrica}><Text style={s.metricaNum}>{Math.round(sessao.gorduraG)} g</Text><Text style={s.metricaRot}>gordura (estimada)</Text></Cartao>
                <Cartao style={s.metrica}><Text style={s.metricaNum}>{mediaAtual || '--'}</Text><Text style={s.metricaRot}>média · máx {sessao.max || '--'}</Text></Cartao>
              </View>
              <Botao texto="Finalizar e salvar treino" icone="stop-circle-outline" onPress={finalizar} style={{ marginTop: 14 }} />
            </View>
          ) : (
            <Botao texto="Iniciar treino monitorado" icone="play" onPress={() => setSessao({ segundos: 0, kcal: 0, gorduraG: 0, soma: 0, n: 0, max: 0 })} />
          )}
        </View>
      )}

      {ultimas.length > 0 && (
        <View>
          <Secao titulo="Últimos treinos monitorados" />
          {ultimas.map((u) => (
            <View key={u.id} style={s.hist}>
              <MaterialCommunityIcons name="heart-pulse" size={22} color={cores.lima} />
              <View style={{ flex: 1 }}>
                <Text style={s.histTitulo}>{formatarData(u.data)} · {tempo(u.segundos)}</Text>
                <Text style={s.histSub}>média {u.media} bpm · máx {u.max} bpm</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.histKcal}>{u.kcal} kcal</Text>
                <Text style={s.histSub}>{fmt(u.gorduraG, 0)} g gordura</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <Cartao style={s.nota}>
        <Text style={s.notaTitulo}>Sobre os números</Text>
        <Text style={s.notaTxt}>
          • Calorias e gordura são estimativas calculadas a partir dos batimentos, do seu peso, idade e sexo.{'\n'}
          • Pressão arterial não é medida pela maioria dos relógios; aqui mostramos a frequência cardíaca (bpm).{'\n'}
          • Os dados são para acompanhamento pessoal e não substituem avaliação médica.
        </Text>
      </Cartao>
    </Tela>
  );
}

const s = StyleSheet.create({
  conectar: { alignItems: 'center', gap: 12, paddingVertical: 26 },
  tituloCard: { color: cores.texto, fontSize: 20, fontWeight: '900' },
  texto: { color: cores.texto2, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  aviso: { color: cores.aviso, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  erro: { color: cores.erro, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  monitor: { alignItems: 'center', gap: 4, borderColor: 'rgba(198,255,61,0.35)' },
  topoMonitor: { flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  ponto: { width: 8, height: 8, borderRadius: 4, backgroundColor: cores.lima },
  statusTxt: { color: cores.texto2, fontSize: 12, fontWeight: '700', flexShrink: 1 },
  desconectar: { color: cores.erro, fontSize: 12, fontWeight: '800' },
  bpm: { color: cores.texto, fontSize: 64, fontWeight: '900', letterSpacing: -2 },
  bpmUn: { color: cores.texto2, fontSize: 18, fontWeight: '700', letterSpacing: 0 },
  zona: { fontSize: 16, fontWeight: '900' },
  zonas: { flexDirection: 'row', gap: 6, alignSelf: 'stretch', marginTop: 14 },
  zonaBarra: { flex: 1, height: 8, borderRadius: 4 },
  fcMax: { color: cores.texto3, fontSize: 11, marginTop: 8 },
  grade: { flexDirection: 'row', gap: 10 },
  metrica: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  metricaNum: { color: cores.lima, fontSize: 26, fontWeight: '900' },
  metricaRot: { color: cores.texto2, fontSize: 11, marginTop: 4, textAlign: 'center' },
  hist: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cores.superficie, borderRadius: 16, borderWidth: 1, borderColor: cores.borda, padding: 14, marginBottom: 8 },
  histTitulo: { color: cores.texto, fontWeight: '800', fontSize: 14 },
  histSub: { color: cores.texto2, fontSize: 12, marginTop: 2 },
  histKcal: { color: cores.lima, fontWeight: '900', fontSize: 15 },
  nota: { marginTop: 22, gap: 6 },
  notaTitulo: { color: cores.texto, fontWeight: '900', fontSize: 14 },
  notaTxt: { color: cores.texto2, fontSize: 12, lineHeight: 19 },
});
