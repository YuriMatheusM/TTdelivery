// delivery-app/index.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

app.use(express.json());

// Conexão com o banco MySQL
const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'delivery'
});

conexao.connect(err => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
    return;
  }
  console.log('🟢 Conectado ao MySQL!');
});

// Rota para cadastrar restaurante
app.post('/cadastro_restaurantes', (req, res) => {
  const { nome, endereco, categoria } = req.body;
  const query = 'INSERT INTO restaurantes (nome, endereco, categoria) VALUES (?, ?, ?)';
  conexao.query(query, [nome, endereco, categoria], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ id: results.insertId, nome, endereco, categoria });
  });
});

// Rota para listar todos os restaurantes
app.get('/restaurantes', (req, res) => {
  conexao.query('SELECT * FROM restaurantes', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

// Rota para criar um pedido
app.post('/criar_pedido', (req, res) => {
  const { restauranteId, itens } = req.body;
  const query = 'INSERT INTO pedidos (restauranteId, itens, status) VALUES (?, ?, ?)';
  conexao.query(query, [restauranteId, JSON.stringify(itens), 'Recebido'], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ id: results.insertId, restauranteId, itens, status: 'Recebido' });
  });
});

// Rota para acompanhar pedido por ID
app.get('/pedidos/:id', (req, res) => {
  const id = req.params.id;
  conexao.query('SELECT * FROM pedidos WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    if (results.length === 0) return res.status(404).json({ erro: 'Pedido não encontrado' });
    const pedido = results[0];
    pedido.itens = JSON.parse(pedido.itens);
    res.json(pedido);
  });
});

// Rota para atualizar o status do pedido
app.patch('/pedidos_status/:id', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const query = 'UPDATE pedidos SET status = ? WHERE id = ?';
  conexao.query(query, [status, id], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ mensagem: 'Status atualizado com sucesso' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
