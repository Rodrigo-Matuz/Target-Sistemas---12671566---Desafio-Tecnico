const TAXA_DIARIA = 0.025;
const MILISSEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000;

/** Converte uma data DD/MM/AAAA em Date, ou retorna null se ela for inválida.
 * @param {string} dataTexto Data informada pelo usuário.
 * @returns {Date | null} Data válida em UTC ou null.
 */
function converterData(dataTexto) {
  const partes = dataTexto.split("/").map(Number);
  if (partes.length !== 3) return null;

  const [dia, mes, ano] = partes;
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  const dataValida =
    data.getUTCFullYear() === ano &&
    data.getUTCMonth() === mes - 1 &&
    data.getUTCDate() === dia;

  return dataValida ? data : null;
}

/** Calcula os juros simples acumulados até hoje para uma conta vencida.
 * @param {(mensagem: string) => Promise<string>} perguntar Função usada para ler dados do terminal.
 * @returns {Promise<void>}
 */
export async function executarDesafio03(perguntar) {
  const valorTexto = (await perguntar("Valor da conta: ")).trim().replace(",", ".");
  const valor = Number(valorTexto);
  const vencimentoTexto = (await perguntar("Vencimento (DD/MM/AAAA): ")).trim();
  const vencimento = converterData(vencimentoTexto);

  if (!Number.isFinite(valor) || valor <= 0 || !vencimento) {
    console.log("Informe um valor positivo e uma data válida no formato DD/MM/AAAA.");
    return;
  }

  const agora = new Date();
  const hoje = Date.UTC(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const diasAtraso = Math.max(0, Math.floor((hoje - vencimento.getTime()) / MILISSEGUNDOS_POR_DIA));
  const juros = valor * TAXA_DIARIA * diasAtraso;

  console.log(`Dias de atraso: ${diasAtraso}`);
  console.log(`Juros: R$ ${juros.toFixed(2)}`);
  console.log(`Total com juros: R$ ${(valor + juros).toFixed(2)}`);
}
