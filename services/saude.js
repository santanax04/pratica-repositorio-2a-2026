import { Platform } from 'react-native';

// Zonas de frequência cardíaca (% da FC máxima) e fração aproximada de calorias vindas de gordura.
export const ZONAS = [
  { id: 'repouso', nome: 'Repouso', min: 0, cor: '#6B6B73', gordura: 0.7 },
  { id: 'aquecimento', nome: 'Aquecimento', min: 0.5, cor: '#4FC3F7', gordura: 0.6 },
  { id: 'gordura', nome: 'Queima de gordura', min: 0.6, cor: '#C6FF3D', gordura: 0.5 },
  { id: 'cardio', nome: 'Cardio', min: 0.7, cor: '#FFB020', gordura: 0.35 },
  { id: 'pico', nome: 'Pico', min: 0.8, cor: '#FF5C5C', gordura: 0.2 },
];

export const fcMaxima = (idade) => 220 - (idade || 30);

export function zonaAtual(bpm, fcMax) {
  const pct = bpm / fcMax;
  let z = ZONAS[0];
  for (const zona of ZONAS) if (pct >= zona.min) z = zona;
  return z;
}

// Estimativa de calorias por minuto a partir da frequência cardíaca (fórmula de Keytel et al.).
export function kcalPorMinuto({ bpm, peso, idade, sexo }) {
  const p = peso || 70;
  const i = idade || 30;
  const kj =
    sexo === 'Feminino'
      ? -20.4022 + 0.4472 * bpm - 0.1263 * p + 0.074 * i
      : -55.0969 + 0.6309 * bpm + 0.1988 * p + 0.2017 * i;
  return Math.max(0, kj / 4.184);
}

export const bluetoothDisponivel = () =>
  Platform.OS === 'web' && typeof navigator !== 'undefined' && !!navigator.bluetooth;

// Conexão real via Web Bluetooth (Chrome/Edge): lê o serviço padrão de frequência cardíaca.
export async function conectarBluetooth(aoBpm, aoDesconectar) {
  const dispositivo = await navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] });
  const servidor = await dispositivo.gatt.connect();
  const servico = await servidor.getPrimaryService('heart_rate');
  const caracteristica = await servico.getCharacteristic('heart_rate_measurement');
  await caracteristica.startNotifications();
  caracteristica.addEventListener('characteristicvaluechanged', (e) => {
    const v = e.target.value;
    const bpm = v.getUint8(0) & 1 ? v.getUint16(1, true) : v.getUint8(1);
    aoBpm(bpm);
  });
  dispositivo.addEventListener('gattserverdisconnected', aoDesconectar);
  return {
    nome: dispositivo.name || 'Dispositivo Bluetooth',
    desconectar: () => dispositivo.gatt.connected && dispositivo.gatt.disconnect(),
  };
}

// Modo demonstração: simula um treino (aquece, sobe e oscila) para testar sem relógio.
export function iniciarDemo(aoBpm) {
  let t = 0;
  aoBpm(82);
  const id = setInterval(() => {
    t += 1;
    const base = 84 + Math.min(t, 90) * 0.9;
    const onda = Math.sin(t / 7) * 7;
    const ruido = (Math.random() - 0.5) * 4;
    aoBpm(Math.round(base + onda + ruido));
  }, 1000);
  return () => clearInterval(id);
}
