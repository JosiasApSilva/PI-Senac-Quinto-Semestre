const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/tickets.json');

// Funções auxiliares para ler e gravar os dados
function readTickets() {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

function writeTickets(tickets) {
  fs.writeFileSync(dataPath, JSON.stringify(tickets, null, 2));
}

// Listar todos os tickets
router.get('/', (req, res) => {
  const tickets = readTickets();
  res.json(tickets);
});

// Obter ticket por ID
router.get('/:id', (req, res) => {
  const tickets = readTickets();
  const ticket = tickets.find(t => t.id === parseInt(req.params.id));

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket não encontrado' });
  }

  res.json(ticket);
});

// Criar novo ticket
router.post('/', (req, res) => {
  const tickets = readTickets();

  // Gera ID seguro mesmo se um dia apagar algum no meio
  const nextId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;

  const novoTicket = {
    id: nextId,
    titulo: req.body.titulo || '',
    descricao: req.body.descricao || '',
    tipo: req.body.tipo || '',
    categoria: req.body.categoria || '',
    prioridade: req.body.prioridade || 'baixa',
    // Responsável normalmente é definido depois, então pode vir vazio
    responsavel: req.body.responsavel || '',
    // Quem abriu o chamado
    solicitante: req.body.solicitante || 'Não informado',
    status: 'aberto',
    criadoEm: new Date().toISOString()
  };

  tickets.push(novoTicket);
  writeTickets(tickets);

  res.status(201).json(novoTicket);
});

// Atualizar status do ticket (encerrar)
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tickets = readTickets();
  const index = tickets.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Ticket não encontrado' });
  }

  const { status, responsavel } = req.body;

  if (status) {
    tickets[index].status = status;
  }

  if (responsavel !== undefined) {
    tickets[index].responsavel = responsavel;
  }

  writeTickets(tickets);
  res.json(tickets[index]);
});

module.exports = router;
