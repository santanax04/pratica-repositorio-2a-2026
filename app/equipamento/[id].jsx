import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Cartao, IconeTile, Secao, Selo, Tela, Vazio } from '@/components/fit';
import { CartaoExercicio } from '@/components/fit/cartoes';
import { VideoAula } from '@/components/fit/video';
import { cores } from '@/constants/tema';
import { equipamentoPorId } from '@/data/equipamentos';
import { exercicioPorId } from '@/data/exercicios';

export default function DetalheEquipamento() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const eq = equipamentoPorId(String(id));

  if (!eq) {
    return (
      <Tela voltar titulo="Equipamento">
        <Vazio icone="alert-circle-outline" titulo="Equipamento não encontrado" />
      </Tela>
    );
  }

  const relacionados = eq.exercicios.map(exercicioPorId).filter(Boolean);

  return (
    <Tela voltar titulo={eq.nome}>
      <View style={s.hero}>
        <IconeTile nome={eq.icone} tamanho={96} />
        <View style={s.selos}>
          <Selo texto={eq.tipo} destaque />
          <Selo texto={eq.musculos} />
        </View>
      </View>

      <VideoAula termo={`como usar ${eq.nome} na academia`} videoId={eq.videoId} titulo="Vídeo: como usar este equipamento" />

      <Text style={s.titulo}>Para que serve</Text>
      <Text style={s.texto}>{eq.descricao}</Text>

      <Text style={s.titulo}>Passo a passo</Text>
      {eq.comoUsar.map((p, i) => (
        <View key={i} style={s.passo}>
          <View style={s.num}><Text style={s.numTxt}>{i + 1}</Text></View>
          <Text style={s.passoTxt}>{p}</Text>
        </View>
      ))}

      <Cartao style={s.seg}>
        <Text style={s.segTitulo}>⚠️ Segurança</Text>
        {eq.seguranca.map((d) => (
          <Text key={d} style={s.segTxt}>• {d}</Text>
        ))}
      </Cartao>

      {relacionados.length > 0 && <Secao titulo="Exercícios neste equipamento" />}
      {relacionados.map((ex) => (
        <CartaoExercicio key={ex.id} ex={ex} aoAbrir={(i) => router.push(`/exercicio/${i}`)} />
      ))}
    </Tela>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', gap: 14, marginTop: 4, marginBottom: 18 },
  selos: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  titulo: { color: cores.texto, fontSize: 17, fontWeight: '900', marginTop: 24, marginBottom: 10 },
  texto: { color: cores.texto2, fontSize: 14, lineHeight: 22 },
  passo: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  num: { width: 26, height: 26, borderRadius: 13, backgroundColor: cores.limaFundo, alignItems: 'center', justifyContent: 'center' },
  numTxt: { color: cores.lima, fontWeight: '900', fontSize: 12 },
  passoTxt: { flex: 1, color: cores.texto, fontSize: 14, lineHeight: 21 },
  seg: { marginTop: 14, gap: 6, borderColor: 'rgba(255,176,32,0.35)' },
  segTitulo: { color: cores.aviso, fontWeight: '900', fontSize: 14, marginBottom: 4 },
  segTxt: { color: cores.texto2, fontSize: 13, lineHeight: 19 },
});
