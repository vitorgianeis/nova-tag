<?php
// =============================================
// EXEMPLO DE USO DO BANCO DE DADOS
// Tag Som e Luz - Sistema de Gerenciamento
// =============================================

require_once 'conexao.php';

// Exemplo 1: Buscar todos os equipamentos
function buscarEquipamentos() {
    $db = Database::getInstance();
    return $db->fetch("SELECT * FROM vw_equipamentos ORDER BY material");
}

// Exemplo 2: Buscar equipamento por ID
function buscarEquipamentoPorId($id) {
    $db = Database::getInstance();
    return $db->fetchOne("SELECT * FROM vw_equipamentos WHERE id = ?", [$id]);
}

// Exemplo 3: Inserir novo equipamento
function inserirEquipamento($material, $quantidade, $categoria_id, $local_id, $observacoes = '') {
    $db = Database::getInstance();
    return $db->insert('equipamentos', [
        'material' => $material,
        'quantidade' => $quantidade,
        'categoria_id' => $categoria_id,
        'local_id' => $local_id,
        'observacoes' => $observacoes
    ]);
}

// Exemplo 4: Atualizar equipamento
function atualizarEquipamento($id, $data) {
    $db = Database::getInstance();
    return $db->update('equipamentos', $data, 'id = ?', [$id]);
}

// Exemplo 5: Deletar equipamento
function deletarEquipamento($id) {
    $db = Database::getInstance();
    return $db->delete('equipamentos', 'id = ?', [$id]);
}

// Exemplo 6: Buscar orçamentos pendentes
function buscarOrcamentosPendentes() {
    $db = Database::getInstance();
    return $db->fetch("
        SELECT o.*, COUNT(oe.id) as total_itens 
        FROM orcamentos o 
        LEFT JOIN orcamento_equipamentos oe ON o.id = oe.orcamento_id 
        WHERE o.status = 'pendente' 
        GROUP BY o.id 
        ORDER BY o.data_criacao DESC
    ");
}

// Exemplo 7: Criar novo orçamento
function criarOrcamento($cliente, $tipoEvento, $dataEvento, $localEvento, $observacoes, $usuarioId = null) {
    $db = Database::getInstance();
    return $db->insert('orcamentos', [
        'cliente' => $cliente,
        'tipo_evento' => $tipoEvento,
        'data_evento' => $dataEvento,
        'local_evento' => $localEvento,
        'observacoes' => $observacoes,
        'usuario_id' => $usuarioId
    ]);
}

// Exemplo 8: Adicionar equipamento ao orçamento
function adicionarEquipamentoOrcamento($orcamentoId, $equipamentoId, $quantidade, $valorUnitario) {
    $db = Database::getInstance();
    return $db->insert('orcamento_equipamentos', [
        'orcamento_id' => $orcamentoId,
        'equipamento_id' => $equipamentoId,
        'quantidade' => $quantidade,
        'valor_unitario' => $valorUnitario
    ]);
}

// Exemplo 9: Aprovar orçamento e criar evento
function aprovarOrcamento($orcamentoId) {
    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    try {
        $conn->beginTransaction();
        
        // Buscar orçamento
        $orcamento = $db->fetchOne("SELECT * FROM orcamentos WHERE id = ?", [$orcamentoId]);
        
        if (!$orcamento) {
            throw new Exception("Orçamento não encontrado");
        }
        
        // Atualizar status do orçamento
        $db->update('orcamentos', ['status' => 'aprovado'], 'id = ?', [$orcamentoId]);
        
        // Criar evento
        $eventoId = $db->insert('eventos', [
            'orcamento_id' => $orcamentoId,
            'cliente' => $orcamento['cliente'],
            'tipo_evento' => $orcamento['tipo_evento'],
            'data_evento' => $orcamento['data_evento'],
            'local_evento' => $orcamento['local_evento'],
            'observacoes' => $orcamento['observacoes'],
            'status' => 'agendado'
        ]);
        
        // Copiar equipamentos do orçamento para o evento
        $equipamentos = $db->fetch(
            "SELECT equipamento_id, quantidade FROM orcamento_equipamentos WHERE orcamento_id = ?",
            [$orcamentoId]
        );
        
        foreach ($equipamentos as $equip) {
            $db->insert('evento_equipamentos', [
                'evento_id' => $eventoId,
                'equipamento_id' => $equip['equipamento_id'],
                'quantidade' => $equip['quantidade']
            ]);
        }
        
        $conn->commit();
        return $eventoId;
        
    } catch (Exception $e) {
        $conn->rollBack();
        throw $e;
    }
}

// Exemplo 10: Buscar eventos agendados
function buscarEventosAgendados() {
    $db = Database::getInstance();
    return $db->fetch("SELECT * FROM vw_eventos_agendados");
}

// Exemplo 11: Criar checklist para evento
function criarChecklist($eventoId, $responsavel) {
    $db = Database::getInstance();
    
    // Criar checklist
    $checklistId = $db->insert('checklists', [
        'evento_id' => $eventoId,
        'responsavel' => $responsavel
    ]);
    
    // Buscar equipamentos do evento
    $equipamentos = $db->fetch(
        "SELECT equipamento_id FROM evento_equipamentos WHERE evento_id = ?",
        [$eventoId]
    );
    
    // Adicionar equipamentos ao checklist
    foreach ($equipamentos as $equip) {
        $db->insert('checklist_equipamentos', [
            'checklist_id' => $checklistId,
            'equipamento_id' => $equip['equipamento_id']
        ]);
    }
    
    return $checklistId;
}

// Exemplo 12: Atualizar status do checklist
function atualizarStatusChecklist($checklistId, $equipamentoId, $status) {
    $db = Database::getInstance();
    return $db->update(
        'checklist_equipamentos',
        ['status' => $status],
        'checklist_id = ? AND equipamento_id = ?',
        [$checklistId, $equipamentoId]
    );
}

// =============================================
// EXEMPLO DE USO
// =============================================

/*
// Buscar todos os equipamentos
$equipamentos = buscarEquipamentos();
foreach ($equipamentos as $equip) {
    echo $equip['material'] . ' - ' . $equip['local'] . '<br>';
}

// Criar novo orçamento
$orcamentoId = criarOrcamento(
    'João da Silva',
    'casamento',
    '2024-12-15',
    'Salão de Festas',
    'Casamento ao ar livre'
);

// Adicionar equipamentos ao orçamento
adicionarEquipamentoOrcamento($orcamentoId, 1, 2, 150.00); // 2 Caixas de Som JBL
adicionarEquipamentoOrcamento($orcamentoId, 4, 10, 80.00);  // 10 Par 56 LED

// Aprovar orçamento
eventoId = aprovarOrcamento($orcamentoId);

// Criar checklist
$checklistId = criarChecklist($eventoId, 'Maria');

// Atualizar status de um equipamento no checklist
atualizarStatusChecklist($checklistId, 1, 'conferido');
*/
