import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Botao, Cartao, Secao, Tela } from '@/components/fit';
import { cores } from '@/constants/tema';
import { OBJETIVOS, PLANOS, dinheiro, objetivoPorId } from '@/data/academia';
import { formaPorId } from '@/data/pagamentos';
import { unidadePorId } from '@/data/unidades';
import { limparContratos, useContratos } from '@/services/personais';
import { limparFotos } from '@/services/fotos';
import { limparMedidas } from '@/services/medidas';
import { limparSessoes } from '@/services/sessoes';
import { limparFavoritos, useFavoritos } from '@/services/favoritos';
import { limparFrequencia, useFrequencia } from '@/services/frequencia';
import { apagarPerfil, calcularImc, classificarImc, usePerfil } from '@/services/perfil';

export default function Perfil() {
  const router = useRouter();
  const { valor: perfil } = usePerfil();
  const { ids } = useFavoritos();
  const { valor: presencas } = useFrequencia();
  const { valor: contratos } = useContratos();
  const [confirmar, setConfirmar] = useState(false);

  if (!perfil) return <Tela />;

  const objetivo = objetivoPorId(perfil.objetivo) ?? OBJETIVOS[0];
  const plano = PLANOS.find((p) => p.id === perfil.plano);
  const unidade = unidadePorId(perfil.unidade);
  const imc = calcularImc(perfil.peso, perfil.altura);

  async function apagarTudo() {
    await Promise.all([apagarPerfil(), limparFavoritos(), limparFrequencia(), limparContratos(), limparMedidas(), limparFotos(), limparSessoes()]);
    router.replace('/cadastro');
  }

  const dados = [
    { r: 'Idade', v: `${perfil.idade} anos` },
    { r: 'Peso', v: `${String(perfil.peso).replace('.', ',')} kg` },
    { r: 'Altura', v: `${perfil.altura} cm` },
  ];

  return (
    <Tela titulo="Perfil">
      <View style={s.cabeca}>
        <View style={s.avatar}>
          <Text style={s.avatarTxt}>{perfil.nome.trim()[0]?.toUpperCase()}</Text>
        </View>
        <Text style={s.nome}>{perfil.nome}</Text>
        <View style={s.objetivo}>
          <MaterialCommunityIcons name={objetivo.icone} size={16} color={cores.lima} />
          <Text style={s.objetivoTxt}>{objetivo.nome} · {perfil.nivel}</Text>
        </View>
      </View>

      <View style={s.dados}>
        {dados.map((d) => (
          <Cartao key={d.r} style={s.dado}>
            <Text style={s.dadoValor}>{d.v}</Text>
            <Text style={s.dadoRotulo}>{d.r}</Text>
          </Cartao>
        ))}
      </View>

      {imc != null && (
        <Cartao style={s.imc}>
          <View>
            <Text style={s.dadoRotulo}>IMC (referência geral)</Text>
            <Text style={s.imcValor}>{imc.toFixed(1).replace('.', ',')}</Text>
          </View>
          <Text style={s.imcClasse}>{classificarImc(imc)}</Text>
        </Cartao>
      )}

      <Secao titulo="Minha academia" />
      <Cartao onPress={() => router.push('/planos')} style={s.linha}>
        <MaterialCommunityIcons name="card-account-details-outline" size={24} color={cores.lima} />
        <View style={{ flex: 1 }}>
          <Text style={s.linhaTitulo}>{plano ? `Plano ${plano.nome}` : 'Nenhum plano ativo'}</Text>
          <Text style={s.linhaSub}>{plano ? `${dinheiro(plano.porMes)} por mês · ${plano.dias} dias${perfil.pagamento ? ` · ${formaPorId(perfil.pagamento)?.nome}` : ''}` : 'Toque para escolher'}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={cores.texto3} />
      </Cartao>
      <Cartao onPress={() => router.push('/unidades')} style={[s.linha, { marginTop: 10 }]}>
        <MaterialCommunityIcons name="map-marker-radius-outline" size={24} color={cores.lima} />
        <View style={{ flex: 1 }}>
          <Text style={s.linhaTitulo}>{unidade ? unidade.nome : 'Escolher unidade'}</Text>
          <Text style={s.linhaSub}>{unidade ? `${unidade.endereco} · ${unidade.cidade}/${unidade.uf}` : 'Veja onde treinar'}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={cores.texto3} />
      </Cartao>
      <Cartao onPress={() => router.push('/personais?aba=meus')} style={[s.linha, { marginTop: 10 }]}>
        <MaterialCommunityIcons name="account-tie-outline" size={24} color={cores.lima} />
        <View style={{ flex: 1 }}>
          <Text style={s.linhaTitulo}>Personal trainers</Text>
          <Text style={s.linhaSub}>{contratos.length ? `${contratos.length} contratação(ões)` : 'Contrate um acompanhamento individual'}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={cores.texto3} />
      </Cartao>
      <Cartao onPress={() => router.push('/favoritos')} style={[s.linha, { marginTop: 10 }]}>
        <MaterialCommunityIcons name="heart-outline" size={24} color={cores.lima} />
        <View style={{ flex: 1 }}>
          <Text style={s.linhaTitulo}>Exercícios favoritos</Text>
          <Text style={s.linhaSub}>{ids.length} salvo(s)</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={cores.texto3} />
      </Cartao>
      <Cartao onPress={() => router.push('/frequencia')} style={[s.linha, { marginTop: 10 }]}>
        <MaterialCommunityIcons name="calendar-check" size={24} color={cores.lima} />
        <View style={{ flex: 1 }}>
          <Text style={s.linhaTitulo}>Frequência</Text>
          <Text style={s.linhaSub}>{presencas.length} presença(s) registrada(s)</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={cores.texto3} />
      </Cartao>

      <Botao texto="Editar cadastro" icone="create-outline" onPress={() => router.push('/cadastro')} style={{ marginTop: 22 }} />
      {confirmar ? (
        <View style={{ marginTop: 12, gap: 10 }}>
          <Text style={s.aviso}>Isso apaga seu cadastro, medidas, fotos, favoritos e frequência deste aparelho. Tem certeza?</Text>
          <Botao texto="Sim, apagar tudo" icone="trash-outline" variante="perigo" onPress={apagarTudo} />
          <Botao texto="Cancelar" variante="secundario" onPress={() => setConfirmar(false)} />
        </View>
      ) : (
        <Botao texto="Apagar meus dados" icone="trash-outline" variante="perigo" onPress={() => setConfirmar(true)} style={{ marginTop: 12 }} />
      )}
    </Tela>
  );
}

