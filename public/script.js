const api = '/api/tickets';

// Carregar lista de tickets
async function carregarTickets() {
  const res = await fetch(api);
  const data = await res.json();
  const tbody = document.getElementById('ticket-list');
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:12px;">
          Nenhum chamado cadastrado. Clique em "Novo Chamado".
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = data.map(t => {
    const titulo = t.titulo || t.descricao || '-';
    const tipo = t.tipo || '-';
    const categoria = t.categoria || '-';
    const prioridade = t.prioridade || 'baixa';
    const solicitante = t.solicitante || '-';
    const responsavel = t.responsavel || '-';
    const status = t.status || 'aberto';

    return `
      <tr>
        <td>${t.id}</td>
        <td>${titulo}</td>
        <td>${tipo}</td>
        <td>${categoria}</td>
        <td class="prioridade prioridade-${prioridade}">
          ${prioridade}
        </td>
        <td>${solicitante}</td>
        <td>${responsavel}</td>
        <td style="color:${status === 'encerrado' ? 'red' : 'green'}">
          ${status}
        </td>
        <td>
          <button onclick="abrir(${t.id})">Abrir</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Criar novo ticket
async function criarTicket(e) {
  e.preventDefault();

  const body = {
    titulo: document.getElementById('titulo').value.trim(),
    descricao: document.getElementById('descricao').value.trim(),
    tipo: document.getElementById('tipo').value,
    categoria: document.getElementById('categoria').value,
    prioridade: document.getElementById('prioridade').value,
    responsavel: document.getElementById('responsavel').value.trim(),
    solicitante: (document.getElementById('solicitante').value || 'Anônimo').trim(),
  };

  try {
    const res = await fetch(api, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(body) 
    });

    if (!res.ok) {
      throw new Error('Erro ao salvar ticket na API');
    }

    window.location.href = 'dashboard.html';

  } catch (err) {
    console.error(err);
    alert('Não foi possível salvar o chamado. Garante que o servidor está rodando (node server.js) e que você abriu pelo http://localhost:3000/');
  }
}

// Abrir detalhes
function abrir(id) {
  window.location.href = `ticket.html?id=${id}`;
}

async function carregarDetalhes() {
  const container = document.getElementById('ticket-details');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    container.innerHTML = '<p>Chamado não encontrado.</p>';
    return;
  }

  const res = await fetch(`${api}/${id}`);
  const t = await res.json();

  const criadoEmFmt = t.criadoEm
    ? new Date(t.criadoEm).toLocaleString('pt-BR')
    : '-';

  container.innerHTML = `
    <p><strong>ID:</strong> ${t.id}</p>
    <p><strong>Título:</strong> ${t.titulo || '-'}</p>
    <p><strong>Descrição:</strong> ${t.descricao || '-'}</p>
    <p><strong>Tipo:</strong> ${t.tipo || '-'}</p>
    <p><strong>Categoria:</strong> ${t.categoria || '-'}</p>
    <p><strong>Prioridade:</strong> ${t.prioridade || '-'}</p>
    <p><strong>Solicitante:</strong> ${t.solicitante || '-'}</p>

    <div class="form-group" style="margin-top:10px;">
      <label for="novo-responsavel">Responsável</label>
      <input type="text" id="novo-responsavel" value="${t.responsavel || ''}">
    </div>

    <p style="margin-top:10px;"><strong>Status:</strong> ${t.status}</p>
    <p><strong>Criado em:</strong> ${criadoEmFmt}</p>

    <div class="form-actions" style="margin-top:16px;">
      <button type="button" onclick="salvarResponsavel(${t.id})">
        Salvar Responsável
      </button>
      <button type="button" onclick="alterarStatus(${t.id}, '${t.status === 'aberto' ? 'encerrado' : 'aberto'}')">
        ${t.status === 'aberto' ? 'Encerrar Chamado' : 'Reabrir Chamado'}
      </button>
    </div>
  `;
}


// Alterar status
async function alterarStatus(id, novoStatus) {
  await fetch(`${api}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: novoStatus })
  });
  alert('Status atualizado!');
  carregarDetalhes();
}

async function salvarResponsavel(id) {
  const input = document.getElementById('novo-responsavel');
  const novoResponsavel = input.value.trim();

  await fetch(`${api}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responsavel: novoResponsavel })
  });

  alert('Responsável atualizado!');
  carregarDetalhes();
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('ticket-list')) carregarTickets();
  if (document.getElementById('ticket-form')) {
    document.getElementById('ticket-form').addEventListener('submit', criarTicket);
  }
  if (document.getElementById('ticket-details')) carregarDetalhes();
  const btnVoltar = document.getElementById('btn-voltar');
  if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  }
});