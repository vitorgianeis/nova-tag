<?php
// =============================================
// API: ORÇAMENTOS
// Tag Som e Luz - Sistema de Gerenciamento
// =============================================

$method = $_SERVER['REQUEST_METHOD'];
$id = $uri[1] ?? null;

$db = Database::getInstance();

switch ($method) {
    case 'GET':
        if ($id) {
            // Buscar orçamento por ID
            $orcamento = $db->fetchOne(
                "SELECT * FROM orcamentos WHERE id = ?",
                [$id]
            );
            
            if ($orcamento) {
                // Buscar equipamentos do orçamento
                $equipamentos = $db->fetch(
                    "SELECT oe.*, e.material 
                     FROM orcamento_equipamentos oe 
                     JOIN equipamentos e ON oe.equipamento_id = e.id 
                     WHERE oe.orcamento_id = ?",
                    [$id]
                );
                $orcamento['equipamentos'] = $equipamentos;
                
                echo json_encode($orcamento);
            } else {
                http_response_code(404);
                echo json_encode(['erro' => 'Orçamento não encontrado']);
            }
        } else {
            // Listar todos os orçamentos
            $status = $_GET['status'] ?? null;
            $busca = $_GET['busca'] ?? null;
            
            $sql = "SELECT * FROM orcamentos WHERE 1=1";
            $params = [];
            
            if ($status) {
                $sql .= " AND status = ?";
                $params[] = $status;
            }
            
            if ($busca) {
                $sql .= " AND cliente LIKE ?";
                $params[] = "%{$busca}%";
            }
            
            $sql .= " ORDER BY data_criacao DESC";
            
            $orcamentos = $db->fetch($sql, $params);
            echo json_encode($orcamentos);
        }
        break;
    
    case 'POST':
        // Criar novo orçamento
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['cliente']) || !isset($data['data_evento'])) {
            http_response_code(400);
            echo json_encode(['erro' => 'Dados incompletos']);
            break;
        }
        
        $id = $db->insert('orcamentos', [
            'cliente' => $data['cliente'],
            'tipo_evento' => $data['tipo_evento'] ?? 'outro',
            'data_evento' => $data['data_evento'],
            'local_evento' => $data['local_evento'] ?? '',
            'observacoes' => $data['observacoes'] ?? '',
            'usuario_id' => $data['usuario_id'] ?? null
        ]);
        
        // Adicionar equipamentos ao orçamento
        if (isset($data['equipamentos']) && is_array($data['equipamentos'])) {
            foreach ($data['equipamentos'] as $equip) {
                $db->insert('orcamento_equipamentos', [
                    'orcamento_id' => $id,
                    'equipamento_id' => $equip['id'],
                    'quantidade' => $equip['quantidade'] ?? 1,
                    'valor_unitario' => $equip['valor_unitario'] ?? 0
                ]);
            }
        }
        
        http_response_code(201);
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Orçamento criado com sucesso',
            'id' => $id
        ]);
        break;
    
    case 'PUT':
        // Atualizar orçamento
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
        
        if (isset($data['status'])) {
            $campos[] = 'status = ?';
            $params[] = $data['status'];
        }
        
        if (isset($data['cliente'])) {
            $campos[] = 'cliente = ?';
            $params[] = $data['cliente'];
        }
        
        if (isset($data['data_evento'])) {
            $campos[] = 'data_evento = ?';
            $params[] = $data['data_evento'];
        }
        
        if (isset($data['local_evento'])) {
            $campos[] = 'local_evento = ?';
            $params[] = $data['local_evento'];
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
        $sql = "UPDATE orcamentos SET " . implode(', ', $campos) . " WHERE id = ?";
        
        $db->query($sql, $params);
        
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Orçamento atualizado com sucesso'
        ]);
        break;
    
    case 'DELETE':
        // Deletar orçamento
        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID não fornecido']);
            break;
        }
        
        $db->delete('orcamentos', 'id = ?', [$id]);
        
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Orçamento removido com sucesso'
        ]);
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido']);
        break;
}
