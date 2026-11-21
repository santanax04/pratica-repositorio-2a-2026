import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar, Botao, Cartao, Chip, Secao, Selo, Tela, Vazio } from '@/components/fit';
import { cores } from '@/constants/tema';
import { FORMAS_PAGAMENTO, dinheiro, resumoPagamento } from '@/data/pagamentos';
import { DIAS_SEMANA, PACOTES, personalPorId } from '@/data/personais';
import { unidadePorId } from '@/data/unidades';
import { hojeISO } from '@/services/frequencia';
import { contratarPersonal } from '@/services/personais';

export default function DetalhePersonal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const personal = personalPorId(String(id));

  const [pacoteId, setPacoteId] = useState('p4');
  const [dias, setDias] = useState([]);
  const [horario, setHorario] = useState('');
  const [forma, setForma] = useState('pix');
  const [erro, setErro] = useState('');
  const [feito, setFeito] = useState(false);

  if (!personal) {
    return (
      <Tela voltar titulo="Personal">
        <Vazio icone="alert-circle-outline" titulo="Personal não encontrado" />
      </Tela>
    );
  }

  const pacote = PACOTES.find((p) => p.id === pacoteId);
  const bruto = personal.preco * pacote.aulas * (1 - pacote.desconto);
  const resumo = resumoPagamento(bruto, forma, pacote.maxParcelas);
  const unidade = unidadePorId(personal.unidade);

  const alternarDia = (n) => setDias((a) => (a.includes(n) ? a.filter((x) => x !== n) : [...a, n].sort()));

  async function confirmar() {
    if (dias.length === 0) return setErro('Escolha pelo menos um dia da semana.');
    if (!horario) return setErro('Escolha um horário.');
    setErro('');
    await contratarPersonal({
      id: String(Date.now()),
      personal: personal.id,
      pacote: pacote.id,
      dias,
      horario,
      forma,
      total: resumo.total,
      data: hojeISO(),
    });
    setFeito(true);
  }

  if (feito) {
    return (
      <Tela titulo="Contratado!" voltar>
        <Cartao style={s.sucesso}>
          <MaterialCommunityIcons name="check-decagram" size={56} color={cores.lima} />
          <Text style={s.sucessoTitulo}>{personal.nome}</Text>
          <Text style={s.sucessoTxt}>
            {pacote.nome} · {dias.map((n) => DIAS_SEMANA.find((d) => d.n === n).curto).join(', ')} às {horario}
          </Text>
          <Text style={s.sucessoTxt}>Válido por {pacote.validade} dias · {dinheiro(resumo.total)}</Text>
          <Text style={s.aviso}>Simulação do projeto escolar: nenhuma cobrança real foi feita.</Text>
        </Cartao>
        <Botao texto="Ver meus personais" icone="people" onPress={() => router.replace('/personais?aba=meus')} style={{ marginTop: 16 }} />
      </Tela>
    );
  }

  return (
    <Tela titulo={personal.nome} voltar>
      <View style={s.cabeca}>
        <Avatar nome={personal.nome} tamanho={84} />
        <View style={s.selos}>
          {personal.especialidades.map((e) => (
            <Selo key={e} texto={e} destaque />
          ))}
          <Selo texto={`${personal.anos} anos`} />
          <Selo texto={`★ ${personal.nota.toFixed(1).replace('.', ',')}`} />
        </View>
        <Text style={s.bio}>{personal.bio}</Text>
        {unidade && <Text style={s.unidade}>📍 Atende na {unidade.nome} · {unidade.cidade}/{unidade.uf}</Text>}
      </View>

      <Secao titulo="Escolha o pacote" />
      <View style={s.grade}>
        {PACOTES.map((p) => (
          <Chip key={p.id} texto={`${p.nome}${p.desconto ? ` -${Math.round(p.desconto * 100)}%` : ''}`} ativo={pacoteId === p.id} onPress={() => setPacoteId(p.id)} />
        ))}
      </View>
      <Text style={s.dica}>Pacote válido por {pacote.validade} dias · {dinheiro(personal.preco)} por aula</Text>

      <Secao titulo="Dias da semana" />
      <View style={s.grade}>
        {DIAS_SEMANA.filter((d) => personal.dias.includes(d.n)).map((d) => (
          <Chip key={d.n} texto={`${d.curto} (${d.ordinal})`} ativo={dias.includes(d.n)} onPress={() => alternarDia(d.n)} />
        ))}
      </View>

      <Secao titulo="Horário" />
      <View style={s.grade}>
        {personal.horarios.map((h) => (
          <Chip key={h} texto={h} ativo={horario === h} onPress={() => setHorario(h)} icone="clock-outline" />
        ))}
      </View>

      <Secao titulo="Forma de pagamento" />
      <View style={s.grade}>
        {FORMAS_PAGAMENTO.map((f) => (
          <Chip key={f.id} texto={f.nome} ativo={forma === f.id} onPress={() => setForma(f.id)} icone={f.icone} />
        ))}
      </View>

      <Cartao style={s.resumo}>
        <View style={s.linha}><Text style={s.rotulo}>{pacote.aulas} aula(s) × {dinheiro(personal.preco)}</Text><Text style={s.valor}>{dinheiro(personal.preco * pacote.aulas)}</Text></View>
        {pacote.desconto > 0 && (
          <View style={s.linha}><Text style={s.rotulo}>Desconto do pacote</Text><Text style={[s.valor, { color: cores.lima }]}>- {dinheiro(personal.preco * pacote.aulas * pacote.desconto)}</Text></View>
        )}
        {resumo.desconto > 0 && (
          <View style={s.linha}><Text style={s.rotulo}>Desconto Pix</Text><Text style={[s.valor, { color: cores.lima }]}>- {dinheiro(resumo.desconto)}</Text></View>
        )}
        <View style={[s.linha, s.linhaTotal]}>
          <Text style={s.totalRotulo}>Total</Text>
          <Text style={s.totalValor}>{dinheiro(resumo.total)}</Text>
        </View>
        {resumo.parcelas > 1 && <Text style={s.parcela}>ou {resumo.parcelas}x de {dinheiro(resumo.valorParcela)} sem juros</Text>}
      </Cartao>

      {!!erro && <Text style={s.erro}>{erro}</Text>}
      <Botao texto="Contratar personal" icone="checkmark-circle" onPress={confirmar} style={{ marginTop: 16 }} />
    </Tela>
  );
}