const s = StyleSheet.create({
  cabeca: { alignItems: 'center', gap: 10, marginTop: 6 },
  avatar: { width: 92, height: 92, borderRadius: 30, backgroundColor: cores.lima, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: cores.fundo, fontSize: 40, fontWeight: '900' },
  nome: { color: cores.texto, fontSize: 24, fontWeight: '900', letterSpacing: -0.4 },
  objetivo: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: cores.limaFundo, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  objetivoTxt: { color: cores.lima, fontSize: 12, fontWeight: '800' },
  dados: { flexDirection: 'row', gap: 10, marginTop: 20 },
  dado: { flex: 1, alignItems: 'center', padding: 14 },
  dadoValor: { color: cores.texto, fontSize: 16, fontWeight: '900' },
  dadoRotulo: { color: cores.texto3, fontSize: 11, fontWeight: '700', marginTop: 3 },
  imc: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  imcValor: { color: cores.lima, fontSize: 26, fontWeight: '900', marginTop: 2 },
  imcClasse: { color: cores.texto, fontWeight: '800', fontSize: 14 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  linhaTitulo: { color: cores.texto, fontSize: 15, fontWeight: '800' },
  linhaSub: { color: cores.texto2, fontSize: 12, marginTop: 2 },
  aviso: { color: cores.texto2, fontSize: 13, textAlign: 'center', lineHeight: 19 },
});
