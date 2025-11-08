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

// Sistema de Login - COM VERIFICAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginPage = document.getElementById('loginPage');
    const appContainer = document.getElementById('appContainer');
    
    console.log('Login form:', loginForm); // Debug
    console.log('Login page:', loginPage); // Debug
    console.log('App container:', appContainer); // Debug
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = this.username.value;
            const password = this.password.value;
            
            console.log('Tentando login:', username, password); // Debug
            
            // Simulação de login
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
    } else {
        console.error('Formulário de login não encontrado!');
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
        
        // Remove classe active de todos os links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        // Adiciona classe active ao link clicado
        this.classList.add('active');
        
        // Oculta todas as páginas
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        
        // Mostra a página correspondente
        const pageId = this.getAttribute('data-page');
        document.getElementById(pageId).classList.add('active');
        
        // Atualiza o título da página
        document.getElementById('currentPageTitle').textContent = this.querySelector('span').textContent;
        
        // Fecha sidebar no mobile
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar').classList.remove('active');
        }
        
        // Carrega dados específicos da página
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

// Verificar tamanho da tela e mostrar/ocultar menu mobile
function checkScreenSize() {
    if (window.innerWidth <= 768) {
        mobileMenuToggle.style.display = 'block';
        sidebar.classList.remove('active');
    } else {
        mobileMenuToggle.style.display = 'none';
        sidebar.classList.add('active');
    }
}

window.addEventListener('resize', checkScreenSize);
checkScreenSize();

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
    
    // Event listeners para checkboxes
    document.querySelectorAll('#lista-equipamentos input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const quantidadeContainer = this.closest('.equipamento-card').querySelector('.quantidade-container');
            quantidadeContainer.style.display = this.checked ? 'block' : 'none';
            calcularTotalOrcamento();
        });
    });
    
    // Event listeners para inputs de quantidade
    document.querySelectorAll('#lista-equipamentos input[type="number"]').forEach(input => {
        input.addEventListener('input', calcularTotalOrcamento);
    });
}

function calcularValorEquipamento(equipamento) {
    // Valores fictícios baseados no tipo de equipamento
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
    
    // Coletar equipamentos selecionados
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
        
        // Evento para mostrar detalhes
        div.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-aceitar') && !e.target.classList.contains('btn-recusar')) {
                mostrarDetalhesOrcamento(orc.id);
            }
        });
        
        container.appendChild(div);
    });
    
    // Adicionar eventos aos botões
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

// Função para aceitar orçamento
function aceitarOrcamento(id) {
    const orcamento = orcamentos.find(o => o.id === id);
    if (!orcamento) return;
    
    // Verificar disponibilidade dos equipamentos
    const equipamentosDisponiveis = verificarDisponibilidade(orcamento.equipamentos);
    
    if (!equipamentosDisponiveis.todosDisponiveis) {
        showToast(`Equipamento "${equipamentosDisponiveis.equipamentoIndisponivel}" não disponível na quantidade solicitada!`, 'warning');
        return;
    }
    
    // Atualizar status do orçamento
    orcamento.status = 'aprovado';
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    
    // Reservar equipamentos
    reservarEquipamentos(orcamento.equipamentos);
    
    // Criar evento automaticamente
    criarEventoFromOrcamento(orcamento);
    
    showToast('Orçamento aceito e evento criado!', 'success');
    carregarOrcamentos();
    
    // Fechar detalhes se estiver aberto
    fecharDetalhes();
}

// Função para recusar orçamento
function recusarOrcamento(id) {
    const orcamento = orcamentos.find(o => o.id === id);
    if (!orcamento) return;
    
    orcamento.status = 'recusado';
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    
    showToast('Orçamento recusado!', 'info');
    carregarOrcamentos();
    fecharDetalhes();
}

// Verificar disponibilidade dos equipamentos
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

