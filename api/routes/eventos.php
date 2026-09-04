<?php
// =============================================
// API: EVENTOS
// Tag Som e Luz - Sistema de Gerenciamento
// =============================================

$method = $_SERVER['REQUEST_METHOD'];
$id = $uri[1] ?? null;

$db = Database::getInstance();

switch ($method) {
    case 'GET':
        if ($id) {
            // Buscar evento por ID
            $evento = $db->fetchOne(
                "SELECT * FROM eventos WHERE id = ?",
                [$id]
            );
            
            if ($evento) {
                // Buscar equipamentos do evento
                $equipamentos = $db->fetch(
                    "SELECT ee.*, e.material 
                     FROM evento_equipamentos ee 
                     JOIN equipamentos e ON ee.equipamento_id = e.id 
                     WHERE ee.evento_id = ?",
                    [$id]
                );
                $evento['equipamentos'] = $equipamentos;
                
                echo json_encode($evento);
            } else {
                http_response_code(404);
                echo json_encode(['erro' => 'Evento não encontrado']);
            }
        } else {
            // Listar eventos
            $status = $_GET['status'] ?? null;
            $data = $_GET['data'] ?? null;
            
            $sql = "SELECT * FROM eventos WHERE 1=1";
            $params = [];
            
            if ($status) {
                $sql .= " AND status = ?";
                $params[] = $status;
            }
            
            if ($data) {
                $sql .= " AND data_evento = ?";
                $params[] = $data;
            }
            
            $sql .= " ORDER BY data_evento ASC";
            
            $eventos = $db->fetch($sql, $params);
            echo json_encode($eventos);
        }
        break;
    
    case 'POST':
        // Criar novo evento
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['cliente']) || !isset($data['data_evento'])) {
            http_response_code(400);
            echo json_encode(['erro' => 'Dados incompletos']);
            break;
        }
        
        $id = $db->insert('eventos', [
            'orcamento_id' => $data['orcamento_id'] ?? null,
            'cliente' => $data['cliente'],
            'tipo_evento' => $data['tipo_evento'] ?? 'outro',
            'data_evento' => $data['data_evento'],
            'local_evento' => $data['local_evento'] ?? '',
            'observacoes' => $data['observacoes'] ?? '',
            'status' => 'agendado'
        ]);
        
        http_response_code(201);
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Evento criado com sucesso',
            'id' => $id
        ]);
        break;
    
    case 'PUT':
        // Atualizar evento
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
        $sql = "UPDATE eventos SET " . implode(', ', $campos) . " WHERE id = ?";
        
        $db->query($sql, $params);
        
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Evento atualizado com sucesso'
        ]);
        break;
    
    case 'DELETE':
        // Deletar evento
        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID não fornecido']);
            break;
        }
        
        $db->delete('eventos', 'id = ?', [$id]);
        
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Evento removido com sucesso'
        ]);
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido']);
        break;
}
