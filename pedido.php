<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'conexion.php';

// Obtener datos JSON
$data = json_decode(file_get_contents('php://input'), true);

if(!$data) {
    echo json_encode(['success' => false, 'mensaje' => 'Datos inválidos']);
    exit;
}

$nombre = isset($data['nombre']) ? trim($data['nombre']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$telefono = isset($data['telefono']) ? trim($data['telefono']) : '';
$direccion = isset($data['direccion']) ? trim($data['direccion']) : '';
$metodo_pago = isset($data['metodo_pago']) ? trim($data['metodo_pago']) : '';
$notas = isset($data['notas']) ? trim($data['notas']) : '';
$carrito = isset($data['carrito']) ? $data['carrito'] : [];
$total = isset($data['total']) ? floatval($data['total']) : 0;

// Validaciones
if(empty($nombre) || empty($email) || empty($telefono) || empty($direccion) || empty($metodo_pago)) {
    echo json_encode(['success' => false, 'mensaje' => 'Todos los campos son obligatorios']);
    exit;
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'mensaje' => 'El email no es válido']);
    exit;
}

if(empty($carrito) || count($carrito) == 0) {
    echo json_encode(['success' => false, 'mensaje' => 'El carrito está vacío']);
    exit;
}

try {
    $con = new Conexion();
    $resultado = $con->insertarPedido($nombre, $email, $telefono, $direccion, $total, $metodo_pago, $notas, $carrito);
    
    if($resultado) {
        echo json_encode(['success' => true, 'mensaje' => '¡Pedido realizado con éxito!']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al procesar el pedido']);
    }
} catch(Exception $e) {
    echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}
?>