// Reservar equipamentos
function reservarEquipamentos(equipamentosOrcamento) {
    equipamentosOrcamento.forEach(equipOrc => {
        const equipamento = equipamentos.find(e => e.id === equipOrc.id);
        if (equipamento) {
            equipamento.quantidade -= equipOrc.quantidade;
        }
    });
    localStorage.setItem('equipamentos', JSON.stringify(equipamentos));
}

// Criar evento a partir do orçamento
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

// Atualizar a função mostrarDetalhesOrcamento para incluir botões
function mostrarDetalhesOrcamento(id) {
    const orcamento = orcamentos.find(o => o.id === id);
    if (!orcamento) return;
    
    document.getElementById('orcamento-titulo').textContent = `Orçamento - ${orcamento.cliente}`;
    document.getElementById('orc-cliente').textContent = orcamento.cliente;
    document.getElementById('orc-data').textContent = formatarData(orcamento.data);
    document.getElementById('orc-local').textContent = orcamento.local;
    document.getElementById('orc-status').textContent = orcamento.status.toUpperCase();
    document.getElementById('orc-tipo').textContent = orcamento.tipoEvento;
    document.getElementById('orc-observacoes').textContent = orcamento.observacoes || 'Nenhuma';
    
    const tabela = document.getElementById('tabela-equipamentos-orc');
    if (tabela) {
        tabela.innerHTML = '';
        
        orcamento.equipamentos.forEach(equip => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${equip.nome}</td>
                <td>${equip.quantidade}</td>
                <td>R$ ${equip.valorUnitario.toFixed(2)}</td>
                <td>R$ ${equip.subtotal.toFixed(2)}</td>
            `;
            tabela.appendChild(tr);
        });
    }
    
    document.getElementById('total-orcamento').textContent = `R$ ${orcamento.total.toFixed(2)}`;
    
    // Adicionar botões de ação nos detalhes
    const botoesContainer = document.getElementById('botoes-acao-orcamento');
    if (botoesContainer) {
        if (orcamento.status === 'pendente') {
            botoesContainer.innerHTML = `
                <button onclick="aceitarOrcamento(${orcamento.id})" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Aceitar Orçamento</button>
                <button onclick="recusarOrcamento(${orcamento.id})" style="background: #F44336; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Recusar Orçamento</button>
            `;
        } else {
            botoesContainer.innerHTML = `
                <div style="color: ${getStatusColor(orcamento.status)}; font-weight: bold;">
                    Status: ${orcamento.status.toUpperCase()}
                </div>
            `;
        }
    }
    
    document.querySelector('.eventos-container').style.display = 'none';
    document.getElementById('detalhes-orcamento').style.display = 'block';
}

// Adicionar este CSS para os botões
function adicionarCSSBotoes() {
    const style = document.createElement('style');
    style.textContent = `
        .btn-aceitar:hover {
            background: #45a049 !important;
            transform: translateY(-1px);
        }
        
        .btn-recusar:hover {
            background: #d32f2f !important;
            transform: translateY(-1px);
        }
        
        .orcamento-item {
            transition: all 0.3s ease;
        }
        
        .orcamento-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);
}

// Inicializar dados de exemplo
function inicializarDadosExemplo() {
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
            ],
            status: 'agendado'
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
            ],
            status: 'agendado'
        }
    ];
    localStorage.setItem('eventos', JSON.stringify(eventos));
    
    // Adicionar alguns orçamentos de exemplo
    orcamentos = [
        {
            id: 1,
            cliente: "João Santos",
            tipoEvento: "Aniversário",
            data: "2024-07-01",
            local: "Casa de Festas",
            observacoes: "Evento para 50 pessoas",
            equipamentos: [
                { id: 1, nome: "Caixa de Som JBL", quantidade: 2, valorUnitario: 150, subtotal: 300 },
                { id: 4, nome: "Par 56 LED", quantidade: 8, valorUnitario: 80, subtotal: 640 }
            ],
            total: 940,
            status: 'pendente',
            dataCriacao: new Date().toISOString()
        }
    ];
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    localStorage.setItem('equipamentos', JSON.stringify(equipamentos));
}

// Chamar a função para adicionar CSS quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    adicionarCSSBotoes();
});

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

