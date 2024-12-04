// auth.js

// Seleccionar el botón de visitante
const playAsGuestButton = document.getElementById('playAsGuest');

// Lógica para redirigir a base.html
playAsGuestButton.addEventListener('click', () => {
    console.log('Redirigiendo como visitante...');
    window.location.href ="base.html"; // Redirige al archivo base.html
});
