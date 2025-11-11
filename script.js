// Dados de exemplo
let equipamentos = [
    { id: 1, material: "Caixa de Som JBL", quantidade: 4, local: "barracao", categoria: "som", observacoes: "Boa estado" },
    { id: 2, material: "Mesa de Som Yamaha", quantidade: 2, local: "barracao", categoria: "som", observacoes: "Nova" },
    { id: 3, material: "Microfone Sem Fio", quantidade: 6, local: "silene", categoria: "som", observacoes: "2 com pilha fraca" },
    { id: 4, material: "Par 56 LED", quantidade: 24, local: "barracao", categoria: "iluminacao", observacoes: "Todos funcionando" },
    { id: 5, material: "Scanner Laser", quantidade: 2, local: "san-carlo", categoria: "iluminacao", observacoes: "Precisa de manutenção" },
    { id: 6, material: "Estrutura Metalica 6x6", quantidade: 2, local: "barracao", categoria: "estrutura", observacoes: "Completa" },
    { id: 7, material: "Projetor Epson", quantidade: 1, local: "silene", categoria: "projecao", observacoes: "Lâmpada nova" },
    { id: 8, material: "Cabo de Rede 20m", quantidade: 10, local: "barracao", categoria: "acessorio", observacoes: "Bom estado" }
];

let orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
let checklists = JSON.parse(localStorage.getItem('checklists')) || [];

// Sistema de Login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginPage = document.getElementById('loginPage');
    const appContainer = document.getElementById('appContainer');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = this.username.value;
            const password = this.password.value;
            
            if (username && password) {
                showLoading();
                setTimeout(() => {
                    if (loginPage) loginPage.style.display = 'none';
                    if (appContainer) appContainer.style.display = 'flex';
                    hideLoading();
                    showToast('Login realizado com sucesso!', 'success');
                }, 1000);
            } else {
                showToast('Preencha usuário e senha!', 'warning');
            }
        });
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
    showToast('Logout realizado com sucesso!', 'info');
});

// Navegação entre páginas
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        
        const pageId = this.getAttribute('data-page');
        document.getElementById(pageId).classList.add('active');
        
        document.getElementById('currentPageTitle').textContent = this.querySelector('span').textContent;
        
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar').classList.remove('active');
        }
        
        if (pageId === 'equipamentos') {
            carregarEquipamentos();
        } else if (pageId === 'orcamentos') {
            carregarOrcamentos();
            carregarEquipamentosOrcamento();
        } else if (pageId === 'checklists') {
            carregarEventosChecklist();
        } else if (pageId === 'eventos-agendados') {
            carregarEventosAgendados();
        } else if (pageId === 'agendamento') {
            inicializarCalendario();
        }
    });
});

// Menu Mobile
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.querySelector('.sidebar');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Fechar menu ao clicar fora (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !mobileMenuToggle.contains(e.target) &&
        sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// Verificar tamanho da tela
// MENU MOBILE FUNCIONAL - SPRINT 1
function checkScreenSize() {
    if (window.innerWidth <= 768) {
        mobileMenuToggle.style.display = 'block';
        sidebar.classList.remove('active');
    } else {
        mobileMenuToggle.style.display = 'none';
        sidebar.classList.add('active');
    }
}

// TOGGLE DO MENU MOBILE
mobileMenuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    sidebar.classList.toggle('active');
});

// FECHAR MENU AO CLICAR FORA
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !mobileMenuToggle.contains(e.target) &&
        sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// FECHAR MENU AO CLICAR EM LINK
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
});

