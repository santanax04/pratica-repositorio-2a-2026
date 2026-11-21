import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Secao, Tela } from '@/components/fit';
import { CartaoTreino } from '@/components/fit/cartoes';
import { OBJETIVOS, TREINOS, objetivoPorId, treinoPorId } from '@/data/academia';
import { cores } from '@/constants/tema';
import { usePerfil } from '@/services/perfil';

export default function Treinos() {
  const router = useRouter();
  const { valor: perfil } = usePerfil();
  if (!perfil) return <Tela />;

  const objetivo = objetivoPorId(perfil.objetivo) ?? OBJETIVOS[0];
  const plano = objetivo.treinos.map(treinoPorId).filter(Boolean);
  const outros = TREINOS.filter((t) => !objetivo.treinos.includes(t.id));
  const abrir = (id) => router.push(`/treino/${id}`);

  return (
    <Tela titulo="Treinos" subtitulo={`Plano para: ${objetivo.nome} · ${perfil.diasSemana}x por semana`}>
      <Secao titulo="Seu plano" />
      {plano.map((t, i) => (
        <CartaoTreino key={t.id} treino={t} dia={i + 1} destaque aoAbrir={abrir} />
      ))}
      <Text style={{ color: cores.texto3, fontSize: 12, marginTop: 2 }}>
        Siga a ordem Dia 1, Dia 2, Dia 3... e recomece quando terminar o ciclo.
      </Text>

      {outros.length > 0 && <Secao titulo="Mais treinos" />}
      {outros.map((t) => (
        <CartaoTreino key={t.id} treino={t} aoAbrir={abrir} />
      ))}
    </Tela>
  );
}
