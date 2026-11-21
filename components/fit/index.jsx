import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { cores, raio } from '@/constants/tema';
import { usePerfil } from '@/services/perfil';
import { introVista } from '@/services/sessao';

// ─── Tela padrão: fundo escuro, rolagem, cabeçalho opcional e trava de cadastro ───
export function Tela({ titulo, subtitulo, voltar = false, acao, exigirCadastro = true, children }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { valor: perfil, carregado } = usePerfil();

  if (!carregado) return <View style={e.base} />;
  // A animação de entrada vem antes de tudo; depois, quem não tem cadastro vai para o cadastro.
  if (exigirCadastro && !introVista()) return <Redirect href="/intro" />;
  if (exigirCadastro && !perfil) return <Redirect href="/cadastro" />;

  const voltarPagina = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View style={[e.base, { paddingTop: insets.top + 6 }]}>
      <ScrollView
        contentContainerStyle={e.conteudo}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {(!!titulo || voltar) && (
          <View style={e.topo}>
            {voltar && (
              <Pressable onPress={voltarPagina} style={e.botaoVoltar} accessibilityLabel="Voltar">
                <Ionicons name="chevron-back" size={22} color={cores.texto} />
              </Pressable>
            )}
            <View style={{ flex: 1 }}>
              {!!titulo && <Text style={e.titulo}>{titulo}</Text>}
              {!!subtitulo && <Text style={e.subtitulo}>{subtitulo}</Text>}
            </View>
            {acao}
          </View>
        )}
        {children}
      </ScrollView>
    </View>
  );
}

export function IconeTile({ nome, tamanho = 52, cor = cores.lima, fundo = cores.limaFundo }) {
  return (
    <View
      style={{
        width: tamanho, height: tamanho, borderRadius: tamanho * 0.3,
        backgroundColor: fundo, alignItems: 'center', justifyContent: 'center',
      }}
    >
      <MaterialCommunityIcons name={nome} size={tamanho * 0.5} color={cor} />
    </View>
  );
}

export function Avatar({ nome, tamanho = 56 }) {
  return (
    <View style={{ width: tamanho, height: tamanho, borderRadius: tamanho * 0.32, backgroundColor: cores.lima, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: cores.fundo, fontWeight: '900', fontSize: tamanho * 0.42 }}>{nome.trim()[0]?.toUpperCase()}</Text>
    </View>
  );
}

export function Cartao({ children, style, onPress }) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [e.cartao, style, pressed && { opacity: 0.8 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[e.cartao, style]}>{children}</View>;
}

export function Chip({ texto, ativo, onPress, icone }) {
  return (
    <Pressable onPress={onPress} style={[e.chip, ativo && e.chipAtivo]} accessibilityRole="button">
      {!!icone && <MaterialCommunityIcons name={icone} size={16} color={ativo ? cores.fundo : cores.texto2} />}
      <Text style={[e.chipTxt, ativo && { color: cores.fundo }]}>{texto}</Text>
    </Pressable>
  );
}

export function Botao({ texto, onPress, icone, variante = 'primario', desativado, style }) {
  const cor = variante === 'primario' ? cores.fundo : variante === 'perigo' ? cores.erro : cores.texto;
  return (
    <Pressable
      onPress={onPress}
      disabled={desativado}
      accessibilityRole="button"
      style={({ pressed }) => [
        e.botao,
        variante === 'primario' && { backgroundColor: cores.lima },
        variante === 'escuro' && { backgroundColor: cores.fundo },
        variante === 'secundario' && { backgroundColor: cores.superficie2, borderWidth: 1, borderColor: cores.borda },
        variante === 'perigo' && { backgroundColor: 'rgba(255,92,92,0.1)', borderWidth: 1, borderColor: 'rgba(255,92,92,0.35)' },
        desativado && { opacity: 0.4 },
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {!!icone && <Ionicons name={icone} size={18} color={variante === 'escuro' ? cores.lima : cor} />}
      <Text style={[e.botaoTxt, { color: variante === 'escuro' ? cores.lima : cor }]}>{texto}</Text>
    </Pressable>
  );
}

export function Barra({ valor, total, altura = 8, cor = cores.lima, fundo = cores.superficie2 }) {
  const pct = total > 0 ? Math.min(1, valor / total) : 0;
  return (
    <View style={{ height: altura, borderRadius: altura, backgroundColor: fundo, overflow: 'hidden' }}>
      <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: cor, borderRadius: altura }} />
    </View>
  );
}

