// =============================================
// SISTEMA TAG SOM E LUZ - script.js (LIMPO)
// =============================================

// Dados compartilhados
let equipamentos = JSON.parse(localStorage.getItem('equipamentos')) || [];
let orcamentos   = JSON.parse(localStorage.getItem('orcamentos'))   || [];
let eventos      = JSON.parse(localStorage.getItem('eventos'))      || [];
let checklists   = JSON.parse(localStorage.getItem('checklists'))   || [];

// =============================================
// AUTENTICAÇÃO
// =============================================
function autenticarUsuario(username, password) {
    const usuarios = [
        { usuario: "admin",    senha: "123",       nome: "Administrador", nivel: "admin" },
        { usuario: "gianeis",  senha: "Tag@2024",  nome: "Gianeis",       nivel: "user" },
        { usuario: "operador", senha: "Oper@2024", nome: "Operador",      nivel: "operador" }
    ];
    const usuario = usuarios.find(u => u.usuario === username && u.senha === password);
    if (usuario) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        return true;
    }
    return false;
}

function checkAuth() {
    const user = localStorage.getItem('usuarioLogado');
    const currentPage = window.location.pathname;
    if (!currentPage.includes('index.html') && !user) {
        window.location.href = 'index.html';
        return false;
    }
    if (currentPage.includes('index.html') && user) {
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (user) {
        const userElement = document.getElementById('current-user');
        if (userElement) userElement.textContent = user.nome || user.usuario;
    }
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// =============================================
// INICIALIZAÇÃO DO SISTEMA
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Inicializando sistema Tag Som e Luz...');

    if (!checkAuth()) return;
    loadUserInfo();

    // Login (apenas na página de login)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = this.username.value;
            const password = this.password.value;
            if (autenticarUsuario(username, password)) {
                showToast('Login realizado com sucesso!', 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
            } else {
                showToast('Usuário ou senha incorretos!', 'error');
            }
        });
    }

    inicializarMenuMobile();

    // Dados iniciais de equipamentos (apenas se vazio)
    if (equipamentos.length === 0) {
        equipamentos = [
            { id: 1,  material: "Caixa de Som JBL",          quantidade: 4,  local: "barracao",  categoria: "som",        observacoes: "Boa estado" },
            { id: 2,  material: "Mesa de Som Yamaha",        quantidade: 2,  local: "barracao",  categoria: "som",        observacoes: "Nova" },
            { id: 3,  material: "Microfone Sem Fio",         quantidade: 6,  local: "silene",    categoria: "som",        observacoes: "2 com pilha fraca" },
            { id: 4,  material: "Par 56 LED",                quantidade: 24, local: "barracao",  categoria: "iluminacao", observacoes: "Todos funcionando" },
            { id: 5,  material: "Scanner Laser",             quantidade: 2,  local: "san-carlo", categoria: "iluminacao", observacoes: "Precisa de manutenção" },
            { id: 6,  material: "Estrutura Metalica 6x6",    quantidade: 2,  local: "barracao",  categoria: "estrutura",  observacoes: "Completa" },
            { id: 7,  material: "Projetor Epson",            quantidade: 1,  local: "silene",    categoria: "projecao",   observacoes: "Lâmpada nova" },
            { id: 8,  material: "Cabo de Rede 20m",          quantidade: 10, local: "barracao",  categoria: "acessorio",  observacoes: "Bom estado" },
            { id: 9,  material: "Estrutura Q30 1m",          quantidade: 4,  local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 10, material: "Estrutura Q30 1,5m",        quantidade: 4,  local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 11, material: "Estrutura Q30 2,5m",        quantidade: 6,  local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 12, material: "Estrutura Q30 3m",          quantidade: 6,  local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 13, material: "Estrutura Q30 Cubos",       quantidade: 8,  local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 14, material: "Estrutura Q30 Pés",         quantidade: 9,  local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 15, material: "Estrutura Q30 Curva Grande",quantidade: 4,  local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 16, material: "Estrutura Q30 Curva Pequena",quantidade: 4, local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 17, material: "Estrutura Q30 Sliver",      quantidade: 4,  local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 18, material: "Estrutura Q30 Pal de Carga",quantidade: 4,  local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 19, material: "Estrutura Q30 Cinta de Sliver",quantidade: 4, local: "barracao", categoria: "estrutura", observacoes: "" },
            { id: 20, material: "Estrutura Q20 1m",          quantidade: 11, local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 21, material: "Estrutura Q20 1m",          quantidade: 16, local: "san-carlo", categoria: "estrutura",  observacoes: "" },
            { id: 22, material: "Estrutura Q20 0,5m",        quantidade: 4,  local: "san-carlo", categoria: "estrutura",  observacoes: "" },
            { id: 23, material: "Estrutura Q20 Curva Grande",quantidade: 4,  local: "san-carlo", categoria: "estrutura",  observacoes: "" },
            { id: 24, material: "Estrutura Q20 Curva Pequena",quantidade: 4, local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 25, material: "Estrutura Q20 Cubo",        quantidade: 3,  local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 26, material: "Estrutura Q20 Cubo",        quantidade: 1,  local: "silene",    categoria: "estrutura",  observacoes: "" },
            { id: 27, material: "Escada Pequena",            quantidade: 2,  local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 28, material: "Escada Grande",             quantidade: 1,  local: "barracao",  categoria: "estrutura",  observacoes: "" },
            { id: 29, material: "Pista de LED",              quantidade: 4,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 30, material: "Placa de LED",              quantidade: 16, local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 31, material: "Placa infinytparis",        quantidade: 20, local: "barracao",  categoria: "iluminacao", observacoes: "18 funcionando" },
            { id: 32, material: "Placa Paris",               quantidade: 36, local: "barracao",  categoria: "iluminacao", observacoes: "32 funcionando" },
            { id: 33, material: "Placa de DJ Paris",         quantidade: 4,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 34, material: "Canhão Amber",              quantidade: 20, local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 35, material: "Canhão RGB",                quantidade: 60, local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 36, material: "Canhão RGB Banda",          quantidade: 20, local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 37, material: "Canhão RGB",                quantidade: 4,  local: "silene",    categoria: "iluminacao", observacoes: "" },
            { id: 38, material: "Luz Néon",                  quantidade: 16, local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 39, material: "Ribalta UV",                quantidade: 12, local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 40, material: "Lâmpada Luz Negra",         quantidade: 4,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 41, material: "Estrobo",                   quantidade: 2,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 42, material: "Estrobo de LED",            quantidade: 1,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 43, material: "Estrobo de Lâmpada",        quantidade: 1,  local: "silene",    categoria: "iluminacao", observacoes: "" },
            { id: 44, material: "Laser",                     quantidade: 1,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 45, material: "Wale",                      quantidade: 3,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 46, material: "Wale",                      quantidade: 1,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 47, material: "Wale",                      quantidade: 2,  local: "silene",    categoria: "iluminacao", observacoes: "" },
            { id: 48, material: "Movie de LED",              quantidade: 3,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 49, material: "Movie de LED",              quantidade: 4,  local: "silene",    categoria: "iluminacao", observacoes: "" },
            { id: 50, material: "Globo Espelhado Grande",    quantidade: 3,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 51, material: "Globo Espelhado 30cm",      quantidade: 9,  local: "silene",    categoria: "iluminacao", observacoes: "" },
            { id: 52, material: "Skypaper",                  quantidade: 1,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 53, material: "Refletor de LED 50w",       quantidade: 4,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 54, material: "Refletor de Lâmpada P",     quantidade: 7,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 55, material: "Refletor de Lâmpada G",     quantidade: 5,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 56, material: "Canhão de Lâmpada",         quantidade: 20, local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 57, material: "HQI",                       quantidade: 10, local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 58, material: "Reator HQI",                quantidade: 8,  local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 59, material: "Pim Bim",                   quantidade: 11, local: "barracao",  categoria: "iluminacao", observacoes: "" },
            { id: 60, material: "Caixa Grave 18 Leacs",      quantidade: 1,  local: "barracao",  categoria: "som", observacoes: "ativo/passiva" },
            { id: 61, material: "Caixa Grave 15 JBL Selenium",quantidade: 1, local: "barracao",  categoria: "som", observacoes: "ativo/passiva" },
            { id: 62, material: "Caixa 12 JBL Selenium Master",quantidade: 2,local: "barracao",  categoria: "som", observacoes: "ativo/passiva" },
            { id: 63, material: "Caixa 12 JBL Selenium JBL", quantidade: 1,  local: "barracao",  categoria: "som", observacoes: "ativo/passiva" },
            { id: 64, material: "Caixa 12 JBL Selenium Master",quantidade: 1,local: "barracao",  categoria: "som", observacoes: "passivo/com potencia" },
            { id: 65, material: "Caixa 15 JBL Selenium Master",quantidade: 2,local: "barracao",  categoria: "som", observacoes: "ativo/passiva" },
            { id: 66, material: "Caixa 15 Transdutori",      quantidade: 1,  local: "barracao",  categoria: "som", observacoes: "ativo/passiva" },
            { id: 67, material: "Caixa 15 Passiva",          quantidade: 2,  local: "silene",    categoria: "som", observacoes: "" },
            { id: 68, material: "Caixa Grave 18 Duplo",      quantidade: 4,  local: "barracao",  categoria: "som", observacoes: "passiva" },
            { id: 69, material: "Microfone Karsect",         quantidade: 2,  local: "barracao",  categoria: "som", observacoes: "base com 2 mic" },
            { id: 70, material: "Microfone Heat set",        quantidade: 1,  local: "barracao",  categoria: "som", observacoes: "base com 1 mic" },
            { id: 71, material: "Microfone AKG",             quantidade: 2,  local: "barracao",  categoria: "som", observacoes: "base com 1 mic" },
            { id: 72, material: "Microfone Shure com fio",   quantidade: 1,  local: "barracao",  categoria: "som", observacoes: "" },
            { id: 73, material: "Microfone Lê Som",          quantidade: 1,  local: "silene",    categoria: "som", observacoes: "base com 1 mic" },
            { id: 74, material: "Mesa de Som Oneal",         quantidade: 1,  local: "silene",    categoria: "som", observacoes: "" },
            { id: 75, material: "Mesa de Som Behringer",     quantidade: 2,  local: "barracao",  categoria: "som", observacoes: "" },
            { id: 76, material: "Mesa de Som Wattsom P",     quantidade: 1,  local: "barracao",  categoria: "som", observacoes: "" },
            { id: 77, material: "Mesa de Som Wattsom G",     quantidade: 2,  local: "barracao",  categoria: "som", observacoes: "" },
            { id: 78, material: "Controladora DJ Wego",      quantidade: 1,  local: "barracao",  categoria: "som", observacoes: "" },
            { id: 79, material: "Controladora DJ DDJ Ergo",  quantidade: 1,  local: "barracao",  categoria: "som", observacoes: "" },
            { id: 80, material: "Controladora DJ Xpoint",    quantidade: 2,  local: "barracao",  categoria: "som", observacoes: "" },
            { id: 81, material: "Projetor",                  quantidade: 1,  local: "silene",    categoria: "projecao", observacoes: "" },
            { id: 82, material: "Televisão Philco 48",       quantidade: 4,  local: "barracao",  categoria: "projecao", observacoes: "" },
            { id: 83, material: "Televisão Philco 39",       quantidade: 2,  local: "silene",    categoria: "projecao", observacoes: "" },
            { id: 84, material: "Televisão Philco 43",       quantidade: 2,  local: "barracao",  categoria: "projecao", observacoes: "" },
            { id: 85, material: "Televisão Philco 39",       quantidade: 2,  local: "manutencao",categoria: "projecao", observacoes: "" },
            { id: 86, material: "Tripé",                     quantidade: 4,  local: "barracao",  categoria: "acessorio", observacoes: "" },
            { id: 87, material: "Pedestal",                  quantidade: 4,  local: "barracao",  categoria: "acessorio", observacoes: "" },
            { id: 88, material: "Máquina de Fumaça",         quantidade: 5,  local: "barracao",  categoria: "acessorio", observacoes: "" },
            { id: 89, material: "Inflável Estrela",          quantidade: 4,  local: "barracao",  categoria: "acessorio", observacoes: "" },
            { id: 90, material: "Inflável Quadrado",         quantidade: 2,  local: "barracao",  categoria: "acessorio", observacoes: "" },
            { id: 91, material: "Inflável Tubo",             quantidade: 2,  local: "barracao",  categoria: "acessorio", observacoes: "" },
            { id: 92, material: "Culer",                     quantidade: 4,  local: "barracao",  categoria: "acessorio", observacoes: "" },
            { id: 93, material: "Mesa DMX512 Preta",         quantidade: 3,  local: "barracao",  categoria: "controle", observacoes: "" },
            { id: 94, material: "Mesa DMX512 Operator",      quantidade: 1,  local: "silene",    categoria: "controle", observacoes: "" },
            { id: 95, material: "Mesa DMX512 Verde",         quantidade: 1,  local: "barracao",  categoria: "controle", observacoes: "" },
            { id: 96, material: "Control 512 Pista infinytparis",quantidade:1,local:"barracao",  categoria: "controle", observacoes: "" },
            { id: 97, material: "Control 512 Pista de LED",  quantidade: 1,  local: "barracao",  categoria: "controle", observacoes: "" },
            { id: 98, material: "Control 512 Azul",          quantidade: 1,  local: "fernando-rancho", categoria: "controle", observacoes: "" },
            { id: 99, material: "Mesa Pilot",                quantidade: 1,  local: "barracao",  categoria: "controle", observacoes: "" },
            { id: 100,material: "Módulo de Palco 2x1",       quantidade: 10, local: "barracao",  categoria: "estrutura", observacoes: "" },
            { id: 101,material: "Tábua de Palco 2x1",        quantidade: 10, local: "barracao",  categoria: "estrutura", observacoes: "" }
        ];
        localStorage.setItem('equipamentos', JSON.stringify(equipamentos));
    }

    console.log('✅ Sistema totalmente inicializado');
});

