<?php
require_once 'conexao.php';
header("Content-Type: application/json; charset=UTF-8");
session_start();

if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'Não autorizado']);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

if (empty($dados['id_produto']) || empty($dados['id_interessado']) || empty($dados['id_produto_interesse'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Dados incompletos para propor troca']);
    exit;
}

$id_produto_desejado = intval($dados['id_produto']);
$id_interessado = intval($dados['id_interessado']);
$id_produto_ofertado = intval($dados['id_produto_interesse']);
$id_dono = $_SESSION['id_usuario'];

$conexao = getConnection();

try {
    // Verifica se já existe proposta com esses mesmos dados
    $check = $conexao->prepare("
        SELECT id_proposta, status FROM propostas 
        WHERE id_produto_ofertado = ? AND id_produto_desejado = ? 
        AND id_interessado = ? AND id_dono_produto = ?
    ");
    $check->bind_param("iiii", $id_produto_ofertado, $id_produto_desejado, $id_interessado, $id_dono);
    $check->execute();
    $resultado = $check->get_result();

    if ($resultado->num_rows > 0) {
        $linha = $resultado->fetch_assoc();
        
        if ($linha['status'] === 'recusada') {
            // Atualiza proposta recusada para pendente
            $update = $conexao->prepare("UPDATE propostas SET status = 'pendente', data_proposta = NOW() WHERE id_proposta = ?");
            $update->bind_param("i", $linha['id_proposta']);
            $update->execute();
            echo json_encode(['mensagem' => 'Proposta reenviada com sucesso']);
            exit;
        } else {
            http_response_code(409);
            echo json_encode(['erro' => 'Já existe uma proposta pendente ou aceita com esses dados']);
            exit;
        }
    }

    // Se não existir proposta, insere nova
    $stmt = $conexao->prepare("
        INSERT INTO propostas (id_produto_ofertado, id_produto_desejado, id_interessado, id_dono_produto)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("iiii", $id_produto_ofertado, $id_produto_desejado, $id_interessado, $id_dono);

    if ($stmt->execute()) {
        echo json_encode(['mensagem' => 'Troca proposta com sucesso']);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Falha ao registrar proposta']);
    }

    $stmt->close();
    $conexao->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>