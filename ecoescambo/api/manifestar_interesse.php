<?php
header('Content-Type: application/json');

require_once 'conexao.php';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Lê e decodifica o JSON recebido
    $dados = json_decode(file_get_contents("php://input"), true);

    // Verifica se todos os campos foram enviados
    if (!isset($dados['id_usuario'], $dados['id_produto'], $dados['id_interessado'])) {
        http_response_code(400);
        echo json_encode(['erro' => 'Campos obrigatórios: id_usuario, id_produto, id_interessado']);
        exit;
    }

    $id_usuario = $dados['id_usuario'];           // dono do produto
    $id_produto = $dados['id_produto'];           // produto desejado
    $id_interessado = $dados['id_interessado'];   // quem quer trocar

    // Verifica se o interesse já foi registrado
    $conexao = getConnection();
    $check = $conexao->prepare("SELECT id_interessados FROM interessados WHERE id_usuario = ? AND id_produto = ? AND id_interessado = ?");
    $check->bind_param("iii", $id_usuario, $id_produto, $id_interessado);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        http_response_code(409); // Conflito
        echo json_encode(['mensagem' => 'Interesse já registrado anteriormente.']);
    } else {
        // Inserir novo interesse
        $stmt = $conexao->prepare("INSERT INTO interessados (id_usuario, id_produto, id_interessado) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $id_usuario, $id_produto, $id_interessado);
        $stmt->execute();

        echo json_encode(['mensagem' => 'Interesse registrado com sucesso!']);
        $stmt->close();
    }

    $check->close();
    $conexao->close();

} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro no servidor: ' . $e->getMessage()]);
}