// =============================================
// MENU MOBILE
// =============================================
function inicializarMenuMobile() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 768) sidebar.classList.remove('active');
            });
        });

        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 768 &&
                sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                !mobileMenuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

function checkScreenSize() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768) {
        if (mobileMenuToggle) mobileMenuToggle.style.display = 'block';
        if (sidebar) sidebar.classList.remove('active');
    } else {
        if (mobileMenuToggle) mobileMenuToggle.style.display = 'none';
        if (sidebar) sidebar.classList.add('active');
    }
}

// =============================================
// UTILITÁRIOS
// =============================================
function showLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) loading.style.display = 'flex';
}
function hideLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) loading.style.display = 'none';
}
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
function formatarLocal(local) {
    const locais = {
        'barracao': 'Barracão', 'silene': 'Silene', 'san-carlo': 'San Carlo',
        'manutencao': 'Manutenção', 'fernando-rancho': 'Fernando Rancho'
    };
    return locais[local] || local;
}
function formatarCategoria(categoria) {
    const categorias = {
        'estrutura': 'Estruturas', 'iluminacao': 'Iluminação', 'som': 'Sonorização',
        'projecao': 'Projeção', 'controle': 'Controles', 'acessorio': 'Acessórios'
    };
    return categorias[categoria] || categoria;
}
function formatarData(dataString) {
    if (!dataString) return 'Data inválida';
    try {
        const [ano, mes, dia] = dataString.split('-').map(Number);
        const data = new Date(ano, mes - 1, dia);
        if (isNaN(data.getTime())) return 'Data inválida';
        return data.toLocaleDateString('pt-BR');
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return 'Data inválida';
    }
}
function corrigirDataFusoHorario(dataString) {
    if (!dataString) return new Date();
    const [ano, mes, dia] = dataString.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
}