const s = StyleSheet.create({
  cabeca: { alignItems: 'center', gap: 12, marginTop: 4 },
  selos: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  bio: { color: cores.texto2, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  unidade: { color: cores.texto, fontSize: 13, fontWeight: '700' },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dica: { color: cores.texto3, fontSize: 12, marginTop: 10 },
  resumo: { marginTop: 22, gap: 10 },
  linha: { flexDirection: 'row', justifyContent: 'space-between' },
  rotulo: { color: cores.texto2, fontSize: 13 },
  valor: { color: cores.texto, fontSize: 13, fontWeight: '800' },
  linhaTotal: { borderTopWidth: 1, borderTopColor: cores.borda, paddingTop: 12 },
  totalRotulo: { color: cores.texto, fontSize: 16, fontWeight: '900' },
  totalValor: { color: cores.lima, fontSize: 22, fontWeight: '900' },
  parcela: { color: cores.texto2, fontSize: 12, textAlign: 'right' },
  erro: { color: cores.erro, fontSize: 13, fontWeight: '700', marginTop: 12, textAlign: 'center' },
  sucesso: { alignItems: 'center', gap: 8, paddingVertical: 28, borderColor: 'rgba(198,255,61,0.4)' },
  sucessoTitulo: { color: cores.texto, fontSize: 21, fontWeight: '900', marginTop: 6 },
  sucessoTxt: { color: cores.texto2, fontSize: 14, textAlign: 'center' },
  aviso: { color: cores.texto3, fontSize: 12, textAlign: 'center', marginTop: 6 },
});
