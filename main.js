//  VARIABLES GLOBALES 
// Array que guarda los productos del carrito
let carrito = [];

//EVENTO DE INICIO
// Este código se ejecuta cuando la página termina de cargar
document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

/*
  FUNCIONES DE NAVEGACIÓN
  Estas funciones permiten hacer scroll suave en la página
*/

// Función para ir al inicio de la página
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para hacer scroll a una sección específica
function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/*
  FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
  Se ejecuta cuando carga la página y configura todos los eventos
*/
function iniciarApp() {
    // Configurar el menú  (para móviles) 
    const burger = document.querySelector('.navbar-burger');
    if(burger) {
        burger.addEventListener('click', function() {
            const menu = document.getElementById('navbarBasicExample');
            burger.classList.toggle('is-active');
            menu.classList.toggle('is-active');
        });
    }
    
    // Configurar botón "Ver Menú" 
    const btnVerMenu = document.querySelector('.hero .button');
    if(btnVerMenu) {
        btnVerMenu.addEventListener('click', verMenu);
    }
    
    // Configurar botón "Reservar Mesa"
    const btnReservar = document.querySelectorAll('.button.is-primary')[0];
    if(btnReservar && btnReservar.textContent.includes('Reservar')) {
        btnReservar.addEventListener('click', mostrarReservacion);
    }
    
    // Configurar botón "Pedidos Online" 
    const btnPedidos = document.querySelectorAll('.button.is-light')[0];
    if(btnPedidos && btnPedidos.textContent.includes('Pedidos')) {
        btnPedidos.addEventListener('click', mostrarCarrito);
    }
    
    // Configurar formulario de contacto 
    const formContacto = document.querySelector('section form');
    if(formContacto) {
        formContacto.addEventListener('submit', enviarContacto);
    }
    
    // Configurar botón de suscripción 
    const btnSuscribir = document.querySelector('.footer .button.is-primary');
    if(btnSuscribir) {
        btnSuscribir.addEventListener('click', suscribirse);
    }
    
    // Cargar carrito guardado de localStorage
    const carritoGuardado = localStorage.getItem('carrito');
    if(carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}


//  FUNCIONES DEL MENÚ DE PRODUCTOS

/*
  VER MENÚ
  Obtiene los productos de la base de datos y los muestra en un modal
*/
async function verMenu() {
    try {
        // Hacer petición al servidor para obtener productos
        const response = await fetch('productos.php');
        const productos = await response.json();
        
        // Construir HTML del modal con tabs de categorías
        let html = `
            <div class="tabs is-centered">
                <ul>
                    <li class="is-active" onclick="filtrarCategoria('todas')"><a>Todas</a></li>
                    <li onclick="filtrarCategoria('Bebidas Calientes')"><a>Bebidas Calientes</a></li>
                    <li onclick="filtrarCategoria('Bebidas Frías')"><a>Bebidas Frías</a></li>
                    <li onclick="filtrarCategoria('Postres')"><a>Postres</a></li>
                </ul>
            </div>
            <div id="productos-lista" class="columns is-multiline" style="max-height: 500px; overflow-y: auto;">
        `;
        
        // Crear una tarjeta por cada producto
        productos.forEach(prod => {
            html += `
                <div class="column is-4 producto-item" data-cat="${prod.categoria}">
                    <div class="card">
                        <div class="card-image">
                            <figure class="image is-4by3">
                                <img src="${prod.imagen}" alt="${prod.nombre}">
                            </figure>
                        </div>
                        <div class="card-content">
                            <p class="title is-5">${prod.nombre}</p>
                            <p class="subtitle is-6 has-text-weight-bold" style="color: #D4AF37;">$${prod.precio}</p>
                            <p>${prod.descripcion}</p>
                            <button class="button is-primary is-fullwidth mt-3" onclick='agregarCarrito(${JSON.stringify(prod)})'>
                                <span class="icon"><i class="fas fa-cart-plus"></i></span>
                                <span>Agregar</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Abrir el modal con los productos
        abrirModal('☕ Nuestro Menú', html);
        
    } catch(error) {
        console.error('Error:', error);
        mostrarMensaje('Error al cargar el menú', 'danger');
    }
}

/*
  FILTRAR CATEGORÍA
  Filtra los productos mostrados según la categoría seleccionada
*/
function filtrarCategoria(categoria) {
    // Obtener todos los productos y tabs
    const items = document.querySelectorAll('.producto-item');
    const tabs = document.querySelectorAll('.tabs li');
    
    // Marcar el tab activo
    tabs.forEach(tab => tab.classList.remove('is-active'));
    event.target.closest('li').classList.add('is-active');
    
    // Mostrar/ocultar productos según categoría
    items.forEach(item => {
        if(categoria === 'todas' || item.dataset.cat === categoria) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/*
  AGREGAR AL CARRITO
  Agrega un producto al carrito o aumenta su cantidad si ya existe
*/
function agregarCarrito(producto) {
    // Buscar si el producto ya está en el carrito
    const existe = carrito.find(item => item.id == producto.id);
    
    if(existe) {
        // Si existe, solo aumentar la cantidad
        existe.cantidad++;
    } else {
        // Si no existe, agregarlo al carrito
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: parseFloat(producto.precio),
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Mostrar mensaje de confirmación
    mostrarMensaje(`${producto.nombre} agregado al carrito`, 'success');
}

//  FUNCIONES DE RESERVACIÓN DE MESA

/*
  MOSTRAR RESERVACIÓN
  Abre un modal con el formulario para reservar una mesa
*/
function mostrarReservacion() {
    // Obtener la fecha de hoy para validación
    const hoy = new Date().toISOString().split('T')[0];
    
    // HTML del formulario de reservación
    const html = `
        <form id="formReserva">
            <div class="columns is-multiline">
                <!-- Campo: Nombre -->
                <div class="column is-6">
                    <div class="field">
                        <label class="label">Nombre *</label>
                        <input class="input" type="text" name="nombre" 
                               pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" 
                               title="Solo se permiten letras" required>
                    </div>
                </div>
                
                <!-- Campo: Email -->
                <div class="column is-6">
                    <div class="field">
                        <label class="label">Email *</label>
                        <input class="input" type="email" name="email" required>
                    </div>
                </div>
                
                <!-- Campo: Teléfono -->
                <div class="column is-6">
                    <div class="field">
                        <label class="label">Teléfono *</label>
                        <input class="input" type="tel" name="telefono" 
                               pattern="[0-9\(\)\-\s]+" 
                               title="Solo números, paréntesis y guiones" required>
                    </div>
                </div>
                
                <!-- Campo: Número de personas -->
                <div class="column is-6">
                    <div class="field">
                        <label class="label">Personas *</label>
                        <input class="input" type="number" name="personas" min="1" max="20" required>
                    </div>
                </div>
                
                <!-- Campo: Fecha -->
                <div class="column is-6">
                    <div class="field">
                        <label class="label">Fecha *</label>
                        <input class="input" type="date" name="fecha" min="${hoy}" required>
                    </div>
                </div>
                
                <!-- Campo: Hora -->
                <div class="column is-6">
                    <div class="field">
                        <label class="label">Hora *</label>
                        <input class="input" type="time" name="hora" required>
                    </div>
                </div>
                
                <!-- Campo: Comentarios (opcional) -->
                <div class="column is-12">
                    <div class="field">
                        <label class="label">Comentarios</label>
                        <textarea class="textarea" name="comentarios"></textarea>
                    </div>
                </div>
                
                <!-- Botón de envío -->
                <div class="column is-12">
                    <button type="submit" class="button is-primary is-fullwidth is-large">
                        Confirmar Reservación
                    </button>
                </div>
            </div>
        </form>
    `;
    
    // Abrir modal con el formulario
    abrirModal('🍽️ Reservar Mesa', html);
    
    // Configurar evento de envío del formulario
    document.getElementById('formReserva').addEventListener('submit', guardarReservacion);
}

/*
  GUARDAR RESERVACIÓN
  Envía los datos de la reservación al servidor
*/
async function guardarReservacion(e) {
    e.preventDefault(); // Prevenir envío tradicional del formulario
    
    const form = e.target;
    const formData = new FormData(form);
    const btnSubmit = form.querySelector('button[type="submit"]');
    
    // Validar formulario antes de enviar
    if(!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Mostrar estado de carga en el botón
    btnSubmit.classList.add('is-loading');
    btnSubmit.disabled = true;
    
    try {
        // Enviar datos al servidor
        const response = await fetch('reservar.php', {
            method: 'POST',
            body: formData
        });
        
        // Obtener respuesta del servidor
        const data = await response.json();
        
        // Cerrar el modal
        cerrarModal();
        
        if(data.success) {
            // Si fue exitoso, mostrar mensaje bonito
            mostrarMensajeBonito(data.mensaje, '✅');
            form.reset();
        } else {
            // Si hubo error, mostrar mensaje de advertencia
            mostrarMensaje(data.mensaje, 'warning');
        }
        
    } catch(error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión. Verifica que los archivos PHP estén en la carpeta correcta.', 'danger');
    } finally {
        // Quitar estado de carga del botón
        btnSubmit.classList.remove('is-loading');
        btnSubmit.disabled = false;
    }
}

//  FUNCIONES DEL CARRITO Y PEDIDOS ONLINE

/*
  MOSTRAR CARRITO
  Muestra el carrito de compras y formulario de pedido
*/
function mostrarCarrito() {
    // Si el carrito está vacío, mostrar mensaje
    if(carrito.length === 0) {
        const html = `
            <div class="has-text-centered" style="padding: 3rem;">
                <i class="fas fa-shopping-cart fa-4x has-text-grey-light mb-4"></i>
                <p class="title is-4">Tu carrito está vacío</p>
                <button class="button is-primary mt-4" onclick="cerrarModal(); verMenu();">
                    Ver Menú
                </button>
            </div>
        `;
        abrirModal('🛒 Carrito', html);
        return;
    }
    
    // Calcular total del carrito
    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
    });
    
    // Construir HTML del modal con carrito y formulario
    let html = `
        <div class="columns">
            <!-- COLUMNA IZQUIERDA: Lista de productos -->
            <div class="column is-7">
                <h3 class="title is-4">Tu Pedido</h3>
                <div style="max-height: 400px; overflow-y: auto;">
    `;
    
    // Crear una tarjeta por cada producto en el carrito
    carrito.forEach((item, index) => {
        html += `
            <div class="box mb-3">
                <div class="columns is-mobile is-vcentered">
                    <!-- Imagen del producto -->
                    <div class="column is-3">
                        <img src="${item.imagen}" style="border-radius: 8px;">
                    </div>
                    <!-- Nombre y precio -->
                    <div class="column is-5">
                        <p class="has-text-weight-bold">${item.nombre}</p>
                        <p class="has-text-grey">$${item.precio}</p>
                    </div>
                    <!-- Controles de cantidad -->
                    <div class="column is-3">
                        <div class="field has-addons">
                            <p class="control">
                                <button class="button is-small" onclick="cambiarCantidad(${index}, -1)">-</button>
                            </p>
                            <p class="control">
                                <input class="input is-small has-text-centered" value="${item.cantidad}" style="width: 50px;" readonly>
                            </p>
                            <p class="control">
                                <button class="button is-small" onclick="cambiarCantidad(${index}, 1)">+</button>
                            </p>
                        </div>
                    </div>
                    <!-- Botón eliminar -->
                    <div class="column is-1">
                        <button class="delete" onclick="eliminarItem(${index})"></button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Total del pedido
    html += `
                </div>
                <div class="box has-background-light mt-4">
                    <div class="level">
                        <div class="level-left">
                            <p class="title is-4">Total:</p>
                        </div>
                        <div class="level-right">
                            <p class="title is-4 has-text-success">$${total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- COLUMNA DERECHA: Formulario de entrega -->
            <div class="column is-5">
                <h3 class="title is-4">Datos de Entrega</h3>
                <form id="formPedido">
                    <div class="field">
                        <label class="label">Nombre *</label>
                        <input class="input" type="text" name="nombre" 
                               pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" 
                               title="Solo se permiten letras" required>
                    </div>
                    <div class="field">
                        <label class="label">Email *</label>
                        <input class="input" type="email" name="email" required>
                    </div>
                    <div class="field">
                        <label class="label">Teléfono *</label>
                        <input class="input" type="tel" name="telefono" 
                               pattern="[0-9\(\)\-\s]+" 
                               title="Solo números, paréntesis y guiones" required>
                    </div>
                    <div class="field">
                        <label class="label">Dirección *</label>
                        <textarea class="textarea" name="direccion" rows="2" 
                                  minlength="10" required></textarea>
                    </div>
                    <div class="field">
                        <label class="label">Método de Pago *</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select name="metodo_pago" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="transferencia">Transferencia</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Notas adicionales</label>
                        <textarea class="textarea" name="notas" rows="2" 
                                  placeholder="Instrucciones especiales de entrega..."></textarea>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button type="submit" class="button is-primary is-fullwidth is-medium">
                                <span class="icon">
                                    <i class="fas fa-check-circle"></i>
                                </span>
                                <span>Realizar Pedido</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Abrir modal
    abrirModal('🛍️ Pedido Online', html);
    
    // Configurar evento del formulario
    document.getElementById('formPedido').addEventListener('submit', guardarPedido);
}

/*
  CAMBIAR CANTIDAD
  Aumenta o disminuye la cantidad de un producto en el carrito
*/
function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    if(carrito[index].cantidad < 1) {
        carrito[index].cantidad = 1;
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cerrarModal();
    mostrarCarrito();
}

/*
  ELIMINAR ITEM
  Elimina un producto del carrito
*/
function eliminarItem(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cerrarModal();
    if(carrito.length > 0) {
        mostrarCarrito();
    }
}

/*
  GUARDAR PEDIDO
  Envía el pedido completo al servidor
*/
async function guardarPedido(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const btnSubmit = form.querySelector('button[type="submit"]');
    
    // Validar formulario
    if(!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    btnSubmit.classList.add('is-loading');
    btnSubmit.disabled = true;
    
    // Calcular total
    let total = 0;
    carrito.forEach(item => total += item.precio * item.cantidad);
    
    // Preparar datos para enviar
    const datos = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        direccion: formData.get('direccion'),
        metodo_pago: formData.get('metodo_pago'),
        notas: formData.get('notas'),
        carrito: carrito,
        total: total
    };
    
    try {
        // Enviar al servidor
        const response = await fetch('pedido.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        
        cerrarModal();
        
        if(data.success) {
            // Vaciar carrito si fue exitoso
            carrito = [];
            localStorage.removeItem('carrito');
            mostrarMensajeBonito(data.mensaje, '🎉');
        } else {
            mostrarMensaje(data.mensaje, 'warning');
        }
        
    } catch(error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión. Verifica los archivos PHP.', 'danger');
    } finally {
        btnSubmit.classList.remove('is-loading');
        btnSubmit.disabled = false;
    }
}

//  FUNCIONES DE CONTACTO Y SUSCRIPCIÓN

/*
  ENVIAR CONTACTO
  Envía el formulario de contacto al servidor
*/
async function enviarContacto(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const btnSubmit = form.querySelector('button[type="submit"]');
    
    // Validar formulario
    if(!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    btnSubmit.classList.add('is-loading');
    btnSubmit.disabled = true;
    
    try {
        const response = await fetch('contacto.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if(data.success) {
            mostrarMensajeBonito(data.mensaje, '📧');
            form.reset();
        } else {
            mostrarMensaje(data.mensaje, 'warning');
        }
        
    } catch(error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión. Verifica los archivos PHP.', 'danger');
    } finally {
        btnSubmit.classList.remove('is-loading');
        btnSubmit.disabled = false;
    }
}

/*
  SUSCRIBIRSE
  Registra un email en el newsletter
*/
async function suscribirse(e) {
    e.preventDefault();
    
    const input = document.querySelector('.footer input[type="email"]');
    const email = input.value.trim();
    const btn = e.target;
    
    // Validar que haya email
    if(!email) {
        mostrarMensaje('Por favor ingresa tu email', 'warning');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        mostrarMensaje('Por favor ingresa un email válido', 'warning');
        return;
    }
    
    btn.classList.add('is-loading');
    btn.disabled = true;
    
    const formData = new FormData();
    formData.append('email', email);
    
    try {
        const response = await fetch('suscribir.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if(data.success) {
            mostrarMensajeBonito(data.mensaje, '🎊');
            input.value = '';
        } else {
            mostrarMensaje(data.mensaje, 'warning');
        }
        
    } catch(error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión. Verifica los archivos PHP.', 'danger');
    } finally {
        btn.classList.remove('is-loading');
        btn.disabled = false;
    }
}


//  FUNCIONES AUXILIARES (MODALES Y NOTIFICACIONES)

/*
  ABRIR MODAL
  Crea y muestra un modal con el contenido especificado
*/
function abrirModal(titulo, contenido) {
    const modal = document.createElement('div');
    modal.id = 'miModal';
    modal.className = 'modal is-active';
    modal.innerHTML = `
        <div class="modal-background" onclick="cerrarModal()"></div>
        <div class="modal-card" style="max-width: 900px;">
            <header class="modal-card-head" style="background: linear-gradient(135deg, #2C1810 0%, #6B4423 100%);">
                <p class="modal-card-title has-text-white">${titulo}</p>
                <button class="delete" onclick="cerrarModal()"></button>
            </header>
            <section class="modal-card-body">
                ${contenido}
            </section>
        </div>
    `;
    document.body.appendChild(modal);
}

/*
  CERRAR MODAL
  Cierra el modal actual
*/
function cerrarModal() {
    const modal = document.getElementById('miModal');
    if(modal) modal.remove();
}

/*
  MOSTRAR MENSAJE
  Muestra una notificación temporal en la esquina superior derecha
*/
function mostrarMensaje(texto, tipo) {
    const notif = document.createElement('div');
    notif.className = `notification is-${tipo}`;
    notif.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notif.innerHTML = `
        <button class="delete" onclick="this.parentElement.remove()"></button>
        ${texto}
    `;
    document.body.appendChild(notif);
    
    // Auto-cerrar después de 4 segundos
    setTimeout(() => notif.remove(), 4000);
}

/*
  Muestra un modal elegante con un mensaje de confirmación
*/
function mostrarMensajeBonito(texto, icono) {
    const modal = document.createElement('div');
    modal.className = 'modal is-active';
    modal.innerHTML = `
        <div class="modal-background" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <div class="box has-text-centered" style="padding: 3rem;">
                <div style="font-size: 4rem;">${icono}</div>
                <h3 class="title is-3 mt-4">¡Éxito!</h3>
                <p class="subtitle is-5">${texto}</p>
                <button class="button is-primary is-large mt-4" onclick="this.closest('.modal').remove()">
                    Aceptar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => modal.remove(), 5000);
}