function mostrarDetalhesOrcamento(id) {
    const orcamento = orcamentos.find(o => o.id === id);
    if (!orcamento) return;
    
    document.getElementById('orcamento-titulo').textContent = `Orçamento - ${orcamento.cliente}`;
    document.getElementById('orc-cliente').textContent = orcamento.cliente;
    document.getElementById('orc-data').textContent = formatarData(orcamento.data);
    document.getElementById('orc-local').textContent = orcamento.local;
    document.getElementById('orc-status').textContent = orcamento.status.toUpperCase();
    
    const tabela = document.getElementById('tabela-equipamentos-orc');
    tabela.innerHTML = '';
    
    orcamento.equipamentos.forEach(equip => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${equip.nome}</td>
            <td>${equip.quantidade}</td>
            <td>1</td>
            <td>R$ ${equip.valorUnitario.toFixed(2)}</td>
            <td>R$ ${equip.subtotal.toFixed(2)}</td>
        `;
        tabela.appendChild(tr);
    });
    
    document.getElementById('total-orcamento').textContent = `R$ ${orcamento.total.toFixed(2)}`;
    
    document.querySelector('.eventos-container').style.display = 'none';
    document.getElementById('detalhes-orcamento').style.display = 'block';
}

function fecharDetalhes() {
    document.getElementById('detalhes-orcamento').style.display = 'none';
    document.querySelector('.eventos-container').style.display = 'block';
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
    console.log('🔍 Carregando evento:', eventoId);
    
    const evento = eventos.find(e => e.id === eventoId);
    if (!evento) return;
    
    // VERIFICAR SE JÁ EXISTE CHECKLIST SALVO PARA ESTE EVENTO
    const checklistSalvo = checklists.find(c => c.eventoId === eventoId);
    console.log('📋 Checklist salvo encontrado:', checklistSalvo);
    
    document.getElementById('checklist-cliente').textContent = evento.cliente;
    document.getElementById('checklist-data').textContent = formatarData(evento.data);
    document.getElementById('checklist-local').textContent = evento.local;
    
    const container = document.getElementById('checklist-equipamentos');
    container.innerHTML = '';
    
    evento.equipamentos.forEach(equip => {
        // ENCONTRAR O STATUS SALVO PARA ESTE EQUIPAMENTO (se existir)
        let statusSelecionado = 'pendente'; // valor padrão
        if (checklistSalvo && checklistSalvo.equipamentos) {
            const equipamentoSalvo = checklistSalvo.equipamentos.find(e => e.equipamentoId === equip.id);
            if (equipamentoSalvo) {
                statusSelecionado = equipamentoSalvo.status;
                console.log(`✅ Equipamento ${equip.id} - Status carregado: ${statusSelecionado}`);
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
    
    // PREENCHER O RESPONSÁVEL SE JÁ EXISTIR CHECKLIST
    if (checklistSalvo) {
        document.getElementById('responsavel').value = checklistSalvo.responsavel || '';
        console.log('👤 Responsável carregado:', checklistSalvo.responsavel);
    }
    
    document.getElementById('detalhes-evento').style.display = 'block';
}

// 🔥 REMOVA A OUTRA FUNÇÃO salvarChecklist() E MANTENHA APENAS ESTA:
function salvarChecklist() {
    console.log('💾 Tentando salvar checklist...');
    
    const eventoId = parseInt(document.getElementById('selecionar-evento').value);
    const responsavel = document.getElementById('responsavel').value;
    
    console.log('Dados:', { eventoId, responsavel });
    
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
        
        console.log(`📦 Equipamento ${equipId} - Status: ${status}`);
    });
    
    // VERIFICAR SE JÁ EXISTE CHECKLIST PARA ESTE EVENTO
    const checklistExistenteIndex = checklists.findIndex(c => c.eventoId === eventoId);
    console.log('Índice do checklist existente:', checklistExistenteIndex);
    
    const checklist = {
        id: checklistExistenteIndex !== -1 ? checklists[checklistExistenteIndex].id : Date.now(),
        eventoId: eventoId,
        responsavel: responsavel,
        equipamentos: statusEquipamentos,
        dataCriacao: checklistExistenteIndex !== -1 ? checklists[checklistExistenteIndex].dataCriacao : new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
    };
    
    // SE JÁ EXISTIR, ATUALIZAR. SE NÃO, ADICIONAR NOVO.
    if (checklistExistenteIndex !== -1) {
        checklists[checklistExistenteIndex] = checklist;
        console.log('🔄 Checklist atualizado');
        showToast('Checklist atualizado com sucesso!', 'success');
    } else {
        checklists.push(checklist);
        console.log('🆕 Novo checklist criado');
        showToast('Checklist salvo com sucesso!', 'success');
    }
    
    // SALVAR NO LOCALSTORAGE
    localStorage.setItem('checklists', JSON.stringify(checklists));
    console.log('💾 Checklists salvos:', checklists);
    
    // RECARREGAR OS DADOS PARA VERIFICAR
    setTimeout(() => {
        carregarDetalhesEventoChecklist(eventoId);
    }, 1000);
}

// Adicione esta função para conectar o botão
document.addEventListener('DOMContentLoaded', function() {
    // Conectar o botão salvar checklist
    const btnSalvar = document.getElementById('btn-salvar-checklist');
    if (btnSalvar) {
        btnSalvar.addEventListener('click', function(e) {
            e.preventDefault();
            salvarChecklist();
        });
        console.log('✅ Botão salvar checklist conectado!');
    }
    
    // Debug inicial
    console.log('🔍 Checklists no startup:', checklists);
})

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
    
    // Cabeçalho dos dias da semana
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Dias vazios no início
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Dias do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        dayElement.appendChild(dayHeader);
        
        // Verificar se há eventos neste dia
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayEvents = eventos.filter(evento => {
            const eventDate = new Date(evento.data);
            return eventDate.toDateString() === currentDay.toDateString();
        });
        
        dayEvents.forEach(evento => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.textContent = evento.cliente;
            eventElement.addEventListener('click', () => mostrarDetalhesEvento(evento.id));
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
            cursor: pointer;
        `;
        div.innerHTML = `
            <h4 style="margin: 0 0 5px 0; color: var(--primary);">${evento.cliente}</h4>
            <p style="margin: 0 0 5px 0;"><strong>Data:</strong> ${formatarData(evento.data)}</p>
            <p style="margin: 0 0 5px 0;"><strong>Local:</strong> ${evento.local}</p>
            <p style="margin: 0;"><strong>Tipo:</strong> ${evento.tipoEvento}</p>
        `;
        
        div.addEventListener('click', () => mostrarDetalhesEvento(evento.id));
        container.appendChild(div);
    });
}

function mostrarDetalhesEvento(eventoId) {
    const evento = eventos.find(e => e.id === eventoId);
    if (!evento) return;
    
    document.getElementById('modal-title').textContent = `Evento - ${evento.cliente}`;
    document.getElementById('event-cliente').value = evento.cliente;
    document.getElementById('event-data').value = formatarData(evento.data);
    document.getElementById('event-local').value = evento.local;
    document.getElementById('event-tipo').value = evento.tipoEvento;
    
    const equipamentosContainer = document.getElementById('event-equipamentos');
    equipamentosContainer.innerHTML = '';
    evento.equipamentos.forEach(equip => {
        const div = document.createElement('div');
        div.style.cssText = 'margin-bottom: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px;';
        div.textContent = `${equip.nome} (${equip.quantidade}x)`;
        equipamentosContainer.appendChild(div);
    });
    
    document.getElementById('event-modal').style.display = 'flex';
}

// Fechar modal
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('event-modal').style.display = 'none';
});

// Fechar modal ao clicar fora
window.addEventListener('click', function(e) {
    const modal = document.getElementById('event-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    checkScreenSize();
    carregarEquipamentos();
    
    // Simular alguns eventos para demonstração
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