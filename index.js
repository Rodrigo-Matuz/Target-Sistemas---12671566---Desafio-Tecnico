import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import { executarDesafio01 } from "./desafios/desafio01-comissao.js";
import { executarDesafio02 } from "./desafios/desafio02-estoque.js";
import { executarDesafio03 } from "./desafios/desafio03-juros.js";

const readline = createInterface({ input: stdin, output: stdout });
const linhas = readline[Symbol.asyncIterator]();

async function perguntar(mensagem) {
  stdout.write(mensagem);
  const { value } = await linhas.next();
  return value ?? "";
}

try {
  stdout.write("Desafio técnico\n1 - Comissão de vendas\n2 - Movimentação de estoque\n3 - Cálculo de juros\n");
  const opcao = (await perguntar("Escolha uma opção: ")).trim();

  if (opcao === "1") executarDesafio01();
  else if (opcao === "2") await executarDesafio02(perguntar);
  else if (opcao === "3") await executarDesafio03(perguntar);
  else stdout.write("Opção inválida.\n");
} finally {
  readline.close();
}
