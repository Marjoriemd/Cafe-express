<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'conexion.php';

// Validar que sea POST
if($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

// Obtener y limpiar datos
$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
$fecha = isset($_POST['fecha']) ? trim($_POST['fecha']) : '';
$hora = isset($_POST['hora']) ? trim($_POST['hora']) : '';
$personas = isset($_POST['personas']) ? intval($_POST['personas']) : 0;
$comentarios = isset($_POST['comentarios']) ? trim($_POST['comentarios']) : '';

// Validaciones
if(empty($nombre) || empty($email) || empty($telefono) || empty($fecha) || empty($hora) || $personas < 1) {
    echo json_encode(['success' => false, 'mensaje' => 'Todos los campos son obligatorios']);
    exit;
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'mensaje' => 'El email no es válido']);
    exit;
}

if(!preg_match('/^[0-9\(\)\-\s]+$/', $telefono)) {
    echo json_encode(['success' => false, 'mensaje' => 'El teléfono solo debe contener números']);
    exit;
}

if(strtotime($fecha) < strtotime(date('Y-m-d'))) {
    echo json_encode(['success' => false, 'mensaje' => 'La fecha debe ser futura']);
    exit;
}

try {
    $con = new Conexion();
    $resultado = $con->insertarReservacion($nombre, $email, $telefono, $fecha, $hora, $personas, $comentarios);
    
    if($resultado) {
        echo json_encode(['success' => true, 'mensaje' => '¡Reservación realizada con éxito!']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al guardar la reservación']);
    }
} catch(Exception $e) {
    echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}
?>