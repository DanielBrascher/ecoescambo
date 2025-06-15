<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'conexao.php';
$conexao = getConnection();

try {
    $dados = json_decode(file_get_contents('php://input'), true);

    if (empty($dados['id_produto']) || empty($dados['nome']) || empty($dados['imagem']) || empty($dados['descricao'])) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'algum valor está faltando']);
        exit;
    }

    $stmt = $conexao->prepare("UPDATE produtos SET nome=?, imagem=?, descricao=? WHERE id_produto=?");
    $stmt->bind_param("sssi", $dados['nome'], $dados['imagem'], $dados['descricao'], $dados['id_produto']);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(['mensagem' => 'Produto atualizado com sucesso']);
    } else {
        http_response_code(422);
        echo json_encode(['mensagem' => 'Algo deu errado :/']);
    }

    $stmt->close();
    $conexao->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['mensagem' => 'Algo deu errado']);
}