import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Barra, Botao, Cartao, IconeTile, Secao, Tela } from '@/components/fit';
import { FundoTreino } from '@/components/fit/FundoTreino';
import { MARCA } from '@/constants/marca';
import { cores, raio } from '@/constants/tema';
import { HORARIOS, NOVIDADES, OBJETIVOS, TREINOS, abertoAgora, objetivoPorId, treinoPorId } from '@/data/academia';
import { unidadePorId } from '@/data/unidades';
import { diasDaSemana, hojeISO, useFrequencia } from '@/services/frequencia';
import { fmt, resumoEvolucao, sentido, serieMedidas, sinal } from '@/services/evolucao';
import { useMedidas } from '@/services/medidas';
import { usePerfil } from '@/services/perfil';

const LETRAS_SEMANA = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function Inicio() {
  const router = useRouter();
  const { valor: perfil } = usePerfil();
  const { valor: presencas } = useFrequencia();
  const { valor: medidas } = useMedidas();

  if (!perfil) return <Tela />;

  const objetivo = objetivoPorId(perfil.objetivo) ?? OBJETIVOS[0];
  const plano = objetivo.treinos.map(treinoPorId).filter(Boolean);
  // Próximo treino: segue a rotação do plano conforme os treinos já concluídos.
  const concluidos = presencas.filter((p) => p.treino).length;
  const proximo = plano[concluidos % plano.length] ?? TREINOS[0];

  const semana = diasDaSemana();
  const datas = new Set(presencas.map((p) => p.data));
  const feitosSemana = semana.filter((d) => datas.has(d)).length;
  const hoje = hojeISO();
  const aberto = abertoAgora();
  const unidade = unidadePorId(perfil.unidade);
  const evolucao = resumoEvolucao(serieMedidas(medidas, perfil));
  const sPeso = evolucao ? sentido(perfil.objetivo, evolucao.deltaKg) : 'neutro';
  const corPeso = sPeso === 'bom' ? cores.lima : sPeso === 'ruim' ? cores.aviso : cores.texto;

  return (
    <Tela>
      <FundoTreino altura={206} raio={26}>
        <View style={s.marcaLinha}>
          <MaterialCommunityIcons name="lightning-bolt" size={20} color={cores.lima} />
          <Text style={s.marcaTxt}>{MARCA.nome}</Text>
          <Text style={s.marcaSub}>{MARCA.sub.toUpperCase()}</Text>
        </View>
        <View style={s.topo}>
          <View style={{ flex: 1 }}>
            <Text style={s.saudacao}>{saudacao()},</Text>
            <Text style={s.nome} numberOfLines={1}>{perfil.nome.split(' ')[0]} 👋</Text>
          </View>
          <Pressable onPress={() => router.push('/perfil')} style={s.avatar} accessibilityLabel="Abrir perfil">
            <Text style={s.avatarTxt}>{perfil.nome.trim()[0]?.toUpperCase()}</Text>
          </Pressable>
        </View>
        {!!unidade && <Text style={s.unidadeTxt}>📍 {unidade.nome}</Text>}
      </FundoTreino>

      <View style={s.hero}>
        <Text style={s.heroRotulo}>PRÓXIMO TREINO</Text>
        <Text style={s.heroTitulo}>{proximo.nome}</Text>
        <Text style={s.heroMeta}>
          {proximo.foco} · {proximo.itens.length} exercícios · {proximo.duracao} min
        </Text>
        <Botao
          texto="Começar agora"
          icone="play"
          variante="escuro"
          onPress={() => router.push(`/treino/${proximo.id}`)}
          style={{ marginTop: 16, alignSelf: 'flex-start' }}
        />
        <MaterialCommunityIcons name="lightning-bolt" size={150} color="rgba(11,11,12,0.1)" style={s.heroIcone} />
      </View>

      <Cartao style={{ marginTop: 14 }}>
        <View style={s.linhaEntre}>
          <Text style={s.cartaoTitulo}>Sua semana</Text>
          <Text style={s.cartaoNum}>{feitosSemana}/{perfil.diasSemana}</Text>
        </View>
        <View style={s.dias}>
          {semana.map((d, i) => {
            const feito = datas.has(d);
            return (
              <View key={d} style={s.diaCol}>
                <View style={[s.diaBolha, feito && s.diaFeito, d === hoje && !feito && s.diaHoje]}>
                  {feito && <MaterialCommunityIcons name="check" size={16} color={cores.fundo} />}
                </View>
                <Text style={[s.diaLetra, d === hoje && { color: cores.lima }]}>{LETRAS_SEMANA[i]}</Text>
              </View>
            );
          })}
        </View>
        <Barra valor={feitosSemana} total={perfil.diasSemana} />
        <Text style={s.legenda}>
          {feitosSemana >= perfil.diasSemana
            ? 'Meta da semana batida! 🔥'
            : `Faltam ${perfil.diasSemana - feitosSemana} treino(s) para a meta da semana.`}
        </Text>
      </Cartao>

      <Cartao onPress={() => router.push('/evolucao')} style={{ marginTop: 14 }}>
        <View style={s.linhaEntre}>
          <Text style={s.cartaoTitulo}>Sua evolução</Text>
          <Text style={s.link}>Ver tudo ›</Text>
        </View>
        {evolucao ? (
          <View style={s.miniLinha}>
            <View style={s.mini}>
              <Text style={s.miniNum}>{fmt(evolucao.atual.peso)}<Text style={s.miniUn}> kg</Text></Text>
              <Text style={s.miniTxt}>peso atual</Text>
            </View>
            <View style={s.mini}>
              <Text style={[s.miniNum, { color: corPeso }]}>{sinal(evolucao.deltaPct)}%</Text>
              <Text style={s.miniTxt}>desde o início</Text>
            </View>
            <View style={s.mini}>
              <Text style={s.miniNum}>
                {evolucao.gordura ? fmt(evolucao.gordura.atual) : '--'}<Text style={s.miniUn}>%</Text>
              </Text>
              <Text style={s.miniTxt}>gordura</Text>
            </View>
          </View>
        ) : null}
        <Text style={s.legenda}>
          {evolucao && evolucao.registros > 1 ? 'Toque para ver gráficos, fotos e conquistas.' : 'Registre suas medidas e fotos para acompanhar o resultado.'}
        </Text>
      </Cartao>

      <View style={s.atalhos}>
        {[
          { t: 'Check-in', i: 'calendar-check', r: '/frequencia' },
          { t: 'Personais', i: 'account-tie-outline', r: '/personais' },
          { t: 'Unidades', i: 'map-marker-radius-outline', r: '/unidades' },
        ].map((a) => (
          <Pressable key={a.t} onPress={() => router.push(a.r)} style={({ pressed }) => [s.atalho, pressed && { opacity: 0.8 }]}>
            <MaterialCommunityIcons name={a.i} size={24} color={cores.lima} />
            <Text style={s.atalhoTxt}>{a.t}</Text>
          </Pressable>
        ))}
      </View>
      <View style={[s.atalhos, { marginTop: 10 }]}>
        {[
          { t: 'Planos', i: 'card-account-details-outline', r: '/planos' },
          { t: 'Equipamentos', i: 'dumbbell', r: '/exercicios?aba=equipamentos' },
          { t: 'Relógio', i: 'watch-variant', r: '/relogio' },
        ].map((a) => (
          <Pressable key={a.t} onPress={() => router.push(a.r)} style={({ pressed }) => [s.atalho, pressed && { opacity: 0.8 }]}>
            <MaterialCommunityIcons name={a.i} size={24} color={cores.lima} />
            <Text style={s.atalhoTxt}>{a.t}</Text>
          </Pressable>
        ))}
      </View>

      {!unidade && (
        <Cartao onPress={() => router.push('/unidades')} style={s.bannerPlano}>
          <IconeTile nome="map-marker-radius-outline" />
          <View style={{ flex: 1 }}>
            <Text style={s.cartaoTitulo}>Escolha sua unidade</Text>
            <Text style={s.legendaSimples}>Veja endereço e horário de cada {MARCA.nome}.</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color={cores.texto3} />
        </Cartao>
      )}

      {!perfil.plano && (
        <Cartao onPress={() => router.push('/planos')} style={s.bannerPlano}>
          <IconeTile nome="ticket-percent-outline" />
          <View style={{ flex: 1 }}>
            <Text style={s.cartaoTitulo}>Escolha seu plano</Text>
            <Text style={s.legendaSimples}>Mensal, trimestral ou anual. Veja as vantagens.</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color={cores.texto3} />
        </Cartao>
      )}

      <Secao titulo="Novidades" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
        {NOVIDADES.map((n) => (
          <View key={n.id} style={s.novidade}>
            <IconeTile nome={n.icone} tamanho={44} />
            <Text style={s.novTitulo}>{n.titulo}</Text>
            <Text style={s.novTexto}>{n.texto}</Text>
          </View>
        ))}
      </ScrollView>

      <Secao titulo="Horários" />
      <Cartao>
        <View style={s.linhaEntre}>
          <Text style={s.cartaoTitulo}>{unidade ? unidade.nome : 'Funcionamento'}</Text>
          <View style={[s.status, { backgroundColor: aberto ? cores.limaFundo : 'rgba(255,92,92,0.12)' }]}>
            <View style={[s.ponto, { backgroundColor: aberto ? cores.lima : cores.erro }]} />
            <Text style={[s.statusTxt, { color: aberto ? cores.lima : cores.erro }]}>{aberto ? 'Aberto agora' : 'Fechado agora'}</Text>
          </View>
        </View>
        {HORARIOS.map((h) => (
          <View key={h.dias} style={s.horario}>
            <Text style={s.horarioDia}>{h.dias}</Text>
            <Text style={s.horarioHora}>{h.horas}</Text>
          </View>
        ))}
      </Cartao>

      <View style={s.frase}>
        <MaterialCommunityIcons name="format-quote-open" size={22} color={cores.lima} />
        <Text style={s.fraseTxt}>{objetivo.frase}</Text>
      </View>
    </Tela>
  );
}

