const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();
const PORT = 3000;

app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let clientes = [
    { id: 1, nome: "Cliente 1" },
    { id: 2, nome: "Cliente 2" }
];

let produtos = [
    { id: 1, nome: "Produto A", preco: 50.0 },
    { id: 2, nome: "Produto B", preco: 120.0 }
];

let vendas = [
    { id: 1, cliente: "Cliente 1", produto: "Produto A", valor: 50.0 }
];

let idCounterClientes = clientes.length + 1;
let idCounterProdutos = produtos.length + 1;
let idCounterVendas = vendas.length + 1;

app.get('/', (req, res) => res.render('home'));

app.get('/clientes', (req, res) => res.render('clientes', { clientes }));
app.get('/clientes/novo', (req, res) => res.render('cadastrar'));
app.post('/clientes', (req, res) => {
    const nome = req.body.nome?.trim();
    if (!nome) return res.status(400).send("O campo nome é obrigatório!");
    clientes.push({ id: idCounterClientes++, nome });
    res.redirect('/clientes');
});
app.get('/clientes/:id/editar', (req, res) => {
    const id = Number(req.params.id);
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return res.status(404).send("Cliente não encontrado");
    res.render('editar', { cliente });
});
app.post('/clientes/:id/editar', (req, res) => {
    const id = Number(req.params.id);
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return res.status(404).send("Cliente não encontrado");
    const novoNome = req.body.nome?.trim();
    if (!novoNome) return res.status(400).send("O campo nome é obrigatório!");
    cliente.nome = novoNome;
    res.redirect('/clientes');
});
app.post('/clientes/:id/excluir', (req, res) => {
    const id = Number(req.params.id);
    clientes = clientes.filter(c => c.id !== id);
    res.redirect('/clientes');
});

app.get('/produtos', (req, res) => res.render('produtos', { produtos }));
app.post('/produtos', (req, res) => {
    const nome = req.body.nome?.trim();
    const preco = parseFloat(req.body.preco);
    if (!nome || isNaN(preco)) return res.status(400).send("Nome e preço são obrigatórios!");
    produtos.push({ id: idCounterProdutos++, nome, preco: preco.toFixed(2) });
    res.redirect('/produtos');
});
app.get('/produtos/:id/editar', (req, res) => {
    const id = Number(req.params.id);
    const produto = produtos.find(p => p.id === id);
    if (!produto) return res.status(404).send("Produto não encontrado");
    res.render('editar', { produto });
});
app.post('/produtos/:id/editar', (req, res) => {
    const id = Number(req.params.id);
    const produto = produtos.find(p => p.id === id);
    if (!produto) return res.status(404).send("Produto não encontrado");
    const nome = req.body.nome?.trim();
    const preco = parseFloat(req.body.preco);
    if (!nome || isNaN(preco)) return res.status(400).send("Nome e preço são obrigatórios!");
    produto.nome = nome;
    produto.preco = preco.toFixed(2);
    res.redirect('/produtos');
});
app.post('/produtos/:id/excluir', (req, res) => {
    const id = Number(req.params.id);
    produtos = produtos.filter(p => p.id !== id);
    res.redirect('/produtos');
});

app.get('/vendas', (req, res) => res.render('vendas', { vendas }));
app.post('/vendas', (req, res) => {
    const cliente = req.body.cliente?.trim();
    const produto = req.body.produto?.trim();
    const valor = parseFloat(req.body.valor);
    if (!cliente || !produto || isNaN(valor)) return res.status(400).send("Todos os campos são obrigatórios!");
    vendas.push({ id: idCounterVendas++, cliente, produto, valor: valor.toFixed(2) });
    res.redirect('/vendas');
});
app.post('/vendas/:id/excluir', (req, res) => {
    const id = Number(req.params.id);
    vendas = vendas.filter(v => v.id !== id);
    res.redirect('/vendas');
});

app.use((req, res) => res.status(404).render('404'));

module.exports = app;
