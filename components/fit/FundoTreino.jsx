import { useEffect, useRef } from 'react';
import { Animated, Easing, ImageBackground, Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { FOTO_FUNDO } from '@/constants/marca';
import { cores } from '@/constants/tema';

const nativo = Platform.OS !== 'web';
const BRANCO = '#F5F5F7';

// Sobe e desce em loop, como quem faz repetições.
function Balanco({ amplitude = 6, duracao = 1200, atraso = 0, style, children }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: duracao, delay: atraso, easing: Easing.inOut(Easing.quad), useNativeDriver: nativo }),
        Animated.timing(v, { toValue: 0, duration: duracao, easing: Easing.inOut(Easing.quad), useNativeDriver: nativo }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [v, duracao, atraso]);
  return (
    <Animated.View style={[style, { transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -amplitude] }) }] }]}>
      {children}
    </Animated.View>
  );
}

function Halterofilista({ largura }) {
  return (
    <Svg width={largura} height={(largura * 200) / 140} viewBox="0 0 140 200">
      <Path d="M8 34 L132 34" stroke="#E8E8EA" strokeWidth="4" strokeLinecap="round" />
      <Rect x="4" y="16" width="9" height="36" rx="3" fill={cores.lima} />
      <Rect x="15" y="21" width="7" height="26" rx="2.5" fill={cores.limaEscuro} />
      <Rect x="127" y="16" width="9" height="36" rx="3" fill={cores.lima} />
      <Rect x="118" y="21" width="7" height="26" rx="2.5" fill={cores.limaEscuro} />
      <Path d="M70 84 L42 34 M70 84 L98 34" stroke={BRANCO} strokeWidth="7" strokeLinecap="round" fill="none" />
      <Circle cx="70" cy="62" r="12" fill={BRANCO} />
      <Path d="M70 80 L70 132" stroke={BRANCO} strokeWidth="11" strokeLinecap="round" fill="none" />
      <Path d="M70 132 L52 170 L50 196 M70 132 L88 170 L90 196" stroke={BRANCO} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function Corredor({ largura }) {
  return (
    <Svg width={largura} height={(largura * 200) / 160} viewBox="0 0 160 200">
      <Circle cx="100" cy="40" r="12" fill={BRANCO} />
      <Path d="M94 56 L78 108" stroke={BRANCO} strokeWidth="11" strokeLinecap="round" fill="none" />
      <Path d="M90 68 L114 86 L130 72 M90 68 L68 82 L56 100" stroke={BRANCO} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M78 108 L102 130 L98 166 L108 190 M78 108 L58 136 L34 142" stroke={BRANCO} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M20 150 L44 150 M10 162 L36 162" stroke={cores.lima} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </Svg>
  );
}

// Fundo com pessoas treinando. Se `FOTO_FUNDO` (constants/marca.js) tiver uma foto, ela é usada no lugar da ilustração.
export function FundoTreino({ altura = 200, raio = 0, absoluto = false, children }) {
  const camadas = FOTO_FUNDO ? (
    <ImageBackground source={FOTO_FUNDO} resizeMode="cover" style={StyleSheet.absoluteFill} />
  ) : (
    <>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Circle cx="78%" cy="55%" r={absoluto ? 190 : 120} fill={cores.lima} opacity="0.09" />
      </Svg>
      {absoluto ? (
        <>
          <Balanco style={[s.fig, { left: -24, bottom: 120 }]} amplitude={10} duracao={1500}>
            <Halterofilista largura={230} />
          </Balanco>
          <Balanco style={[s.fig, { right: -30, bottom: 230 }]} amplitude={8} duracao={700} atraso={200}>
            <Corredor largura={230} />
          </Balanco>
        </>
      ) : (
        <>
          <Balanco style={[s.fig, { right: 10, bottom: 0 }]} amplitude={6} duracao={1300}>
            <Halterofilista largura={118} />
          </Balanco>
          <Balanco style={[s.fig, { right: 128, bottom: 10, opacity: 0.55 }]} amplitude={5} duracao={650} atraso={150}>
            <Corredor largura={98} />
          </Balanco>
        </>
      )}
    </>
  );

  const sombra = (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
      <Defs>
        <LinearGradient id={absoluto ? 'sombraTela' : 'sombraBanner'} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0B0B0C" stopOpacity={absoluto ? 0.45 : 0.1} />
          <Stop offset="1" stopColor="#0B0B0C" stopOpacity={absoluto ? 0.97 : 0.55} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${absoluto ? 'sombraTela' : 'sombraBanner'})`} />
    </Svg>
  );

  if (absoluto) {
    return (
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: 0.55, overflow: 'hidden' }]}>
        {camadas}
        {sombra}
      </View>
    );
  }

  return (
    <View style={[s.banner, { height: altura, borderRadius: raio }]}>
      {camadas}
      {sombra}
      <View style={s.conteudo}>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({
  fig: { position: 'absolute' },
  banner: { overflow: 'hidden', backgroundColor: '#0F0F11', borderWidth: 1, borderColor: cores.borda },
  conteudo: { flex: 1, padding: 18 },
});
