export const FORMAS_PAGAMENTO = [
  { id: 'pix', nome: 'Pix', icone: 'qrcode', descricao: 'Aprovação na hora · 5% de desconto', desconto: 0.05, parcelavel: false },
  { id: 'credito', nome: 'Cartão de crédito', icone: 'credit-card-outline', descricao: 'Parcele sem juros', desconto: 0, parcelavel: true },
  { id: 'debito', nome: 'Cartão de débito', icone: 'credit-card-check-outline', descricao: 'À vista, direto da sua conta', desconto: 0, parcelavel: false },
  { id: 'boleto', nome: 'Boleto bancário', icone: 'barcode', descricao: 'Vence em 3 dias · compensa em até 2 dias úteis', desconto: 0, parcelavel: false },
  { id: 'dinheiro', nome: 'Dinheiro na recepção', icone: 'cash', descricao: 'Pague direto na unidade', desconto: 0, parcelavel: false },
];

export const formaPorId = (id) => FORMAS_PAGAMENTO.find((f) => f.id === id);

export const dinheiro = (n) => `R$ ${n.toFixed(2).replace('.', ',')}`;

// Calcula o total final conforme a forma de pagamento (Pix tem desconto; crédito parcela sem juros).
export function resumoPagamento(total, formaId, maxParcelas = 1) {
  const forma = formaPorId(formaId) ?? FORMAS_PAGAMENTO[0];
  const final = total * (1 - forma.desconto);
  const parcelas = forma.parcelavel ? Math.max(1, maxParcelas) : 1;
  return {
    forma,
    total: final,
    desconto: total - final,
    parcelas,
    valorParcela: final / parcelas,
  };
}
