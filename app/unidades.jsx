import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Botao, Cartao, Chip, IconeTile, Secao, Selo, Tela } from '@/components/fit';
import { cores } from '@/constants/tema';
import { PARCEIROS, UNIDADES, mapaUrl } from '@/data/unidades';
import { salvarPerfil, usePerfil } from '@/services/perfil';

const CIDADES = ['Todas', ...Array.from(new Set(UNIDADES.map((u) => u.cidade)))];

export default function Unidades() {
  const { valor: perfil } = usePerfil();
  const [cidade, setCidade] = useState('Todas');
  if (!perfil) return <Tela />;

  const lista = UNIDADES.filter((u) => cidade === 'Todas' || u.cidade === cidade);

  return (
    <Tela titulo="Unidades" subtitulo="Escolha onde você quer treinar" voltar>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginBottom: 16 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {CIDADES.map((c) => (
          <Chip key={c} texto={c} ativo={cidade === c} onPress={() => setCidade(c)} />
        ))}
      </ScrollView>

      {lista.map((u) => {
        const minha = perfil.unidade === u.id;
        return (
          <Cartao key={u.id} style={[s.unidade, minha && { borderColor: cores.lima }]}>
            <View style={s.topo}>
              <IconeTile nome="map-marker-radius" />
              <View style={{ flex: 1 }}>
                <Text style={s.nome}>{u.nome}</Text>
                <Text style={s.cidade}>{u.bairro} · {u.cidade}/{u.uf}</Text>
              </View>
              {minha && <Selo texto="Sua unidade" destaque />}
            </View>

            <View style={s.info}>
              <MaterialCommunityIcons name="map-marker-outline" size={17} color={cores.texto3} />
              <Text style={s.infoTxt}>{u.endereco}</Text>
            </View>
            <View style={s.info}>
              <MaterialCommunityIcons name="clock-outline" size={17} color={cores.texto3} />
              <Text style={s.infoTxt}>{u.horario}</Text>
            </View>
            <View style={s.info}>
              <MaterialCommunityIcons name="phone-outline" size={17} color={cores.texto3} />
              <Text style={s.infoTxt}>{u.telefone} · {u.area}</Text>
            </View>

            <View style={s.destaques}>
              {u.destaques.map((d) => (
                <Selo key={d} texto={d} />
              ))}
            </View>

            <View style={s.acoes}>
              <Botao texto="Ver no mapa" icone="location-outline" variante="secundario" onPress={() => Linking.openURL(mapaUrl(u))} style={{ flex: 1 }} />
              <Botao
                texto={minha ? 'Escolhida' : 'Escolher'}
                icone={minha ? 'checkmark' : undefined}
                desativado={minha}
                onPress={() => salvarPerfil({ unidade: u.id })}
                style={{ flex: 1 }}
              />
            </View>
          </Cartao>
        );
      })}

      <Secao titulo="Empresas parceiras" />
      {PARCEIROS.map((p) => (
        <View key={p.id} style={s.parceiro}>
          <IconeTile nome={p.icone} tamanho={44} />
          <View style={{ flex: 1 }}>
            <Text style={s.parceiroNome}>{p.nome}</Text>
            <Text style={s.parceiroTipo}>{p.tipo}</Text>
            <Text style={s.parceiroBeneficio}>{p.beneficio}</Text>
          </View>
        </View>
      ))}
      <Text style={s.nota}>Unidades, endereços e empresas são fictícios, criados para o projeto escolar.</Text>
    </Tela>
  );
}

const s = StyleSheet.create({
  unidade: { marginBottom: 14, gap: 10 },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  nome: { color: cores.texto, fontSize: 16, fontWeight: '900' },
  cidade: { color: cores.texto2, fontSize: 12, marginTop: 2 },
  info: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoTxt: { flex: 1, color: cores.texto2, fontSize: 13, lineHeight: 18 },
  destaques: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  acoes: { flexDirection: 'row', gap: 10, marginTop: 6 },
  parceiro: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, marginBottom: 10,
    backgroundColor: cores.superficie, borderRadius: 18, borderWidth: 1, borderColor: cores.borda,
  },
  parceiroNome: { color: cores.texto, fontSize: 15, fontWeight: '800' },
  parceiroTipo: { color: cores.texto2, fontSize: 12, marginTop: 2 },
  parceiroBeneficio: { color: cores.lima, fontSize: 12, fontWeight: '800', marginTop: 3 },
  nota: { color: cores.texto3, fontSize: 12, textAlign: 'center', marginTop: 6, lineHeight: 18 },
});
