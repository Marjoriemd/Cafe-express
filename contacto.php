<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'conexion.php';

if($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$mensaje = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : '';

// Validaciones
if(empty($nombre) || empty($email) || empty($mensaje)) {
    echo json_encode(['success' => false, 'mensaje' => 'Todos los campos son obligatorios']);
    exit;
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'mensaje' => 'El email no es válido']);
    exit;
}

if(strlen($mensaje) < 10) {
    echo json_encode(['success' => false, 'mensaje' => 'El mensaje debe tener al menos 10 caracteres']);
    exit;
}

try {
    $con = new Conexion();
    $resultado = $con->insertarMensaje($nombre, $email, $mensaje);
    
    if($resultado) {
        echo json_encode(['success' => true, 'mensaje' => '¡Mensaje enviado con éxito!']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al enviar el mensaje']);
    }
} catch(Exception $e) {
    echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}
?>