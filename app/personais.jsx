import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar, Botao, Cartao, Tela, Vazio } from '@/components/fit';
import { cores, raio } from '@/constants/tema';
import { dinheiro, formaPorId } from '@/data/pagamentos';
import { DIAS_SEMANA, PACOTES, PERSONAIS, pacotePorId, personalPorId } from '@/data/personais';
import { unidadePorId } from '@/data/unidades';
import { cancelarContrato, useContratos } from '@/services/personais';

const formatar = (iso) => iso.split('-').reverse().join('/');

export default function Personais() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { valor: contratos } = useContratos();
  const [aba, setAba] = useState(params.aba === 'meus' ? 'meus' : 'todos');

  return (
    <Tela titulo="Personal trainers" subtitulo="Treino individual com acompanhamento" voltar>
      <View style={s.abas}>
        {[
          { id: 'todos', t: 'Contratar' },
          { id: 'meus', t: `Meus personais (${contratos.length})` },
        ].map((a) => (
          <Pressable key={a.id} onPress={() => setAba(a.id)} style={[s.aba, aba === a.id && s.abaAtiva]}>
            <Text style={[s.abaTxt, aba === a.id && { color: cores.fundo }]}>{a.t}</Text>
          </Pressable>
        ))}
      </View>

      {aba === 'todos' ? (
        <>
          <Cartao style={s.pacotes}>
            <Text style={s.pacotesTitulo}>Pacotes de aulas</Text>
            <Text style={s.pacotesTxt}>
              {PACOTES.map((p) => `${p.nome}${p.desconto ? ` (-${Math.round(p.desconto * 100)}%)` : ''}`).join(' · ')}
            </Text>
          </Cartao>
          {PERSONAIS.map((p) => (
            <Pressable key={p.id} onPress={() => router.push(`/personal/${p.id}`)} style={({ pressed }) => [s.card, pressed && { opacity: 0.85 }]}>
              <Avatar nome={p.nome} />
              <View style={{ flex: 1 }}>
                <Text style={s.nome}>{p.nome}</Text>
                <Text style={s.meta}>{p.especialidades.join(' · ')}</Text>
                <Text style={s.meta}>{unidadePorId(p.unidade)?.nome} · {p.anos} anos de experiência</Text>
                <View style={s.rodape}>
                  <MaterialCommunityIcons name="star" size={15} color={cores.lima} />
                  <Text style={s.nota}>{p.nota.toFixed(1).replace('.', ',')}</Text>
                  <Text style={s.preco}>{dinheiro(p.preco)}/aula</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={cores.texto3} />
            </Pressable>
          ))}
        </>
      ) : contratos.length === 0 ? (
        <Vazio icone="account-tie-outline" titulo="Você ainda não contratou um personal" texto="Escolha um profissional, os dias e o horário que preferir.">
          <Botao texto="Ver personais" icone="search" onPress={() => setAba('todos')} style={{ marginTop: 10 }} />
        </Vazio>
      ) : (
        [...contratos].reverse().map((c) => {
          const p = personalPorId(c.personal);
          const pac = pacotePorId(c.pacote);
          if (!p || !pac) return null;
          return (
            <Cartao key={c.id} style={{ marginBottom: 12, gap: 10 }}>
              <View style={s.linha}>
                <Avatar nome={p.nome} tamanho={46} />
                <View style={{ flex: 1 }}>
                  <Text style={s.nome}>{p.nome}</Text>
                  <Text style={s.meta}>{pac.nome} · válido por {pac.validade} dias</Text>
                </View>
              </View>
              <Text style={s.detalhe}>
                📅 {c.dias.map((n) => DIAS_SEMANA.find((d) => d.n === n)?.curto).join(', ')} às {c.horario}
              </Text>
              <Text style={s.detalhe}>
                💳 {dinheiro(c.total)} via {formaPorId(c.forma)?.nome} · contratado em {formatar(c.data)}
              </Text>
              <Botao texto="Cancelar contratação" icone="close-circle-outline" variante="perigo" onPress={() => cancelarContrato(c.id)} />
            </Cartao>
          );
        })
      )}
    </Tela>
  );
}

const s = StyleSheet.create({
  abas: { flexDirection: 'row', backgroundColor: cores.superficie, borderRadius: raio.m, padding: 4, borderWidth: 1, borderColor: cores.borda, marginBottom: 16 },
  aba: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12 },
  abaAtiva: { backgroundColor: cores.lima },
  abaTxt: { color: cores.texto2, fontWeight: '900', fontSize: 13 },
  pacotes: { marginBottom: 14, gap: 6, borderColor: 'rgba(198,255,61,0.35)' },
  pacotesTitulo: { color: cores.lima, fontWeight: '900', fontSize: 13 },
  pacotesTxt: { color: cores.texto2, fontSize: 12, lineHeight: 18 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, marginBottom: 12,
    backgroundColor: cores.superficie, borderRadius: raio.g, borderWidth: 1, borderColor: cores.borda,
  },
  nome: { color: cores.texto, fontSize: 16, fontWeight: '900' },
  meta: { color: cores.texto2, fontSize: 12, marginTop: 3 },
  rodape: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  nota: { color: cores.texto, fontSize: 13, fontWeight: '800' },
  preco: { color: cores.lima, fontSize: 13, fontWeight: '900', marginLeft: 'auto' },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detalhe: { color: cores.texto2, fontSize: 13, lineHeight: 19 },
});
