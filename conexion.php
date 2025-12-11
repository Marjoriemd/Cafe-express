<?php 
class Conexion {
    private $servidor;
    private $base;
    private $usuario;
    private $pass;
    public $enlace = null;
    
    public function __construct() {
        // Cargar configuración desde archivo o variables de entorno
        $config = include('config.php');
        
        $this->servidor = $config['db']['host'];
        $this->base = $config['db']['database'];
        $this->usuario = $config['db']['username'];
        $this->pass = $config['db']['password'];
    }
    
    public function Conectar() {
        $this->enlace = mysqli_connect($this->servidor, $this->usuario, $this->pass, $this->base);
        if(!$this->enlace) {
            die('No se pudo conectar a la base de datos: ' . mysqli_connect_error());
        }
        mysqli_set_charset($this->enlace, "utf8");
    }
    
    // ... resto de tus métodos (los mantienes igual)
    
    public function consultarProductos($condicion = null) {
        if($this->enlace == null) {
            $this->Conectar();
        }
        $condicion = $condicion != null ? " WHERE " . $condicion : "";
        $consulta = mysqli_query($this->enlace, "SELECT * FROM productos $condicion ORDER BY nombre");        
        return $consulta;
    }
    
    public function insertarReservacion($nombre, $email, $telefono, $fecha, $hora, $personas, $comentarios) {
        if($this->enlace == null) {
            $this->Conectar();
        }
        $ins = $this->enlace->prepare('INSERT INTO reservaciones (nombre_cliente, email, telefono, fecha_reserva, hora_reserva, numero_personas, comentarios) VALUES(?,?,?,?,?,?,?)');
        $ins->bind_param('sssssis', $nombre, $email, $telefono, $fecha, $hora, $personas, $comentarios);
        $res = $ins->execute();
        return $res;
    }
    
    public function insertarPedido($nombre, $email, $telefono, $direccion, $total, $metodo_pago, $notas, $carrito) {
        if($this->enlace == null) {
            $this->Conectar();
        }
        
        $ins = $this->enlace->prepare('INSERT INTO pedidos (nombre_cliente, email, telefono, direccion, total, metodo_pago, notas) VALUES(?,?,?,?,?,?,?)');
        $ins->bind_param('ssssdss', $nombre, $email, $telefono, $direccion, $total, $metodo_pago, $notas);
        
        if($ins->execute()) {
            $pedido_id = $this->enlace->insert_id;
            
            foreach($carrito as $item) {
                $producto_id = $item['id'];
                $cantidad = $item['cantidad'];
                $precio = $item['precio'];
                $subtotal = $cantidad * $precio;
                
                $det = $this->enlace->prepare('INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES(?,?,?,?,?)');
                $det->bind_param('iiidd', $pedido_id, $producto_id, $cantidad, $precio, $subtotal);
                $det->execute();
            }
            return true;
        }
        return false;
    }
    
    public function insertarMensaje($nombre, $email, $mensaje) {
        if($this->enlace == null) {
            $this->Conectar();
        }
        $ins = $this->enlace->prepare('INSERT INTO mensajes (nombre, email, mensaje) VALUES(?,?,?)');
        $ins->bind_param('sss', $nombre, $email, $mensaje);
        $res = $ins->execute();
        return $res;
    }
    
    public function insertarSuscripcion($email) {
        if($this->enlace == null) {
            $this->Conectar();
        }
        
        $check = mysqli_query($this->enlace, "SELECT id FROM suscripciones WHERE email = '$email'");
        if(mysqli_num_rows($check) > 0) {
            return -1;
        }
        
        $ins = $this->enlace->prepare('INSERT INTO suscripciones (email) VALUES(?)');
        $ins->bind_param('s', $email);
        $res = $ins->execute();
        return $res ? 1 : 0;
    }
}
?>