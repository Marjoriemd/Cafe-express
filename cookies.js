
// AL INICIO DEL ARCHIVO cookies.js, después de DOMContentLoaded

    
    // ... resto del código
// Esperar a que cargue el DOM
document.addEventListener('DOMContentLoaded', function() {

     document.cookie = "cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Verificar si el usuario ya aceptó/rechazó cookies
    if (!getCookie('cookieConsent')) {
        showCookieBanner();
    }
    

    // Función para mostrar el banner
    function showCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            setTimeout(() => {
                banner.classList.add('show');
            }, 1000); // Aparece 1 segundo después de cargar la página
        }
    }
    
    // Botón ACEPTAR
    const acceptBtn = document.getElementById('acceptCookies');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            setCookie('cookieConsent', 'accepted', 365);
            hideCookieBanner();
            // Aquí puedes activar Google Analytics u otras cookies
            console.log('Cookies aceptadas');
        });
    }
    
    // Botón RECHAZAR
    const rejectBtn = document.getElementById('rejectCookies');
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            setCookie('cookieConsent', 'rejected', 365);
            hideCookieBanner();
            // Aquí puedes desactivar cookies no esenciales
            console.log('Cookies rechazadas');
        });
    }
    
    // Ocultar banner
    function hideCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 400);
        }
    }
    
    // Función para establecer cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }
    
    // Función para obtener cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
});


