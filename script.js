// Banco de dados simulado
let eventos = JSON.parse(localStorage.getItem('eventosTag')) || [
    {
        id: 1,
        cliente: "Ana Silva",
        tipoEvento: "Casamento",
        data: "2024-06-15",
        local: "Salão de Festas Jardim das Flores",
        equipamentos: [
            { nome: "Caixa de Som JBL 15\"", quantidade: 4 },
            { nome: "Canhão de Luz RGB 200W", quantidade: 12 }
        ],
        responsavel: "Carlos Oliveira",
        observacoes: "Cerimônia às 16h, recepção às 18h",
        status: "confirmado"
    },
    {
        id: 2,
        cliente: "Produções Musicais LTDA",
        tipoEvento: "Show de Rock",
        data: "2024-06-20",
        local: "Teatro Municipal",
        equipamentos: [
            { nome: "Caixa de Som JBL 15\"", quantidade: 8 },
            { nome: "Estrutura Metálica Q30", quantidade: 1 },
            { nome: "Máquina de Fumaça", quantidade: 2 }
        ],
        responsavel: "Roberto Santos",
        observacoes: "Soundcheck às 17h",
        status: "confirmado"
    }
];

let orcamentos = JSON.parse(localStorage.getItem('orcamentosTag')) || [];

let equipamentosDisponiveis = [
    { id: 1, nome: "Caixa de Som JBL 15\"", categoria: "som", diaria: 180 },
    { id: 2, nome: "Canhão de Luz RGB 200W", categoria: "iluminacao", diaria: 120 },
    { id: 3, nome: "Microfone Sem Fio Shure", categoria: "som", diaria: 80 },
    { id: 4, nome: "Estrutura Metálica Q30", categoria: "estrutura", diaria: 300 },
    { id: 5, nome: "Mesa de Som Behringer", categoria: "som", diaria: 150 },
    { id: 6, nome: "Projetor 5000 Lumens", categoria: "projecao", diaria: 200 },
    { id: 7, nome: "Máquina de Fumaça", categoria: "efeitos", diaria: 90 }
];

// Dados dos equipamentos
const equipamentos = [
    { material: "Estrutura Q30", quantidade: "43m total", local: "barracão", categoria: "estrutura" },
    { material: "1 metrô", quantidade: "4", local: "barracão", categoria: "estrutura" },
    { material: "Pista de LED", quantidade: "", local: "barracão", categoria: "iluminacao" },
    { material: "Placas de LED Paris", quantidade: "36", local: "barracão", categoria: "iluminacao", obs: "32 funcionando" },
    { material: "Caixas de Som", quantidade: "", local: "barracão", categoria: "som" },
    { material: "grave 18 leacs", quantidade: "", local: "barracão", categoria: "som" },
    { material: "caixa 15 JBL Selenium master", quantidade: "2", local: "barracão", categoria: "som" },
    { material: "Palco", quantidade: "", local: "barracão", categoria: "estrutura" },
    { material: "canhão RGB", quantidade: "60", local: "barracão", categoria: "iluminacao", obs: "aproximadamente" },
    { material: "luz néon", quantidade: "", local: "barracão", categoria: "iluminacao" },
    { material: "laser", quantidade: "", local: "barracão", categoria: "iluminacao" },
    { material: "fumaça", quantidade: "5", local: "barracão", categoria: "acessorio" },
    { material: "microfone", quantidade: "", local: "barracão", categoria: "som" },
    { material: "Mic AKG", quantidade: "2 base com 1 mic", local: "barracão", categoria: "som" },
    { material: "mesa de som", quantidade: "", local: "barracão", categoria: "som" },
    { material: "oneal", quantidade: "", local: "barracão", categoria: "som" },
    { material: "behringer", quantidade: "", local: "barracão", categoria: "som" }
];

// Variáveis globais
let orcamentoAtualId = null;
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedEvent = null;

// Nomes dos meses e dias
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                   "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// ===== FUNÇÕES PRINCIPAIS =====

