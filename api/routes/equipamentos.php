<?php
// =============================================
// API: EQUIPAMENTOS
// Tag Som e Luz - Sistema de Gerenciamento
// =============================================

$method = $_SERVER['REQUEST_METHOD'];
$id = $uri[1] ?? null;

$db = Database::getInstance();

switch ($method) {
    case 'GET':
        if ($id) {
            // Buscar equipamento por ID
            $equipamento = $db->fetchOne(
                "SELECT * FROM vw_equipamentos WHERE id = ?",
                [$id]
            );
            
            if ($equipamento) {
                echo json_encode($equipamento);
            } else {
                http_response_code(404);
                echo json_encode(['erro' => 'Equipamento não encontrado']);
            }
        } else {
            // Listar todos os equipamentos
            $categoria = $_GET['categoria'] ?? null;
            $local = $_GET['local'] ?? null;
            $busca = $_GET['busca'] ?? null;
            
            $sql = "SELECT * FROM vw_equipamentos WHERE 1=1";
            $params = [];
            
            if ($categoria) {
                $sql .= " AND categoria_slug = ?";
                $params[] = $categoria;
            }
            
            if ($local) {
                $sql .= " AND local_slug = ?";
                $params[] = $local;
            }
            
            if ($busca) {
                $sql .= " AND material LIKE ?";
                $params[] = "%{$busca}%";
            }
            
            $sql .= " ORDER BY material";
            
            $equipamentos = $db->fetch($sql, $params);
            echo json_encode($equipamentos);
        }
        break;
    
    case 'POST':
        // Criar novo equipamento
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['material']) || !isset($data['quantidade'])) {
            http_response_code(400);
            echo json_encode(['erro' => 'Dados incompletos']);
            break;
        }
        
        $id = $db->insert('equipamentos', [
            'material' => $data['material'],
            'quantidade' => $data['quantidade'],
            'categoria_id' => $data['categoria_id'] ?? 1,
            'local_id' => $data['local_id'] ?? 1,
            'observacoes' => $data['observacoes'] ?? ''
        ]);
        
        http_response_code(201);
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Equipamento criado com sucesso',
            'id' => $id
        ]);
        break;
    
    case 'PUT':
        // Atualizar equipamento
        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID não fornecido']);
            break;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode(['erro' => 'Dados inválidos']);
            break;
        }
        
        $campos = [];
        $params = [];
        
        if (isset($data['material'])) {
            $campos[] = 'material = ?';
            $params[] = $data['material'];
        }
        
        if (isset($data['quantidade'])) {
            $campos[] = 'quantidade = ?';
            $params[] = $data['quantidade'];
        }
        
        if (isset($data['categoria_id'])) {
            $campos[] = 'categoria_id = ?';
            $params[] = $data['categoria_id'];
        }
        
        if (isset($data['local_id'])) {
            $campos[] = 'local_id = ?';
            $params[] = $data['local_id'];
        }
        
        if (isset($data['observacoes'])) {
            $campos[] = 'observacoes = ?';
            $params[] = $data['observacoes'];
        }
        
        if (empty($campos)) {
            http_response_code(400);
            echo json_encode(['erro' => 'Nenhum dado para atualizar']);
            break;
        }
        
        $params[] = $id;
        $sql = "UPDATE equipamentos SET " . implode(', ', $campos) . " WHERE id = ?";
        
        $db->query($sql, $params);
        
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Equipamento atualizado com sucesso'
        ]);
        break;
    
    case 'DELETE':
        // Deletar equipamento
        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID não fornecido']);
            break;
        }
        
        $db->delete('equipamentos', 'id = ?', [$id]);
        
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Equipamento removido com sucesso'
        ]);
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido']);
        break;
}
