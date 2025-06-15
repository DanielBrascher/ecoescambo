<?php
require_once 'conexao.php';
header('Content-Type: application/json; charset=UTF-8');

if (!isset($_GET['id_usuario'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID do usuário não informado']);
    exit;
}

$id_usuario = intval($_GET['id_usuario']);
$conexao = getConnection();

try {
    $stmt = $conexao->prepare("SELECT p.id_produto, p.nome, p.imagem, p.descricao
        FROM produtos p
        JOIN usuario_produto up ON up.id_produto = p.id_produto
        WHERE up.id_usuario = ?");
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $produtos = [];
    while ($row = $resultado->fetch_assoc()) {
        $produtos[] = $row;
    }

    echo json_encode($produtos);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao buscar produtos do usuário']);
}