// =============================================
// EQUIPAMENTOS (CRUD)
// =============================================
function inicializarSistemaEquipamentos() {
    const btnNovo = document.getElementById('btn-novo-equipamento');
    if (btnNovo) btnNovo.addEventListener('click', () => abrirModalEquipamento());

    const btnFechar = document.getElementById('btn-fechar-modal-equipamento');
    if (btnFechar) btnFechar.addEventListener('click', fecharModalEquipamento);

    const btnCancelar = document.getElementById('btn-cancelar-equipamento');
    if (btnCancelar) btnCancelar.addEventListener('click', fecharModalEquipamento);

    const formEquipamento = document.getElementById('form-equipamento');
    if (formEquipamento) formEquipamento.addEventListener('submit', salvarEquipamento);

    const modal = document.getElementById('modal-equipamento');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'modal-equipamento') fecharModalEquipamento();
        });
    }

    const filtroCategoria = document.getElementById('filtro-categoria');
    const filtroLocal = document.getElementById('filtro-local');
    const busca = document.getElementById('busca');
    if (filtroCategoria) filtroCategoria.addEventListener('change', aplicarFiltrosEquipamentos);
    if (filtroLocal) filtroLocal.addEventListener('change', aplicarFiltrosEquipamentos);
    if (busca) busca.addEventListener('input', aplicarFiltrosEquipamentos);
}

function abrirModalEquipamento(equipamento = null) {
    const modal = document.getElementById('modal-equipamento');
    const titulo = document.getElementById('modal-equipamento-title');
    const form = document.getElementById('form-equipamento');

    if (equipamento) {
        titulo.textContent = 'Editar Equipamento';
        document.getElementById('equipamento-id').value = equipamento.id;
        document.getElementById('equipamento-material').value = equipamento.material;
        document.getElementById('equipamento-quantidade').value = equipamento.quantidade;
        document.getElementById('equipamento-categoria').value = equipamento.categoria;
        document.getElementById('equipamento-local').value = equipamento.local;
        document.getElementById('equipamento-observacoes').value = equipamento.observacoes;
    } else {
        titulo.textContent = 'Novo Equipamento';
        form.reset();
        document.getElementById('equipamento-id').value = '';
    }
    modal.style.display = 'flex';
}

function fecharModalEquipamento() {
    const modal = document.getElementById('modal-equipamento');
    const form = document.getElementById('form-equipamento');
    if (modal) modal.style.display = 'none';
    if (form) form.reset();
}

function salvarEquipamento(e) {
    e.preventDefault();
    const id = document.getElementById('equipamento-id').value;
    const material = document.getElementById('equipamento-material').value;
    const quantidade = parseInt(document.getElementById('equipamento-quantidade').value);
    const categoria = document.getElementById('equipamento-categoria').value;
    const local = document.getElementById('equipamento-local').value;
    const observacoes = document.getElementById('equipamento-observacoes').value;

    if (id) {
        const index = equipamentos.findIndex(eq => eq.id == id);
        if (index !== -1) {
            equipamentos[index] = { ...equipamentos[index], material, quantidade, categoria, local, observacoes };
            showToast('Equipamento atualizado com sucesso!', 'success');
        }
    } else {
        equipamentos.push({ id: Date.now(), material, quantidade, categoria, local, observacoes });
        showToast('Equipamento adicionado com sucesso!', 'success');
    }

    localStorage.setItem('equipamentos', JSON.stringify(equipamentos));
    carregarEquipamentos();
    fecharModalEquipamento();
    if (document.getElementById('total-tipos-equipamentos')) atualizarDashboard();
}

function editarEquipamento(id) {
    const equipamento = equipamentos.find(eq => eq.id == id);
    if (equipamento) abrirModalEquipamento(equipamento);
}

function excluirEquipamento(id) {
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
        const index = equipamentos.findIndex(eq => eq.id == id);
        if (index !== -1) {
            equipamentos.splice(index, 1);
            localStorage.setItem('equipamentos', JSON.stringify(equipamentos));
            carregarEquipamentos();
            showToast('Equipamento excluído com sucesso!', 'success');
            if (document.getElementById('total-tipos-equipamentos')) atualizarDashboard();
        }
    }
}

