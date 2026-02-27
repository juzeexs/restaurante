<?php
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "lanches_e_bebidas";

$conn = new mysqli($servidor, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
?>