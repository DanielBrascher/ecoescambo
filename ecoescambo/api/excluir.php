<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'conexao.php';

$conexao = getConnection();

try {
    $dados = json_decode(file_get_contents('php://input'), true);

    if (empty($dados['id_produto'])) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'ID do produto não informado']);
        exit;
    }

    // Exclui da tabela intermediária primeiro
    $stmt1 = $conexao->prepare("DELETE FROM usuario_produto WHERE id_produto = ?");
    $stmt1->bind_param("i", $dados['id_produto']);
    $stmt1->execute();
    $stmt1->close();

    // Depois exclui da tabela de produtos
    $stmt2 = $conexao->prepare("DELETE FROM produtos WHERE id_produto = ?");
    $stmt2->bind_param("i", $dados['id_produto']);

    if ($stmt2->execute()) {
        http_response_code(200);
        echo json_encode(['mensagem' => 'Produto excluído com sucesso']);
    } else {
        http_response_code(422);
        echo json_encode(['mensagem' => 'Falha ao excluir o produto']);
    }

    $stmt2->close();
    $conexao->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['mensagem' => 'Erro no servidor: ' . $e->getMessage()]);
}