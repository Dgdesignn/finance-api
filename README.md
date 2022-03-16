# FinAPI  - Financeira

> É uma APi que contem rotas com as principais funções bancárias. Utilizei um array para fazer o armazenamento dos dados não de forma permanente, utilizando também os conceitos básico de uma API e dos  **middlewares**. 

### Requisitos
- [x] Deve ser possível criar uma conta
- [x] Deve ser possível buscar o extrato bancário de cliente
- [x] Deve ser possível realizar um depósito
- [x] Deve ser possível fazer o levantamento
- [x] Deve ser possível buscar o extrato bancário do cliente por data
- [x] Deve ser possível actualizar dados da conta do cliente
- [x] Dever ser possível deletar uma conta

## Regras de negócio

- [x] Não deve ser possível cadastrar uma conta com BI já existete
- [x] Não deve ser possível fazer depósito em uma conta não existente
- [x] Não deve ser possível buscar extrato de uma conta não existente
- [x] Não deve ser possível fazer lrvantamento de uma conta não existente
- [x] Não deve ser possível excluir uma conta não existente
- [x] Não deve ser possível fazer levantamento quando o saldo for insuficiente