const express = require('express');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Função para buscar endereço no ViaCEP
const getAddressByCEP = async (cep) => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    
    // Verifica se o CEP não foi encontrado
    if (response.data.erro) {
      throw new Error('CEP não encontrado.');
    }
    
    return {
      logradouro: response.data.logradouro,
      bairro: response.data.bairro,
      cidade: response.data.localidade,
      estado: response.data.uf
    };
  } catch (error) {
    throw new Error('Erro ao buscar endereço: ' + error.message);
  }
};

// Rota: Criar um novo cliente
app.post('/clientes', async (req, res) => {
  try {
    const { nome, cpf, telefone, cep, numero, complemento } = req.body;
    
    // Busca os dados do endereço via CEP
    const address = await getAddressByCEP(cep);
    
    // Cria o cliente no banco de dados
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        cpf,
        telefone,
        cep,
        numero,
        complemento,
        ...address  // logradouro, bairro, cidade, estado
      }
    });
    
    res.status(201).json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota: Listar todos os clientes
app.get('/clientes', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota: Buscar um cliente pelo ID
app.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }
    
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota: Atualizar um cliente
app.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, telefone, cep, numero, complemento } = req.body;
    
    let address = {};
    
    // Se o CEP for informado/alterado, busca os novos dados do endereço
    if (cep) {
      address = await getAddressByCEP(cep);
    }
    
    const cliente = await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        cpf,
        telefone,
        cep,
        numero,
        complemento,
        ...address
      }
    });
    
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota: Excluir um cliente
app.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.cliente.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Cliente excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
