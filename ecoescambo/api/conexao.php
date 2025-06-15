<?php
function getConnection() {
$servidor = "localhost";
$usuario = "root"; 
$senha = "";
$banco = "ecoescambo";

// Criar conexão
$conexao = new mysqli($servidor, $usuario, $senha, $banco);

if ($conexao->connect_error) {
    throw new Exception("falha");
}
 $conexao->set_charset("utf8mb4");
 return $conexao;
}
?>