// Função para carregar a tabela de equipamentos
function carregarTabelaEquipamentos() {
    const tbody = document.querySelector('#tabela-equipamentos tbody');
    const filtroCategoria = document.getElementById('filtro-categoria').value;
    const filtroLocal = document.getElementById('filtro-local').value;
    const busca = document.getElementById('busca').value.toLowerCase();
    
    tbody.innerHTML = "";
    
    const filtrados = equipamentos.filter(item => {
        const categoriaMatch = !filtroCategoria || item.categoria === filtroCategoria;
        const localMatch = !filtroLocal || item.local.includes(filtroLocal);
        const buscaMatch = !busca || item.material.toLowerCase().includes(busca);
        
        return categoriaMatch && localMatch && buscaMatch;
    });
    
    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px; color: var(--gray);">Nenhum equipamento encontrado</td></tr>`;
        return;
    }
    
   filtrados.forEach(item => {
    const classeLocal = item.local === "barracão" ? "status-barracao" : "status-outro";
    
    // Nomes mais curtos para mobile
    let materialCurto = item.material;
    if (materialCurto.length > 20) {
        materialCurto = materialCurto.substring(0, 17) + '...';
    }
    
    let obsCurta = item.obs || "-";
    if (obsCurta.length > 15) {
        obsCurta = obsCurta.substring(0, 12) + '...';
    }
    
    tbody.innerHTML += `
        <tr>
            <td title="${item.material}">${materialCurto}</td>
            <td>${item.quantidade || "-"}</td>
            <td><span class="${classeLocal}">${item.local === "barracão" ? "Barracão" : "Outro"}</span></td>
            <td title="${item.obs || ''}">${obsCurta}</td>
        </tr>
    `;
});
}

// Sistema de Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this.username.value;
    const password = this.password.value;
    
    if(!username || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    const SENHA_CORRETA = "vitor123";
    const USUARIO_CORRETO = "Vitor";
    
    if(username === USUARIO_CORRETO && password === SENHA_CORRETA) {
        realizarLogin();
    } else {
        alert('Usuário ou senha incorretos!');
        this.password.value = '';
    }
});

function realizarLogin() {
    const formBox = document.querySelector('.form-box');
    formBox.style.transform = 'scale(0.98)';
    formBox.style.boxShadow = '0 5px 20px rgba(255, 107, 0, 0.3)';
    
    setTimeout(() => {
        formBox.style.transform = '';
        formBox.style.boxShadow = '';
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        
        // Carregar dados iniciais
        carregarTabelaEquipamentos();
        carregarEquipamentos();
        carregarEventosParaChecklist();
        carregarListaEventos();
        carregarOrcamentos();
        renderCalendar();
        loadEventsList();
    }, 500);
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('login-form').reset();
    orcamentoAtualId = null;
});

// Navegação
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        this.classList.add('active');
        const pageId = this.getAttribute('data-page');
        
        if (pageId) {
            document.getElementById(pageId).classList.add('active');
            document.getElementById('currentPageTitle').textContent = 
                this.querySelector('span').textContent;
                
            if (pageId === 'eventos') {
                abrirAba('orcamento');
            } else if (pageId === 'orcamentos') {
                carregarOrcamentos();
            } else if (pageId === 'agendamento') {
                renderCalendar();
                loadEventsList();
            } else if (pageId === 'equipamentos') {
                carregarTabelaEquipamentos();
            }
        }
    });
});

// Event listeners para filtros de equipamentos
document.getElementById("filtro-categoria").addEventListener("change", carregarTabelaEquipamentos);
document.getElementById("filtro-local").addEventListener("change", carregarTabelaEquipamentos);
document.getElementById("busca").addEventListener("input", carregarTabelaEquipamentos);

// ===== SISTEMA DE EVENTOS =====

function abrirAba(abaId) {
    document.querySelectorAll('.conteudo-aba').forEach(aba => {
        aba.classList.remove('ativa');
    });
    
    document.querySelectorAll('.aba').forEach(aba => {
        aba.classList.remove('ativa');
    });
    
    document.getElementById(abaId).classList.add('ativa');
    document.querySelector(`.aba[onclick="abrirAba('${abaId}')"]`).classList.add('ativa');
    
    if (abaId === 'checklist') {
        carregarEventosParaChecklist();
    } else if (abaId === 'eventos-agendados') {
        carregarListaEventos();
    }
}

