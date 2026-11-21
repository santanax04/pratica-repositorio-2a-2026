import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Botao, Cartao, Chip, Secao, Tela } from '@/components/fit';
import { Anel, GraficoLinha } from '@/components/fit/graficos';
import { Fotos } from '@/components/evolucao/Fotos';
import { Medidas } from '@/components/evolucao/Medidas';
import { cores } from '@/constants/tema';
import {
  antesDe, conquistas, dataCurta, dataMenosDias, fmt, paraData, resumoEvolucao, sentido, serieMedidas, sinal,
} from '@/services/evolucao';
import { useFotos } from '@/services/fotos';
import { useFrequencia } from '@/services/frequencia';
import { useMedidas } from '@/services/medidas';
import { usePerfil } from '@/services/perfil';
import { useSessoes } from '@/services/sessoes';

const cor = (s) => (s === 'bom' ? cores.lima : s === 'ruim' ? cores.aviso : cores.texto);

function Resumo({ perfil, serie, irParaMedidas }) {
  const router = useRouter();
  const { valor: presencas } = useFrequencia();
  const { valor: sessoes } = useSessoes();
  const { valor: fotos } = useFotos();
  const [metrica, setMetrica] = useState('peso');
  const [periodo, setPeriodo] = useState(90);

  const r = resumoEvolucao(serie);
  const limite = periodo ? dataMenosDias(periodo) : '0000-00-00';
  const pontos = serie
    .filter((m) => m.data >= limite && m[metrica] != null)
    .map((m) => ({ x: paraData(m.data).getTime(), y: m[metrica], rotulo: dataCurta(m.data) }));
  const sufixo = { peso: ' kg', gordura: '%', cintura: ' cm' }[metrica];

  const sPeso = sentido(perfil.objetivo, r.deltaKg);
  const meta = perfil.metaPeso;
  const andou = meta ? Math.abs(r.inicial.peso - r.atual.peso) : 0;
  const total = meta ? Math.abs(r.inicial.peso - meta) : 0;
  const rumo = meta && (r.inicial.peso - meta) * (r.inicial.peso - r.atual.peso) > 0;
  const pctMeta = meta && total > 0 && rumo ? Math.min(100, (andou / total) * 100) : 0;

  const semanaDe = dataMenosDias(7);
  const sessoesSemana = sessoes.filter((s) => s.data >= semanaDe);
  const kcalSemana = sessoesSemana.reduce((t, s) => t + s.kcal, 0);
  const gorduraSemana = sessoesSemana.reduce((t, s) => t + s.gorduraG, 0);

  const comparativos = [
    { rot: '30 dias atrás', dias: 30 },
    { rot: '90 dias atrás', dias: 90 },
    { rot: '1 ano atrás', dias: 365 },
  ].map((c) => {
    const ref = antesDe(serie, dataMenosDias(c.dias));
    return { ...c, ref };
  });

  const lista = conquistas({ presencas, serie, sessoes, fotos, perfil });
  const feitas = lista.filter((c) => c.ok).length;

  return (
    <View>
      <View style={s.duplo}>
        <Cartao style={s.destaque}>
          <Text style={s.rotulo}>PESO ATUAL</Text>
          <Text style={s.grande}>{fmt(r.atual.peso)}<Text style={s.unidade}> kg</Text></Text>
        </Cartao>
        <Cartao style={s.destaque}>
          <Text style={s.rotulo}>DESDE O INÍCIO</Text>
          <Text style={[s.grande, { color: cor(sPeso) }]}>{sinal(r.deltaKg)}<Text style={s.unidade}> kg</Text></Text>
          <Text style={[s.pct, { color: cor(sPeso) }]}>{sinal(r.deltaPct)}%</Text>
        </Cartao>
      </View>

      {r.registros < 2 && (
        <Cartao style={s.dica}>
          <Text style={s.dicaTxt}>Registre suas medidas toda semana para ver gráficos e percentuais de evolução.</Text>
          <Botao texto="Registrar agora" icone="add-circle-outline" onPress={irParaMedidas} style={{ marginTop: 10 }} />
        </Cartao>
      )}

      {meta ? (
        <Cartao style={s.meta}>
          <Anel valor={pctMeta} total={100} tamanho={84} espessura={9}>
            <Text style={s.anelTxt}>{Math.round(pctMeta)}%</Text>
          </Anel>
          <View style={{ flex: 1 }}>
            <Text style={s.metaTitulo}>Meta de {fmt(meta)} kg</Text>
            <Text style={s.metaTxt}>
              {pctMeta >= 100 ? 'Meta alcançada! 🏆' : `Faltam ${fmt(Math.abs(r.atual.peso - meta))} kg para chegar lá.`}
            </Text>
          </View>
        </Cartao>
      ) : null}

      {r.gordura ? (
        <View style={s.duplo}>
          <Cartao style={s.destaque}>
            <Text style={s.rotulo}>% DE GORDURA</Text>
            <Text style={s.grande}>{fmt(r.gordura.atual)}<Text style={s.unidade}>%</Text></Text>
            {r.gordura.kgPerdidos != null && (
              <Text style={[s.pct, { color: r.gordura.delta < 0 ? cores.lima : cores.aviso }]}>{sinal(r.gordura.delta)} p.p.</Text>
            )}
          </Cartao>
          <Cartao style={s.destaque}>
            <Text style={s.rotulo}>GORDURA PERDIDA</Text>
            {r.gordura.kgPerdidos != null ? (
              <>
                <Text style={[s.grande, { color: r.gordura.kgPerdidos > 0 ? cores.lima : cores.aviso }]}>
                  {fmt(Math.abs(r.gordura.kgPerdidos))}<Text style={s.unidade}> kg</Text>
                </Text>
                <Text style={s.pct}>{r.gordura.kgPerdidos >= 0 ? 'de gordura a menos' : 'de gordura a mais'}</Text>
              </>
            ) : (
              <Text style={s.dicaTxt}>Registre o % de gordura mais uma vez para calcular.</Text>
            )}
          </Cartao>
        </View>
      ) : (
        <Cartao onPress={irParaMedidas} style={s.cta}>
          <MaterialCommunityIcons name="percent-outline" size={26} color={cores.lima} />
          <View style={{ flex: 1 }}>
            <Text style={s.metaTitulo}>Acompanhe seu % de gordura</Text>
            <Text style={s.metaTxt}>Informe o valor da balança de bioimpedância ou da avaliação física.</Text>
          </View>
        </Cartao>
      )}
      {r.gordura?.magraDelta != null && (
        <Text style={s.magra}>Massa magra: {sinal(r.gordura.magraDelta)} kg desde o início.</Text>
      )}

      <Secao titulo="Gráfico" />
      <View style={s.chips}>
        {[
          { id: 'peso', t: 'Peso' },
          { id: 'gordura', t: '% Gordura' },
          { id: 'cintura', t: 'Cintura' },
        ].map((m) => (
          <Chip key={m.id} texto={m.t} ativo={metrica === m.id} onPress={() => setMetrica(m.id)} />
        ))}
      </View>
      <View style={[s.chips, { marginTop: 8 }]}>
        {[
          { v: 7, t: '7 dias' },
          { v: 30, t: '30 dias' },
          { v: 90, t: '90 dias' },
          { v: 365, t: '1 ano' },
          { v: 0, t: 'Tudo' },
        ].map((p) => (
          <Chip key={p.v} texto={p.t} ativo={periodo === p.v} onPress={() => setPeriodo(p.v)} />
        ))}
      </View>
      <Cartao style={{ marginTop: 12, paddingHorizontal: 8 }}>
        <GraficoLinha pontos={pontos} sufixo={sufixo} />
      </Cartao>

      <Secao titulo="Comparativo de peso" />
      <Cartao style={{ gap: 12 }}>
        {comparativos.map((c) => {
          const ok = c.ref && c.ref.data !== r.atual.data;
          const d = ok ? r.atual.peso - c.ref.peso : 0;
          return (
            <View key={c.dias} style={s.linhaComp}>
              <Text style={s.compRotulo}>{c.rot}</Text>
              <Text style={[s.compValor, ok && { color: cor(sentido(perfil.objetivo, d)) }]}>
                {ok ? `${sinal(d)} kg (${sinal((d / c.ref.peso) * 100)}%)` : 'sem registro'}
              </Text>
            </View>
          );
        })}
        <View style={[s.linhaComp, s.linhaTotal]}>
          <Text style={[s.compRotulo, { color: cores.texto }]}>Desde o início</Text>
          <Text style={[s.compValor, { color: cor(sPeso) }]}>{sinal(r.deltaKg)} kg ({sinal(r.deltaPct)}%)</Text>
        </View>
      </Cartao>

      <Secao titulo="Esta semana no relógio" acaoTexto="Abrir relógio" aoAcao={() => router.push('/relogio')} />
      <Cartao style={s.relogio}>
        <View style={s.relogioItem}>
          <Text style={s.grandeMed}>{Math.round(kcalSemana)}</Text>
          <Text style={s.rotuloMed}>kcal queimadas</Text>
        </View>
        <View style={s.relogioItem}>
          <Text style={s.grandeMed}>{Math.round(gorduraSemana)}<Text style={s.unidade}> g</Text></Text>
          <Text style={s.rotuloMed}>gordura estimada</Text>
        </View>
        <View style={s.relogioItem}>
          <Text style={s.grandeMed}>{sessoesSemana.length}</Text>
          <Text style={s.rotuloMed}>treinos monitorados</Text>
        </View>
      </Cartao>

      <Secao titulo={`Conquistas (${feitas}/${lista.length})`} />
      <View style={s.conquistas}>
        {lista.map((c) => (
          <View key={c.id} style={[s.conquista, c.ok && s.conquistaOk]}>
            <MaterialCommunityIcons name={c.icone} size={26} color={c.ok ? cores.lima : cores.texto3} />
            <Text style={[s.conquistaTxt, c.ok && { color: cores.texto }]}>{c.titulo}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function Evolucao() {
  const { valor: perfil } = usePerfil();
  const { valor: medidas } = useMedidas();
  const [aba, setAba] = useState('resumo');
  if (!perfil) return <Tela />;

  const serie = serieMedidas(medidas, perfil);

  return (
    <Tela titulo="Evolução" subtitulo="Seus resultados, do início até hoje">
      <View style={s.abas}>
        {[
          { id: 'resumo', t: 'Resumo' },
          { id: 'medidas', t: 'Medidas' },
          { id: 'fotos', t: 'Fotos' },
        ].map((a) => (
          <Text key={a.id} onPress={() => setAba(a.id)} accessibilityRole="button" style={[s.aba, aba === a.id && s.abaAtiva]}>
            {a.t}
          </Text>
        ))}
      </View>
      {aba === 'resumo' && <Resumo perfil={perfil} serie={serie} irParaMedidas={() => setAba('medidas')} />}
      {aba === 'medidas' && <Medidas perfil={perfil} serie={serie} medidasSalvas={medidas} />}
      {aba === 'fotos' && <Fotos serie={serie} />}
    </Tela>
  );
}

const s = StyleSheet.create({
  abas: { flexDirection: 'row', backgroundColor: cores.superficie, borderRadius: 16, padding: 4, borderWidth: 1, borderColor: cores.borda, marginBottom: 16 },
  aba: { flex: 1, textAlign: 'center', paddingVertical: 10, borderRadius: 12, color: cores.texto2, fontWeight: '900', fontSize: 13, overflow: 'hidden' },
  abaAtiva: { backgroundColor: cores.lima, color: cores.fundo },
  duplo: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  destaque: { flex: 1, gap: 2 },
  rotulo: { color: cores.texto3, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  grande: { color: cores.texto, fontSize: 30, fontWeight: '900', letterSpacing: -0.8, marginTop: 4 },
  unidade: { color: cores.texto2, fontSize: 14, fontWeight: '700' },
  pct: { color: cores.texto2, fontSize: 12, fontWeight: '800' },
  dica: { marginBottom: 12, borderColor: 'rgba(198,255,61,0.35)' },
  dicaTxt: { color: cores.texto2, fontSize: 13, lineHeight: 19 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  anelTxt: { color: cores.lima, fontSize: 18, fontWeight: '900' },
  metaTitulo: { color: cores.texto, fontSize: 15, fontWeight: '900' },
  metaTxt: { color: cores.texto2, fontSize: 12, marginTop: 3, lineHeight: 17 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  magra: { color: cores.texto2, fontSize: 12, marginBottom: 4, marginLeft: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  linhaComp: { flexDirection: 'row', justifyContent: 'space-between' },
  linhaTotal: { borderTopWidth: 1, borderTopColor: cores.borda, paddingTop: 12 },
  compRotulo: { color: cores.texto2, fontSize: 13 },
  compValor: { color: cores.texto3, fontSize: 13, fontWeight: '900' },
  relogio: { flexDirection: 'row', justifyContent: 'space-between' },
  relogioItem: { flex: 1, alignItems: 'center', gap: 4 },
  grandeMed: { color: cores.lima, fontSize: 24, fontWeight: '900' },
  rotuloMed: { color: cores.texto2, fontSize: 11, textAlign: 'center' },
  conquistas: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  conquista: { width: '31%', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 6, borderRadius: 16, backgroundColor: cores.superficie, borderWidth: 1, borderColor: cores.borda, opacity: 0.6 },
  conquistaOk: { opacity: 1, borderColor: 'rgba(198,255,61,0.45)', backgroundColor: 'rgba(198,255,61,0.06)' },
  conquistaTxt: { color: cores.texto3, fontSize: 11, fontWeight: '800', textAlign: 'center' },
});
