<?php
require_once 'conexao.php';
header('Content-Type: application/json; charset=UTF-8');

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID do produto não informado']);
    exit;
}

$id = intval($_GET['id']);
$conexao = getConnection();

try {
    $stmt = $conexao->prepare("SELECT id_produto, nome, imagem, descricao FROM produtos WHERE id_produto = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        echo json_encode($resultado->fetch_assoc());
    } else {
        http_response_code(404);
        echo json_encode(['erro' => 'Produto não encontrado']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao buscar produto']);
}