// Carrega equipamentos para seleção no orçamento
function carregarEquipamentos() {
    const container = document.getElementById('lista-equipamentos');
    container.innerHTML = '';
    
    equipamentosDisponiveis.forEach(equip => {
        container.innerHTML += `
            <div class="equipamento-card">
                <h4>${equip.nome}</h4>
                <p>R$ ${equip.diaria.toFixed(2)} /dia</p>
                <div class="checkbox-container">
                    <input type="checkbox" id="equip-${equip.id}" value="${equip.id}">
                    <label for="equip-${equip.id}">Selecionar</label>
                </div>
                <div class="equipment-inputs" id="inputs-equip-${equip.id}" style="display: none; margin-top: 10px;">
                    <div>
                        <label>Quantidade: 
                            <input type="number" min="1" value="1" id="qtd-equip-${equip.id}" style="width: 60px;">
                        </label>
                    </div>
                    <div>
                        <label>Dias: 
                            <input type="number" min="1" value="1" id="dias-equip-${equip.id}" style="width: 60px;">
                        </label>
                    </div>
                </div>
            </div>
        `;
    });
    
    document.querySelectorAll('#lista-equipamentos input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const inputsDiv = document.getElementById(`inputs-equip-${this.value}`);
            inputsDiv.style.display = this.checked ? 'block' : 'none';
            calcularTotalOrcamento();
        });
    });
    
    document.getElementById('lista-equipamentos').addEventListener('input', function(e) {
        if (e.target.matches('input[type="number"]')) {
            calcularTotalOrcamento();
        }
    });
}

// Calcular total do orçamento
function calcularTotalOrcamento() {
    let total = 0;
    document.querySelectorAll('#lista-equipamentos input[type="checkbox"]:checked').forEach(checkbox => {
        const equipId = parseInt(checkbox.value);
        const qtd = parseInt(document.getElementById(`qtd-equip-${equipId}`).value) || 0;
        const dias = parseInt(document.getElementById(`dias-equip-${equipId}`).value) || 0;
        const equipamento = equipamentosDisponiveis.find(e => e.id === equipId);
        if (equipamento) {
            total += equipamento.diaria * qtd * dias;
        }
    });
    document.getElementById('total-orcamento-form').textContent = total.toFixed(2);
}

// Formulário de orçamento
document.getElementById('form-orcamento').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const dataInput = document.getElementById('data').value;
    const equipamentosSelecionados = [];
    
    document.querySelectorAll('#lista-equipamentos input[type="checkbox"]:checked').forEach(checkbox => {
        const equipId = parseInt(checkbox.value);
        const qtd = parseInt(document.getElementById(`qtd-equip-${equipId}`).value);
        const dias = parseInt(document.getElementById(`dias-equip-${equipId}`).value);
        const equipamento = equipamentosDisponiveis.find(e => e.id === equipId);
        
        equipamentosSelecionados.push({
            id: equipId,
            nome: equipamento.nome,
            quantidade: qtd,
            dias: dias,
            diaria: equipamento.diaria,
            subtotal: equipamento.diaria * qtd * dias
        });
    });
    
    const novoOrcamento = {
        id: Date.now(),
        cliente: document.getElementById('cliente').value,
        evento: document.getElementById('evento').value,
        data: dataInput,
        local: document.getElementById('local').value,
        observacoes: document.getElementById('observacoes').value,
        equipamentos: equipamentosSelecionados,
        total: parseFloat(document.getElementById('total-orcamento-form').textContent),
        status: 'pendente'
    };
    
    orcamentos.push(novoOrcamento);
    localStorage.setItem('orcamentosTag', JSON.stringify(orcamentos));
    
    alert('Orçamento criado com sucesso! ID: ' + novoOrcamento.id);
    this.reset();
    carregarEquipamentos();
    document.getElementById('total-orcamento-form').textContent = '0.00';
    
    document.querySelector('.nav-link[data-page="orcamentos"]').click();
});