function renderLinhaEquipamento(equip) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${equip.material}</td>
        <td>${equip.quantidade}</td>
        <td>${formatarCategoria(equip.categoria)}</td>
        <td><span class="status-${equip.local}">${formatarLocal(equip.local)}</span></td>
        <td>${equip.observacoes || '-'}</td>
        <td>
            <div class="btn-acoes">
                <button class="btn-editar" onclick="editarEquipamento(${equip.id})"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn-excluir" onclick="excluirEquipamento(${equip.id})"><i class="fas fa-trash"></i> Excluir</button>
            </div>
        </td>`;
    return tr;
}

function carregarEquipamentos() {
    const tabela = document.querySelector('#tabela-equipamentos tbody');
    if (!tabela) return;
    tabela.innerHTML = '';
    equipamentos.forEach(equip => tabela.appendChild(renderLinhaEquipamento(equip)));
}

function aplicarFiltrosEquipamentos() {
    const categoria = document.getElementById('filtro-categoria')?.value || '';
    const local = document.getElementById('filtro-local')?.value || '';
    const busca = document.getElementById('busca')?.value.toLowerCase() || '';

    const filtrados = equipamentos.filter(equip =>
        (!categoria || equip.categoria === categoria) &&
        (!local || equip.local === local) &&
        (!busca || equip.material.toLowerCase().includes(busca))
    );

    const tabela = document.querySelector('#tabela-equipamentos tbody');
    if (!tabela) return;
    tabela.innerHTML = '';
    filtrados.forEach(equip => tabela.appendChild(renderLinhaEquipamento(equip)));
}

// =============================================
// ORÇAMENTOS (CRUD)
// =============================================
function inicializarSistemaOrcamentos() {
    console.log('💰 Inicializando sistema de orçamentos...');

    const btnNovo = document.getElementById('btn-novo-orcamento');
    if (btnNovo) btnNovo.addEventListener('click', () => abrirModalOrcamento());

    const btnFechar = document.getElementById('btn-fechar-modal-orcamento');
    if (btnFechar) btnFechar.addEventListener('click', fecharModalOrcamento);

    const btnCancelar = document.getElementById('btn-cancelar-orcamento');
    if (btnCancelar) btnCancelar.addEventListener('click', fecharModalOrcamento);

    const formOrcamento = document.getElementById('form-orcamento');
    if (formOrcamento) formOrcamento.addEventListener('submit', salvarOrcamento);

    const modal = document.getElementById('modal-orcamento');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'modal-orcamento') fecharModalOrcamento();
        });
    }

    const filtroStatus = document.getElementById('filtro-status');
    const buscaOrcamento = document.getElementById('busca-orcamento');
    if (filtroStatus) filtroStatus.addEventListener('change', aplicarFiltrosOrcamentos);
    if (buscaOrcamento) buscaOrcamento.addEventListener('input', aplicarFiltrosOrcamentos);

    aplicarFiltrosOrcamentos();
    console.log('✅ Sistema de orçamentos inicializado');
}

function abrirModalOrcamento(orcamento = null) {
    const modal = document.getElementById('modal-orcamento');
    const titulo = document.getElementById('modal-orcamento-title');
    const form = document.getElementById('form-orcamento');

    if (orcamento) {
        titulo.innerHTML = '<i class="fas fa-file-invoice-dollar"></i> Editar Orçamento';
        document.getElementById('orcamento-id').value = orcamento.id;
        document.getElementById('orcamento-cliente').value = orcamento.cliente;
        document.getElementById('orcamento-evento').value = orcamento.tipoEvento;
        document.getElementById('orcamento-data').value = orcamento.data;
        document.getElementById('orcamento-local').value = orcamento.local;
        document.getElementById('orcamento-observacoes').value = orcamento.observacoes || '';
        setTimeout(() => carregarEquipamentosOrcamento(orcamento.equipamentos), 100);
    } else {
        titulo.innerHTML = '<i class="fas fa-file-invoice-dollar"></i> Novo Orçamento';
        form.reset();
        document.getElementById('orcamento-id').value = '';
        document.getElementById('total-orcamento-form').textContent = '0.00';
        setTimeout(() => carregarEquipamentosOrcamento([]), 100);
    }
    modal.style.display = 'flex';
}

function fecharModalOrcamento() {
    const modal = document.getElementById('modal-orcamento');
    const form = document.getElementById('form-orcamento');
    if (modal) modal.style.display = 'none';
    if (form) form.reset();
    const total = document.getElementById('total-orcamento-form');
    if (total) total.textContent = '0.00';
}

function carregarEquipamentosOrcamento(equipamentosSelecionados = []) {
    const container = document.getElementById('lista-equipamentos-orcamento');
    if (!container) return;
    container.innerHTML = '';

    equipamentos.forEach(equip => {
        const equipamentoSelecionado = equipamentosSelecionados.find(e => e.id === equip.id);
        const selecionado = !!equipamentoSelecionado;
        const quantidade = selecionado ? equipamentoSelecionado.quantidade : 1;
        const valorUnitario = calcularValorEquipamento(equip);

        const div = document.createElement('div');
        div.className = 'equipamento-orcamento-card';
        div.innerHTML = `
            <h4>${equip.material}</h4>
            <p><i class="fas fa-cubes"></i> Disponível: ${equip.quantidade} unidades</p>
            <p><i class="fas fa-map-marker-alt"></i> Local: ${formatarLocal(equip.local)}</p>
            <p><i class="fas fa-tag"></i> Categoria: ${formatarCategoria(equip.categoria)}</p>
            <p><i class="fas fa-dollar-sign"></i> Valor unitário: R$ ${valorUnitario.toFixed(2)}</p>
            <div class="checkbox-container">
                <input type="checkbox" id="equip-orc-${equip.id}" data-id="${equip.id}" data-nome="${equip.material}" data-valor="${valorUnitario}" ${selecionado ? 'checked' : ''}>
                <label for="equip-orc-${equip.id}">Incluir no orçamento</label>
            </div>
            <div class="quantidade-container" style="display:${selecionado ? 'flex' : 'none'}">
                <label>Quantidade:</label>
                <input type="number" min="1" max="${equip.quantidade}" value="${quantidade}" data-id="${equip.id}">
            </div>`;
        container.appendChild(div);
    });

    document.querySelectorAll('#lista-equipamentos-orcamento input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const quantidadeContainer = this.closest('.equipamento-orcamento-card').querySelector('.quantidade-container');
            if (quantidadeContainer) quantidadeContainer.style.display = this.checked ? 'flex' : 'none';
            calcularTotalOrcamento();
        });
    });

    document.querySelectorAll('#lista-equipamentos-orcamento input[type="number"]').forEach(input => {
        input.addEventListener('input', calcularTotalOrcamento);
    });

    calcularTotalOrcamento();
}

function calcularTotalOrcamento() {
    let total = 0;
    document.querySelectorAll('#lista-equipamentos-orcamento input[type="checkbox"]:checked').forEach(checkbox => {
        const id = checkbox.getAttribute('data-id');
        const valorUnitario = parseFloat(checkbox.getAttribute('data-valor'));
        const quantidadeInput = document.querySelector(`#lista-equipamentos-orcamento input[type="number"][data-id="${id}"]`);
        const quantidade = parseInt(quantidadeInput?.value) || 1;
        total += valorUnitario * quantidade;
    });
    const totalElement = document.getElementById('total-orcamento-form');
    if (totalElement) totalElement.textContent = total.toFixed(2);
}

