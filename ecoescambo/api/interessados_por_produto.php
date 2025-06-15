<?php
require_once 'conexao.php';
header('Content-Type: application/json; charset=UTF-8');

if (!isset($_GET['id_produto'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID do produto não informado']);
    exit;
}

$id_produto = intval($_GET['id_produto']);
$conexao = getConnection();

try {
    $stmt = $conexao->prepare("SELECT DISTINCT u.id_usuario, u.nome
        FROM interessados i
        JOIN usuarios u ON i.id_interessado = u.id_usuario
        WHERE i.id_produto = ?");
    $stmt->bind_param("i", $id_produto);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $interessados = [];
    while ($row = $resultado->fetch_assoc()) {
        $interessados[] = $row;
    }

    echo json_encode($interessados);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao buscar interessados']);
}