import { useEffect, useState } from 'react';
import { Animated, Easing, Image, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { IconeTile } from '@/components/fit';
import { FIGURAS } from '@/data/figuras';
import { FOTOS_EXERCICIOS } from '@/data/fotos-exercicios';
import { cores } from '@/constants/tema';

const CORPO = '#F5F5F7';
const LADO_B = '#9A9AA2';
const lerp = (a, b, t) => a + (b - a) * t;
const lp = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const autoB = (a) => ({ e: [a.e[0] - 3, a.e[1]], m: [a.m[0] - 3, a.m[1]], k: [a.k[0] - 3, a.k[1]], f: [a.f[0] - 3, a.f[1]] });
const mixLado = (x, y, t) => ({ e: lp(x.e, y.e, t), m: lp(x.m, y.m, t), k: lp(x.k, y.k, t), f: lp(x.f, y.f, t) });

// Mistura a pose inicial (t = 0) com a final (t = 1).
function misturar(A, B, t) {
  const frontal = !!(A.b || B.b);
  return {
    c: lp(A.c, B.c, t),
    p: lp(A.p, B.p, t),
    q: lp(A.q, B.q, t),
    a: mixLado(A.a, B.a, t),
    b: frontal ? mixLado(A.b ?? autoB(A.a), B.b ?? autoB(B.a), t) : mixLado(autoB(A.a), autoB(B.a), t),
    frontal,
    mid: A.mid && B.mid ? lp(A.mid, B.mid, t) : A.mid || B.mid || null,
  };
}

const pt = (pose, on) => (on === 'mb' ? (pose.b ? pose.b.m : pose.a.m) : pose.a.m);
const par = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

function Acessorio({ a, pose, t, i }) {
  switch (a.t) {
    case 'ret':
      return <Rect key={i} x={a.x} y={a.y} width={a.w} height={a.h} rx={a.r} fill={a.cor} />;
    case 'linha':
      return <Line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke={a.cor} strokeWidth={a.w} strokeLinecap="round" />;
    case 'circ':
      return a.contorno ? (
        <Circle key={i} cx={a.x} cy={a.y} r={a.r} stroke={a.cor} strokeWidth="3" fill="none" />
      ) : (
        <Circle key={i} cx={a.x} cy={a.y} r={a.r} fill={a.cor} />
      );
    case 'cabo': {
      const m = pose.a.m;
      return <Line key={i} x1={a.de[0]} y1={a.de[1]} x2={m[0]} y2={m[1]} stroke="#9A9AA2" strokeWidth="1.5" />;
    }
    case 'placa': {
      const m = pt(pose, a.on);
      return (
        <Circle key={i} cx={m[0]} cy={m[1]} r="7" fill={cores.lima} stroke={cores.fundo} strokeWidth="2" />
      );
    }
    case 'halt': {
      const m = pt(pose, a.on);
      return <Rect key={i} x={m[0] - 6} y={m[1] - 3} width="12" height="6" rx="2.5" fill={cores.lima} />;
    }
    case 'halt2':
      return (
        <>
          <Rect key={`${i}a`} x={pose.a.m[0] - 6} y={pose.a.m[1] - 3} width="12" height="6" rx="2.5" fill={cores.lima} />
          <Rect key={`${i}b`} x={pose.b.m[0] - 6} y={pose.b.m[1] - 3} width="12" height="6" rx="2.5" fill={cores.lima} />
        </>
      );
    case 'plat': {
      const { k, f } = pose.a;
      const dx = f[0] - k[0];
      const dy = f[1] - k[1];
      const n = Math.hypot(dx, dy) || 1;
      const px = (-dy / n) * 9;
      const py = (dx / n) * 9;
      return <Line key={i} x1={f[0] - px} y1={f[1] - py} x2={f[0] + px} y2={f[1] + py} stroke={cores.lima} strokeWidth="4" strokeLinecap="round" />;
    }
    case 'corda': {
      const ctrlY = lerp(98, -12, t);
      return (
        <Path key={i} d={`M${par(pose.a.m)} Q50 ${ctrlY.toFixed(1)} ${par(pose.b.m)}`} stroke={cores.lima} strokeWidth="2" fill="none" strokeLinecap="round" />
      );
    }
    default:
      return null;
  }
}

const ESTATICOS = ['ret', 'linha', 'circ'];

/**
 * Figura do exercício. Mostra uma FOTO se existir em data/fotos-exercicios.js,
 * senão o boneco animado (ou parado, com `animar={false}`); sem figura, cai no ícone.
 */
export function FiguraExercicio({ id, icone = 'dumbbell', tamanho = 56, animar = false }) {
  const [t, setT] = useState(0);
  const foto = FOTOS_EXERCICIOS[id];
  const fig = FIGURAS[id];

  useEffect(() => {
    if (!animar || !fig || foto) return undefined;
    const v = new Animated.Value(0);
    const escuta = v.addListener(({ value }) => setT(value));
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.delay(200),
        Animated.timing(v, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.delay(200),
      ])
    );
    anim.start();
    return () => {
      anim.stop();
      v.removeListener(escuta);
    };
  }, [animar, fig, foto]);

  const moldura = {
    width: tamanho,
    height: tamanho,
    borderRadius: tamanho * 0.28,
    overflow: 'hidden',
    backgroundColor: '#0F0F11',
    borderWidth: 1,
    borderColor: 'rgba(198,255,61,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (foto) {
    return (
      <View style={moldura}>
        <Image source={foto} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      </View>
    );
  }
  if (!fig) return <IconeTile nome={icone} tamanho={tamanho} />;

  const pose = misturar(fig.poses[0], fig.poses[1], animar ? t : 0);
  const braco = (l) => `M${par(pose.p)} L${par(l.e)} L${par(l.m)}`;
  const perna = (l) => `M${par(pose.q)} L${par(l.k)} L${par(l.f)}`;
  const tronco = pose.mid ? `M${par(pose.p)} Q${par(pose.mid)} ${par(pose.q)}` : `M${par(pose.p)} L${par(pose.q)}`;
  const corLadoB = pose.frontal ? CORPO : LADO_B;

  return (
    <View style={moldura}>
      <Svg width={tamanho} height={tamanho} viewBox="0 0 100 100">
        <Circle cx="50" cy="52" r="46" fill={cores.lima} opacity="0.06" />
        <Line x1="6" y1="93" x2="94" y2="93" stroke={cores.borda} strokeWidth="2" strokeLinecap="round" />
        {fig.acc.map((a, i) => (ESTATICOS.includes(a.t) ? <Acessorio key={`s${i}`} a={a} pose={pose} t={t} i={i} /> : null))}
        <Path d={`${braco(pose.b)} ${perna(pose.b)}`} stroke={corLadoB} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Path d={tronco} stroke={CORPO} strokeWidth="7" strokeLinecap="round" fill="none" />
        <Path d={`${braco(pose.a)} ${perna(pose.a)}`} stroke={CORPO} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Circle cx={pose.c[0]} cy={pose.c[1]} r="6.5" fill={CORPO} />
        {fig.acc.map((a, i) => (ESTATICOS.includes(a.t) ? null : <Acessorio key={`d${i}`} a={a} pose={pose} t={t} i={i} />))}
      </Svg>
    </View>
  );
}
