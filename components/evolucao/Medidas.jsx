import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Botao, Campo, Cartao, Secao } from '@/components/fit';
import { cores } from '@/constants/tema';
import { fmt, formatarData } from '@/services/evolucao';
import { hojeISO } from '@/services/frequencia';
import { adicionarMedida, removerMedida } from '@/services/medidas';
import { salvarPerfil } from '@/services/perfil';

const num = (v) => Number(String(v).replace(',', '.'));
const vazio = (v) => String(v).trim() === '';

export function Medidas({ perfil, serie, medidasSalvas }) {
  const ultima = serie[serie.length - 1];
  const [peso, setPeso] = useState(ultima ? String(ultima.peso).replace('.', ',') : '');
  const [gordura, setGordura] = useState('');
  const [cintura, setCintura] = useState('');
  const [meta, setMeta] = useState(perfil.metaPeso ? String(perfil.metaPeso).replace('.', ',') : '');
  const [erros, setErros] = useState({});
  const [aviso, setAviso] = useState('');

  async function salvar() {
    const novo = {};
    const p = num(peso);
    if (!p || p < 25 || p > 300) novo.peso = 'Informe um peso entre 25 e 300 kg.';
    if (!vazio(gordura) && !(num(gordura) >= 3 && num(gordura) <= 60)) novo.gordura = 'Informe entre 3% e 60%.';
    if (!vazio(cintura) && !(num(cintura) >= 40 && num(cintura) <= 200)) novo.cintura = 'Informe entre 40 e 200 cm.';
    if (!vazio(meta) && !(num(meta) >= 25 && num(meta) <= 300)) novo.meta = 'Informe entre 25 e 300 kg.';
    setErros(novo);
    setAviso('');
    if (Object.keys(novo).length) return;

    const hoje = hojeISO();
    // Antes do primeiro registro, guarda o peso do cadastro como ponto inicial.
    if (medidasSalvas.length === 0 && perfil.peso && (perfil.criadoEm || hoje) !== hoje) {
      await adicionarMedida({ id: 'inicial', data: perfil.criadoEm, peso: perfil.peso, gordura: null, cintura: null });
    }
    await adicionarMedida({
      id: hoje,
      data: hoje,
      peso: p,
      gordura: vazio(gordura) ? null : num(gordura),
      cintura: vazio(cintura) ? null : num(cintura),
    });
    await salvarPerfil({ peso: p, metaPeso: vazio(meta) ? null : num(meta) });
    setGordura('');
    setCintura('');
    setAviso('Medidas de hoje salvas! 💪');
  }

  return (
    <View>
      <Cartao style={{ marginTop: 4 }}>
        <Text style={s.titulo}>Registrar medidas de hoje</Text>
        <Text style={s.sub}>Pese-se sempre no mesmo horário para comparar melhor.</Text>
        <View style={{ height: 14 }} />
        <Campo rotulo="Peso" valor={peso} onChange={setPeso} teclado="decimal-pad" sufixo="kg" placeholder="Ex.: 68,5" erro={erros.peso} maxLength={6} />
        <Campo rotulo="% de gordura (opcional)" valor={gordura} onChange={setGordura} teclado="decimal-pad" sufixo="%" placeholder="Bioimpedância ou avaliação física" erro={erros.gordura} maxLength={5} />
        <Campo rotulo="Cintura (opcional)" valor={cintura} onChange={setCintura} teclado="decimal-pad" sufixo="cm" placeholder="Ex.: 82" erro={erros.cintura} maxLength={5} />
        <Campo rotulo="Meta de peso (opcional)" valor={meta} onChange={setMeta} teclado="decimal-pad" sufixo="kg" placeholder="Ex.: 65" erro={erros.meta} maxLength={6} />
        {!!aviso && <Text style={s.aviso}>{aviso}</Text>}
        <Botao texto="Salvar medidas" icone="save-outline" onPress={salvar} />
      </Cartao>

      <Secao titulo="Histórico" />
      {[...serie].reverse().map((m) => (
        <View key={m.id} style={s.linha}>
          <View style={{ flex: 1 }}>
            <Text style={s.data}>{formatarData(m.data)}</Text>
            <Text style={s.valores}>
              {fmt(m.peso)} kg
              {m.gordura != null ? `  ·  ${fmt(m.gordura)}% gordura` : ''}
              {m.cintura != null ? `  ·  cintura ${fmt(m.cintura)} cm` : ''}
            </Text>
          </View>
          {medidasSalvas.length > 0 && (
            <Text onPress={() => removerMedida(m.id)} accessibilityRole="button" accessibilityLabel="Excluir medida" style={s.excluir}>
              <MaterialCommunityIcons name="trash-can-outline" size={20} color={cores.texto3} />
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 17, fontWeight: '900' },
  sub: { color: cores.texto2, fontSize: 12, marginTop: 4 },
  aviso: { color: cores.lima, fontWeight: '800', fontSize: 13, marginBottom: 12 },
  linha: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cores.superficie, borderRadius: 16,
    borderWidth: 1, borderColor: cores.borda, padding: 14, marginBottom: 8,
  },
  data: { color: cores.texto, fontWeight: '900', fontSize: 14 },
  valores: { color: cores.texto2, fontSize: 12, marginTop: 3 },
  excluir: { padding: 6 },
});
