<?php
require_once 'conexao.php';
session_start();
header("Content-Type: application/json; charset=UTF-8");

if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'Não autorizado']);
    exit;
}

$id_usuario = $_SESSION['id_usuario'];
$conexao = getConnection();

try {
    $sql = "
        SELECT 
            p.id_proposta,
            p.id_produto_desejado,
            p.id_produto_ofertado,
            p.data_proposta,
            p.status,
            u.nome AS nome_dono,
            pd.nome AS nome_desejado,
            pd.imagem AS imagem_desejado,
            po.nome AS nome_ofertado,
            po.imagem AS imagem_ofertado
        FROM propostas p
        JOIN produtos pd ON p.id_produto_desejado = pd.id_produto
        JOIN produtos po ON p.id_produto_ofertado = po.id_produto
        JOIN usuarios u ON p.id_dono_produto = u.id_usuario
        WHERE p.id_interessado = ?
        ORDER BY p.data_proposta DESC
    ";

    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $propostas = [];

    while ($row = $resultado->fetch_assoc()) {
        $propostas[] = $row;
    }

    echo json_encode($propostas);

    $stmt->close();
    $conexao->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro no servidor: ' . $e->getMessage()]);
}