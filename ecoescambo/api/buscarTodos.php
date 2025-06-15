<?php
require_once 'conexao.php';
header('Content-Type: application/json; charset=UTF-8');

$conexao = getConnection();

// Paginação opcional
$pagina = isset($_GET['pagina']) ? intval($_GET['pagina']) : 1;
$limite = isset($_GET['limite']) ? intval($_GET['limite']) : 100;
$offset = ($pagina - 1) * $limite;

try {
    $stmt = $conexao->prepare("
        SELECT 
            p.id_produto,
            p.nome,
            p.imagem,
            p.descricao,
            up.id_usuario,
            COUNT(i.id_interessado) AS qtd_interessados
        FROM produtos p
        JOIN usuario_produto up ON up.id_produto = p.id_produto
        LEFT JOIN interessados i ON i.id_produto = p.id_produto
        GROUP BY p.id_produto
        ORDER BY p.id_produto DESC
        LIMIT ? OFFSET ?
    ");
    $stmt->bind_param("ii", $limite, $offset);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $produtos = [];
    while ($linha = $resultado->fetch_assoc()) {
        $produtos[] = $linha;
    }

    echo json_encode($produtos);

    $stmt->close();
    $conexao->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao buscar produtos: ' . $e->getMessage()]);
}