function salvarOrcamento(e) {
    e.preventDefault();
    const id = document.getElementById('orcamento-id').value;
    const cliente = document.getElementById('orcamento-cliente').value;
    const tipoEvento = document.getElementById('orcamento-evento').value;
    const data = document.getElementById('orcamento-data').value;
    const local = document.getElementById('orcamento-local').value;
    const observacoes = document.getElementById('orcamento-observacoes').value;

    const equipamentosSelecionados = [];
    document.querySelectorAll('#lista-equipamentos-orcamento input[type="checkbox"]:checked').forEach(checkbox => {
        const equipId = checkbox.getAttribute('data-id');
        const nome = checkbox.getAttribute('data-nome');
        const valorUnitario = parseFloat(checkbox.getAttribute('data-valor'));
        const quantidadeInput = document.querySelector(`#lista-equipamentos-orcamento input[type="number"][data-id="${equipId}"]`);
        const quantidade = parseInt(quantidadeInput?.value) || 1;
        equipamentosSelecionados.push({
            id: parseInt(equipId), nome, quantidade, valorUnitario, subtotal: valorUnitario * quantidade
        });
    });

    if (equipamentosSelecionados.length === 0) {
        showToast('Selecione pelo menos um equipamento!', 'warning');
        return;
    }

    const total = equipamentosSelecionados.reduce((sum, item) => sum + item.subtotal, 0);

    if (id) {
        const index = orcamentos.findIndex(o => o.id == id);
        if (index !== -1) {
            orcamentos[index] = {
                ...orcamentos[index], cliente, tipoEvento, data, local, observacoes,
                equipamentos: equipamentosSelecionados, total
            };
            showToast('Orçamento atualizado com sucesso!', 'success');
        }
    } else {
        orcamentos.push({
            id: Date.now(), cliente, tipoEvento, data, local, observacoes,
            equipamentos: equipamentosSelecionados, total,
            status: 'pendente', dataCriacao: new Date().toISOString()
        });
        showToast('Orçamento criado com sucesso!', 'success');
    }

    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    aplicarFiltrosOrcamentos();
    fecharModalOrcamento();
}

function editarOrcamento(id) {
    const orcamento = orcamentos.find(o => o.id == id);
    if (orcamento) abrirModalOrcamento(orcamento);
}

function renderOrcamentoItem(orc) {
    const div = document.createElement('div');
    div.className = 'orcamento-item';
    div.style.borderLeftColor = getStatusColor(orc.status);
    div.innerHTML = `
        <h4>${orc.cliente}</h4>
        <p><i class="fas fa-calendar-day"></i> ${formatarData(orc.data)}</p>
        <p><i class="fas fa-map-marker-alt"></i> ${orc.local}</p>
        <p><i class="fas fa-tag"></i> ${orc.tipoEvento}</p>
        ${orc.observacoes ? `<p><i class="fas fa-sticky-note"></i> ${orc.observacoes}</p>` : ''}
        <span class="status-${orc.status}">${orc.status.toUpperCase()}</span>
        <p><strong>R$ ${orc.total.toFixed(2)}</strong></p>
        <div class="orcamento-acoes">
            ${orc.status === 'pendente' ? `
                <button class="btn-acao btn-aprovar" onclick="aprovarOrcamento(${orc.id})"><i class="fas fa-check"></i> Aprovar</button>
                <button class="btn-acao btn-rejeitar" onclick="rejeitarOrcamento(${orc.id})"><i class="fas fa-times"></i> Rejeitar</button>
            ` : ''}
            <button class="btn-acao btn-editar" onclick="editarOrcamento(${orc.id})"><i class="fas fa-edit"></i> Editar</button>
            <button class="btn-acao btn-excluir" onclick="excluirOrcamento(${orc.id})"><i class="fas fa-trash"></i> Excluir</button>
            <button class="btn-acao btn-detalhes" onclick="verDetalhesOrcamento(${orc.id})"><i class="fas fa-eye"></i> Detalhes</button>
        </div>`;
    return div;
}

function carregarOrcamentos() {
    const container = document.getElementById('lista-orcamentos');
    if (!container) return;
    container.innerHTML = '';
    orcamentos.forEach(orc => container.appendChild(renderOrcamentoItem(orc)));
    const contador = document.getElementById('contador-orcamentos');
    if (contador) contador.textContent = orcamentos.length;
}

function aplicarFiltrosOrcamentos() {
    const status = document.getElementById('filtro-status')?.value || '';
    const busca = document.getElementById('busca-orcamento')?.value.toLowerCase() || '';

    const filtrados = orcamentos.filter(orc =>
        (!status || orc.status === status) &&
        (!busca || orc.cliente.toLowerCase().includes(busca))
    );

    const container = document.getElementById('lista-orcamentos');
    if (!container) return;
    container.innerHTML = '';
    filtrados.forEach(orc => container.appendChild(renderOrcamentoItem(orc)));

    const contador = document.getElementById('contador-orcamentos');
    if (contador) contador.textContent = filtrados.length;
}

function verDetalhesOrcamento(id) {
    const orcamento = orcamentos.find(o => o.id === id);
    if (!orcamento) return;
    let detalhes = `Cliente: ${orcamento.cliente}\n`;
    detalhes += `Evento: ${orcamento.tipoEvento}\n`;
    detalhes += `Data: ${formatarData(orcamento.data)}\n`;
    detalhes += `Local: ${orcamento.local}\n`;
    detalhes += `Status: ${orcamento.status}\n`;
    detalhes += `Total: R$ ${orcamento.total.toFixed(2)}\n\nEquipamentos:\n`;
    orcamento.equipamentos.forEach(equip => {
        detalhes += `• ${equip.nome} (${equip.quantidade}x) - R$ ${equip.subtotal.toFixed(2)}\n`;
    });
    alert(detalhes);
}

