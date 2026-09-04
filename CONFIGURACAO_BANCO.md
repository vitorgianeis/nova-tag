# Configuração do Banco de Dados - Tag Som e Luz

## 📋 Pré-requisitos

- MySQL 5.7 ou superior
- PHP 7.4 ou superior
- XAMPP, WAMP ou similar (para Windows Server 2022)

## 🚀 Passo a Passo da Configuração

### 1. Instalar o MySQL

No Windows Server 2022 com Hyper-V:

```bash
# Baixe o MySQL Community Server
# https://dev.mysql.com/downloads/mysql/

# Instale com as configurações padrão
# Defina uma senha para o root (lembre-se!)
```

### 2. Criar o Banco de Dados

Abra o MySQL Workbench ou phpMyAdmin e execute o script SQL:

```bash
# Opção 1: Usando MySQL Workbench
# Abra o arquivo banco_dados.sql e execute

# Opção 2: Usando linha de comando
mysql -u root -p < banco_dados.sql
```

### 3. Configurar as Credenciais

Edite o arquivo `config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'tag_som_luz');
define('DB_USER', 'root');        // Seu usuário do MySQL
define('DB_PASS', 'sua_senha');   // Sua senha do MySQL
```

### 4. Testar a Conexão

Acesse o arquivo `exemplo_uso.php` no navegador para verificar se a conexão está funcionando.

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Usuários do sistema |
| `categorias` | Categorias de equipamentos |
| `loais` | Locais de armazenamento |
| `equipamentos` | Estoque de equipamentos |
| `orcamentos` | Orçamentos para clientes |
| `orcamento_equipamentos` | Itens de cada orçamento |
| `eventos` | Eventos agendados |
| `evento_equipamentos` | Equipamentos de cada evento |
| `checklists` | Checklists operacionais |
| `checklist_equipamentos` | Itens de cada checklist |

### Diagrama de Relacionamento

```
usuarios (1) ──── (N) orcamentos
categorias (1) ──── (N) equipamentos
loais (1) ──── (N) equipamentos
orcamentos (1) ──── (N) orcamento_equipamentos
equipamentos (1) ──── (N) orcamento_equipamentos
orcamentos (1) ──── (N) eventos
eventos (1) ──── (N) evento_equipamentos
eventos (1) ──── (N) checklists
checklists (1) ──── (N) checklist_equipamentos
```

## 🔧 Usando o Banco de Dados

### Incluir Conexão nas Páginas PHP

```php
<?php
require_once 'conexao.php';
$db = Database::getInstance();
?>
```

### Exemplos de Consultas

```php
// Buscar todos os equipamentos
$equipamentos = $db->fetch("SELECT * FROM vw_equipamentos");

// Buscar por ID
$equipamento = $db->fetchOne("SELECT * FROM equipamentos WHERE id = ?", [1]);

// Inserir dados
$id = $db->insert('equipamentos', [
    'material' => 'Caixa de Som',
    'quantidade' => 4,
    'categoria_id' => 3,
    'local_id' => 1
]);

// Atualizar dados
$db->update('equipamentos', ['quantidade' => 5], 'id = ?', [1]);

// Deletar dados
$db->delete('equipamentos', 'id = ?', [1]);
```

## 🔐 Segurança

### Senhas Criptografadas

As senhas devem ser criptografadas com `password_hash()`:

```php
// Criar senha
$senha = password_hash('minha_senha', PASSWORD_DEFAULT);

// Verificar senha
if (password_verify('senha_digitada', $senha_hash)) {
    // Senha correta
}
```

### Prepared Statements

Sempre use prepared statements para prevenir SQL Injection:

```php
// CORRETO
$db->query("SELECT * FROM usuarios WHERE usuario = ?", [$username]);

// ERRADO - Nunca faça isso!
$db->query("SELECT * FROM usuarios WHERE usuario = '$username'");
```

## 🐛 Solução de Problemas

### Erro: "Access denied for user"

1. Verifique se o MySQL está rodando
2. Confirme usuário e senha no `config.php`
3. Verifique se o usuário tem permissão de acesso

### Erro: "Unknown database"

1. Execute o script `banco_dados.sql` para criar o banco
2. Verifique o nome do banco no `config.php`

### Erro: "Table doesn't exist"

1. Execute o script `banco_dados.sql` completo
2. Verifique se todas as tabelas foram criadas

## 📝 Arquivos do Sistema

```
nova-tag/
├── config.php          # Configurações do banco
├── conexao.php         # Classe de conexão
├── banco_dados.sql     # Script SQL
├── exemplo_uso.php     # Exemplos de uso
├── assets/
│   ├── script.js       # JavaScript principal
│   └── style.css       # Estilos CSS
├── index.html          # Página de login
├── dashboard.html      # Painel principal
├── equipamentos.html   # Gestão de equipamentos
├── orcamentos.html     # Gestão de orçamentos
├── eventos.html        # Lista de eventos
├── checklists.html     # Checklists operacionais
└── agendamento.html    # Calendário de eventos
```

## ✅ Checklist de Configuração

- [ ] MySQL instalado e rodando
- [ ] Banco `tag_som_luz` criado
- [ ] Todas as tabelas criadas
- [ ] Usuários inseridos no banco
- [ ] Arquivo `config.php` configurado
- [ ] Teste de conexão realizado
- [ ] PHP funcionando no IIS/Apache

## 🆕 Suporte

Em caso de problemas, verifique:
1. Logs do MySQL: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\`
2. Logs do PHP: `C:\xampp\php\logs\php_error_log`
3. Configuração do IIS para PHP
