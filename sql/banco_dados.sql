-- =============================================
-- BANCO DE DADOS: TAG SOM E LUZ
-- Sistema de Gerenciamento de Eventos
-- =============================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS tag_som_luz 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE tag_som_luz;

-- =============================================
-- TABELA: usuarios
-- =============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    nivel ENUM('admin', 'user', 'operador') DEFAULT 'user',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP NULL
) ENGINE=InnoDB;

-- Inserir usuários padrão
INSERT INTO usuarios (usuario, senha, nome, nivel) VALUES 
('admin', '$2y$10$YourHashedPassword123', 'Administrador', 'admin'),
('gianeis', '$2y$10$YourHashedPassword456', 'Gianeis', 'user'),
('operador', '$2y$10$YourHashedPassword789', 'Operador', 'operador');

-- =============================================
-- TABELA: categorias
-- =============================================
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT
) ENGINE=InnoDB;

-- Inserir categorias padrão
INSERT INTO categorias (nome, slug, descricao) VALUES 
('Estruturas', 'estrutura', 'Estruturas metálicas e palcos'),
('Iluminação', 'iluminacao', 'Equipamentos de iluminação'),
('Sonorização', 'som', 'Equipamentos de áudio'),
('Projeção', 'projecao', 'Projetores e telas'),
('Controles', 'controle', 'Mesas de controle DMX'),
('Acessórios', 'acessorio', 'Acessórios diversos');

-- =============================================
-- TABELA: locais
-- =============================================
CREATE TABLE IF NOT EXISTS locais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    endereco TEXT
) ENGINE=InnoDB;

-- Inserir locais padrão
INSERT INTO locais (nome, slug) VALUES 
('Barracão', 'barracao'),
('Silene', 'silene'),
('San Carlo', 'san-carlo'),
('Manutenção', 'manutencao'),
('Fernando Rancho', 'fernando-rancho');

-- =============================================
-- TABELA: equipamentos
-- =============================================
CREATE TABLE IF NOT EXISTS equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material VARCHAR(200) NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    categoria_id INT NOT NULL,
    local_id INT NOT NULL,
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    FOREIGN KEY (local_id) REFERENCES locais(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================
-- TABELA: orcamentos
-- =============================================
CREATE TABLE IF NOT EXISTS orcamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(200) NOT NULL,
    tipo_evento ENUM('casamento', 'aniversario', 'corporativo', 'formatura', 'outro') NOT NULL,
    data_evento DATE NOT NULL,
    local_evento VARCHAR(200) NOT NULL,
    observacoes TEXT,
    status ENUM('pendente', 'aprovado', 'recusado', 'cancelado') DEFAULT 'pendente',
    total DECIMAL(10,2) DEFAULT 0.00,
    usuario_id INT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================
-- TABELA: orcamento_equipamentos (itens do orçamento)
-- =============================================
CREATE TABLE IF NOT EXISTS orcamento_equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orcamento_id INT NOT NULL,
    equipamento_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    valor_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * valor_unitario) STORED,
    FOREIGN KEY (orcamento_id) REFERENCES orcamentos(id) ON DELETE CASCADE,
    FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================
-- TABELA: eventos
-- =============================================
CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orcamento_id INT,
    cliente VARCHAR(200) NOT NULL,
    tipo_evento ENUM('casamento', 'aniversario', 'corporativo', 'formatura', 'outro') NOT NULL,
    data_evento DATE NOT NULL,
    local_evento VARCHAR(200) NOT NULL,
    observacoes TEXT,
    status ENUM('agendado', 'em_andamento', 'concluido', 'cancelado') DEFAULT 'agendado',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orcamento_id) REFERENCES orcamentos(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================
-- TABELA: evento_equipamentos (equipamentos do evento)
-- =============================================
CREATE TABLE IF NOT EXISTS evento_equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    equipamento_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
    FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================
-- TABELA: checklists
-- =============================================
CREATE TABLE IF NOT EXISTS checklists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    responsavel VARCHAR(200),
    status ENUM('pendente', 'em_andamento', 'concluido') DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- TABELA: checklist_equipamentos (itens do checklist)
-- =============================================
CREATE TABLE IF NOT EXISTS checklist_equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    checklist_id INT NOT NULL,
    equipamento_id INT NOT NULL,
    status ENUM('pendente', 'conferido', 'testado', 'pronto') DEFAULT 'pendente',
    observacoes TEXT,
    FOREIGN KEY (checklist_id) REFERENCES checklists(id) ON DELETE CASCADE,
    FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX idx_equipamentos_categoria ON equipamentos(categoria_id);
CREATE INDEX idx_equipamentos_local ON equipamentos(local_id);
CREATE INDEX idx_orcamentos_status ON orcamentos(status);
CREATE INDEX idx_orcamentos_data ON orcamentos(data_evento);
CREATE INDEX idx_eventos_data ON eventos(data_evento);
CREATE INDEX idx_eventos_status ON eventos(status);
CREATE INDEX idx_checklists_evento ON checklists(evento_id);

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- View para listar equipamentos com categoria e local
CREATE OR REPLACE VIEW vw_equipamentos AS
SELECT 
    e.id,
    e.material,
    e.quantidade,
    c.nome AS categoria,
    c.slug AS categoria_slug,
    l.nome AS local,
    l.slug AS local_slug,
    e.observacoes,
    e.data_criacao
FROM equipamentos e
INNER JOIN categorias c ON e.categoria_id = c.id
INNER JOIN locais l ON e.local_id = l.id;

-- View para listar orçamentos com total
CREATE OR REPLACE VIEW vw_orcamentos AS
SELECT 
    o.*,
    COUNT(oe.id) AS total_itens
FROM orcamentos o
LEFT JOIN orcamento_equipamentos oe ON o.id = oe.orcamento_id
GROUP BY o.id;

-- View para eventos agendados
CREATE OR REPLACE VIEW vw_eventos_agendados AS
SELECT 
    e.*,
    o.status AS status_orcamento
FROM eventos e
LEFT JOIN orcamentos o ON e.orcamento_id = o.id
WHERE e.status = 'agendado'
ORDER BY e.data_evento ASC;
