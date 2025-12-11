<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'conexion.php';

if($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

$email = isset($_POST['email']) ? trim($_POST['email']) : '';

// Validaciones
if(empty($email)) {
    echo json_encode(['success' => false, 'mensaje' => 'Por favor ingresa tu email']);
    exit;
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'mensaje' => 'El email no es válido']);
    exit;
}

try {
    $con = new Conexion();
    $resultado = $con->insertarSuscripcion($email);
    
    if($resultado == 1) {
        echo json_encode(['success' => true, 'mensaje' => '¡Gracias por suscribirte!']);
    } else if($resultado == -1) {
        echo json_encode(['success' => false, 'mensaje' => 'Este email ya está suscrito']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al suscribir']);
    }
} catch(Exception $e) {
    echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}
?>