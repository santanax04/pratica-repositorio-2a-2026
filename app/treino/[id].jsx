import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Barra, Botao, Cartao, Secao, Tela, Vazio } from '@/components/fit';
import { FiguraExercicio } from '@/components/fit/FiguraExercicio';
import { cores, raio } from '@/constants/tema';
import { exerciciosDoTreino, treinoPorId } from '@/data/academia';
import { registrarPresenca } from '@/services/frequencia';

export default function DetalheTreino() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const treino = treinoPorId(String(id));
  const [feitos, setFeitos] = useState([]);
  const [concluido, setConcluido] = useState(false);

  if (!treino) {
    return (
      <Tela voltar titulo="Treino">
        <Vazio icone="alert-circle-outline" titulo="Treino não encontrado" />
      </Tela>
    );
  }

  const itens = exerciciosDoTreino(treino);
  const alternar = (exId) =>
    setFeitos((atual) => (atual.includes(exId) ? atual.filter((x) => x !== exId) : [...atual, exId]));

  async function concluir() {
    await registrarPresenca(treino.id);
    setConcluido(true);
  }

  return (
    <Tela voltar titulo={treino.nome} subtitulo={`${treino.foco} · ${treino.duracao} min · ${treino.nivel}`}>
      <Text style={s.descricao}>{treino.descricao}</Text>

      <Cartao style={{ marginTop: 16 }}>
        <View style={s.linhaEntre}>
          <Text style={s.progTitulo}>Progresso</Text>
          <Text style={s.progNum}>{feitos.length}/{itens.length}</Text>
        </View>
        <View style={{ marginTop: 12 }}>
          <Barra valor={feitos.length} total={itens.length} />
        </View>
      </Cartao>

      <Secao titulo="Exercícios" />
      {itens.map(({ ex, series, reps, descanso }) => {
        const feito = feitos.includes(ex.id);
        return (
          <View key={ex.id} style={[s.item, feito && s.itemFeito]}>
            <Pressable
              onPress={() => alternar(ex.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: feito }}
              accessibilityLabel={`Marcar ${ex.nome} como feito`}
              style={[s.check, feito && s.checkFeito]}
            >
              {feito && <MaterialCommunityIcons name="check" size={18} color={cores.fundo} />}
            </Pressable>
            <Pressable style={{ flex: 1 }} onPress={() => router.push(`/exercicio/${ex.id}`)}>
              <Text style={[s.exNome, feito && { color: cores.texto3, textDecorationLine: 'line-through' }]}>{ex.nome}</Text>
              <Text style={s.exMeta}>
                {series} × {reps}  ·  descanso {descanso}
              </Text>
            </Pressable>
            <FiguraExercicio id={ex.id} icone={ex.icone} tamanho={56} />
          </View>
        );
      })}

      {concluido ? (
        <Cartao style={s.parabens}>
          <MaterialCommunityIcons name="trophy" size={40} color={cores.lima} />
          <Text style={s.parabensTitulo}>Treino concluído! 💪</Text>
          <Text style={s.parabensTxt}>Sua presença de hoje já foi registrada.</Text>
          <Botao texto="Ver frequência" icone="calendar" onPress={() => router.replace('/frequencia')} style={{ marginTop: 12, alignSelf: 'stretch' }} />
        </Cartao>
      ) : (
        <Botao
          texto="Concluir treino e fazer check-in"
          icone="checkmark-done"
          onPress={concluir}
          style={{ marginTop: 18 }}
        />
      )}
    </Tela>
  );
}

const s = StyleSheet.create({
  descricao: { color: cores.texto2, fontSize: 14, lineHeight: 21 },
  linhaEntre: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progTitulo: { color: cores.texto, fontWeight: '800', fontSize: 15 },
  progNum: { color: cores.lima, fontWeight: '900', fontSize: 18 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, marginBottom: 10,
    backgroundColor: cores.superficie, borderRadius: raio.g, borderWidth: 1, borderColor: cores.borda,
  },
  itemFeito: { opacity: 0.7 },
  check: { width: 30, height: 30, borderRadius: 10, borderWidth: 2, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
  checkFeito: { backgroundColor: cores.lima, borderColor: cores.lima },
  exNome: { color: cores.texto, fontSize: 15, fontWeight: '800' },
  exMeta: { color: cores.texto2, fontSize: 12, marginTop: 3 },
  parabens: { alignItems: 'center', gap: 6, marginTop: 18, borderColor: 'rgba(198,255,61,0.4)' },
  parabensTitulo: { color: cores.texto, fontSize: 20, fontWeight: '900', marginTop: 4 },
  parabensTxt: { color: cores.texto2, fontSize: 13 },
});
