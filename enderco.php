<?php
include_once('conexao.php');

$json = file_get_contents('php://input');
$dados = json_decode($json, true);

if ($dados) {
    $cep         = $conn->real_escape_string($dados['cep']);
    $rua         = $conn->real_escape_string($dados['rua']);
    $numero      = $conn->real_escape_string($dados['numero']);
    $complemento = $conn->real_escape_string($dados['complemento'] ?? '');
    $bairro      = $conn->real_escape_string($dados['bairro']);
    $cidade      = $conn->real_escape_string($dados['cidade']);
    $uf          = $conn->real_escape_string($dados['uf']);

    $sql = "INSERT INTO endereco_de_entrega (cep, rua, numero, complemento, bairro, cidade, uf) 
            VALUES ('$cep', '$rua', '$numero', '$complemento', '$bairro', '$cidade', '$uf')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "sucesso"]);
    } else {
        echo json_encode(["status" => "erro", "mensagem" => $conn->error]);
    }
} else {
    echo json_encode(["status" => "erro", "mensagem" => "Sem dados"]);
}
?>