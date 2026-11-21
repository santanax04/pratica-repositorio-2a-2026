import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Chip, IconeTile, Tela, Vazio } from '@/components/fit';
import { CartaoExercicio } from '@/components/fit/cartoes';
import { cores, raio } from '@/constants/tema';
import { EQUIPAMENTOS, TIPOS_EQUIP } from '@/data/equipamentos';
import { EXERCICIOS, GRUPOS } from '@/data/exercicios';
import { alternarFavorito, useFavoritos } from '@/services/favoritos';

const semAcento = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function Exercicios() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { ids } = useFavoritos();
  const [aba, setAba] = useState(params.aba === 'equipamentos' ? 'equipamentos' : 'exercicios');
  const [busca, setBusca] = useState('');
  const [grupo, setGrupo] = useState('Todos');
  const [tipo, setTipo] = useState('Todos');

  const emEquip = aba === 'equipamentos';

  const lista = useMemo(() => {
    const termo = semAcento(busca.trim());
    return EXERCICIOS.filter(
      (ex) =>
        (grupo === 'Todos' || ex.grupo === grupo) &&
        (!termo || semAcento(ex.nome).includes(termo) || semAcento(ex.equipamento).includes(termo))
    );
  }, [busca, grupo]);

  const equipamentos = useMemo(() => {
    const termo = semAcento(busca.trim());
    return EQUIPAMENTOS.filter(
      (eq) => (tipo === 'Todos' || eq.tipo === tipo) && (!termo || semAcento(eq.nome).includes(termo))
    );
  }, [busca, tipo]);

  return (
    <Tela
      titulo={emEquip ? 'Equipamentos' : 'Exercícios'}
      subtitulo={emEquip ? `${EQUIPAMENTOS.length} equipamentos com vídeo e passo a passo` : `${EXERCICIOS.length} exercícios com vídeo-aula`}
      acao={
        <Pressable onPress={() => router.push('/favoritos')} style={s.favBotao} accessibilityLabel="Ver favoritos">
          <Ionicons name="heart" size={20} color={cores.lima} />
        </Pressable>
      }
    >
      <View style={s.abas}>
        {[
          { id: 'exercicios', t: 'Exercícios' },
          { id: 'equipamentos', t: 'Equipamentos' },
        ].map((a) => (
          <Pressable key={a.id} onPress={() => { setAba(a.id); setBusca(''); }} style={[s.aba, aba === a.id && s.abaAtiva]}>
            <Text style={[s.abaTxt, aba === a.id && { color: cores.fundo }]}>{a.t}</Text>
          </Pressable>
        ))}
      </View>

      <View style={s.busca}>
        <Ionicons name="search" size={19} color={cores.texto3} />
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder={emEquip ? 'Buscar equipamento...' : 'Buscar exercício ou equipamento...'}
          placeholderTextColor={cores.texto3}
          style={[s.input, Platform.OS === 'web' && { outlineStyle: 'none' }]}
          autoCorrect={false}
        />
        {!!busca && (
          <Pressable onPress={() => setBusca('')} hitSlop={10} accessibilityLabel="Limpar busca">
            <Ionicons name="close-circle" size={19} color={cores.texto3} />
          </Pressable>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginBottom: 16 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {emEquip
          ? ['Todos', ...TIPOS_EQUIP].map((t) => <Chip key={t} texto={t} ativo={tipo === t} onPress={() => setTipo(t)} />)
          : ['Todos', ...GRUPOS].map((g) => <Chip key={g} texto={g} ativo={grupo === g} onPress={() => setGrupo(g)} />)}
      </ScrollView>

      {emEquip ? (
        equipamentos.length === 0 ? (
          <Vazio icone="magnify" titulo="Nenhum equipamento encontrado" texto="Tente outro nome ou outro tipo." />
        ) : (
          equipamentos.map((eq) => (
            <Pressable
              key={eq.id}
              onPress={() => router.push(`/equipamento/${eq.id}`)}
              accessibilityRole="button"
              style={({ pressed }) => [s.equip, pressed && { opacity: 0.8 }]}
            >
              <IconeTile nome={eq.icone} />
              <View style={{ flex: 1 }}>
                <Text style={s.equipNome}>{eq.nome}</Text>
                <Text style={s.equipMeta} numberOfLines={1}>{eq.tipo} · {eq.musculos}</Text>
                <Text style={s.equipVideo}>▶ Vídeo e passo a passo</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={cores.texto3} />
            </Pressable>
          ))
        )
      ) : lista.length === 0 ? (
        <Vazio icone="magnify" titulo="Nenhum exercício encontrado" texto="Tente outro nome ou outro grupo muscular." />
      ) : (
        lista.map((ex) => (
          <CartaoExercicio
            key={ex.id}
            ex={ex}
            detalhe={`Sugestão: ${ex.sugestao}`}
            favorito={ids.includes(ex.id)}
            aoAbrir={(id) => router.push(`/exercicio/${id}`)}
            aoFavoritar={alternarFavorito}
          />
        ))
      )}
    </Tela>
  );
}

const s = StyleSheet.create({
  favBotao: { width: 42, height: 42, borderRadius: 14, backgroundColor: cores.limaFundo, alignItems: 'center', justifyContent: 'center' },
  abas: { flexDirection: 'row', backgroundColor: cores.superficie, borderRadius: raio.m, padding: 4, borderWidth: 1, borderColor: cores.borda, marginBottom: 14 },
  aba: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12 },
  abaAtiva: { backgroundColor: cores.lima },
  abaTxt: { color: cores.texto2, fontWeight: '900', fontSize: 13 },
  busca: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: cores.superficie, borderRadius: raio.m,
    borderWidth: 1, borderColor: cores.borda, paddingHorizontal: 14, minHeight: 50, marginBottom: 14,
  },
  input: { flex: 1, color: cores.texto, fontSize: 15, paddingVertical: 10 },
  equip: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, marginBottom: 10,
    backgroundColor: cores.superficie, borderRadius: raio.g, borderWidth: 1, borderColor: cores.borda,
  },
  equipNome: { color: cores.texto, fontSize: 15, fontWeight: '800' },
  equipMeta: { color: cores.texto2, fontSize: 12, marginTop: 3 },
  equipVideo: { color: cores.lima, fontSize: 12, fontWeight: '800', marginTop: 4 },
});
