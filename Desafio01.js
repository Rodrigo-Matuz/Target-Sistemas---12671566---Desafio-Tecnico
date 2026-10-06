import { createInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import vendasJson from "./json/vendas.json" with { type: "json" };
import estoqueJson from "./json/estoque.json" with { type: "json" };

const rl = createInterface({ input, output });
const linhas = [];
let aguardarLinha;

rl.on("line", (linha) => {
  if (aguardarLinha) {
    const resolver = aguardarLinha;
    aguardarLinha = undefined;
    resolver(linha);
  } else {
    linhas.push(linha);
  }
});

async function perguntar(texto) {
  output.write(texto);
  if (linhas.length) return linhas.shift();
  return new Promise((resolve) => {
    aguardarLinha = resolve;
  });
}

function calcularComissoes() {
  const comissoes = {};

  for (const venda of vendasJson.vendas) {
    const percentual = venda.valor < 100 ? 0 : venda.valor < 500 ? 0.01 : 0.05;
    comissoes[venda.vendedor] = (comissoes[venda.vendedor] || 0) + venda.valor * percentual;
  }

  console.log("\nComissão por vendedor:");
  for (const [vendedor, comissao] of Object.entries(comissoes)) {
    console.log(`${vendedor}: R$ ${comissao.toFixed(2)}`);
  }
}

async function movimentarEstoque() {
  const { estoque } = estoqueJson;
  const codigo = Number(await perguntar("Código do produto: "));
  const produto = estoque.find((item) => item.codigoProduto === codigo);

  if (!produto) {
    console.log("Produto não encontrado.");
    return;
  }

  const tipo = (await perguntar("Tipo da movimentação (entrada/saída): ")).trim().toLowerCase();
  if (tipo !== "entrada" && tipo !== "saída" && tipo !== "saida") {
    console.log("Tipo inválido. Use entrada ou saída.");
    return;
  }

  const quantidade = Number(await perguntar("Quantidade: "));
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    console.log("Informe uma quantidade inteira maior que zero.");
    return;
  }

  if (tipo === "saída" || tipo === "saida") {
    if (quantidade > produto.estoque) {
      console.log("Estoque insuficiente.");
      return;
    }
    produto.estoque -= quantidade;
  } else {
    produto.estoque += quantidade;
  }

  const id = Date.now();
  console.log(`Movimentação ${id} (${tipo}) registrada para ${produto.descricaoProduto}.`);
  console.log(`Estoque final: ${produto.estoque}`);
}

async function calcularJuros() {
  const valor = Number((await perguntar("Valor da conta: ")).replace(",", "."));
  const vencimento = (await perguntar("Data de vencimento (DD/MM/AAAA): ")).trim();
  const partes = vencimento.split("/").map(Number);
  const dataVencimento = new Date(partes[2], partes[1] - 1, partes[0]);

  if (
    !Number.isFinite(valor) || valor <= 0 || partes.length !== 3 ||
    dataVencimento.getFullYear() !== partes[2] ||
    dataVencimento.getMonth() !== partes[1] - 1 ||
    dataVencimento.getDate() !== partes[0]
  ) {
    console.log("Informe um valor positivo e uma data válida no formato DD/MM/AAAA.");
    return;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  dataVencimento.setHours(0, 0, 0, 0);
  const diasAtraso = Math.max(0, Math.floor((hoje - dataVencimento) / 86400000));
  const juros = valor * 0.025 * diasAtraso;

  console.log(`Dias de atraso: ${diasAtraso}`);
  console.log(`Juros: R$ ${juros.toFixed(2)}`);
  console.log(`Total com juros: R$ ${(valor + juros).toFixed(2)}`);
}

try {
  console.log("1 - Calcular comissão\n2 - Movimentar estoque\n3 - Calcular juros");
  const opcao = await perguntar("Escolha uma opção: ");

  if (opcao === "1") calcularComissoes();
  else if (opcao === "2") await movimentarEstoque();
  else if (opcao === "3") await calcularJuros();
  else console.log("Opção inválida.");
} finally {
  rl.close();
}