// Funções de utilidade
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Sistema de Equipamentos
function carregarEquipamentos() {
    const tabela = document.querySelector('#tabela-equipamentos tbody');
    tabela.innerHTML = '';
    
    equipamentos.forEach(equip => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${equip.material}</td>
            <td>${equip.quantidade}</td>
            <td><span class="status-${equip.local}">${formatarLocal(equip.local)}</span></td>
            <td>${equip.observacoes}</td>
        `;
        tabela.appendChild(tr);
    });
}

function formatarLocal(local) {
    const locais = {
        'barracao': 'Barracão',
        'silene': 'Silene',
        'san-carlo': 'San Carlo'
    };
    return locais[local] || local;
}

// Filtros de equipamentos
document.getElementById('filtro-categoria').addEventListener('change', aplicarFiltros);
document.getElementById('filtro-local').addEventListener('change', aplicarFiltros);
document.getElementById('busca').addEventListener('input', aplicarFiltros);

function aplicarFiltros() {
    const categoria = document.getElementById('filtro-categoria').value;
    const local = document.getElementById('filtro-local').value;
    const busca = document.getElementById('busca').value.toLowerCase();
    
    const equipamentosFiltrados = equipamentos.filter(equip => {
        return (!categoria || equip.categoria === categoria) &&
               (!local || equip.local === local) &&
               (!busca || equip.material.toLowerCase().includes(busca));
    });
    
    const tabela = document.querySelector('#tabela-equipamentos tbody');
    tabela.innerHTML = '';
    
    equipamentosFiltrados.forEach(equip => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${equip.material}</td>
            <td>${equip.quantidade}</td>
            <td><span class="status-${equip.local}">${formatarLocal(equip.local)}</span></td>
            <td>${equip.observacoes}</td>
        `;
        tabela.appendChild(tr);
    });
}

// Sistema de Orçamentos
function carregarEquipamentosOrcamento() {
    const container = document.getElementById('lista-equipamentos');
    container.innerHTML = '';
    
    equipamentos.forEach(equip => {
        const div = document.createElement('div');
        div.className = 'equipamento-card';
        div.innerHTML = `
            <h4>${equip.material}</h4>
            <p>Disponível: ${equip.quantidade} unidades</p>
            <p>Local: ${formatarLocal(equip.local)}</p>
            <div class="checkbox-container">
                <input type="checkbox" id="equip-${equip.id}" data-id="${equip.id}" data-nome="${equip.material}" data-valor="${calcularValorEquipamento(equip)}">
                <label for="equip-${equip.id}">Incluir no orçamento</label>
            </div>
            <div class="quantidade-container" style="display: none; margin-top: 10px;">
                <label>Quantidade:</label>
                <input type="number" min="1" max="${equip.quantidade}" value="1" data-id="${equip.id}" style="width: 80px; margin-left: 10px;">
            </div>
        `;
        container.appendChild(div);
    });
    
    document.querySelectorAll('#lista-equipamentos input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const quantidadeContainer = this.closest('.equipamento-card').querySelector('.quantidade-container');
            quantidadeContainer.style.display = this.checked ? 'block' : 'none';
            calcularTotalOrcamento();
        });
    });
    
    document.querySelectorAll('#lista-equipamentos input[type="number"]').forEach(input => {
        input.addEventListener('input', calcularTotalOrcamento);
    });
}

