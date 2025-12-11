<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'conexion.php';

try {
    $con = new Conexion();
    $productos = $con->consultarProductos();
    
    $lista = [];
    while($prod = mysqli_fetch_assoc($productos)) {
        $lista[] = $prod;
    }
    
    echo json_encode($lista, JSON_UNESCAPED_UNICODE);
} catch(Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>