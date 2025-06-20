<?php
function getConnection() {
    $host = 'localhost';
    $user = 'root';
    $pass = ''; // Altere para sua senha do MySQL se necessário
    $dbname = 'ecoescambo';

    // Conexão inicial (sem banco de dados)
    $conn = new mysqli($host, $user, $pass);
    if ($conn->connect_error) {
        die("Erro na conexão: " . $conn->connect_error);
    }

    // Cria o banco de dados se não existir
    $conn->query("CREATE DATABASE IF NOT EXISTS $dbname DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");

    // Usa o banco de dados
    $conn->select_db($dbname);

    // Criação das tabelas
    $conn->query("
        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(1000),
            email VARCHAR(1000),
            senha VARCHAR(255)
        ) ENGINE=InnoDB
    ");

    $conn->query("
        CREATE TABLE IF NOT EXISTS produtos (
            id_produto INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(60),
            imagem VARCHAR(1000),
            descricao VARCHAR(1000)
        ) ENGINE=InnoDB
    ");

    $conn->query("
        CREATE TABLE IF NOT EXISTS usuario_produto (
            id_usuario INT,
            id_produto INT,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
            FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
        ) ENGINE=InnoDB
    ");

    $conn->query("
        CREATE TABLE IF NOT EXISTS interessados (
            id_interessados INT AUTO_INCREMENT PRIMARY KEY,
            id_usuario INT,
            id_produto INT,
            id_interessado INT,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
            FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE,
            FOREIGN KEY (id_interessado) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
        ) ENGINE=InnoDB
    ");

    $conn->query("
        CREATE TABLE IF NOT EXISTS propostas (
            id_proposta INT AUTO_INCREMENT PRIMARY KEY,
            id_produto_ofertado INT NOT NULL,
            id_produto_desejado INT NOT NULL,
            id_interessado INT NOT NULL,
            id_dono_produto INT NOT NULL,
            data_proposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status ENUM('pendente','aceita','recusada') DEFAULT 'pendente',
            FOREIGN KEY (id_produto_ofertado) REFERENCES produtos(id_produto) ON DELETE CASCADE,
            FOREIGN KEY (id_produto_desejado) REFERENCES produtos(id_produto) ON DELETE CASCADE,
            FOREIGN KEY (id_interessado) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
            FOREIGN KEY (id_dono_produto) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
        ) ENGINE=InnoDB
    ");

    return $conn;
}
?>