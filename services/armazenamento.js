import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

// Pequena "loja" de dados: guarda o estado em memória, salva no AsyncStorage
// (localStorage no navegador) e avisa as telas quando algo muda.
export function criarArmazenamento(chave, inicial) {
  let estado = { valor: inicial, carregado: false };
  const ouvintes = new Set();

  const notificar = (novo) => {
    estado = novo;
    ouvintes.forEach((fn) => fn());
  };

  const carregamento = (async () => {
    try {
      const salvo = await AsyncStorage.getItem(chave);
      notificar({ valor: salvo ? JSON.parse(salvo) : inicial, carregado: true });
    } catch {
      notificar({ ...estado, carregado: true });
    }
  })();

  async function definir(atualizador) {
    await carregamento;
    const novo = typeof atualizador === 'function' ? atualizador(estado.valor) : atualizador;
    notificar({ ...estado, valor: novo });
    try {
      await AsyncStorage.setItem(chave, JSON.stringify(novo));
    } catch {
      // Continua funcionando durante a sessão mesmo se o salvamento falhar.
    }
  }

  const assinar = (fn) => {
    ouvintes.add(fn);
    return () => ouvintes.delete(fn);
  };
  const obter = () => estado;

  function usar() {
    const atual = useSyncExternalStore(assinar, obter, obter);
    return { valor: atual.valor, carregado: atual.carregado };
  }

  return { usar, definir };
}