// Controle do formulário de orçamentos
document.addEventListener('DOMContentLoaded', function() {
    const btnNovo = document.getElementById('btn-novo-orcamento');
    const formContainer = document.getElementById('form-container-orcamento');
    const btnCancelar = document.getElementById('btn-cancelar');

    if (btnNovo && formContainer) {
        btnNovo.addEventListener('click', function() {
            formContainer.style.display = 'block';
            carregarEquipamentosOrcamento();
            formContainer.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', function() {
            formContainer.style.display = 'none';
            document.getElementById('form-orcamento').reset();
            document.getElementById('total-orcamento-form').textContent = '0.00';
            document.querySelectorAll('#lista-equipamentos input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.querySelectorAll('.quantidade-container').forEach(container => container.style.display = 'none');
        });
    }
});

function calcularValorEquipamento(equipamento) {
    const valores = {
        'som': 150,
        'iluminacao': 80,
        'estrutura': 300,
        'projecao': 200,
        'controle': 100,
        'acessorio': 50
    };
    return valores[equipamento.categoria] || 100;
}

function calcularTotalOrcamento() {
    let total = 0;
    
    document.querySelectorAll('#lista-equipamentos input[type="checkbox"]:checked').forEach(checkbox => {
        const id = checkbox.getAttribute('data-id');
        const valorUnitario = parseFloat(checkbox.getAttribute('data-valor'));
        const quantidadeInput = document.querySelector(`#lista-equipamentos input[type="number"][data-id="${id}"]`);
        const quantidade = parseInt(quantidadeInput.value) || 1;
        
        total += valorUnitario * quantidade;
    });
    
    document.getElementById('total-orcamento-form').textContent = total.toFixed(2);
}

// Formulário de orçamento
document.getElementById('form-orcamento').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cliente = document.getElementById('cliente').value;
    const tipoEvento = document.getElementById('evento').value;
    const data = document.getElementById('data').value;
    const local = document.getElementById('local').value;
    const observacoes = document.getElementById('observacoes').value;
    
    const equipamentosSelecionados = [];
    document.querySelectorAll('#lista-equipamentos input[type="checkbox"]:checked').forEach(checkbox => {
        const id = checkbox.getAttribute('data-id');
        const nome = checkbox.getAttribute('data-nome');
        const valorUnitario = parseFloat(checkbox.getAttribute('data-valor'));
        const quantidadeInput = document.querySelector(`#lista-equipamentos input[type="number"][data-id="${id}"]`);
        const quantidade = parseInt(quantidadeInput.value) || 1;
        
        equipamentosSelecionados.push({
            id: parseInt(id),
            nome: nome,
            quantidade: quantidade,
            valorUnitario: valorUnitario,
            subtotal: valorUnitario * quantidade
        });
    });
    
    if (equipamentosSelecionados.length === 0) {
        showToast('Selecione pelo menos um equipamento!', 'warning');
        return;
    }
    
    const total = equipamentosSelecionados.reduce((sum, item) => sum + item.subtotal, 0);
    
    const novoOrcamento = {
        id: Date.now(),
        cliente: cliente,
        tipoEvento: tipoEvento,
        data: data,
        local: local,
        observacoes: observacoes,
        equipamentos: equipamentosSelecionados,
        total: total,
        status: 'pendente',
        dataCriacao: new Date().toISOString()
    };
    
    orcamentos.push(novoOrcamento);
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    
    showToast('Orçamento criado com sucesso!', 'success');
    
    document.getElementById('form-container-orcamento').style.display = 'none';
    this.reset();
    document.getElementById('total-orcamento-form').textContent = '0.00';
    document.querySelectorAll('#lista-equipamentos input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.quantidade-container').forEach(container => container.style.display = 'none');
    
    carregarOrcamentos();
});

