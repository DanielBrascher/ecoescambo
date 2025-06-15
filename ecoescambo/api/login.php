<?php
session_start();
header('Content-Type: application/json; charset=UTF-8');

require_once 'conexao.php';
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $dados = json_decode(file_get_contents("php://input"), true);

    if (!isset($dados['email'], $dados['senha'])) {
        http_response_code(400);
        echo json_encode(['erro' => 'Email e senha são obrigatórios.']);
        exit;
    }

    $email = $dados['email'];
    $senha = $dados['senha'];

    $conexao = getConnection();
    $stmt = $conexao->prepare("SELECT id_usuario, nome, senha FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();

        if (password_verify($senha, $usuario['senha'])) {
            $_SESSION['id_usuario'] = $usuario['id_usuario'];
            $_SESSION['nome_usuario'] = $usuario['nome'];

            echo json_encode([
                'mensagem' => 'Login bem-sucedido!',
                'id_usuario' => $usuario['id_usuario'],
                'nome' => $usuario['nome']
            ]);
        } else {
            http_response_code(401); // Não autorizado
            echo json_encode(['erro' => 'Senha incorreta.']);
        }
    } else {
        http_response_code(404); // Não encontrado
        echo json_encode(['erro' => 'E-mail não encontrado.']);
    }

    $stmt->close();
    $conexao->close();
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro no servidor: ' . $e->getMessage()]);
}