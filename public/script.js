const api = 'http://localhost:3000/api/tickets';

// Carregar lista de tickets
async function carregarTickets() {
  const res = await fetch(api);
  const data = await res.json();
  const tbody = document.getElementById('ticket-list');
  if (tbody) {
    tbody.innerHTML = data.map(t => `
      <tr>
        <td>${t.id}</td>
        <td>${t.descricao}</td>
        <td style="color:${t.status === 'encerrado' ? 'red' : 'green'}">${t.status}</td>
        <td>
          <button onclick="abrir(${t.id})">Abrir</button>
        </td>
      </tr>`).join('');
  }
}

// Criar novo ticket
async function criarTicket(e) {
  e.preventDefault();
  const body = {
    descricao: document.getElementById('descricao').value,
    usuario: document.getElementById('usuario')?.value || 'Anônimo',
  };
  await fetch(api, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(body) 
  });
  window.location.href = 'dashboard.html';
}

// Abrir detalhes
function abrir(id) {
  window.location.href = `ticket.html?id=${id}`;
}

// Carregar detalhes
async function carregarDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  const res = await fetch(`${api}/${id}`);
  const t = await res.json();

  document.getElementById('ticket-details').innerHTML = `
    <p><strong>ID:</strong> ${t.id}</p>
    <p><strong>Descrição:</strong> ${t.descricao}</p>
    <p><strong>Status:</strong> ${t.status}</p>
    <button onclick="alterarStatus(${t.id}, '${t.status === 'aberto' ? 'encerrado' : 'aberto'}')">
      ${t.status === 'aberto' ? 'Encerrar Chamado' : 'Reabrir Chamado'}
    </button>
  `;
}

// Alterar status
async function alterarStatus(id, novoStatus) {
  await fetch(`${api}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: novoStatus })
  });
  alert('Status atualizado com sucesso!');
  carregarDetalhes();
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('ticket-list')) carregarTickets();
  if (document.getElementById('ticket-form')) document.getElementById('ticket-form').addEventListener('submit', criarTicket);
  if (document.getElementById('ticket-details')) carregarDetalhes();
});