// ===== SISTEMA DE ORÇAMENTOS =====

function carregarOrcamentos() {
    const container = document.getElementById('lista-orcamentos');
    container.innerHTML = '';
    
    if (orcamentos.length === 0) {
        container.innerHTML = '<p>Nenhum orçamento cadastrado ainda.</p>';
        return;
    }
    
    const filtroStatus = document.getElementById('filtro-status').value;
    const busca = document.getElementById('busca-orcamento').value.toLowerCase();
    
    const filtrados = orcamentos.filter(orc => {
        const statusMatch = !filtroStatus || orc.status === filtroStatus;
        const buscaMatch = !busca || 
            (orc.cliente && orc.cliente.toLowerCase().includes(busca)) ||
            (orc.evento && orc.evento.toLowerCase().includes(busca)) ||
            (orc.local && orc.local.toLowerCase().includes(busca));
        
        return statusMatch && buscaMatch;
    });
    
    if (filtrados.length === 0) {
        container.innerHTML = '<p>Nenhum orçamento encontrado com os filtros selecionados.</p>';
        return;
    }
    
    filtrados.forEach(orc => {
        let statusClass = '';
        let statusText = '';
        
        if (orc.status === 'pendente') {
            statusClass = 'status-pendente';
            statusText = 'PENDENTE';
        } else if (orc.status === 'aprovado') {
            statusClass = 'status-concluido';
            statusText = 'APROVADO';
        } else if (orc.status === 'recusado') {
            statusClass = 'status-recusado';
            statusText = 'RECUSADO';
        }
        
        container.innerHTML += `
            <div class="info-card">
                <h3>${orc.cliente} - ${orc.evento}</h3>
                <p><strong>Data:</strong> ${formatarData(orc.data)}</p>
                <p><strong>Local:</strong> ${orc.local || 'Não informado'}</p>
                <p><strong>Status:</strong> <span class="status ${statusClass}">${statusText}</span></p>
                <p><strong>Valor:</strong> R$ ${typeof orc.total === 'number' ? orc.total.toFixed(2) : '0.00'}</p>
                <button class="btn" style="margin-top: 10px;" onclick="visualizarOrcamento(${orc.id})">Detalhes</button>
            </div>
        `;
    });
}

function visualizarOrcamento(id) {
    const orcamento = orcamentos.find(o => o.id === id);
    if (orcamento) {
        orcamentoAtualId = id;
        
        document.getElementById('orcamento-titulo').textContent = `Orçamento #${orcamento.id}`;
        document.getElementById('orc-cliente').textContent = orcamento.cliente;
        document.getElementById('orc-data').textContent = formatarData(orcamento.data);
        document.getElementById('orc-local').textContent = orcamento.local;
        
        let statusText = '';
        let statusClass = '';
        if (orcamento.status === 'pendente') {
            statusText = 'PENDENTE';
            statusClass = 'status-pendente';
        } else if (orcamento.status === 'aprovado') {
            statusText = 'APROVADO';
            statusClass = 'status-concluido';
        } else {
            statusText = 'RECUSADO';
            statusClass = 'status-recusado';
        }
        document.getElementById('orc-status').innerHTML = `<span class="status ${statusClass}">${statusText}</span>`;
        
        const tbody = document.getElementById('tabela-equipamentos-orc');
        tbody.innerHTML = '';
        
        let total = 0;
        orcamento.equipamentos.forEach(item => {
            const subtotal = item.diaria * item.quantidade * item.dias;
            total += subtotal;
            
            tbody.innerHTML += `
                <tr>
                    <td>${item.nome}</td>
                    <td>${item.quantidade}</td>
                    <td>${item.dias}</td>
                    <td>R$ ${item.diaria.toFixed(2)}</td>
                    <td>R$ ${subtotal.toFixed(2)}</td>
                </tr>
            `;
        });
        
        document.getElementById('total-orcamento').textContent = `R$ ${total.toFixed(2)}`;
        
        document.getElementById('btn-aprovar').onclick = function() {
            aprovarOrcamento(orcamento.id);
        };
        
        document.getElementById('btn-recusar').onclick = function() {
            recusarOrcamento(orcamento.id);
        };
        
        document.getElementById('btn-deletar').onclick = function() {
            mostrarConfirmacaoExclusao();
        };
        
        document.getElementById('lista-orcamentos').style.display = 'none';
        document.getElementById('detalhes-orcamento').style.display = 'block';
    }
}

