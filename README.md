# pgwebbuscacep
## Exercício 2 (Com Postgres)
Crie uma API com as operações CRUD para Clientes contendo os seguintes atributos:
* Nome, CPF, Telefone, CEP, Numero, Complemento

1. Quando for salvar no banco de dados, busque automaticamente o endereco do cliente através do CEP
informado, utilizando a API do ViaCEP.
2. Depois de buscar o CEP, salve o endereço do cliente no banco de dados completando os seguintes campos de
endereço: logradouro, bairro, cidade, estado
3. Adicionar junto ao código, o arquivo de configuração do Postman ou Insomnia para os testes (Sem esse arquivo,
a nota será 0)

Utilize Express e Prisma para o CRUD
Utilize Axios para buscar o endereço do cliente no ViaCEP (1000 exemplos na internet)
