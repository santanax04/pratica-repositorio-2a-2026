import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Barra, Botao, Cartao, Secao, Tela } from '@/components/fit';
import { cores } from '@/constants/tema';
import { treinoPorId } from '@/data/academia';
import { dataISO, desfazerPresencaHoje, diasDaSemana, hojeISO, registrarPresenca, useFrequencia } from '@/services/frequencia';
import { usePerfil } from '@/services/perfil';

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const SEMANA = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

export default function Frequencia() {
  const { valor: perfil } = usePerfil();
  const { valor: presencas } = useFrequencia();
  const agora = new Date();
  const [ano, setAno] = useState(agora.getFullYear());
  const [mes, setMes] = useState(agora.getMonth());

  if (!perfil) return <Tela />;

  const hoje = hojeISO();
  const datas = new Set(presencas.map((p) => p.data));
  const presenteHoje = datas.has(hoje);
  const prefixo = `${ano}-${String(mes + 1).padStart(2, '0')}`;
  const noMes = presencas.filter((p) => p.data.startsWith(prefixo)).length;
  const naSemana = diasDaSemana().filter((d) => datas.has(d)).length;

  const offset = (new Date(ano, mes, 1).getDay() + 6) % 7;
  const total = new Date(ano, mes + 1, 0).getDate();
  const celulas = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];

  function mudarMes(delta) {
    const d = new Date(ano, mes + delta, 1);
    setAno(d.getFullYear());
    setMes(d.getMonth());
  }

  const historico = [...presencas].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 8);
  const formatar = (iso) => iso.split('-').reverse().join('/');

  return (
    <Tela titulo="Frequência" subtitulo="Acompanhe sua presença na academia">
      <Cartao style={s.checkin}>
        <MaterialCommunityIcons
          name={presenteHoje ? 'check-decagram' : 'map-marker-check-outline'}
          size={44}
          color={presenteHoje ? cores.fundo : cores.lima}
        />
        <Text style={[s.checkTitulo, presenteHoje && { color: cores.fundo }]}>
          {presenteHoje ? 'Presença registrada hoje!' : 'Chegou na academia?'}
        </Text>
        <Text style={[s.checkTxt, presenteHoje && { color: 'rgba(11,11,12,0.7)' }]}>
          {presenteHoje ? 'Bom treino! Continue assim. 🔥' : 'Registre sua presença de hoje com um toque.'}
        </Text>
        {presenteHoje ? (
          <Botao texto="Desfazer check-in" variante="escuro" onPress={desfazerPresencaHoje} style={{ marginTop: 14, alignSelf: 'stretch' }} />
        ) : (
          <Botao texto="Fazer check-in" icone="log-in" onPress={() => registrarPresenca()} style={{ marginTop: 14, alignSelf: 'stretch' }} />
        )}
      </Cartao>

      <View style={s.stats}>
        <Cartao style={s.stat}>
          <Text style={s.statNum}>{naSemana}<Text style={s.statDe}>/{perfil.diasSemana}</Text></Text>
          <Text style={s.statTxt}>na semana</Text>
        </Cartao>
        <Cartao style={s.stat}>
          <Text style={s.statNum}>{noMes}</Text>
          <Text style={s.statTxt}>no mês</Text>
        </Cartao>
        <Cartao style={s.stat}>
          <Text style={s.statNum}>{presencas.length}</Text>
          <Text style={s.statTxt}>no total</Text>
        </Cartao>
      </View>
      <View style={{ marginTop: 14 }}>
        <Barra valor={naSemana} total={perfil.diasSemana} />
      </View>

      <Secao titulo="Calendário" />
      <Cartao>
        <View style={s.mesTopo}>
          <Botao texto="" icone="chevron-back" variante="secundario" onPress={() => mudarMes(-1)} style={s.mesBotao} />
          <Text style={s.mesTitulo}>{MESES[mes]} {ano}</Text>
          <Botao texto="" icone="chevron-forward" variante="secundario" onPress={() => mudarMes(1)} style={s.mesBotao} />
        </View>
        <View style={s.grade}>
          {SEMANA.map((l, i) => (
            <View key={`h${i}`} style={s.celula}><Text style={s.cabSemana}>{l}</Text></View>
          ))}
          {celulas.map((dia, i) => {
            if (dia == null) return <View key={`v${i}`} style={s.celula} />;
            const iso = dataISO(new Date(ano, mes, dia));
            const feito = datas.has(iso);
            return (
              <View key={iso} style={s.celula}>
                <View style={[s.dia, feito && s.diaFeito, iso === hoje && !feito && s.diaHoje]}>
                  <Text style={[s.diaTxt, feito && { color: cores.fundo }]}>{dia}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Cartao>

      <Secao titulo="Últimas presenças" />
      {historico.length === 0 ? (
        <Text style={s.vazio}>Nenhuma presença registrada ainda.</Text>
      ) : (
        historico.map((p) => (
          <View key={p.data} style={s.hist}>
            <MaterialCommunityIcons name="check-circle" size={20} color={cores.lima} />
            <Text style={s.histData}>{formatar(p.data)}</Text>
            <Text style={s.histTreino} numberOfLines={1}>
              {p.treino ? treinoPorId(p.treino)?.nome ?? 'Treino' : 'Check-in'}
            </Text>
          </View>
        ))
      )}
    </Tela>
  );
}

const s = StyleSheet.create({
  checkin: { alignItems: 'center', backgroundColor: cores.superficie, gap: 4, paddingVertical: 22 },
  checkTitulo: { color: cores.texto, fontSize: 19, fontWeight: '900', marginTop: 6 },
  checkTxt: { color: cores.texto2, fontSize: 13, textAlign: 'center' },
  stats: { flexDirection: 'row', gap: 10, marginTop: 14 },
  stat: { flex: 1, alignItems: 'center', padding: 14 },
  statNum: { color: cores.lima, fontSize: 26, fontWeight: '900' },
  statDe: { color: cores.texto3, fontSize: 15 },
  statTxt: { color: cores.texto2, fontSize: 11, marginTop: 2, fontWeight: '700' },
  mesTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  mesBotao: { width: 40, height: 40, paddingVertical: 0, paddingHorizontal: 0 },
  mesTitulo: { color: cores.texto, fontSize: 16, fontWeight: '900' },
  grade: { flexDirection: 'row', flexWrap: 'wrap' },
  celula: { width: '14.2857%', alignItems: 'center', paddingVertical: 3 },
  cabSemana: { color: cores.texto3, fontSize: 11, fontWeight: '800', marginBottom: 4 },
  dia: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  diaFeito: { backgroundColor: cores.lima },
  diaHoje: { borderWidth: 2, borderColor: cores.lima },
  diaTxt: { color: cores.texto2, fontSize: 13, fontWeight: '700' },
  vazio: { color: cores.texto3, fontSize: 13 },
  hist: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cores.superficie, borderRadius: 14,
    borderWidth: 1, borderColor: cores.borda, padding: 14, marginBottom: 8,
  },
  histData: { color: cores.texto, fontWeight: '800', fontSize: 14 },
  histTreino: { flex: 1, color: cores.texto2, fontSize: 13, textAlign: 'right' },
});