function aprovarOrcamento(id) {
    const orcamento = orcamentos.find(o => o.id === id);
    if (!orcamento) return;

    const eventoExistente = eventos.find(e => e.orcamentoId === id);
    if (eventoExistente) {
        showToast('Este orçamento já tem um evento associado!', 'warning');
        return;
    }

    const disp = verificarDisponibilidade(orcamento.equipamentos);
    if (!disp.todosDisponiveis) {
        showToast(`Equipamento "${disp.equipamentoIndisponivel}" não disponível na quantidade solicitada!`, 'warning');
        return;
    }

    orcamento.status = 'aprovado';
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    reservarEquipamentos(orcamento.equipamentos);
    criarEventoFromOrcamento(orcamento);

    showToast('Orçamento aprovado e evento criado!', 'success');
    aplicarFiltrosOrcamentos();
}

function rejeitarOrcamento(id) {
    const orcamento = orcamentos.find(o => o.id === id);
    if (!orcamento) return;

    if (confirm(`Deseja rejeitar o orçamento de "${orcamento.cliente}"?`)) {
        const eventoIndex = eventos.findIndex(e => e.orcamentoId === id);
        if (eventoIndex !== -1) {
            const evento = eventos[eventoIndex];
            liberarEquipamentosEvento(evento.equipamentos);
            eventos.splice(eventoIndex, 1);
            const checklistIndex = checklists.findIndex(c => c.eventoId === evento.id);
            if (checklistIndex !== -1) {
                checklists.splice(checklistIndex, 1);
                localStorage.setItem('checklists', JSON.stringify(checklists));
            }
        }
        orcamento.status = 'recusado';
        localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
        localStorage.setItem('eventos', JSON.stringify(eventos));
        showToast('Orçamento recusado! Evento removido.', 'info');
        aplicarFiltrosOrcamentos();
    }
}

function excluirOrcamento(id) {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
        const index = orcamentos.findIndex(o => o.id == id);
        if (index !== -1) {
            const eventoIndex = eventos.findIndex(e => e.orcamentoId === id);
            if (eventoIndex !== -1) {
                const evento = eventos[eventoIndex];
                liberarEquipamentosEvento(evento.equipamentos);
                eventos.splice(eventoIndex, 1);
                const checklistIndex = checklists.findIndex(c => c.eventoId === evento.id);
                if (checklistIndex !== -1) {
                    checklists.splice(checklistIndex, 1);
                    localStorage.setItem('checklists', JSON.stringify(checklists));
                }
            }
            orcamentos.splice(index, 1);
            localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
            localStorage.setItem('eventos', JSON.stringify(eventos));
            showToast('Orçamento excluído com sucesso! Evento e checklist removidos.', 'success');

            aplicarFiltrosOrcamentos();
            if (document.getElementById('lista-eventos') || document.getElementById('lista-proximos-eventos')) {
                carregarEventosAgendados();
                carregarProximosEventos();
            }
            if (document.getElementById('selecionar-evento')) carregarEventosChecklist();
        }
    }
}

// Funções auxiliares de orçamentos/eventos
function verificarDisponibilidade(equipamentosOrcamento) {
    for (const equipOrc of equipamentosOrcamento) {
        const equipamento = equipamentos.find(e => e.id === equipOrc.id);
        if (!equipamento || equipamento.quantidade < equipOrc.quantidade) {
            return { todosDisponiveis: false, equipamentoIndisponivel: equipOrc.nome };
        }
    }
    return { todosDisponiveis: true };
}

function reservarEquipamentos(equipamentosOrcamento) {
    equipamentosOrcamento.forEach(equipOrc => {
        const equipamento = equipamentos.find(e => e.id === equipOrc.id);
        if (equipamento) equipamento.quantidade -= equipOrc.quantidade;
    });
    localStorage.setItem('equipamentos', JSON.stringify(equipamentos));
}

function liberarEquipamentosEvento(equipamentosEvento) {
    equipamentosEvento.forEach(equipEvento => {
        const equipamento = equipamentos.find(e => e.id === equipEvento.id);
        if (equipamento) equipamento.quantidade += equipEvento.quantidade;
    });
    localStorage.setItem('equipamentos', JSON.stringify(equipamentos));
}

function criarEventoFromOrcamento(orcamento) {
    const eventoExistente = eventos.find(e => e.orcamentoId === orcamento.id);
    if (eventoExistente) return;

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

    if (document.getElementById('lista-eventos') || document.getElementById('lista-proximos-eventos')) {
        carregarEventosAgendados();
        carregarProximosEventos();
    }
    if (document.getElementById('selecionar-evento')) carregarEventosChecklist();
}

function calcularValorEquipamento(equipamento) {
    const valores = {
        'som': 150, 'iluminacao': 80, 'estrutura': 300,
        'projecao': 200, 'controle': 100, 'acessorio': 50
    };
    return valores[equipamento.categoria] || 100;
}

function getStatusColor(status) {
    const cores = {
        'pendente': '#FFC107', 'aprovado': '#4CAF50',
        'recusado': '#F44336', 'cancelado': '#9E9E9E'
    };
    return cores[status] || '#8e8e8e';
}

// =============================================
// CHECKLISTS
// =============================================
function mostrarMensagemChecklistVazio() {
    const detalhes = document.getElementById('detalhes-evento');
    if (detalhes) detalhes.style.display = 'none';
}

function carregarEventosChecklist() {
    const select = document.getElementById('selecionar-evento');
    if (!select) return;

    const eventosAprovados = eventos.filter(evento =>
        evento.orcamentoId != null && evento.status === 'agendado'
    );

    select.innerHTML = '';

    if (eventosAprovados.length === 0) {
        select.innerHTML = `<option value="">Nenhum evento aprovado disponível</option>`;
        mostrarMensagemChecklistVazio();
        return;
    }

    const optionPadrao = document.createElement('option');
    optionPadrao.value = '';
    optionPadrao.textContent = 'Selecione um evento...';
    select.appendChild(optionPadrao);

    eventosAprovados.forEach(evento => {
        const option = document.createElement('option');
        option.value = evento.id;
        option.textContent = `${evento.cliente} - ${formatarData(evento.data)} - ${evento.local}`;
        select.appendChild(option);
    });

    select.addEventListener('change', function () {
        const eventoId = parseInt(this.value);
        if (eventoId) {
            carregarDetalhesEventoChecklist(eventoId);
        } else {
            const detalhes = document.getElementById('detalhes-evento');
            if (detalhes) detalhes.style.display = 'none';
        }
    });

    const btnSalvar = document.getElementById('btn-salvar-checklist');
    if (btnSalvar) {
        btnSalvar.addEventListener('click', function (e) {
            e.preventDefault();
            salvarChecklist();
        });
    }
}

