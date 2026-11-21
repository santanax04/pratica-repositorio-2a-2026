import { Platform, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '@/constants/tema';

const icone = (nome) => ({ color, size }) => (
  <MaterialCommunityIcons name={nome} size={size + 1} color={color} />
);

const oculta = { href: null };

export default function RootLayout() {
  return (
    // No navegador, o app fica centralizado numa "tela de celular" de até 480px.
    <View style={estilos.fundo}>
      <View style={estilos.app}>
        <StatusBar style="light" />
        <Tabs
          backBehavior="history"
          screenOptions={{
            headerShown: false,
            sceneStyle: { backgroundColor: cores.fundo },
            tabBarActiveTintColor: cores.lima,
            tabBarInactiveTintColor: cores.texto3,
            tabBarStyle: {
              height: 66,
              paddingTop: 6,
              paddingBottom: 8,
              backgroundColor: '#111113',
              borderTopColor: cores.borda,
              borderTopWidth: 1,
            },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '800' },
          }}
        >
          <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: icone('home-variant') }} />
          <Tabs.Screen name="treinos" options={{ title: 'Treinos', tabBarIcon: icone('dumbbell') }} />
          <Tabs.Screen name="exercicios" options={{ title: 'Exercícios', tabBarIcon: icone('weight-lifter') }} />
          <Tabs.Screen name="evolucao" options={{ title: 'Evolução', tabBarIcon: icone('chart-line') }} />
          <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icone('account') }} />

          <Tabs.Screen name="intro" options={{ ...oculta, tabBarStyle: { display: 'none' } }} />
          <Tabs.Screen name="frequencia" options={oculta} />
          <Tabs.Screen name="relogio" options={oculta} />
          <Tabs.Screen name="cadastro" options={{ ...oculta, tabBarStyle: { display: 'none' } }} />
          <Tabs.Screen name="planos" options={oculta} />
          <Tabs.Screen name="favoritos" options={oculta} />
          <Tabs.Screen name="exercicio/[id]" options={oculta} />
          <Tabs.Screen name="treino/[id]" options={oculta} />
          <Tabs.Screen name="equipamento/[id]" options={oculta} />
          <Tabs.Screen name="unidades" options={oculta} />
          <Tabs.Screen name="personais" options={oculta} />
          <Tabs.Screen name="personal/[id]" options={oculta} />
        </Tabs>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: '#000', alignItems: 'center' },
  app: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: cores.fundo,
    ...(Platform.OS === 'web' ? { boxShadow: '0 0 60px rgba(198,255,61,0.06)' } : null),
  },
});
