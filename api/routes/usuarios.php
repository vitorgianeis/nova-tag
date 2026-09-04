<?php
// =============================================
// API: USUÁRIOS (AUTENTICAÇÃO)
// Tag Som e Luz - Sistema de Gerenciamento
// =============================================

$method = $_SERVER['REQUEST_METHOD'];
$action = $uri[1] ?? null;

$db = Database::getInstance();

switch ($action) {
    case 'login':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['erro' => 'Método não permitido']);
            break;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['usuario']) || !isset($data['senha'])) {
            http_response_code(400);
            echo json_encode(['erro' => 'Credenciais não fornecidas']);
            break;
        }
        
        // Buscar usuário
        $usuario = $db->fetchOne(
            "SELECT * FROM usuarios WHERE usuario = ?",
            [$data['usuario']]
        );
        
        if (!$usuario || !password_verify($data['senha'], $usuario['senha'])) {
            http_response_code(401);
            echo json_encode(['erro' => 'Usuário ou senha incorretos']);
            break;
        }
        
        // Atualizar último acesso
        $db->update('usuarios', ['ultimo_acesso' => date('Y-m-d H:i:s')], 'id = ?', [$usuario['id']]);
        
        // Retornar dados do usuário (sem a senha)
        unset($usuario['senha']);
        
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Login realizado com sucesso',
            'usuario' => $usuario
        ]);
        break;
    
    case 'registro':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['erro' => 'Método não permitido']);
            break;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['usuario']) || !isset($data['senha']) || !isset($data['nome'])) {
            http_response_code(400);
            echo json_encode(['erro' => 'Dados incompletos']);
            break;
        }
        
        // Verificar se usuário já existe
        $existente = $db->fetchOne(
            "SELECT id FROM usuarios WHERE usuario = ?",
            [$data['usuario']]
        );
        
        if ($existente) {
            http_response_code(409);
            echo json_encode(['erro' => 'Usuário já existe']);
            break;
        }
        
        // Criar usuário
        $id = $db->insert('usuarios', [
            'usuario' => $data['usuario'],
            'senha' => password_hash($data['senha'], PASSWORD_DEFAULT),
            'nome' => $data['nome'],
            'nivel' => $data['nivel'] ?? 'user'
        ]);
        
        http_response_code(201);
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Usuário criado com sucesso',
            'id' => $id
        ]);
        break;
    
    case 'perfil':
        if ($method !== 'GET') {
            http_response_code(405);
            echo json_encode(['erro' => 'Método não permitido']);
            break;
        }
        
        // Aqui você implementaria validação de token/session
        // Por enquanto, retorna mensagem informativa
        echo json_encode([
            'mensagem' => 'Implementar autenticação via token/session'
        ]);
        break;
    
    default:
        // Listar todos os usuários (apenas para admin)
        if ($method === 'GET' && !$action) {
            $usuarios = $db->fetch(
                "SELECT id, usuario, nome, nivel, data_criacao, ultimo_acesso FROM usuarios ORDER BY nome"
            );
            echo json_encode($usuarios);
        } else {
            http_response_code(404);
            echo json_encode(['erro' => 'Ação não encontrada']);
        }
        break;
}
