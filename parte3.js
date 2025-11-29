document.getElementById('generateButton').addEventListener('click', generateHeart);

// Variables para controlar las animaciones
let animationTimeout; 
let messageTimeout; 
let letters = []; 

// CAMBIO CLAVE: Mensaje corregido gramaticalmente.
const MESSAGE_TEXT = "No importa lo lejos que estés, mientras estés en mi corazón, siempre te sentiré cerca.";

function generateHeart() {
    const nameInput = document.getElementById('nameInput');
    const heartContainer = document.getElementById('heartContainer');
    
    // Limpiar cualquier animación y contenido previo
    clearTimeout(animationTimeout);
    clearTimeout(messageTimeout);
    heartContainer.innerHTML = '';
    heartContainer.classList.remove('beating-heart'); 
    letters = []; 

    const name = nameInput.value.trim();
    if (name === "") {
        alert("Por favor, ingresa un nombre.");
        return;
    }

    // 1. GENERACIÓN DEL CORAZÓN EXTERNO DE LETRAS
    let fullText = name;
    while (fullText.length < 100) { 
        fullText += name;
    }
    
    const characters = fullText.split('');

    const scaleFactorX = 15;
    const scaleFactorY = -15;
    const centerX = 150;
    const centerY = 150;

    const pointsPerLetter = 2; 
    const totalPoints = characters.length * pointsPerLetter; 

    for (let i = 0; i < totalPoints; i++) {
        if (i % pointsPerLetter === 0) {
            const angle = i * (2 * Math.PI / totalPoints); 

            // ECUACIÓN PARAMÉTRICA DEL CORAZÓN
            const x_raw = 16 * Math.pow(Math.sin(angle), 3);
            const y_raw = (13 * Math.cos(angle)) - 
                          (5 * Math.cos(2 * angle)) - 
                          (2 * Math.cos(3 * angle)) - 
                          (1 * Math.cos(4 * angle));

            const finalX = x_raw * scaleFactorX + centerX;
            const finalY = y_raw * scaleFactorY + centerY;

            const letterSpan = document.createElement('span');
            const charIndex = (i / pointsPerLetter) % name.length; 
            letterSpan.textContent = name[charIndex]; 
            letterSpan.classList.add('letter');

            letterSpan.style.left = `${finalX}px`;
            letterSpan.style.top = `${finalY}px`;
            
            letters.push(letterSpan); 
            heartContainer.appendChild(letterSpan);
        }
    }

    // 2. INICIAR LA FORMACIÓN PROGRESIVA
    let index = 0;
    const revealInterval = 20; 

    function revealNextLetter() {
        if (index < letters.length) {
            letters[index].style.opacity = 1; 
            index++;
            animationTimeout = setTimeout(revealNextLetter, revealInterval);
        } else {
            // Cuando el corazón externo está completo:
            heartContainer.classList.add('beating-heart'); 
            setTimeout(startMessageAnimation, 1000); 
        }
    }

    revealNextLetter(); 

    // 3. LÓGICA DE APARICIÓN DEL MENSAJE CENTRAL
    function startMessageAnimation() {
        // Crear el contenedor del mensaje
        const messageContainer = document.createElement('div');
        messageContainer.id = 'centerMessage';
        heartContainer.appendChild(messageContainer);

        // Crear un array de elementos span para cada letra del mensaje
        const messageCharacters = MESSAGE_TEXT.split('').map(char => {
            const span = document.createElement('span');
            // Usar espacio no rompible (\u00A0) para los espacios
            span.textContent = char === ' ' ? '\u00A0' : char; 
            span.classList.add('message-letter');
            messageContainer.appendChild(span);
            return span;
        });

        // Iniciar la aparición letra por letra del mensaje
        let msgIndex = 0;
        const msgRevealInterval = 50; 

        function revealNextMessageLetter() {
            if (msgIndex < messageCharacters.length) {
                messageCharacters[msgIndex].style.opacity = 1;
                msgIndex++;
                messageTimeout = setTimeout(revealNextMessageLetter, msgRevealInterval);
            }
        }
        
        revealNextMessageLetter();
    }
}