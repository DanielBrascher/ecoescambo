<?php
require_once 'conexao.php';
header('Content-Type: application/json');
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conexao = getConnection();
    // Lê e decodifica o JSON da requisição
    $dados = json_decode(file_get_contents("php://input"), true);

    // Verificação de campos obrigatórios
    if (!isset($dados['nome'], $dados['descricao'], $dados['id_usuario'])) {
        http_response_code(400);
        echo json_encode(['erro' => 'Campos obrigatórios: nome, descricao e id_usuario']);
        exit;
    }

    $nome = $dados['nome'];
    $imagem = $dados['imagem'] ?? ''; // campo opcional
    $descricao = $dados['descricao'];
    $id_usuario = $dados['id_usuario'];

    // Inserir produto
    $sqlProduto = "INSERT INTO produtos (nome, imagem, descricao) VALUES (?, ?, ?)";
    $stmtProduto = $conexao->prepare($sqlProduto);
    $stmtProduto->bind_param("sss", $nome, $imagem, $descricao);
    $stmtProduto->execute();

    // Pegar ID do produto recém-inserido
    $id_produto = $conexao->insert_id;

    // Associar produto ao usuário
    $sqlAssoc = "INSERT INTO usuario_produto (id_usuario, id_produto) VALUES (?, ?)";
    $stmtAssoc = $conexao->prepare($sqlAssoc);
    $stmtAssoc->bind_param("ii", $id_usuario, $id_produto);
    $stmtAssoc->execute();

    echo json_encode([
        'mensagem' => 'Produto cadastrado e associado ao usuário com sucesso!',
        'id_produto' => $id_produto
    ]);

    $stmtProduto->close();
    $stmtAssoc->close();
    $conexao->close();

} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao adicionar produto: ' . $e->getMessage()]);
}