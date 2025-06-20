<?php
require_once 'conexao.php';
header('Content-Type: application/json');

try {
    $conexao = getConnection();
    $input = json_decode(file_get_contents("php://input"), true);

    $id_produto = $input['id_produto'] ?? null;
    $id_interessado = $input['id_interessado'] ?? null;

    if (!$id_produto || !$id_interessado) {
        http_response_code(400);
        echo json_encode(["mensagem" => "Dados incompletos."]);
        exit;
    }

    $stmt = $conexao->prepare("DELETE FROM interessados WHERE id_produto = ? AND id_interessado = ?");
    $stmt->bind_param("ii", $id_produto, $id_interessado);

    if ($stmt->execute()) {
        echo json_encode(["mensagem" => "Todas as ofertas deste interessado foram rejeitadas com sucesso."]);
    } else {
        http_response_code(500);
        echo json_encode(["mensagem" => "Erro ao rejeitar ofertas."]);
    }

    $stmt->close();
    $conexao->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["mensagem" => "Erro no servidor: " . $e->getMessage()]);
}
?>