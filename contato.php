<?php
include_once('conexao.php');
$json = file_get_contents('php://input');
$dados = json_decode($json, true);

if ($dados) {
    $nome = $conn->real_escape_string($dados['nome']);
    $email = $conn->real_escape_string($dados['email']);
    $msg = $conn->real_escape_string($dados['mensagem']);

    $sql = "INSERT INTO contatos (nome, email, mensagem) VALUES ('$nome', '$email', '$msg')";
    $conn->query($sql);
}
?>