import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Botao, Cartao, Selo, Tela, Vazio } from '@/components/fit';
import { FiguraExercicio } from '@/components/fit/FiguraExercicio';
import { VideoAula } from '@/components/fit/video';
import { cores } from '@/constants/tema';
import { exercicioPorId } from '@/data/exercicios';
import { alternarFavorito, useFavoritos } from '@/services/favoritos';

export default function DetalheExercicio() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { ids } = useFavoritos();
  const ex = exercicioPorId(String(id));

  if (!ex) {
    return (
      <Tela voltar titulo="Exercício">
        <Vazio icone="alert-circle-outline" titulo="Exercício não encontrado" />
      </Tela>
    );
  }

  const favorito = ids.includes(ex.id);

  return (
    <Tela voltar titulo={ex.nome}>
      <View style={s.hero}>
        <FiguraExercicio id={ex.id} icone={ex.icone} tamanho={220} animar />
        <Text style={s.legendaFig}>Veja o movimento: início e fim da repetição</Text>
        <View style={s.selos}>
          <Selo texto={ex.grupo} destaque />
          <Selo texto={ex.nivel} />
          <Selo texto={ex.equipamento} />
        </View>
      </View>

      <VideoAula termo={`como fazer ${ex.nome} exercício academia execução correta`} videoId={ex.videoId} titulo="Vídeo: como fazer este exercício" />

      <Cartao style={[s.sugestao, { marginTop: 14 }]}>
        <Text style={s.rotulo}>SUGESTÃO DE SÉRIES</Text>
        <Text style={s.valor}>{ex.sugestao}</Text>
      </Cartao>

      <Text style={s.titulo}>Sobre o exercício</Text>
      <Text style={s.texto}>{ex.descricao}</Text>

      <Text style={s.titulo}>Como fazer com segurança</Text>
      {ex.dicas.map((d, i) => (
        <View key={i} style={s.dica}>
          <View style={s.num}><Text style={s.numTxt}>{i + 1}</Text></View>
          <Text style={s.dicaTxt}>{d}</Text>
        </View>
      ))}

      <Botao
        texto={favorito ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
        icone={favorito ? 'heart-dislike' : 'heart'}
        variante={favorito ? 'secundario' : 'primario'}
        onPress={() => alternarFavorito(ex.id)}
        style={{ marginTop: 22 }}
      />
      <Text style={s.aviso}>
        <Ionicons name="information-circle-outline" size={13} color={cores.texto3} /> Em caso de dúvida, peça ajuda a um instrutor.
      </Text>
    </Tela>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', gap: 12, marginTop: 4, marginBottom: 18 },
  legendaFig: { color: cores.texto3, fontSize: 12, fontWeight: '700' },
  selos: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  sugestao: { alignItems: 'center', paddingVertical: 14 },
  rotulo: { color: cores.texto3, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  valor: { color: cores.lima, fontSize: 28, fontWeight: '900', marginTop: 4 },
  titulo: { color: cores.texto, fontSize: 17, fontWeight: '900', marginTop: 24, marginBottom: 10 },
  texto: { color: cores.texto2, fontSize: 14, lineHeight: 22 },
  dica: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  num: { width: 26, height: 26, borderRadius: 13, backgroundColor: cores.limaFundo, alignItems: 'center', justifyContent: 'center' },
  numTxt: { color: cores.lima, fontWeight: '900', fontSize: 12 },
  dicaTxt: { flex: 1, color: cores.texto, fontSize: 14, lineHeight: 21 },
  aviso: { color: cores.texto3, fontSize: 12, textAlign: 'center', marginTop: 14 },
});
