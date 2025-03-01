// Opciones de la ruleta
const wheelOptions = [
    { text: "5% OFF", color: "#4CAF50", discount: "5%" },
    { text: "10% OFF", color: "#2196F3", discount: "10%" },
    { text: "15% OFF", color: "#FFC107", discount: "15%" },
    { text: "20% OFF", color: "#9C27B0", discount: "20%" },
    { text: "¡Suerte la próxima!", color: "#F44336", discount: "0%" }
];

// Datos del jugador
let playerData = {};

// Variable para controlar si la ruleta ya ha sido girada
let wheelSpun = false;

// Función para crear la ruleta
function createWheel() {
    const wheel = document.getElementById('wheel');
    const sectionAngle = 360 / wheelOptions.length;

    // Limpiar el contenido actual
    wheel.innerHTML = '';

    wheelOptions.forEach((option, index) => {
        const section = document.createElement('div');
        section.className = 'section';
        section.style.backgroundColor = option.color;
        section.style.transform = `rotate(${index * sectionAngle}deg)`;

        // Crear contenido de la sección
        const content = document.createElement('span');
        content.textContent = option.text;
        content.style.transform = `rotate(${90 + sectionAngle / 2}deg)`;
        content.style.position = 'absolute';
        content.style.left = '60%';
        content.style.width = '100px';
        content.style.textAlign = 'center';

        section.appendChild(content);
        wheel.appendChild(section);
    });
}

// Función para recolectar datos del jugador
function collectPlayerData() {
    const name = document.getElementById('name').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;

    // Validar datos
    if (!name || !lastname || !email) {
        alert('Por favor completa todos los campos');
        return false;
    }

    // Validar que el correo no haya jugado antes (opcional)
    try {
        const hasPlayed = localStorage.getItem(email);

        if (hasPlayed) {
            alert('¡Ya has participado con este correo electrónico! Cada cliente solo puede participar una vez.');
            return false;
        }
    } catch (e) {
        console.log("Error al verificar localStorage:", e);
        // Continuar incluso si localStorage falla
    }

    playerData = {
        name,
        lastname,
        email,
        playDate: new Date().toISOString()
    };

    return true;
}

// Función para mostrar la ruleta
function showWheel() {
    const formContainer = document.getElementById('formContainer');
    const gameContainer = document.getElementById('gameContainer');

    formContainer.style.display = 'none';
    gameContainer.style.display = 'flex';

    console.log("Mostrando ruleta");
}

// Función para girar la ruleta
function spinWheel() {
    // Verificar si la ruleta ya ha sido girada
    if (wheelSpun) {
        alert('Ya has girado la ruleta. ¡Solo puedes girarla una vez!');
        return;
    }

    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spinButton');
    const resultContainer = document.getElementById('resultContainer');

    // Deshabilitar botón durante el giro
    spinButton.disabled = true;

    // Ocultar cualquier resultado previo
    resultContainer.style.display = 'none';

    // Generar un ángulo aleatorio (entre 2 y 10 vueltas completas)
    const rotations = 2 + Math.random() * 8;
    const degrees = rotations * 360;

    // Añadir un offset aleatorio para determinar el resultado
    const sectionAngle = 360 / wheelOptions.length;
    const offset = Math.floor(Math.random() * wheelOptions.length);
    const finalAngle = degrees + (offset * sectionAngle);

    // Animar la ruleta
    wheel.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)'; // Añadir transición aquí
    wheel.style.transform = `rotate(${finalAngle}deg)`;

    // Procesar el resultado después de la animación
    setTimeout(() => {
        processResult(offset);

        // Registrar que el usuario ya ha jugado
        try {
            localStorage.setItem(playerData.email, 'true');
        } catch (e) {
            console.log("Error al guardar en localStorage:", e);
        }

        // Habilitar el botón nuevamente
        spinButton.disabled = false;
    }, 5000); // 5 segundos (duración de la animación)

    // Establecer la variable wheelSpun a true después de girar la ruleta
    wheelSpun = true;
}

// Función para procesar el resultado
function processResult(resultIndex) {
    const result = wheelOptions[resultIndex];
    const resultContainer = document.getElementById('resultContainer');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const discountCode = document.getElementById('discountCode');

    // Mostrar el resultado
    resultContainer.style.display = 'block';

    if (result.discount === "0%") {
        resultTitle.textContent = "¡Suerte la próxima!";
        resultMessage.textContent = `Gracias por participar ${playerData.name}. Aunque no obtuviste un descuento esta vez, te invitamos a seguir disfrutando de nuestras nueces de gran calidad.`;
        discountCode.textContent = "";
        discountCode.style.display = "none";
    } else {
        resultTitle.textContent = `¡Felicidades! Ganaste ${result.discount} de descuento`;
        resultMessage.textContent = `¡Enhorabuena ${playerData.name}! Has ganado un descuento del ${result.discount} en tu próxima compra de nueces.`;

        // Generar código de descuento único
        const code = generateDiscountCode(playerData.name, result.discount);
        discountCode.textContent = code;
        discountCode.style.display = "block";

        // Guardar el resultado con el código
        playerData.discount = result.discount;
        playerData.code = code;
    }

    // Opcional: Enviar los datos a un servidor
    console.log("Resultado:", result.discount, "Datos del jugador:", playerData);
}

// Función para generar código de descuento
function generateDiscountCode(name, discount) {
    // Crear un código basado en el nombre y el descuento
    const namePart = name.substring(0, 3).toUpperCase();
    const discountPart = discount.replace('%', '');
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return `${namePart}${discountPart}-${randomPart}`;
}

// Inicializar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Crear la ruleta
    createWheel();

    // Configurar evento para el formulario
    document.getElementById('playerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (collectPlayerData()) {
            showWheel();
        }
    });

    // Configurar evento para girar la ruleta
    document.getElementById('spinButton').addEventListener('click', spinWheel);
});