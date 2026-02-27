<?php
include_once('conexao.php');

$json = file_get_contents('php://input');
$dados = json_decode($json, true);

if ($dados) {
    $nome = $conn->real_escape_string($dados['nome']);
    $descricao = $conn->real_escape_string($dados['descricao']);
    $desconto = $conn->real_escape_string($dados['desconto']);
    $preco = $conn->real_escape_string($dados['preco']);

    $sql = "INSERT INTO pedidos (nome, descricao, desconto, preco) 
            VALUES ('$nome', '$descricao', '$desconto', '$preco')";

    if ($conn->query($sql) === TRUE) {
        echo "Sucesso!";
    } else {
        echo "Erro SQL: " . $conn->error;
    }
}
?>