const s = StyleSheet.create({
  marcaLinha: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  marcaTxt: { color: cores.texto, fontSize: 16, fontWeight: '900', letterSpacing: 3 },
  marcaSub: { color: cores.texto3, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginTop: 2 },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  unidadeTxt: { color: cores.texto2, fontSize: 12, fontWeight: '700', marginTop: 10 },
  saudacao: { color: cores.texto2, fontSize: 14 },
  nome: { color: cores.texto, fontSize: 28, fontWeight: '900', letterSpacing: -0.6 },
  avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: cores.superficie2, borderWidth: 1, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: cores.lima, fontWeight: '900', fontSize: 20 },
  hero: { marginTop: 14, backgroundColor: cores.lima, borderRadius: 26, padding: 20, overflow: 'hidden' },
  heroRotulo: { color: 'rgba(11,11,12,0.6)', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  heroTitulo: { color: cores.fundo, fontSize: 28, fontWeight: '900', letterSpacing: -0.6, marginTop: 6 },
  heroMeta: { color: 'rgba(11,11,12,0.7)', fontSize: 13, fontWeight: '600', marginTop: 4 },
  heroIcone: { position: 'absolute', right: -14, bottom: -22 },
  linhaEntre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cartaoTitulo: { color: cores.texto, fontSize: 15, fontWeight: '800' },
  cartaoNum: { color: cores.lima, fontSize: 18, fontWeight: '900' },
  dias: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  diaCol: { alignItems: 'center', gap: 6 },
  diaBolha: { width: 34, height: 34, borderRadius: 17, backgroundColor: cores.superficie2, alignItems: 'center', justifyContent: 'center' },
  diaFeito: { backgroundColor: cores.lima },
  diaHoje: { borderWidth: 2, borderColor: cores.lima },
  diaLetra: { color: cores.texto3, fontSize: 11, fontWeight: '800' },
  legenda: { color: cores.texto2, fontSize: 12, marginTop: 10 },
  legendaSimples: { color: cores.texto2, fontSize: 12, marginTop: 2 },
  atalhos: { flexDirection: 'row', gap: 10, marginTop: 14 },
  atalho: { flex: 1, alignItems: 'center', gap: 8, paddingVertical: 16, backgroundColor: cores.superficie, borderRadius: raio.g, borderWidth: 1, borderColor: cores.borda },
  atalhoTxt: { color: cores.texto, fontSize: 12, fontWeight: '800' },
  bannerPlano: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14 },
  novidade: { width: 220, backgroundColor: cores.superficie, borderRadius: raio.g, borderWidth: 1, borderColor: cores.borda, padding: 16, gap: 6 },
  novTitulo: { color: cores.texto, fontSize: 15, fontWeight: '800', marginTop: 8 },
  novTexto: { color: cores.texto2, fontSize: 12, lineHeight: 17 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  ponto: { width: 7, height: 7, borderRadius: 4 },
  statusTxt: { fontSize: 11, fontWeight: '800' },
  horario: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, marginTop: 12, borderTopWidth: 1, borderTopColor: cores.borda },
  horarioDia: { color: cores.texto2, fontSize: 13 },
  horarioHora: { color: cores.texto, fontSize: 13, fontWeight: '800' },
  link: { color: cores.lima, fontSize: 13, fontWeight: '800' },
  miniLinha: { flexDirection: 'row', marginTop: 14, gap: 8 },
  mini: { flex: 1, backgroundColor: cores.superficie2, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  miniNum: { color: cores.texto, fontSize: 18, fontWeight: '900' },
  miniUn: { color: cores.texto2, fontSize: 12, fontWeight: '700' },
  miniTxt: { color: cores.texto3, fontSize: 11, marginTop: 3, fontWeight: '700' },
  frase: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 26, paddingHorizontal: 4 },
  fraseTxt: { flex: 1, color: cores.texto2, fontSize: 14, lineHeight: 21, fontStyle: 'italic' },
});