function aprovarOrcamento(id) {
    const orc = orcamentos.find(o => o.id === id);
    if (orc) {
        orc.status = 'aprovado';
        localStorage.setItem('orcamentosTag', JSON.stringify(orcamentos));
        
        adicionarEvento(orc);
        alert('Orçamento aprovado com sucesso! Evento agendado.');
        carregarOrcamentos();
        fecharDetalhes();
    }
}

function recusarOrcamento(id) {
    const orc = orcamentos.find(o => o.id == id);
    if (!orc) return;

    if (!confirm('Tem certeza que deseja recusar este orçamento?')) {
        return;
    }

    orc.status = 'recusado';
    localStorage.setItem('orcamentosTag', JSON.stringify(orcamentos));
    alert('Orçamento recusado com sucesso!');
    carregarOrcamentos();
    fecharDetalhes();
}

function adicionarEvento(orcamento) {
    const novoEvento = {
        id: Date.now(),
        cliente: orcamento.cliente,
        tipoEvento: orcamento.evento,
        data: orcamento.data,
        local: orcamento.local,
        equipamentos: orcamento.equipamentos.map(eq => ({
            nome: eq.nome,
            quantidade: eq.quantidade
        })),
        responsavel: '',
        observacoes: orcamento.observacoes,
        status: "confirmado"
    };
    
    eventos.push(novoEvento);
    localStorage.setItem('eventosTag', JSON.stringify(eventos));
}

// ===== SISTEMA DE CHECKLIST =====

