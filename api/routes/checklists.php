<?php
// =============================================
// API: CHECKLISTS
// Tag Som e Luz - Sistema de Gerenciamento
// =============================================

$method = $_SERVER['REQUEST_METHOD'];
$id = $uri[1] ?? null;

$db = Database::getInstance();

switch ($method) {
    case 'GET':
        if ($id) {
            // Buscar checklist por ID
            $checklist = $db->fetchOne(
                "SELECT * FROM checklists WHERE id = ?",
                [$id]
            );
            
            if ($checklist) {
                // Buscar equipamentos do checklist
                $equipamentos = $db->fetch(
                    "SELECT ce.*, e.material 
                     FROM checklist_equipamentos ce 
                     JOIN equipamentos e ON ce.equipamento_id = e.id 
                     WHERE ce.checklist_id = ?",
                    [$id]
                );
                $checklist['equipamentos'] = $equipamentos;
                
                echo json_encode($checklist);
            } else {
                http_response_code(404);
                echo json_encode(['erro' => 'Checklist não encontrado']);
            }
        } else {
            // Listar checklists
            $eventoId = $_GET['evento_id'] ?? null;
            
            $sql = "SELECT c.*, e.cliente, e.data_evento 
                    FROM checklists c 
                    JOIN eventos e ON c.evento_id = e.id 
                    WHERE 1=1";
            $params = [];
            
            if ($eventoId) {
                $sql .= " AND c.evento_id = ?";
                $params[] = $eventoId;
            }
            
            $sql .= " ORDER BY c.data_criacao DESC";
            
            $checklists = $db->fetch($sql, $params);
            echo json_encode($checklists);
        }
        break;
    
    case 'POST':
        // Criar novo checklist
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['evento_id'])) {
            http_response_code(400);
            echo json_encode(['erro' => 'Dados incompletos']);
            break;
        }
        
        $id = $db->insert('checklists', [
            'evento_id' => $data['evento_id'],
            'responsavel' => $data['responsavel'] ?? '',
            'status' => 'pendente'
        ]);
        
        // Adicionar equipamentos ao checklist
        if (isset($data['equipamentos']) && is_array($data['equipamentos'])) {
            foreach ($data['equipamentos'] as $equip) {
                $db->insert('checklist_equipamentos', [
                    'checklist_id' => $id,
                    'equipamento_id' => $equip['id'],
                    'status' => $equip['status'] ?? 'pendente'
                ]);
            }
        }
        
        http_response_code(201);
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Checklist criado com sucesso',
            'id' => $id
        ]);
        break;
    
    case 'PUT':
        // Atualizar checklist
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
        
        // Atualizar status do checklist
        if (isset($data['status'])) {
            $db->update('checklists', ['status' => $data['status']], 'id = ?', [$id]);
        }
        
        // Atualizar status dos equipamentos
        if (isset($data['equipamentos']) && is_array($data['equipamentos'])) {
            foreach ($data['equipamentos'] as $equip) {
                if (isset($equip['id']) && isset($equip['status'])) {
                    $db->update(
                        'checklist_equipamentos',
                        ['status' => $equip['status']],
                        'checklist_id = ? AND equipamento_id = ?',
                        [$id, $equip['id']]
                    );
                }
            }
        }
        
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Checklist atualizado com sucesso'
        ]);
        break;
    
    case 'DELETE':
        // Deletar checklist
        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID não fornecido']);
            break;
        }
        
        $db->delete('checklists', 'id = ?', [$id]);
        
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Checklist removido com sucesso'
        ]);
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido']);
        break;
}
