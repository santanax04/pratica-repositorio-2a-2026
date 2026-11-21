import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { cores, raio } from '@/constants/tema';
import { FiguraExercicio } from '@/components/fit/FiguraExercicio';

export function CartaoExercicio({ ex, favorito, aoAbrir, aoFavoritar, detalhe }) {
  return (
    <Pressable
      onPress={() => aoAbrir(ex.id)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${ex.nome}`}
      style={({ pressed }) => [c.linha, pressed && { opacity: 0.8 }]}
    >
      <FiguraExercicio id={ex.id} icone={ex.icone} tamanho={60} />
      <View style={{ flex: 1 }}>
        <Text style={c.nome} numberOfLines={1}>{ex.nome}</Text>
        <Text style={c.meta} numberOfLines={1}>{ex.grupo} · {ex.equipamento}</Text>
        {!!detalhe && <Text style={c.detalhe}>{detalhe}</Text>}
      </View>
      {aoFavoritar ? (
        <Pressable
          onPress={() => aoFavoritar(ex.id)}
          hitSlop={10}
          accessibilityLabel={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          style={c.coracao}
        >
          <Ionicons name={favorito ? 'heart' : 'heart-outline'} size={22} color={favorito ? cores.lima : cores.texto3} />
        </Pressable>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={cores.texto3} />
      )}
    </Pressable>
  );
}

export function CartaoTreino({ treino, dia, destaque, aoAbrir }) {
  return (
    <Pressable
      onPress={() => aoAbrir(treino.id)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir treino ${treino.nome}`}
      style={({ pressed }) => [c.linha, pressed && { opacity: 0.8 }, destaque && { borderColor: 'rgba(198,255,61,0.45)' }]}
    >
      <View style={c.letra}>
        {dia ? (
          <>
            <Text style={c.diaRotulo}>DIA</Text>
            <Text style={c.letraTxt}>{dia}</Text>
          </>
        ) : (
          <MaterialCommunityIcons name="dumbbell" size={24} color={cores.lima} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={c.nome} numberOfLines={1}>{treino.nome}</Text>
        <Text style={c.meta}>{treino.foco} · {treino.itens.length} exercícios · {treino.duracao} min</Text>
        <Text style={[c.detalhe, { color: cores.texto3 }]}>{treino.nivel}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={cores.texto3} />
    </Pressable>
  );
}

const c = StyleSheet.create({
  linha: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, marginBottom: 10,
    backgroundColor: cores.superficie, borderRadius: raio.g, borderWidth: 1, borderColor: cores.borda,
  },
  nome: { color: cores.texto, fontSize: 15, fontWeight: '800' },
  meta: { color: cores.texto2, fontSize: 12, marginTop: 3 },
  detalhe: { color: cores.lima, fontSize: 12, fontWeight: '800', marginTop: 4 },
  coracao: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  letra: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: cores.limaFundo,
    alignItems: 'center', justifyContent: 'center',
  },
  letraTxt: { color: cores.lima, fontSize: 22, fontWeight: '900', lineHeight: 24 },
  diaRotulo: { color: cores.lima, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
});