function carregarOrcamentos() {
    const container = document.getElementById('lista-orcamentos');
    if (!container) return;
    
    container.innerHTML = '';
    
    orcamentos.forEach(orc => {
        const div = document.createElement('div');
        div.className = 'orcamento-item';
        div.style.cssText = `
            background: rgba(40,40,40,0.8);
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid ${getStatusColor(orc.status)};
            cursor: pointer;
        `;
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin: 0 0 5px 0; color: var(--primary);">${orc.cliente}</h4>
                    <p style="margin: 0; color: var(--gray);">${formatarData(orc.data)} - ${orc.local}</p>
                    <p style="margin: 0; color: var(--gray);">${orc.tipoEvento}</p>
                </div>
                <div style="text-align: right;">
                    <div style="background: ${getStatusColor(orc.status)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; display: inline-block; margin-bottom: 5px;">
                        ${orc.status.toUpperCase()}
                    </div>
                    <div style="font-weight: bold; margin-top: 5px;">R$ ${orc.total.toFixed(2)}</div>
                </div>
            </div>
            ${orc.status === 'pendente' ? `
            <div style="margin-top: 10px; display: flex; gap: 10px;">
                <button class="btn-aceitar" data-id="${orc.id}" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Aceitar</button>
                <button class="btn-recusar" data-id="${orc.id}" style="background: #F44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Recusar</button>
            </div>
            ` : ''}
        `;
        
        div.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-aceitar') && !e.target.classList.contains('btn-recusar')) {
                mostrarDetalhesOrcamento(orc.id);
            }
        });
        
        container.appendChild(div);
    });
    
    document.querySelectorAll('.btn-aceitar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const orcamentoId = parseInt(this.getAttribute('data-id'));
            aceitarOrcamento(orcamentoId);
        });
    });
    
    document.querySelectorAll('.btn-recusar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const orcamentoId = parseInt(this.getAttribute('data-id'));
            recusarOrcamento(orcamentoId);
        });
    });
}

function aceitarOrcamento(id) {
    const orcamento = orcamentos.find(o => o.id === id);
    if (!orcamento) return;
    
    const equipamentosDisponiveis = verificarDisponibilidade(orcamento.equipamentos);
    
    if (!equipamentosDisponiveis.todosDisponiveis) {
        showToast(`Equipamento "${equipamentosDisponiveis.equipamentoIndisponivel}" não disponível na quantidade solicitada!`, 'warning');
        return;
    }
    
    orcamento.status = 'aprovado';
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    
    reservarEquipamentos(orcamento.equipamentos);
    criarEventoFromOrcamento(orcamento);
    
    showToast('Orçamento aceito e evento criado!', 'success');
    carregarOrcamentos();
}

function recusarOrcamento(id) {
    const orcamento = orcamentos.find(o => o.id === id);
    if (!orcamento) return;
    
    orcamento.status = 'recusado';
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    
    showToast('Orçamento recusado!', 'info');
    carregarOrcamentos();
}

function verificarDisponibilidade(equipamentosOrcamento) {
    for (const equipOrc of equipamentosOrcamento) {
        const equipamento = equipamentos.find(e => e.id === equipOrc.id);
        if (!equipamento || equipamento.quantidade < equipOrc.quantidade) {
            return {
                todosDisponiveis: false,
                equipamentoIndisponivel: equipOrc.nome
            };
        }
    }
    return { todosDisponiveis: true };
}

function reservarEquipamentos(equipamentosOrcamento) {
    equipamentosOrcamento.forEach(equipOrc => {
        const equipamento = equipamentos.find(e => e.id === equipOrc.id);
        if (equipamento) {
            equipamento.quantidade -= equipOrc.quantidade;
        }
    });
    localStorage.setItem('equipamentos', JSON.stringify(equipamentos));
}

function criarEventoFromOrcamento(orcamento) {
    const novoEvento = {
        id: Date.now(),
        cliente: orcamento.cliente,
        tipoEvento: orcamento.tipoEvento,
        data: orcamento.data,
        local: orcamento.local,
        observacoes: orcamento.observacoes,
        equipamentos: orcamento.equipamentos,
        orcamentoId: orcamento.id,
        status: 'agendado'
    };
    
    eventos.push(novoEvento);
    localStorage.setItem('eventos', JSON.stringify(eventos));
    
    showToast('Evento criado automaticamente!', 'success');
}

function getStatusColor(status) {
    const cores = {
        'pendente': '#FFC107',
        'aprovado': '#4CAF50',
        'recusado': '#F44336'
    };
    return cores[status] || '#8e8e8e';
}

function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Sistema de Checklists
function carregarEventosChecklist() {
    const select = document.getElementById('selecionar-evento');
    select.innerHTML = '<option value="">Selecione um evento...</option>';
    
    eventos.forEach(evento => {
        const option = document.createElement('option');
        option.value = evento.id;
        option.textContent = `${evento.cliente} - ${formatarData(evento.data)}`;
        select.appendChild(option);
    });
    
    select.addEventListener('change', function() {
        const eventoId = parseInt(this.value);
        if (eventoId) {
            carregarDetalhesEventoChecklist(eventoId);
        } else {
            document.getElementById('detalhes-evento').style.display = 'none';
        }
    });
}

function carregarDetalhesEventoChecklist(eventoId) {
    const evento = eventos.find(e => e.id === eventoId);
    if (!evento) return;
    
    const checklistSalvo = checklists.find(c => c.eventoId === eventoId);
    
    document.getElementById('checklist-cliente').textContent = evento.cliente;
    document.getElementById('checklist-data').textContent = formatarData(evento.data);
    document.getElementById('checklist-local').textContent = evento.local;
    
    const container = document.getElementById('checklist-equipamentos');
    container.innerHTML = '';
    
    evento.equipamentos.forEach(equip => {
        let statusSelecionado = 'pendente';
        if (checklistSalvo && checklistSalvo.equipamentos) {
            const equipamentoSalvo = checklistSalvo.equipamentos.find(e => e.equipamentoId === equip.id);
            if (equipamentoSalvo) {
                statusSelecionado = equipamentoSalvo.status;
            }
        }
        
        const div = document.createElement('div');
        div.className = 'checklist-item';
        div.innerHTML = `
            <div>
                <strong>${equip.nome}</strong>
                <div style="font-size: 0.9em; color: var(--gray);">Quantidade: ${equip.quantidade}</div>
            </div>
            <div>
                <select class="status-equipamento" data-id="${equip.id}" style="background: rgba(40,40,40,0.8); color: white; border: 1px solid #444; padding: 5px; border-radius: 4px;">
                    <option value="pendente" ${statusSelecionado === 'pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="conferido" ${statusSelecionado === 'conferido' ? 'selected' : ''}>Conferido</option>
                    <option value="testado" ${statusSelecionado === 'testado' ? 'selected' : ''}>Testado</option>
                    <option value="pronto" ${statusSelecionado === 'pronto' ? 'selected' : ''}>Pronto</option>
                </select>
            </div>
        `;
        container.appendChild(div);
    });
    
    if (checklistSalvo) {
        document.getElementById('responsavel').value = checklistSalvo.responsavel || '';
    }
    
    document.getElementById('detalhes-evento').style.display = 'block';
}

function salvarChecklist() {
    const eventoId = parseInt(document.getElementById('selecionar-evento').value);
    const responsavel = document.getElementById('responsavel').value;
    
    if (!eventoId || !responsavel) {
        showToast('Preencha todos os campos!', 'warning');
        return;
    }
    
    const statusEquipamentos = [];
    document.querySelectorAll('.status-equipamento').forEach(select => {
        const equipId = select.getAttribute('data-id');
        const status = select.value;
        
        statusEquipamentos.push({
            equipamentoId: parseInt(equipId),
            status: status
        });
    });
    
    const checklistExistenteIndex = checklists.findIndex(c => c.eventoId === eventoId);
    
    const checklist = {
        id: checklistExistenteIndex !== -1 ? checklists[checklistExistenteIndex].id : Date.now(),
        eventoId: eventoId,
        responsavel: responsavel,
        equipamentos: statusEquipamentos,
        dataCriacao: checklistExistenteIndex !== -1 ? checklists[checklistExistenteIndex].dataCriacao : new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
    };
    
    if (checklistExistenteIndex !== -1) {
        checklists[checklistExistenteIndex] = checklist;
        showToast('Checklist atualizado com sucesso!', 'success');
    } else {
        checklists.push(checklist);
        showToast('Checklist salvo com sucesso!', 'success');
    }
    
    localStorage.setItem('checklists', JSON.stringify(checklists));
    
    setTimeout(() => {
        carregarDetalhesEventoChecklist(eventoId);
    }, 1000);
}

// Conectar o botão salvar checklist
document.addEventListener('DOMContentLoaded', function() {
    const btnSalvar = document.getElementById('btn-salvar-checklist');
    if (btnSalvar) {
        btnSalvar.addEventListener('click', function(e) {
            e.preventDefault();
            salvarChecklist();
        });
    }
});

// Sistema de Eventos Agendados
function carregarEventosAgendados() {
    const container = document.getElementById('lista-eventos');
    container.innerHTML = '';
    
    eventos.forEach(evento => {
        const div = document.createElement('div');
        div.className = 'evento-item';
        div.style.cssText = `
            background: rgba(40,40,40,0.8);
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid var(--primary);
        `;
        div.innerHTML = `
            <h4 style="margin: 0 0 5px 0; color: var(--primary);">${evento.cliente}</h4>
            <p style="margin: 0 0 5px 0;"><strong>Data:</strong> ${formatarData(evento.data)}</p>
            <p style="margin: 0 0 5px 0;"><strong>Local:</strong> ${evento.local}</p>
            <p style="margin: 0 0 5px 0;"><strong>Tipo:</strong> ${evento.tipoEvento}</p>
            <div style="margin-top: 10px;">
                <strong>Equipamentos:</strong>
                <ul style="margin: 5px 0; padding-left: 20px;">
                    ${evento.equipamentos.map(equip => `<li>${equip.nome} (${equip.quantidade}x)</li>`).join('')}
                </ul>
            </div>
        `;
        container.appendChild(div);
    });
}

// Sistema de Calendário
let currentDate = new Date();

function inicializarCalendario() {
    renderCalendar();
    
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    document.getElementById('today').addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar();
    });
}

function renderCalendar() {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    document.getElementById('current-month').textContent = 
        `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';
    
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        dayElement.appendChild(dayHeader);
        
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayEvents = eventos.filter(evento => {
            const eventDate = new Date(evento.data);
            return eventDate.toDateString() === currentDay.toDateString();
        });
        
        dayEvents.forEach(evento => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.textContent = evento.cliente;
            dayElement.appendChild(eventElement);
        });
        
        calendarGrid.appendChild(dayElement);
    }
    
    carregarListaEventos();
}

function carregarListaEventos() {
    const container = document.getElementById('eventos-lista');
    container.innerHTML = '';
    
    eventos.forEach(evento => {
        const div = document.createElement('div');
        div.className = 'evento-item';
        div.style.cssText = `
            background: rgba(40,40,40,0.8);
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid var(--primary);
        `;
        div.innerHTML = `
            <h4 style="margin: 0 0 5px 0; color: var(--primary);">${evento.cliente}</h4>
            <p style="margin: 0 0 5px 0;"><strong>Data:</strong> ${formatarData(evento.data)}</p>
            <p style="margin: 0 0 5px 0;"><strong>Local:</strong> ${evento.local}</p>
            <p style="margin: 0;"><strong>Tipo:</strong> ${evento.tipoEvento}</p>
        `;
        container.appendChild(div);
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    checkScreenSize();
    carregarEquipamentos();
    
    if (eventos.length === 0) {
        eventos = [
            {
                id: 1,
                cliente: "Maria Silva",
                tipoEvento: "Casamento",
                data: "2024-06-15",
                local: "Salão de Festas Jardim",
                equipamentos: [
                    { id: 1, nome: "Caixa de Som JBL", quantidade: 2 },
                    { id: 4, nome: "Par 56 LED", quantidade: 12 },
                    { id: 3, nome: "Microfone Sem Fio", quantidade: 2 }
                ]
            },
            {
                id: 2,
                cliente: "Empresa XYZ",
                tipoEvento: "Evento Corporativo",
                data: "2024-06-20",
                local: "Centro de Convenções",
                equipamentos: [
                    { id: 2, nome: "Mesa de Som Yamaha", quantidade: 1 },
                    { id: 1, nome: "Caixa de Som JBL", quantidade: 4 },
                    { id: 7, nome: "Projetor Epson", quantidade: 1 }
                ]
            }
        ];
        localStorage.setItem('eventos', JSON.stringify(eventos));
    }
});

// FUNÇÃO ATUALIZAR DASHBOARD - SPRINT 1
function atualizarDashboard() {
    console.log('Atualizando dashboard...');
    
    // 1. TOTAL DE EQUIPAMENTOS (soma todas as quantidades)
    const totalEquipamentos = equipamentos.reduce((sum, equip) => sum + equip.quantidade, 0);
    
    // 2. EVENTOS ATIVOS (eventos com data futura)
    const hoje = new Date().toISOString().split('T')[0];
    const eventosAtivos = eventos.filter(evento => evento.data >= hoje).length;
    
    // 3. TOTAL DE ORÇAMENTOS
    const totalOrcamentos = orcamentos.length;
    
    // 4. CHECKLISTS CONCLUÍDOS (todos equipamentos com status "pronto")
    const totalChecklists = checklists.length;
    const checklistsConcluidos = checklists.filter(checklist => {
        const todosProntos = checklist.equipamentos.every(equip => equip.status === 'pronto');
        return todosProntos;
    }).length;
    
    const percentualChecklists = totalChecklists > 0 ? 
        Math.round((checklistsConcluidos / totalChecklists) * 100) : 0;
    
    // ATUALIZAR INTERFACE
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length === 4) {
        statCards[0].querySelector('.stat-value').textContent = totalEquipamentos;
        statCards[1].querySelector('.stat-value').textContent = eventosAtivos;
        statCards[2].querySelector('.stat-value').textContent = totalOrcamentos;
        statCards[3].querySelector('.stat-value').textContent = percentualChecklists + '%';
    }
    
    console.log('Dashboard atualizado:', {
        equipamentos: totalEquipamentos,
        eventos: eventosAtivos,
        orcamentos: totalOrcamentos,
        checklists: percentualChecklists + '%'
    });
}

// CHAMAR QUANDO DASHBOARD CARREGAR
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar dashboard quando a página for carregada
    if (document.getElementById('dashboard').classList.contains('active')) {
        atualizarDashboard();
    }
    
    // Atualizar também quando navegar para dashboard
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (this.getAttribute('data-page') === 'dashboard') {
                setTimeout(atualizarDashboard, 100);
            }
        });
    });
});

