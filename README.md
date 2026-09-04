# Tag Som e Luz - Sistema de Gerenciamento

Sistema completo para gerenciamento de eventos, equipamentos e orçamentos para empresa de som e luz.

## 📁 Estrutura de Pastas

```
nova-tag/
├── 📄 index.html              # Página de login
├── 📄 dashboard.html          # Painel principal
├── 📄 equipamentos.html       # Gestão de equipamentos
├── 📄 orcamentos.html         # Gestão de orçamentos
├── 📄 eventos.html            # Lista de eventos
├── 📄 checklists.html         # Checklists operacionais
├── 📄 agendamento.html        # Calendário de eventos
├── 📄 .htaccess               # Configurações de URL
│
├── 📁 assets/                 # Arquivos estáticos
│   ├── 📄 script.js           # JavaScript principal
│   ├── 📄 style.css           # Estilos CSS
│   └── 📁 images/             # Imagens
│
├── 📁 includes/               # Configurações PHP (PROTEGIDO)
│   ├── 📄 config.php          # Configurações do banco
│   ├── 📄 conexao.php         # Classe de conexão MySQL
│   ├── 📄 .htaccess           # Bloqueio de acesso
│   └── 📄 index.html          # Página de bloqueio
│
├── 📁 api/                    # API REST (PROTEGIDO)
│   ├── 📄 index.php           # Rotas da API
│   └── 📁 routes/             # Rotas por recurso
│       ├── 📄 equipamentos.php
│       ├── 📄 orcamentos.php
│       ├── 📄 eventos.php
│       ├── 📄 checklists.php
│       └── 📄 usuarios.php
│
├── 📁 sql/                    # Scripts SQL (PROTEGIDO)
│   ├── 📄 banco_dados.sql     # Script de criação do BD
│   ├── 📄 .htaccess           # Bloqueio de acesso
│   └── 📄 index.html          # Página de bloqueio
│
├── 📄 CONFIGURACAO_BANCO.md   # Documentação do banco
└── 📄 README.md               # Este arquivo
```

## 🚀 Funcionalidades

### Módulos do Sistema

| Módulo | Descrição |
|--------|-----------|
| **Dashboard** | Painel com estatísticas e próximos eventos |
| **Equipamentos** | Cadastro e controle de estoque |
| **Orçamentos** | Criação e gestão de orçamentos para clientes |
| **Eventos** | Agenda de eventos agendados |
| **Checklists** | Controle operacional de montagem |
| **Agendamento** | Calendário visual de eventos |

### Funcionalidades Técnicas

- ✅ Autenticação de usuários
- ✅ CRUD completo para todas as entidades
- ✅ Filtros e busca em tempo real
- ✅ Calendário interativo
- ✅ API REST para integrações
- ✅ Design responsivo (mobile)
- ✅ Banco de dados MySQL
- ✅ Segurança contra SQL Injection

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** PHP 7.4+
- **Banco de Dados:** MySQL 5.7+
- **Servidor:** IIS (Windows Server 2022) ou Apache

## 📋 Pré-requisitos

- PHP 7.4 ou superior
- MySQL 5.7 ou superior
- Habilitar extensões PHP:
  - `php_pdo_mysql`
  - `php_json`

## 🔧 Configuração

### 1. Banco de Dados

```bash
# Acessar MySQL
mysql -u root -p

# Executar script de criação
source sql/banco_dados.sql
```

### 2. Configuração PHP

Edite `includes/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'tag_som_luz');
define('DB_USER', 'root');
define('DB_PASS', 'sua_senha');
```

### 3. IIS (Windows Server)

1. Instalar o PHP via Web Platform Installer
2. Criar site no IIS
3. Configurar URL Rewrite com o `.htaccess`

## 📡 API REST

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/equipamentos` | Listar equipamentos |
| POST | `/api/equipamentos` | Criar equipamento |
| PUT | `/api/equipamentos/{id}` | Atualizar equipamento |
| DELETE | `/api/equipamentos/{id}` | Deletar equipamento |
| GET | `/api/orcamentos` | Listar orçamentos |
| POST | `/api/orcamentos` | Criar orçamento |
| GET | `/api/eventos` | Listar eventos |
| POST | `/api/eventos` | Criar evento |
| GET | `/api/checklists` | Listar checklists |
| POST | `/api/checklists` | Criar checklist |
| POST | `/api/usuarios/login` | Autenticar usuário |

### Exemplo de Requisição

```javascript
// Buscar equipamentos
fetch('/api/equipamentos')
    .then(response => response.json())
    .then(data => console.log(data));

// Criar orçamento
fetch('/api/orcamentos', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        cliente: 'João da Silva',
        tipo_evento: 'casamento',
        data_evento: '2024-12-15',
        local_evento: 'Salão de Festas'
    })
});
```

## 🔐 Segurança

- ✅ Prepared statements para prevenir SQL Injection
- ✅ Criptografia de senhas com `password_hash()`
- ✅ Proteção de pastas sensíveis via `.htaccess`
- ✅ Validação de dados de entrada
- ✅ Headers de segurança HTTP

## 📝 Licença

Este é um projeto acadêmico para fins de aprendizado.