function carregarDetalhesEventoChecklist(eventoId) {
    const evento = eventos.find(e => e.id === eventoId);
    if (!evento) return;

    const checklistSalvo = checklists.find(c => c.eventoId === eventoId);

    document.getElementById('checklist-cliente').textContent = evento.cliente;
    document.getElementById('checklist-data').textContent = formatarData(evento.data);
    document.getElementById('checklist-local').textContent = evento.local;

    const container = document.getElementById('checklist-equipamentos');
    if (!container) return;
    container.innerHTML = '';

    evento.equipamentos.forEach(equip => {
        let statusSelecionado = 'pendente';
        if (checklistSalvo && checklistSalvo.equipamentos) {
            const equipamentoSalvo = checklistSalvo.equipamentos.find(e => e.equipamentoId === equip.id);
            if (equipamentoSalvo) statusSelecionado = equipamentoSalvo.status;
        }

        const div = document.createElement('div');
        div.className = 'checklist-item';
        div.innerHTML = `
            <div>
                <h4>${equip.nome}</h4>
                <p>Quantidade: ${equip.quantidade}</p>
            </div>
            <select class="status-equipamento" data-id="${equip.id}">
                <option value="pendente"  ${statusSelecionado === 'pendente'  ? 'selected' : ''}>Pendente</option>
                <option value="conferido" ${statusSelecionado === 'conferido' ? 'selected' : ''}>Conferido</option>
                <option value="testado"   ${statusSelecionado === 'testado'   ? 'selected' : ''}>Testado</option>
                <option value="pronto"    ${statusSelecionado === 'pronto'    ? 'selected' : ''}>Pronto</option>
            </select>`;
        container.appendChild(div);
    });

    if (checklistSalvo) document.getElementById('responsavel').value = checklistSalvo.responsavel || '';
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
        statusEquipamentos.push({
            equipamentoId: parseInt(select.getAttribute('data-id')),
            status: select.value
        });
    });

    const idx = checklists.findIndex(c => c.eventoId === eventoId);
    const checklist = {
        id: idx !== -1 ? checklists[idx].id : Date.now(),
        eventoId,
        responsavel,
        equipamentos: statusEquipamentos,
        dataCriacao: idx !== -1 ? checklists[idx].dataCriacao : new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
    };

    if (idx !== -1) {
        checklists[idx] = checklist;
        showToast('Checklist atualizado com sucesso!', 'success');
    } else {
        checklists.push(checklist);
        showToast('Checklist salvo com sucesso!', 'success');
    }

    localStorage.setItem('checklists', JSON.stringify(checklists));
    setTimeout(() => carregarDetalhesEventoChecklist(eventoId), 1000);
}

// =============================================
// EVENTOS
// =============================================
function carregarEventosAgendados() {
    const container = document.getElementById('lista-eventos');
    if (!container) return;
    container.innerHTML = '';

    const eventosAprovados = eventos.filter(evento => evento.orcamentoId && evento.status === 'agendado');

    if (eventosAprovados.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:30px; color:var(--gray);">
                <i class="fas fa-calendar-times fa-2x"></i>
                <h3>Nenhum Evento Agendado</h3>
                <p>Os eventos aparecerão aqui automaticamente quando você aprovar orçamentos.</p>
            </div>`;
        return;
    }

    eventosAprovados.forEach(evento => {
        const orcamento = orcamentos.find(o => o.id === evento.orcamentoId);
        const statusOrcamento = orcamento ? orcamento.status : 'não encontrado';

        const div = document.createElement('div');
        div.className = 'evento-item';
        div.style.cssText = `background: rgba(40,40,40,0.8); padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid var(--primary); position: relative;`;
        div.innerHTML = `
            <h4>${evento.cliente}</h4>
            <p><strong>Data:</strong> ${formatarData(evento.data)}</p>
            <p><strong>Local:</strong> ${evento.local}</p>
            <p><strong>Tipo:</strong> ${evento.tipoEvento}</p>
            <span class="status-aprovado">Evento Aprovado</span>
            <span class="status-${statusOrcamento}">Orçamento: ${statusOrcamento.toUpperCase()}</span>
            <p style="margin-top:10px;"><strong>Equipamentos:</strong></p>
            <ul>${evento.equipamentos.map(equip => `<li>${equip.nome} (${equip.quantidade}x)</li>`).join('')}</ul>
            <div class="orcamento-acoes">
                <button class="btn-acao btn-excluir" onclick="excluirEvento(${evento.id})"><i class="fas fa-trash"></i> Excluir Evento</button>
                ${statusOrcamento === 'cancelado' ? `<button class="btn-acao btn-aprovar" onclick="reativarOrcamento(${evento.id})"><i class="fas fa-redo"></i> Reativar</button>` : ''}
            </div>`;
        container.appendChild(div);
    });
}

function carregarProximosEventos() {
    const container = document.getElementById('lista-proximos-eventos');
    if (!container) return;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const eventosFuturos = eventos.filter(evento => {
        const dataEvento = corrigirDataFusoHorario(evento.data);
        return evento.orcamentoId && evento.status === 'agendado' && dataEvento >= hoje;
    }).slice(0, 5);

    container.innerHTML = '';

    if (eventosFuturos.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:20px; color:var(--gray);">
                <p>Nenhum evento futuro</p>
                <small>Aprove orçamentos para agendar eventos</small>
            </div>`;
        return;
    }

    eventosFuturos.forEach(evento => {
        const div = document.createElement('div');
        div.className = 'evento-item';
        div.innerHTML = `
            <h4>${evento.cliente}</h4>
            <p><strong>Data:</strong> ${formatarData(evento.data)}</p>
            <p><strong>Local:</strong> ${evento.local}</p>
            <p><strong>Tipo:</strong> ${evento.tipoEvento}</p>
            ${evento.observacoes ? `<p><strong>Observações:</strong> ${evento.observacoes}</p>` : ''}`;
        container.appendChild(div);
    });
}