export function Selo({ texto, destaque }) {
  return (
    <View style={[e.selo, destaque && { backgroundColor: cores.lima }]}>
      <Text style={[e.seloTxt, destaque && { color: cores.fundo }]}>{texto}</Text>
    </View>
  );
}

export function Secao({ titulo, acaoTexto, aoAcao }) {
  return (
    <View style={e.secao}>
      <Text style={e.secaoTitulo}>{titulo}</Text>
      {!!acaoTexto && (
        <Pressable onPress={aoAcao} hitSlop={8}>
          <Text style={e.secaoAcao}>{acaoTexto}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function Vazio({ icone = 'dumbbell', titulo, texto, children }) {
  return (
    <View style={e.vazio}>
      <IconeTile nome={icone} tamanho={64} />
      <Text style={e.vazioTitulo}>{titulo}</Text>
      {!!texto && <Text style={e.vazioTexto}>{texto}</Text>}
      {children}
    </View>
  );
}

export function Campo({ rotulo, valor, onChange, placeholder, teclado, sufixo, erro, maxLength }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={e.rotulo}>{rotulo}</Text>
      <View style={[e.campo, !!erro && { borderColor: cores.erro }]}>
        <TextInput
          value={valor}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={cores.texto3}
          keyboardType={teclado}
          maxLength={maxLength}
          style={[e.campoInput, Platform.OS === 'web' && { outlineStyle: 'none' }]}
        />
        {!!sufixo && <Text style={e.campoSufixo}>{sufixo}</Text>}
      </View>
      {!!erro && <Text style={e.erro}>{erro}</Text>}
    </View>
  );
}

const e = StyleSheet.create({
  base: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { paddingHorizontal: 20, paddingBottom: 36, paddingTop: 6 },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18, marginTop: 6 },
  botaoVoltar: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: cores.superficie,
    borderWidth: 1, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center',
  },
  titulo: { color: cores.texto, fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  subtitulo: { color: cores.texto2, fontSize: 13, marginTop: 3 },
  cartao: {
    backgroundColor: cores.superficie, borderRadius: raio.g, padding: 16,
    borderWidth: 1, borderColor: cores.borda,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 999, backgroundColor: cores.superficie, borderWidth: 1, borderColor: cores.borda,
  },
  chipAtivo: { backgroundColor: cores.lima, borderColor: cores.lima },
  chipTxt: { color: cores.texto2, fontWeight: '700', fontSize: 13 },
  botao: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 15, paddingHorizontal: 20, borderRadius: raio.m,
  },
  botaoTxt: { fontWeight: '900', fontSize: 15, letterSpacing: 0.2 },
  selo: { backgroundColor: cores.superficie2, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
  seloTxt: { color: cores.texto2, fontSize: 11, fontWeight: '800' },
  secao: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 12 },
  secaoTitulo: { color: cores.texto, fontSize: 18, fontWeight: '900' },
  secaoAcao: { color: cores.lima, fontWeight: '800', fontSize: 13 },
  vazio: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 20, gap: 10 },
  vazioTitulo: { color: cores.texto, fontSize: 17, fontWeight: '900', marginTop: 6, textAlign: 'center' },
  vazioTexto: { color: cores.texto2, fontSize: 13, textAlign: 'center', lineHeight: 19 },
  rotulo: { color: cores.texto2, fontSize: 12, fontWeight: '800', marginBottom: 8, letterSpacing: 0.6, textTransform: 'uppercase' },
  campo: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: cores.superficie, borderRadius: raio.m,
    borderWidth: 1, borderColor: cores.borda, paddingHorizontal: 16, minHeight: 54,
  },
  campoInput: { flex: 1, color: cores.texto, fontSize: 16, paddingVertical: 12 },
  campoSufixo: { color: cores.texto3, fontWeight: '800', marginLeft: 8 },
  erro: { color: cores.erro, fontSize: 12, marginTop: 6, fontWeight: '600' },
});
