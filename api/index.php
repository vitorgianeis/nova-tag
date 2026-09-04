<?php
// =============================================
// CONFIGURAÇÃO DE ROTAS DA API
// Tag Som e Luz - Sistema de Gerenciamento
// =============================================

// Headers de segurança
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir configurações
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/conexao.php';

// Obter a requisição
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($uri, '/'));

// Remover 'api' do início do array
if ($uri[0] === 'api') {
    array_shift($uri);
}

// Roteamento
$resource = $uri[0] ?? '';

switch ($resource) {
    case 'equipamentos':
        require __DIR__ . '/routes/equipamentos.php';
        break;
    case 'orcamentos':
        require __DIR__ . '/routes/orcamentos.php';
        break;
    case 'eventos':
        require __DIR__ . '/routes/eventos.php';
        break;
    case 'checklists':
        require __DIR__ . '/routes/checklists.php';
        break;
    case 'usuarios':
        require __DIR__ . '/routes/usuarios.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['erro' => 'Recurso não encontrado']);
        break;
}
