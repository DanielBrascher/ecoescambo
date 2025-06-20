<?php
require_once 'conexao.php';
session_start();
header("Content-Type: application/json; charset=UTF-8");

$dados = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['id_usuario']) || empty($dados['id_proposta']) || empty($dados['status'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Dados inválidos']);
    exit;
}

$id_proposta = intval($dados['id_proposta']);
$status = $dados['status'];

$conexao = getConnection();

try {
    // Se a proposta for aceita, removemos os dois produtos
    if ($status === 'aceita') {
        // Buscar os produtos envolvidos
        $stmtBusca = $conexao->prepare("SELECT id_produto_desejado, id_produto_ofertado FROM propostas WHERE id_proposta = ?");
        $stmtBusca->bind_param("i", $id_proposta);
        $stmtBusca->execute();
        $stmtBusca->bind_result($id_desejado, $id_ofertado);
        $stmtBusca->fetch();
        $stmtBusca->close();

        // Remover da tabela usuario_produto
        $stmtDelUserProd = $conexao->prepare("DELETE FROM usuario_produto WHERE id_produto IN (?, ?)");
        $stmtDelUserProd->bind_param("ii", $id_desejado, $id_ofertado);
        $stmtDelUserProd->execute();
        $stmtDelUserProd->close();

        // Remover da tabela produtos
        $stmtDelProd = $conexao->prepare("DELETE FROM produtos WHERE id_produto IN (?, ?)");
        $stmtDelProd->bind_param("ii", $id_desejado, $id_ofertado);
        $stmtDelProd->execute();
        $stmtDelProd->close();
    }

    // Atualizar status da proposta
    $stmtAtualiza = $conexao->prepare("UPDATE propostas SET status = ? WHERE id_proposta = ?");
    $stmtAtualiza->bind_param("si", $status, $id_proposta);
    $stmtAtualiza->execute();
    $stmtAtualiza->close();

    echo json_encode(['mensagem' => 'Proposta atualizada com sucesso']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro no servidor: ' . $e->getMessage()]);
}