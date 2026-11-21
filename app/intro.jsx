import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Botao } from '@/components/fit';
import { FundoTreino } from '@/components/fit/FundoTreino';
import { MARCA } from '@/constants/marca';
import { cores } from '@/constants/tema';
import { usePerfil } from '@/services/perfil';
import { marcarIntro } from '@/services/sessao';

const nativo = Platform.OS !== 'web';

const DESTAQUES = [
  { icone: 'dumbbell', titulo: 'Treinos para o seu objetivo', texto: 'Planos prontos, dia a dia.' },
  { icone: 'play-circle-outline', titulo: 'Vídeo de cada exercício', texto: 'Aprenda a usar todos os equipamentos.' },
  { icone: 'chart-line', titulo: 'Evolução de verdade', texto: 'Medidas, fotos antes e depois e relógio inteligente.' },
  { icone: 'account-tie-outline', titulo: 'Personais e unidades', texto: 'Contrate um personal e encontre sua academia.' },
];

// Aparece de baixo para cima, com atraso (efeito escalonado).
function Surgir({ atraso = 0, children, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 520, delay: atraso, easing: Easing.out(Easing.cubic), useNativeDriver: nativo }).start();
  }, [v, atraso]);
  return (
    <Animated.View style={[{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] }, style]}>
      {children}
    </Animated.View>
  );
}

function Splash() {
  const logo = useRef(new Animated.Value(0)).current;
  const brilho = useRef(new Animated.Value(0)).current;
  const nome = useRef(new Animated.Value(0)).current;
  const slogan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulso = Animated.loop(
      Animated.sequence([
        Animated.timing(brilho, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: nativo }),
        Animated.timing(brilho, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: nativo }),
      ])
    );
    pulso.start();
    Animated.sequence([
      Animated.spring(logo, { toValue: 1, friction: 5, tension: 60, useNativeDriver: nativo }),
      Animated.timing(nome, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: nativo }),
      Animated.timing(slogan, { toValue: 1, duration: 450, useNativeDriver: nativo }),
    ]).start();
    return () => pulso.stop();
  }, [logo, brilho, nome, slogan]);

  return (
    <View style={s.centro}>
      <View style={s.logoArea}>
        <Animated.View
          style={[
            s.brilho,
            {
              opacity: brilho.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.5] }),
              transform: [{ scale: brilho.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }],
            },
          ]}
        />
        <Animated.View
          style={[
            s.logo,
            {
              opacity: logo,
              transform: [
                { scale: logo.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) },
                { rotate: logo.interpolate({ inputRange: [0, 1], outputRange: ['-30deg', '0deg'] }) },
              ],
            },
          ]}
        >
          <MaterialCommunityIcons name="lightning-bolt" size={78} color={cores.fundo} />
        </Animated.View>
      </View>

      <Animated.Text
        style={[
          s.nome,
          { opacity: nome, transform: [{ translateY: nome.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] },
        ]}
      >
        {MARCA.nome}
      </Animated.Text>
      <Animated.Text style={[s.sub, { opacity: nome }]}>{MARCA.sub.toUpperCase()}</Animated.Text>
      <Animated.Text style={[s.slogan, { opacity: slogan }]}>{MARCA.slogan}</Animated.Text>
    </View>
  );
}

export default function Intro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { valor: perfil, carregado } = usePerfil();
  const [fim, setFim] = useState(false);
  const [fase, setFase] = useState('splash');
  const barra = useRef(new Animated.Value(0)).current;

  // Barra de carregamento: ao terminar, a animação de entrada acaba.
  useEffect(() => {
    Animated.timing(barra, { toValue: 1, duration: 2600, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(
      ({ finished }) => finished && setFim(true)
    );
    const seguranca = setTimeout(() => setFim(true), 4000);
    return () => clearTimeout(seguranca);
  }, [barra]);

  // Quem já tem cadastro vai direto para o app; quem é novo vê as boas-vindas.
  useEffect(() => {
    if (!fim || !carregado) return;
    if (perfil) {
      marcarIntro();
      router.replace('/');
    } else {
      setFase('boasvindas');
    }
  }, [fim, carregado, perfil, router]);

  function comecar() {
    marcarIntro();
    router.replace('/cadastro');
  }

  return (
    <View style={[s.tela, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      <FundoTreino absoluto />
      {fase === 'splash' ? (
        <>
          <Splash />
          <View style={s.barraFundo}>
            <Animated.View style={[s.barra, { width: barra.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
          </View>
        </>
      ) : (
        <View style={s.boasVindas}>
          <Surgir>
            <View style={s.logoPequeno}>
              <MaterialCommunityIcons name="lightning-bolt" size={34} color={cores.fundo} />
            </View>
          </Surgir>
          <Surgir atraso={120}>
            <Text style={s.titulo}>Bem-vindo à{'\n'}{MARCA.nome} {MARCA.sub}</Text>
            <Text style={s.descricao}>Seu treino, suas unidades e seu personal em um só lugar.</Text>
          </Surgir>

          <View style={{ marginTop: 20, gap: 10 }}>
            {DESTAQUES.map((d, i) => (
              <Surgir key={d.titulo} atraso={300 + i * 160}>
                <View style={s.item}>
                  <View style={s.itemIcone}>
                    <MaterialCommunityIcons name={d.icone} size={26} color={cores.lima} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.itemTitulo}>{d.titulo}</Text>
                    <Text style={s.itemTexto}>{d.texto}</Text>
                  </View>
                </View>
              </Surgir>
            ))}
          </View>

          <View style={{ flex: 1 }} />
          <Surgir atraso={900}>
            <Botao texto="Criar meu perfil" icone="arrow-forward" onPress={comecar} />
          </Surgir>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, paddingHorizontal: 24 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoArea: { width: 190, height: 190, alignItems: 'center', justifyContent: 'center', marginBottom: 26 },
  brilho: { position: 'absolute', width: 190, height: 190, borderRadius: 95, backgroundColor: cores.lima },
  logo: { width: 128, height: 128, borderRadius: 40, backgroundColor: cores.lima, alignItems: 'center', justifyContent: 'center' },
  nome: { color: cores.texto, fontSize: 54, fontWeight: '900', letterSpacing: 10 },
  sub: { color: cores.lima, fontSize: 14, fontWeight: '900', letterSpacing: 8, marginTop: 4 },
  slogan: { color: cores.texto2, fontSize: 13, marginTop: 22, textAlign: 'center' },
  barraFundo: { height: 4, borderRadius: 2, backgroundColor: cores.superficie2, overflow: 'hidden', marginBottom: 24 },
  barra: { height: '100%', backgroundColor: cores.lima, borderRadius: 2 },
  boasVindas: { flex: 1, paddingTop: 20 },
  logoPequeno: { width: 60, height: 60, borderRadius: 20, backgroundColor: cores.lima, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  titulo: { color: cores.texto, fontSize: 34, fontWeight: '900', letterSpacing: -0.8, lineHeight: 40 },
  descricao: { color: cores.texto2, fontSize: 15, lineHeight: 22, marginTop: 12 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, backgroundColor: 'rgba(21,21,23,0.88)',
    borderRadius: 20, borderWidth: 1, borderColor: cores.borda,
  },
  itemIcone: { width: 48, height: 48, borderRadius: 15, backgroundColor: cores.limaFundo, alignItems: 'center', justifyContent: 'center' },
  itemTitulo: { color: cores.texto, fontSize: 15, fontWeight: '800' },
  itemTexto: { color: cores.texto2, fontSize: 12, marginTop: 2 },
});
