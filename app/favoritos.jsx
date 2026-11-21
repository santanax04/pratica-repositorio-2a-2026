import { useRouter } from 'expo-router';
import { Botao, Tela, Vazio } from '@/components/fit';
import { CartaoExercicio } from '@/components/fit/cartoes';
import { EXERCICIOS } from '@/data/exercicios';
import { alternarFavorito, useFavoritos } from '@/services/favoritos';

export default function Favoritos() {
  const router = useRouter();
  const { ids } = useFavoritos();
  const lista = [...ids].reverse().map((id) => EXERCICIOS.find((e) => e.id === id)).filter(Boolean);

  return (
    <Tela titulo="Favoritos" subtitulo={`${lista.length} exercício(s) salvos`} voltar>
      {lista.length === 0 ? (
        <Vazio icone="heart-outline" titulo="Nada por aqui ainda" texto="Toque no coração de um exercício para guardá-lo aqui.">
          <Botao texto="Ver exercícios" icone="search" onPress={() => router.push('/exercicios')} style={{ marginTop: 10 }} />
        </Vazio>
      ) : (
        lista.map((ex) => (
          <CartaoExercicio
            key={ex.id}
            ex={ex}
            favorito
            detalhe={`Sugestão: ${ex.sugestao}`}
            aoAbrir={(id) => router.push(`/exercicio/${id}`)}
            aoFavoritar={alternarFavorito}
          />
        ))
      )}
    </Tela>
  );
}
