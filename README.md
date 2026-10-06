# Desafio técnico

Implementação em JavaScript dos três exercícios descritos em [DESAFIO.md](./DESAFIO.md).

## Requisitos

- Node.js 20.10 ou superior (para importar os arquivos JSON como módulos).

## Como executar

Na pasta do projeto, rode:

```bash
npm start
```

Escolha no menu qual exercício executar. Os dados de vendas e estoque ficam na pasta `json/`.

## Organização

```text
.
├── desafios/
│   ├── desafio01-comissao.js
│   ├── desafio02-estoque.js
│   └── desafio03-juros.js
├── json/
│   ├── estoque.json
│   └── vendas.json
├── index.js
└── package.json
```

O `index.js` exibe o menu e encaminha a execução para o módulo escolhido. Cada exercício mantém sua regra e lógica em um arquivo próprio.

## Exercícios

1. **Comissão de vendas:** vendas abaixo de R$ 100 não geram comissão; valores de R$ 100 a R$ 499,99 geram 1%; a partir de R$ 500 geram 5%. O resultado é agrupado por vendedor.
2. **Movimentação de estoque:** informa o código do produto, o tipo (`I` para entrada ou `O` para saída) e a quantidade. O programa valida o produto e a quantidade, impede saída maior que o estoque disponível e mostra o identificador, a descrição e o saldo final. Os dados são mantidos em memória durante a execução.
3. **Cálculo de juros:** solicita valor e vencimento no formato `DD/MM/AAAA`. Aplica juros simples de 2,5% do valor original por dia de atraso. Vencimentos hoje ou no futuro não geram juros.
