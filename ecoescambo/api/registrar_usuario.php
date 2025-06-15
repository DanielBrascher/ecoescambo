<?php
header("Content-Type: application/json; charset=UTF-8");

require_once 'conexao.php';
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Lê e decodifica o JSON do corpo da requisição
    $dados = json_decode(file_get_contents("php://input"), true);

    if (!isset($dados['nome'], $dados['email'], $dados['senha'])) {
        http_response_code(400);
        echo json_encode(['erro' => 'Campos obrigatórios ausentes.']);
        exit;
    }

    $nome = $dados['nome'];
    $email = $dados['email'];
    $senha = $dados['senha'];

    $conexao = getConnection();
    // Verifica se e-mail já está cadastrado
    $check = $conexao->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        http_response_code(409); // Conflito
        echo json_encode(['erro' => 'E-mail já cadastrado.']);
    } else {
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

        $stmt = $conexao->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nome, $email, $senha_hash);
        $stmt->execute();

        echo json_encode(['mensagem' => 'Usuário cadastrado com sucesso!']);
        $stmt->close();
    }

    $check->close();
    $conexao->close();
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro no servidor: ' . $e->getMessage()]);
}