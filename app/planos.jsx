import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Botao, Cartao, Secao, Selo, Tela } from '@/components/fit';
import { cores, raio } from '@/constants/tema';
import { PLANOS, dinheiro } from '@/data/academia';
import { FORMAS_PAGAMENTO, formaPorId, resumoPagamento } from '@/data/pagamentos';
import { hojeISO } from '@/services/frequencia';
import { salvarPerfil, usePerfil } from '@/services/perfil';

export default function Planos() {
  const router = useRouter();
  const { valor: perfil } = usePerfil();
  const [selecionado, setSelecionado] = useState(null);
  const [forma, setForma] = useState('pix');
  const [concluido, setConcluido] = useState(false);

  if (!perfil) return <Tela />;

  const plano = PLANOS.find((p) => p.id === selecionado);
  const resumo = plano ? resumoPagamento(plano.total, forma, plano.maxParcelas) : null;

  async function confirmar() {
    await salvarPerfil({ plano: plano.id, pagamento: forma, planoDesde: hojeISO() });
    setConcluido(true);
  }

  // ─── Etapa 3: contratação concluída ───
  if (concluido && plano) {
    return (
      <Tela titulo="Tudo certo!" voltar>
        <Cartao style={s.sucesso}>
          <MaterialCommunityIcons name="check-decagram" size={56} color={cores.lima} />
          <Text style={s.sucessoTitulo}>Plano {plano.nome} ativado</Text>
          <Text style={s.sucessoTxt}>
            Válido por {plano.dias} dias · pagamento via {formaPorId(forma).nome}.
          </Text>
          <Text style={s.nota}>Simulação do projeto escolar: nenhuma cobrança real foi feita.</Text>
        </Cartao>
        <Botao texto="Voltar ao perfil" icone="person" onPress={() => router.replace('/perfil')} style={{ marginTop: 16 }} />
      </Tela>
    );
  }

  // ─── Etapa 2: forma de pagamento ───
  if (plano) {
    return (
      <Tela titulo="Pagamento" subtitulo={`Plano ${plano.nome} · ${plano.dias} dias`} voltar>
        <Cartao style={s.resumoPlano}>
          <View style={{ flex: 1 }}>
            <Text style={s.nome}>{plano.nome}</Text>
            <Text style={s.total}>{plano.dias} dias de acesso</Text>
          </View>
          <Text style={s.precoMedio}>{dinheiro(plano.total)}</Text>
        </Cartao>

        <Secao titulo="Forma de pagamento" />
        {FORMAS_PAGAMENTO.map((f) => {
          const ativo = forma === f.id;
          return (
            <Pressable key={f.id} onPress={() => setForma(f.id)} style={[s.forma, ativo && s.formaAtiva]} accessibilityRole="radio" accessibilityState={{ selected: ativo }}>
              <MaterialCommunityIcons name={f.icone} size={26} color={ativo ? cores.lima : cores.texto2} />
              <View style={{ flex: 1 }}>
                <Text style={s.formaNome}>{f.nome}</Text>
                <Text style={s.formaDesc}>
                  {f.parcelavel && plano.maxParcelas > 1 ? `Até ${plano.maxParcelas}x sem juros` : f.descricao}
                </Text>
              </View>
              <MaterialCommunityIcons name={ativo ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={ativo ? cores.lima : cores.texto3} />
            </Pressable>
          );
        })}

        <Cartao style={s.resumo}>
          <View style={s.linha}><Text style={s.rotulo}>Plano {plano.nome}</Text><Text style={s.valor}>{dinheiro(plano.total)}</Text></View>
          {resumo.desconto > 0 && (
            <View style={s.linha}><Text style={s.rotulo}>Desconto {resumo.forma.nome}</Text><Text style={[s.valor, { color: cores.lima }]}>- {dinheiro(resumo.desconto)}</Text></View>
          )}
          <View style={[s.linha, s.linhaTotal]}>
            <Text style={s.totalRotulo}>Total</Text>
            <Text style={s.totalValor}>{dinheiro(resumo.total)}</Text>
          </View>
          {resumo.parcelas > 1 && (
            <Text style={s.parcela}>ou {resumo.parcelas}x de {dinheiro(resumo.valorParcela)} sem juros</Text>
          )}
        </Cartao>

        <Botao texto="Confirmar contratação" icone="lock-closed" onPress={confirmar} style={{ marginTop: 16 }} />
        <Botao texto="Trocar plano" variante="secundario" onPress={() => setSelecionado(null)} style={{ marginTop: 10 }} />
        <Text style={[s.nota, { marginTop: 12 }]}>Simulação do projeto escolar: nenhuma cobrança real é feita.</Text>
      </Tela>
    );
  }

  // ─── Etapa 1: escolher o plano ───
  return (
    <Tela titulo="Planos" subtitulo="Escolha o melhor para o seu ritmo" voltar>
      {PLANOS.map((p) => {
        const ativo = perfil.plano === p.id;
        return (
          <View key={p.id} style={[s.plano, p.selo && s.planoDestaque, ativo && s.planoAtivo]}>
            <View style={s.topo}>
              <View>
                <Text style={s.nome}>{p.nome}</Text>
                <Text style={s.dias}>{p.dias} dias</Text>
              </View>
              {ativo ? <Selo texto="Seu plano" destaque /> : p.selo ? <Selo texto={p.selo} destaque /> : null}
            </View>
            <View style={s.precoLinha}>
              <Text style={s.preco}>{dinheiro(p.porMes)}</Text>
              <Text style={s.porMes}> /mês</Text>
            </View>
            <Text style={s.total}>
              {p.id === 'mensal' ? 'Renovação mensal' : `${dinheiro(p.total)} por ${p.periodo}`}
              {p.maxParcelas > 1 ? ` · até ${p.maxParcelas}x sem juros` : ''}
            </Text>
            <View style={{ marginVertical: 14, gap: 9 }}>
              {p.beneficios.map((b) => (
                <View key={b} style={s.beneficio}>
                  <MaterialCommunityIcons name="check-circle" size={18} color={cores.lima} />
                  <Text style={s.beneficioTxt}>{b}</Text>
                </View>
              ))}
            </View>
            <Botao
              texto={ativo ? 'Renovar / trocar pagamento' : 'Escolher este plano'}
              variante={ativo ? 'secundario' : 'primario'}
              onPress={() => setSelecionado(p.id)}
            />
          </View>
        );
      })}

      <Secao titulo="Formas de pagamento" />
      <Cartao style={{ gap: 12 }}>
        {FORMAS_PAGAMENTO.map((f) => (
          <View key={f.id} style={s.formaLinha}>
            <MaterialCommunityIcons name={f.icone} size={22} color={cores.lima} />
            <View style={{ flex: 1 }}>
              <Text style={s.formaNome}>{f.nome}</Text>
              <Text style={s.formaDesc}>{f.descricao}</Text>
            </View>
          </View>
        ))}
      </Cartao>
    </Tela>
  );
}

const s = StyleSheet.create({
  plano: { backgroundColor: cores.superficie, borderRadius: raio.g + 4, padding: 20, borderWidth: 1, borderColor: cores.borda, marginBottom: 14 },
  planoDestaque: { borderColor: 'rgba(198,255,61,0.45)' },
  planoAtivo: { borderColor: cores.lima, backgroundColor: 'rgba(198,255,61,0.06)' },
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nome: { color: cores.texto, fontSize: 20, fontWeight: '900' },
  dias: { color: cores.lima, fontSize: 13, fontWeight: '900', marginTop: 2 },
  precoLinha: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 },
  preco: { color: cores.lima, fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  porMes: { color: cores.texto2, fontSize: 14, marginBottom: 6 },
  total: { color: cores.texto3, fontSize: 12, marginTop: 2 },
  beneficio: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  beneficioTxt: { color: cores.texto, fontSize: 14, flex: 1 },
  nota: { color: cores.texto3, fontSize: 12, textAlign: 'center', lineHeight: 18 },
  resumoPlano: { flexDirection: 'row', alignItems: 'center' },
  precoMedio: { color: cores.lima, fontSize: 22, fontWeight: '900' },
  forma: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, marginBottom: 10,
    backgroundColor: cores.superficie, borderRadius: raio.g, borderWidth: 1, borderColor: cores.borda,
  },
  formaAtiva: { borderColor: cores.lima, backgroundColor: 'rgba(198,255,61,0.06)' },
  formaLinha: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  formaNome: { color: cores.texto, fontSize: 15, fontWeight: '800' },
  formaDesc: { color: cores.texto2, fontSize: 12, marginTop: 2 },
  resumo: { marginTop: 6, gap: 10 },
  linha: { flexDirection: 'row', justifyContent: 'space-between' },
  rotulo: { color: cores.texto2, fontSize: 13 },
  valor: { color: cores.texto, fontSize: 13, fontWeight: '800' },
  linhaTotal: { borderTopWidth: 1, borderTopColor: cores.borda, paddingTop: 12 },
  totalRotulo: { color: cores.texto, fontSize: 16, fontWeight: '900' },
  totalValor: { color: cores.lima, fontSize: 22, fontWeight: '900' },
  parcela: { color: cores.texto2, fontSize: 12, textAlign: 'right' },
  sucesso: { alignItems: 'center', gap: 8, paddingVertical: 28, borderColor: 'rgba(198,255,61,0.4)' },
  sucessoTitulo: { color: cores.texto, fontSize: 21, fontWeight: '900', marginTop: 6 },
  sucessoTxt: { color: cores.texto2, fontSize: 14, textAlign: 'center' },
});
