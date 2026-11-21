import { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Botao, Cartao, Chip, Secao, Vazio } from '@/components/fit';
import { cores } from '@/constants/tema';
import { antesDe, diasEntre, fmt, formatarData, sinal } from '@/services/evolucao';
import { MAX_FOTOS, adicionarFoto, removerFoto, useFotos } from '@/services/fotos';
import { hojeISO } from '@/services/frequencia';

const LADOS = [
  { id: 'frente', t: 'Frente' },
  { id: 'lado', t: 'Lado' },
  { id: 'costas', t: 'Costas' },
];

export function Fotos({ serie }) {
  const { valor: fotos } = useFotos();
  const [lado, setLado] = useState('frente');
  const [filtro, setFiltro] = useState('todas');
  const [mensagem, setMensagem] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [aId, setAId] = useState(null);
  const [bId, setBId] = useState(null);

  const lista = fotos
    .filter((f) => filtro === 'todas' || f.lado === filtro)
    .sort((a, b) => a.data.localeCompare(b.data) || a.id.localeCompare(b.id));
  const antes = lista.find((f) => f.id === aId) ?? lista[0];
  const depois = lista.find((f) => f.id === bId) ?? lista[lista.length - 1];

  async function adicionar(origem) {
    setMensagem('');
    if (fotos.length >= MAX_FOTOS) {
      setMensagem(`Limite de ${MAX_FOTOS} fotos. Exclua alguma para adicionar outra.`);
      return;
    }
    try {
      setOcupado(true);
      const opcoes = { mediaTypes: ['images'], allowsEditing: true, aspect: [3, 4], quality: 0.8 };
      let res;
      if (origem === 'camera') {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          setMensagem('Permita o acesso à câmera para tirar a foto.');
          return;
        }
        res = await ImagePicker.launchCameraAsync(opcoes);
      } else {
        res = await ImagePicker.launchImageLibraryAsync(opcoes);
      }
      if (res.canceled) return;
      // Reduz a foto para caber no armazenamento do aparelho.
      const out = await ImageManipulator.manipulateAsync(res.assets[0].uri, [{ resize: { width: 600 } }], {
        compress: 0.6,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      });
      const id = String(Date.now());
      await adicionarFoto({ id, data: hojeISO(), lado, uri: `data:image/jpeg;base64,${out.base64}` });
      setAId(null);
      setBId(null);
      setMensagem('Foto adicionada! 📸');
    } catch {
      setMensagem('Não foi possível adicionar a foto. Tente novamente.');
    } finally {
      setOcupado(false);
    }
  }

  const pesoEm = (f) => antesDe(serie, f.data)?.peso;
  const dPeso = antes && depois && pesoEm(antes) != null && pesoEm(depois) != null ? pesoEm(depois) - pesoEm(antes) : null;

  const Miniaturas = ({ selecionada, aoEscolher }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {lista.map((f) => (
        <Pressable key={f.id} onPress={() => aoEscolher(f.id)} style={[s.mini, selecionada?.id === f.id && s.miniAtiva]}>
          <Image source={{ uri: f.uri }} style={s.miniImg} />
          <Text style={s.miniData}>{formatarData(f.data).slice(0, 5)}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  return (
    <View>
      <Cartao style={{ marginTop: 4, gap: 12 }}>
        <Text style={s.titulo}>Nova foto de progresso</Text>
        <Text style={s.sub}>Tire as fotos sempre no mesmo local, luz e posição para comparar melhor.</Text>
        <View style={s.linhaChips}>
          {LADOS.map((l) => (
            <Chip key={l.id} texto={l.t} ativo={lado === l.id} onPress={() => setLado(l.id)} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Botao texto="Galeria" icone="images-outline" variante="secundario" desativado={ocupado} onPress={() => adicionar('galeria')} style={{ flex: 1 }} />
          {Platform.OS !== 'web' && (
            <Botao texto="Câmera" icone="camera-outline" desativado={ocupado} onPress={() => adicionar('camera')} style={{ flex: 1 }} />
          )}
        </View>
        {!!mensagem && <Text style={s.mensagem}>{mensagem}</Text>}
      </Cartao>

      <Secao titulo="Antes e depois" />
      <View style={[s.linhaChips, { marginBottom: 14 }]}>
        {[{ id: 'todas', t: 'Todas' }, ...LADOS].map((l) => (
          <Chip key={l.id} texto={l.t} ativo={filtro === l.id} onPress={() => { setFiltro(l.id); setAId(null); setBId(null); }} />
        ))}
      </View>

      {lista.length < 2 ? (
        <Vazio
          icone="camera-burst"
          titulo={lista.length === 0 ? 'Nenhuma foto ainda' : 'Falta mais uma foto'}
          texto="Adicione pelo menos duas fotos (em dias diferentes) para comparar sua evolução lado a lado."
        />
      ) : (
        <View>
          <View style={s.comparacao}>
            {[
              { rot: 'ANTES', foto: antes },
              { rot: 'DEPOIS', foto: depois },
            ].map(({ rot, foto }) => (
              <View key={rot} style={{ flex: 1 }}>
                <View style={s.moldura}>
                  <Image source={{ uri: foto.uri }} style={s.imagem} resizeMode="cover" />
                  <View style={s.etiqueta}><Text style={s.etiquetaTxt}>{rot}</Text></View>
                </View>
                <Text style={s.dataFoto}>{formatarData(foto.data)}</Text>
                <Text style={s.pesoFoto}>{pesoEm(foto) != null ? `${fmt(pesoEm(foto))} kg` : '—'}</Text>
              </View>
            ))}
          </View>

          <Cartao style={s.resumo}>
            <Text style={s.resumoTitulo}>{diasEntre(antes.data, depois.data)} dias entre as fotos</Text>
            <Text style={s.resumoTxt}>
              {dPeso != null ? `Variação de peso no período: ${sinal(dPeso)} kg` : 'Registre seu peso em "Medidas" para ver a variação no período.'}
            </Text>
          </Cartao>

          <Text style={s.rotulo}>Escolha a foto "antes"</Text>
          <Miniaturas selecionada={antes} aoEscolher={setAId} />
          <Text style={[s.rotulo, { marginTop: 14 }]}>Escolha a foto "depois"</Text>
          <Miniaturas selecionada={depois} aoEscolher={setBId} />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <Botao texto='Excluir "antes"' icone="trash-outline" variante="perigo" onPress={() => { removerFoto(antes.id); setAId(null); }} style={{ flex: 1 }} />
            <Botao texto='Excluir "depois"' icone="trash-outline" variante="perigo" onPress={() => { removerFoto(depois.id); setBId(null); }} style={{ flex: 1 }} />
          </View>
        </View>
      )}
      <Text style={s.nota}>O app compara as fotos lado a lado e junta suas medidas do mesmo período; ele não analisa o corpo automaticamente.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 17, fontWeight: '900' },
  sub: { color: cores.texto2, fontSize: 12, lineHeight: 18 },
  linhaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mensagem: { color: cores.lima, fontWeight: '800', fontSize: 13 },
  comparacao: { flexDirection: 'row', gap: 12 },
  moldura: { aspectRatio: 3 / 4, borderRadius: 18, overflow: 'hidden', backgroundColor: cores.superficie2, borderWidth: 1, borderColor: cores.borda },
  imagem: { width: '100%', height: '100%' },
  etiqueta: { position: 'absolute', top: 10, left: 10, backgroundColor: cores.lima, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  etiquetaTxt: { color: cores.fundo, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  dataFoto: { color: cores.texto, fontWeight: '800', fontSize: 13, marginTop: 8, textAlign: 'center' },
  pesoFoto: { color: cores.lima, fontWeight: '900', fontSize: 15, textAlign: 'center' },
  resumo: { marginVertical: 16, alignItems: 'center', gap: 4, borderColor: 'rgba(198,255,61,0.35)' },
  resumoTitulo: { color: cores.texto, fontWeight: '900', fontSize: 15 },
  resumoTxt: { color: cores.texto2, fontSize: 13, textAlign: 'center' },
  rotulo: { color: cores.texto2, fontSize: 12, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 },
  mini: { width: 58, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden', backgroundColor: cores.superficie },
  miniAtiva: { borderColor: cores.lima },
  miniImg: { width: '100%', aspectRatio: 3 / 4 },
  miniData: { color: cores.texto2, fontSize: 10, fontWeight: '700', textAlign: 'center', paddingVertical: 3 },
  nota: { color: cores.texto3, fontSize: 12, textAlign: 'center', lineHeight: 18, marginTop: 18 },
});
