import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import { cores } from '@/constants/tema';

// pontos: [{ x: timestamp, y: valor, rotulo: '12/03' }]
export function GraficoLinha({ pontos, altura = 190, sufixo = '', casas = 1 }) {
  const [largura, setLargura] = useState(0);

  if (pontos.length === 0) {
    return (
      <View style={[s.vazio, { height: altura }]}>
        <Text style={s.vazioTxt}>Sem registros neste período.</Text>
      </View>
    );
  }

  const padX = 16;
  const padTopo = 30;
  const padBase = 30;
  const ys = pontos.map((p) => p.y);
  let min = Math.min(...ys);
  let max = Math.max(...ys);
  if (max - min < 0.5) {
    min -= 1;
    max += 1;
  } else {
    const folga = (max - min) * 0.18;
    min -= folga;
    max += folga;
  }
  const t0 = pontos[0].x;
  const t1 = pontos[pontos.length - 1].x;
  const px = (p, i) =>
    pontos.length === 1
      ? largura / 2
      : padX + (t1 === t0 ? i / (pontos.length - 1) : (p.x - t0) / (t1 - t0)) * (largura - 2 * padX);
  const py = (y) => padTopo + (1 - (y - min) / (max - min)) * (altura - padTopo - padBase);
  const coords = pontos.map((p, i) => [px(p, i), py(p.y)]);
  const linha = coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${linha} L${coords[coords.length - 1][0].toFixed(1)} ${altura - padBase} L${coords[0][0].toFixed(1)} ${altura - padBase} Z`;
  const ultimo = coords[coords.length - 1];
  const primeiro = coords[0];
  const rotulo = (v) => `${Number(v).toFixed(casas).replace('.', ',')}${sufixo}`;

  return (
    <View style={{ height: altura }} onLayout={(e) => setLargura(e.nativeEvent.layout.width)}>
      {largura > 0 && (
        <Svg width={largura} height={altura}>
          <Defs>
            <LinearGradient id="areaGrafico" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={cores.lima} stopOpacity="0.35" />
              <Stop offset="1" stopColor={cores.lima} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          {[0, 1, 2].map((i) => {
            const y = padTopo + (i * (altura - padTopo - padBase)) / 2;
            return <Line key={i} x1={padX} x2={largura - padX} y1={y} y2={y} stroke={cores.borda} strokeWidth="1" strokeDasharray="4 6" />;
          })}
          {pontos.length > 1 && <Path d={area} fill="url(#areaGrafico)" />}
          {pontos.length > 1 && <Path d={linha} stroke={cores.lima} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          {pontos.length <= 31 &&
            coords.map(([x, y], i) => <Circle key={i} cx={x} cy={y} r="3.5" fill={cores.fundo} stroke={cores.lima} strokeWidth="2" />)}
          <Circle cx={ultimo[0]} cy={ultimo[1]} r="9" fill={cores.lima} opacity="0.22" />
          <Circle cx={ultimo[0]} cy={ultimo[1]} r="5" fill={cores.lima} />
          {pontos.length > 1 && (
            <SvgText x={primeiro[0]} y={primeiro[1] - 12} fill={cores.texto2} fontSize="12" fontWeight="700" textAnchor="start">
              {rotulo(pontos[0].y)}
            </SvgText>
          )}
          <SvgText x={ultimo[0]} y={ultimo[1] - 14} fill={cores.lima} fontSize="14" fontWeight="900" textAnchor={pontos.length === 1 ? 'middle' : 'end'}>
            {rotulo(pontos[pontos.length - 1].y)}
          </SvgText>
          <SvgText x={padX} y={altura - 8} fill={cores.texto3} fontSize="11" textAnchor="start">
            {pontos[0].rotulo}
          </SvgText>
          {pontos.length > 1 && (
            <SvgText x={largura - padX} y={altura - 8} fill={cores.texto3} fontSize="11" textAnchor="end">
              {pontos[pontos.length - 1].rotulo}
            </SvgText>
          )}
        </Svg>
      )}
    </View>
  );
}

export function Anel({ valor, total, tamanho = 96, espessura = 10, children }) {
  const r = (tamanho - espessura) / 2;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? Math.max(0, Math.min(1, valor / total)) : 0;
  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={tamanho} height={tamanho} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={tamanho / 2} cy={tamanho / 2} r={r} stroke={cores.superficie2} strokeWidth={espessura} fill="none" />
        <Circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={r}
          stroke={cores.lima}
          strokeWidth={espessura}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
        />
      </Svg>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  vazio: { alignItems: 'center', justifyContent: 'center' },
  vazioTxt: { color: cores.texto3, fontSize: 13 },
});
