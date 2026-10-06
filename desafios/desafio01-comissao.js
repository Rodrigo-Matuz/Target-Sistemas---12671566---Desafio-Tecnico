import vendasJson from "../json/vendas.json" with { type: "json" };

export function executarDesafio01() {
  const comissoes = new Map();

  for (const venda of vendasJson.vendas) {
    const percentual = venda.valor < 100 ? 0 : venda.valor < 500 ? 0.01 : 0.05;
    const comissao = venda.valor * percentual;
    const acumulado = comissoes.get(venda.vendedor) ?? 0;
    comissoes.set(venda.vendedor, acumulado + comissao);
  }

  console.log("\nComissão por vendedor:");
  for (const [vendedor, comissao] of comissoes) {
    console.log(`${vendedor}: R$ ${comissao.toFixed(2)}`);
  }
}
