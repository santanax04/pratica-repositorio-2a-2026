import { createElement } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores, raio } from '@/constants/tema';

// Vídeo-aula: se houver `videoId`, toca na própria página (web) ou abre o YouTube (celular).
// Sem `videoId`, abre a busca do YouTube por "termo", que sempre devolve vídeos atuais.
export function VideoAula({ termo, videoId, titulo = 'Assistir vídeo-aula' }) {
  if (videoId && Platform.OS === 'web') {
    return (
      <View style={s.player}>
        {createElement('iframe', {
          src: `https://www.youtube-nocookie.com/embed/${videoId}`,
          style: { width: '100%', height: '100%', border: 0 },
          allowFullScreen: true,
          title: titulo,
        })}
      </View>
    );
  }

  const url = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(termo)}`;

  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      accessibilityRole="link"
      accessibilityLabel={titulo}
      style={({ pressed }) => [s.card, pressed && { opacity: 0.85 }]}
    >
      <View style={s.play}>
        <MaterialCommunityIcons name="play" size={30} color={cores.fundo} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.titulo}>{titulo}</Text>
        <Text style={s.sub}>Abre no YouTube · passo a passo em vídeo</Text>
      </View>
      <MaterialCommunityIcons name="open-in-new" size={20} color={cores.texto3} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  player: { width: '100%', aspectRatio: 16 / 9, borderRadius: raio.g, overflow: 'hidden', backgroundColor: '#000' },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: raio.g,
    backgroundColor: cores.superficie, borderWidth: 1, borderColor: 'rgba(198,255,61,0.4)',
  },
  play: { width: 54, height: 54, borderRadius: 27, backgroundColor: cores.lima, alignItems: 'center', justifyContent: 'center' },
  titulo: { color: cores.texto, fontSize: 15, fontWeight: '900' },
  sub: { color: cores.texto2, fontSize: 12, marginTop: 3 },
});