function carregarEventosParaChecklist() {
    const select = document.getElementById('selecionar-evento');
    select.innerHTML = '<option value="">Selecione um evento...</option>';
    
    eventos.forEach(evento => {
        const option = document.createElement('option');
        option.value = evento.id;
        option.textContent = `${evento.cliente} - ${formatarData(evento.data)} - ${evento.tipoEvento}`;
        select.appendChild(option);
    });
    
    select.addEventListener('change', function() {
        const eventoId = parseInt(this.value);
        if (!eventoId) {
            document.getElementById('detalhes-evento').style.display = 'none';
            return;
        }
        
        const evento = eventos.find(e => e.id === eventoId);
        if (evento) {
            document.getElementById('checklist-cliente').textContent = evento.cliente;
            document.getElementById('checklist-data').textContent = formatarData(evento.data);
            document.getElementById('checklist-local').textContent = evento.local;
            
            const checklistContainer = document.getElementById('checklist-equipamentos');
            checklistContainer.innerHTML = '';
            
            evento.equipamentos.forEach(item => {
                checklistContainer.innerHTML += `
                    <div class="checklist-item">
                        <div>
                            <h4>${item.nome} (x${item.quantidade})</h4>
                            <div style="display: flex; gap: 15px; margin-top: 5px;">
                                <label><input type="checkbox"> Carregado</label>
                                <label><input type="checkbox"> Montado</label>
                                <label><input type="checkbox"> Testado</label>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            document.getElementById('detalhes-evento').style.display = 'block';
        }
    });
}

function salvarChecklist() {
    const eventoId = parseInt(document.getElementById('selecionar-evento').value);
    const responsavel = document.getElementById('responsavel').value;
    
    if (eventoId && responsavel) {
        const eventoIndex = eventos.findIndex(e => e.id === eventoId);
        if (eventoIndex !== -1) {
            eventos[eventoIndex].responsavel = responsavel;
            localStorage.setItem('eventosTag', JSON.stringify(eventos));
            alert('Checklist salvo com sucesso!');
        }
    } else {
        alert('Por favor, selecione um evento e informe o responsável!');
    }
}

function carregarListaEventos() {
    const container = document.getElementById('lista-eventos');
    container.innerHTML = '';
    
    if (eventos.length === 0) {
        container.innerHTML = '<p>Nenhum evento cadastrado ainda.</p>';
        return;
    }
    
    eventos.forEach(evento => {
        let statusClass = 'status-concluido';
        let statusText = 'CONFIRMADO';
        
        container.innerHTML += `
            <div class="checklist-item" style="margin-bottom: 20px;">
                <div>
                    <h3>${evento.cliente}</h3>
                    <p><strong>Data:</strong> ${formatarData(evento.data)}</p>
                    <p><strong>Local:</strong> ${evento.local}</p>
                    <p><strong>Equipamentos:</strong> ${evento.equipamentos.length} itens</p>
                    ${evento.responsavel ? `<p><strong>Responsável:</strong> ${evento.responsavel}</p>` : ''}
                </div>
                <span class="status ${statusClass}">${statusText}</span>
            </div>
        `;
    });
}

// ===== SISTEMA DE CALENDÁRIO =====

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';
    
    document.getElementById('current-month').textContent = 
        `${monthNames[currentMonth]} ${currentYear}`;
    
    for (let i = 0; i < 7; i++) {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day';
        dayHeader.innerHTML = `<div class="day-header">${dayNames[i]}</div>`;
        calendarGrid.appendChild(dayHeader);
    }
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonthToday = today.getMonth();
    const currentYearToday = today.getFullYear();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const isToday = day === currentDay && 
                        currentMonth === currentMonthToday && 
                        currentYear === currentYearToday;
        
        dayElement.innerHTML = `
            <div class="day-header ${isToday ? 'today' : ''}">${day}</div>
            <div class="day-events" id="events-${day}"></div>
        `;
        
        calendarGrid.appendChild(dayElement);
        
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        addEventsToDay(day, dateStr);
    }
}

function addEventsToDay(day, dateStr) {
    const formattedDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = eventos.filter(event => event.data === formattedDay);
    
    const eventsContainer = document.getElementById(`events-${day}`);
    
    if (!eventsContainer) return;
    
    eventsContainer.innerHTML = '';
    
    dayEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.textContent = `${event.cliente} - ${event.tipoEvento}`;
        eventElement.dataset.eventId = event.id;
        
        eventElement.addEventListener('click', function() {
            openEventModal(event.id);
        });
        
        eventsContainer.appendChild(eventElement);
    });
}

function loadEventsList() {
    const eventosLista = document.getElementById('eventos-lista');
    eventosLista.innerHTML = '';
    
    if (eventos.length === 0) {
        eventosLista.innerHTML = '<p>Nenhum evento agendado</p>';
        return;
    }
    
    eventos.sort((a, b) => new Date(a.data) - new Date(b.data));
    
    eventos.forEach(event => {
        const formattedDate = formatarData(event.data);
        
        const eventElement = document.createElement('div');
        eventElement.className = 'checklist-item';
        eventElement.innerHTML = `
            <div>
                <h3>${event.cliente} - ${event.tipoEvento}</h3>
                <p><strong>Data:</strong> ${formattedDate}</p>
                <p><strong>Local:</strong> ${event.local}</p>
                <p><strong>Responsável:</strong> ${event.responsavel || 'A definir'}</p>
            </div>
            <span class="status status-concluido">CONFIRMADO</span>
        `;
        
        eventElement.addEventListener('click', function() {
            openEventModal(event.id);
        });
        
        eventosLista.appendChild(eventElement);
    });
}

function openEventModal(eventId) {
    const event = eventos.find(e => e.id === eventId);
    if (!event) return;
    
    selectedEvent = event;
    const formattedDate = formatarData(event.data);

    document.getElementById('modal-title').textContent = `Evento #${event.id}`;
    document.getElementById('event-cliente').value = event.cliente;
    document.getElementById('event-data').value = formattedDate;
    document.getElementById('event-local').value = event.local;
    document.getElementById('event-tipo').value = event.tipoEvento;
    document.getElementById('event-responsavel').value = event.responsavel || '';
    document.getElementById('event-observacoes').value = event.observacoes || '';
    
    const equipamentosContainer = document.getElementById('event-equipamentos');
    equipamentosContainer.innerHTML = '';
    
    event.equipamentos.forEach(equip => {
        const equipElement = document.createElement('div');
        equipElement.textContent = `${equip.nome} (x${equip.quantidade})`;
        equipamentosContainer.appendChild(equipElement);
    });
    
    document.getElementById('event-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('event-modal').style.display = 'none';
    selectedEvent = null;
}

function saveEvent() {
    if (!selectedEvent) return;
    
    selectedEvent.responsavel = document.getElementById('event-responsavel').value;
    selectedEvent.observacoes = document.getElementById('event-observacoes').value;
    
    localStorage.setItem('eventosTag', JSON.stringify(eventos));
    closeModal();
    renderCalendar();
    loadEventsList();
    
    alert('Evento atualizado com sucesso!');
}

function cancelEvent() {
    if (!selectedEvent) {
        alert('Nenhum evento selecionado!');
        return;
    }

    try {
        const eventIndex = eventos.findIndex(e => e.id === selectedEvent.id);
        
        if (eventIndex === -1) {
            throw new Error('Evento não encontrado no sistema');
        }

        eventos.splice(eventIndex, 1);
        localStorage.setItem('eventosTag', JSON.stringify(eventos));
        
        closeModal();
        renderCalendar();
        loadEventsList();
        carregarListaEventos();
        
        alert('Evento cancelado com sucesso!');
    } catch (error) {
        console.error('Erro ao cancelar evento:', error);
        alert(`Falha ao cancelar evento: ${error.message}`);
    }
}

// ===== FUNÇÕES UTILITÁRIAS =====

function formatarData(dataString) {
    if (!dataString) return '';
    const partes = dataString.split('-');
    if (partes.length === 3) {
        const [ano, mes, dia] = partes;
        return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
    }
    return dataString;
}

function novoOrcamento() {
    document.querySelector('.nav-link[data-page="eventos"]').click();
    abrirAba('orcamento');
}

function mostrarConfirmacaoExclusao() {
    if (orcamentoAtualId === null) {
        alert("Nenhum orçamento selecionado!");
        return;
    }
    document.getElementById('confirmationModal').style.display = 'flex';
}

function fecharConfirmacaoExclusao() {
    document.getElementById('confirmationModal').style.display = 'none';
}

function deletarOrcamento() {
    if (orcamentoAtualId === null) return;
    
    try {
        const id = Number(orcamentoAtualId);
        const orcIndex = orcamentos.findIndex(o => o.id === id);
        
        if (orcIndex === -1) {
            throw new Error(`Orçamento não encontrado: ${id}`);
        }

        orcamentos.splice(orcIndex, 1);
        localStorage.setItem('orcamentosTag', JSON.stringify(orcamentos));
        
        fecharDetalhes();
        carregarOrcamentos();
        fecharConfirmacaoExclusao();
        
        alert('Orçamento excluído com sucesso!');
        orcamentoAtualId = null;
    } catch (error) {
        console.error("Erro na exclusão:", error);
        alert("Falha ao excluir: " + error.message);
        fecharConfirmacaoExclusao();
    }
}

function fecharDetalhes() {
    document.getElementById('lista-orcamentos').style.display = 'grid';
    document.getElementById('detalhes-orcamento').style.display = 'none';
    orcamentoAtualId = null;
}

// ===== INICIALIZAÇÃO =====

document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para navegação no calendário
    document.getElementById('prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    document.getElementById('today').addEventListener('click', function() {
        const today = new Date();
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        renderCalendar();
    });
    
    // Event listeners para o modal
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-salvar-evento').addEventListener('click', saveEvent);
    document.getElementById('btn-cancelar-evento').addEventListener('click', cancelEvent);
    
    // Event listeners para o modal de confirmação de exclusão
    document.getElementById('btn-confirm-delete').addEventListener('click', deletarOrcamento);
    document.getElementById('btn-cancel-delete').addEventListener('click', fecharConfirmacaoExclusao);
    
    // Event listeners para filtros de orçamentos
    document.getElementById("filtro-status").addEventListener("change", carregarOrcamentos);
    document.getElementById("busca-orcamento").addEventListener("input", carregarOrcamentos);
});