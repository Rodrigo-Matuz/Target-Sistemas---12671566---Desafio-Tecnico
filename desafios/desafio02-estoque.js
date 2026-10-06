import estoqueJson from "../json/estoque.json" with { type: "json" };

let proximoId = 1;

/** Registra uma entrada ou saída e exibe o saldo atualizado do produto.
 * @param {(mensagem: string) => Promise<string>} perguntar Função usada para ler dados do terminal.
 * @returns {Promise<void>}
 */
export async function executarDesafio02(perguntar) {
  const codigoProduto = Number(await perguntar("Código do produto: "));
  const produto = estoqueJson.estoque.find((item) => item.codigoProduto === codigoProduto);

  if (!produto) {
    console.log("Produto não encontrado.");
    return;
  }

  const tipo = (await perguntar("Tipo da movimentação (I = entrada / O = saída): "))
    .trim()
    .toUpperCase();
  const entrada = tipo === "I";
  const saida = tipo === "O";

  if (!entrada && !saida) {
    console.log("Tipo inválido. Use I para entrada ou O para saída.");
    return;
  }

  const quantidade = Number(await perguntar("Quantidade: "));
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    console.log("Informe uma quantidade inteira maior que zero.");
    return;
  }

  if (saida && quantidade > produto.estoque) {
    console.log("Estoque insuficiente.");
    return;
  }

  produto.estoque += entrada ? quantidade : -quantidade;

  const descricao = entrada ? "Entrada de estoque" : "Saída de estoque";
  console.log(`\nMovimentação ${proximoId++}: ${descricao}`);
  console.log(`Produto: ${produto.descricaoProduto}`);
  console.log(`Estoque final: ${produto.estoque}`);
}
