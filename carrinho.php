<?php
include_once('conexao.php');
$json = file_get_contents('php://input');
$dados = json_decode($json, true);

if ($dados) {
    $nome = $conn->real_escape_string($dados['nome']);
    $preco = (float)$dados['preco'];
    $desc = $conn->real_escape_string($dados['descricao']);

    $sql = "INSERT INTO carrinho (nome, descricao, preco) VALUES ('$nome', '$desc', '$preco')";
    $conn->query($sql);
}
?>