function excluirEvento(id) {
    const evento = eventos.find(e => e.id === id);
    if (!evento) return;

    if (confirm(`Tem certeza que deseja excluir o evento de "${evento.cliente}"?\n\nEsta ação não pode ser desfeita e liberará os equipamentos reservados.`)) {
        const orcamentoCorrespondente = orcamentos.find(o => o.id === evento.orcamentoId);

        liberarEquipamentosEvento(evento.equipamentos);

        if (orcamentoCorrespondente) {
            orcamentoCorrespondente.status = 'cancelado';
            orcamentoCorrespondente.observacoes = orcamentoCorrespondente.observacoes
                ? `${orcamentoCorrespondente.observacoes} | Evento cancelado em ${new Date().toLocaleDateString()}`
                : `Evento cancelado em ${new Date().toLocaleDateString()}`;
        }

        const index = eventos.findIndex(e => e.id === id);
        if (index !== -1) {
            eventos.splice(index, 1);
            localStorage.setItem('eventos', JSON.stringify(eventos));

            const checklistIndex = checklists.findIndex(c => c.eventoId === id);
            if (checklistIndex !== -1) {
                checklists.splice(checklistIndex, 1);
                localStorage.setItem('checklists', JSON.stringify(checklists));
            }

            localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
            showToast('Evento excluído com sucesso! Equipamentos liberados e orçamento atualizado.', 'success');
            atualizarTodasInterfaces();
        }
    }
}

function reativarOrcamento(eventoId) {
    const evento = eventos.find(e => e.id === eventoId);
    if (!evento || !evento.orcamentoId) return;

    const orcamento = orcamentos.find(o => o.id === evento.orcamentoId);
    if (!orcamento) return;

    if (confirm(`Deseja reativar o orçamento de "${orcamento.cliente}"?`)) {
        const disp = verificarDisponibilidade(evento.equipamentos);
        if (!disp.todosDisponiveis) {
            showToast(`Equipamento "${disp.equipamentoIndisponivel}" não disponível!`, 'warning');
            return;
        }
        reservarEquipamentos(evento.equipamentos);
        orcamento.status = 'aprovado';
        localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
        showToast('Orçamento reativado com sucesso!', 'success');
        atualizarTodasInterfaces();
    }
}

function atualizarTodasInterfaces() {
    carregarEventosAgendados();
    carregarProximosEventos();
    aplicarFiltrosOrcamentos();
    if (document.getElementById('selecionar-evento')) carregarEventosChecklist();
    if (document.getElementById('total-tipos-equipamentos')) atualizarDashboard();
    console.log('🔄 Todas as interfaces atualizadas');
}

// =============================================
// CALENDÁRIO
// =============================================
let currentDate = new Date();

function inicializarCalendario() {
    renderCalendar();

    const prevMonth = document.getElementById('prev-month');
    const nextMonth = document.getElementById('next-month');
    const today = document.getElementById('today');

    if (prevMonth) prevMonth.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
    if (nextMonth) nextMonth.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
    if (today) today.addEventListener('click', () => { currentDate = new Date(); renderCalendar(); });

    carregarListaEventos();
}

function renderCalendar() {
    const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const currentMonthElement = document.getElementById('current-month');
    if (currentMonthElement) currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';

    ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].forEach(day => {
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
            const eventDate = corrigirDataFusoHorario(evento.data);
            const currentDayCorrected = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
            return eventDate.getTime() === currentDayCorrected.getTime();
        });

        dayEvents.forEach(evento => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.textContent = evento.cliente;
            eventElement.setAttribute('title', `${evento.cliente} - ${evento.tipoEvento}`);
            dayElement.appendChild(eventElement);
        });

        const today = new Date();
        if (currentDay.getDate() === today.getDate() &&
            currentDay.getMonth() === today.getMonth() &&
            currentDay.getFullYear() === today.getFullYear()) {
            dayElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
            dayElement.style.border = '2px solid #4CAF50';
        }

        calendarGrid.appendChild(dayElement);
    }

    carregarListaEventos();
}

function carregarListaEventos() {
    const container = document.getElementById('eventos-lista');
    if (!container) return;
    container.innerHTML = '';

    const eventosOrdenados = [...eventos].sort((a, b) => corrigirDataFusoHorario(a.data) - corrigirDataFusoHorario(b.data));

    eventosOrdenados.forEach(evento => {
        const div = document.createElement('div');
        div.className = 'evento-item';
        div.style.cssText = `background: rgba(40,40,40,0.8); padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid var(--primary);`;
        div.innerHTML = `
            <h4>${evento.cliente}</h4>
            <p><strong>Data:</strong> ${formatarData(evento.data)}</p>
            <p><strong>Local:</strong> ${evento.local}</p>
            <p><strong>Tipo:</strong> ${evento.tipoEvento}</p>`;
        container.appendChild(div);
    });
}

// =============================================
// DASHBOARD
// =============================================
function atualizarDashboard() {
    console.log('📊 Atualizando dashboard...');

    const totalTiposEquipamentos = equipamentos.length;
    const totalUnidadesEquipamentos = equipamentos.reduce((sum, equip) => sum + equip.quantidade, 0);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const eventosAtivos = eventos.filter(evento => corrigirDataFusoHorario(evento.data) >= hoje).length;

    const totalOrcamentos = orcamentos.length;

    const totalChecklists = checklists.length;
    const checklistsConcluidos = checklists.filter(c => c.equipamentos.every(equip => equip.status === 'pronto')).length;
    const percentualChecklists = totalChecklists > 0 ? Math.round((checklistsConcluidos / totalChecklists) * 100) : 0;

    const totalTiposElement = document.getElementById('total-tipos-equipamentos');
    const totalUnidadesElement = document.getElementById('total-unidades-equipamentos');
    const totalEventosElement = document.getElementById('total-eventos');
    const totalOrcamentosElement = document.getElementById('total-orcamentos');
    const percentualChecklistsElement = document.getElementById('percentual-checklists');

    if (totalTiposElement) totalTiposElement.textContent = totalTiposEquipamentos;
    if (totalUnidadesElement) totalUnidadesElement.textContent = totalUnidadesEquipamentos;
    if (totalEventosElement) totalEventosElement.textContent = eventosAtivos;
    if (totalOrcamentosElement) totalOrcamentosElement.textContent = totalOrcamentos;
    if (percentualChecklistsElement) percentualChecklistsElement.textContent = percentualChecklists + '%';
}

// =============================================
// EXPORTS GLOBAIS (para onclick e debug)
// =============================================
window.logout = logout;
window.checkScreenSize = checkScreenSize;
window.inicializarMenuMobile = inicializarMenuMobile;
window.editarEquipamento = editarEquipamento;
window.excluirEquipamento = excluirEquipamento;
window.editarOrcamento = editarOrcamento;
window.excluirOrcamento = excluirOrcamento;
window.aprovarOrcamento = aprovarOrcamento;
window.rejeitarOrcamento = rejeitarOrcamento;
window.verDetalhesOrcamento = verDetalhesOrcamento;
window.excluirEvento = excluirEvento;
window.reativarOrcamento = reativarOrcamento;
window.inicializarCalendario = inicializarCalendario;
