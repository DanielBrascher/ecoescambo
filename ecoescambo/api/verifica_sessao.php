<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['id_usuario'])) {
    echo json_encode([
        'logado' => true,
        'id_usuario' => $_SESSION['id_usuario'],
        'nome_usuario' => $_SESSION['nome_usuario']
    ]);
} else {
    http_response_code(401); // Não autorizado
    echo json_encode(['logado' => false]);
}