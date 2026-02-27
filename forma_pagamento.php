<?php
include_once('conexao.php');

$json = file_get_contents('php://input');
$dados = json_decode($json, true);

if ($dados) {
    $metodo = $conn->real_escape_string($dados['metodo']);

    $sql = "INSERT INTO forma_pagamento (tipo) VALUES ('$metodo')";

    if ($conn->query($sql) === TRUE) {
        echo "Forma de pagamento gravada com sucesso!";
    } else {
        echo "Erro SQL: " . $conn->error;
    }
}
?>