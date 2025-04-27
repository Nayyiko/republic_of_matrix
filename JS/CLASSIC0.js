document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const encryptBtn = document.getElementById('encrypt-btn');
    const decryptBtn = document.getElementById('decrypt-btn');
    const encryptionKey = document.getElementById('encryption-key');
    const showInstructionsBtn = document.getElementById('show-instructions');
    const dismissInstructionsBtn = document.getElementById('dismiss-instructions');
    const instructionsPanel = document.getElementById('instructions-panel');

    // 选择加密算法
    const encryptionAlgorithm = 'AES'; // 可以选择 'AES', 'DES', 或 'RSA'

    function applyGlitchAnimation(element) {
        element.classList.add('glitching');
        setTimeout(() => {
            element.classList.remove('glitching');
        }, 300);
    }

    function createGlitchText(text) {
        const span = document.createElement('span');
        span.className = 'glitch-text';
        span.setAttribute('data-text', text);
        span.textContent = text;
        return span;
    }

    async function animateTyping(element, text, delay = 20) {
        element.value = ''; 
        let displayText = '';

        return new Promise(resolve => {
            let index = 0;
            const chars = text.split('');

            function typeNextChar() {
                if (index < chars.length) {
                    displayText += chars[index];
                    element.value = displayText; 
                    index++;
                    setTimeout(typeNextChar, delay);
                } else {
                    setTimeout(resolve, 100);
                }
            }

            typeNextChar();
        });
    }

    function encrypt(text, key) {
        if (!text) return '';

        switch (encryptionAlgorithm) {
            case 'AES':
                return CryptoJS.AES.encrypt(text, key).toString();
            case 'DES':
                return CryptoJS.DES.encrypt(text, key).toString();
            case 'RSA':
                const encryptor = new JSEncrypt();
                encryptor.setPublicKey(key);
                return encryptor.encrypt(text);
            default:
                return '';
        }
    }

    function decrypt(encryptedText, key) {
        if (!encryptedText) return '';

        try {
            switch (encryptionAlgorithm) {
                case 'AES':
                    return CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
                case 'DES':
                    return CryptoJS.DES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
                case 'RSA':
                    const decryptor = new JSEncrypt();
                    decryptor.setPrivateKey(key);
                    return decryptor.decrypt(encryptedText);
                default:
                    return '';
            }
        } catch (e) {
            console.error('Decryption error:', e);
            return 'Error: Invalid encrypted text or wrong key';
        }
    }

    function glitchInputOnType() {
        const span = document.createElement('span');
        span.textContent = inputText.value.charAt(inputText.value.length - 1);
        span.style.position = 'absolute';
        span.style.color = 'var(--primary-color)';
        span.style.opacity = '0.7';
        span.style.fontSize = '1.3rem';
        span.style.pointerEvents = 'none';

        const rect = inputText.getBoundingClientRect();
        const charWidth = 10; 
        const approxPos = (inputText.value.length - 1) % (rect.width / charWidth);

        span.style.left = `${approxPos * charWidth}px`;
        span.style.top = '0';

        document.body.appendChild(span);

        applyGlitchAnimation(span);

        setTimeout(() => {
            document.body.removeChild(span);
        }, 300);
    }

    encryptBtn.addEventListener('click', async function() {
        const text = inputText.value;
        const key = encryptionKey.value || 'glitched';

        if (!text) {
            outputText.value = '';
            return;
        }

        encryptBtn.disabled = true;

        const buttonText = encryptBtn.querySelector('.button-text');
        applyGlitchAnimation(buttonText);

        setTimeout(async () => {
            const encrypted = encrypt(text, key);
            await animateTyping(outputText, encrypted, 5);
            encryptBtn.disabled = false;
        }, 300);
    });

    decryptBtn.addEventListener('click', async function() {
        const text = inputText.value;
        const key = encryptionKey.value || 'glitched';

        if (!text) {
            outputText.value = '';
            return;
        }

        decryptBtn.disabled = true;

        const buttonText = decryptBtn.querySelector('.button-text');
        applyGlitchAnimation(buttonText);

        setTimeout(async () => {
            const decrypted = decrypt(text, key);
            await animateTyping(outputText, decrypted, 5);
            decryptBtn.disabled = false;
        }, 300);
    });

    inputText.addEventListener('input', function() {
        glitchInputOnType();
    });

    showInstructionsBtn.addEventListener('click', function() {
        instructionsPanel.classList.add('active');
    });

    dismissInstructionsBtn.addEventListener('click', function() {
        instructionsPanel.classList.remove('active');
    });

    if (encryptionKey.value === '') {
        encryptionKey.value = 'glitched';
    }

    document.addEventListener('mousemove', function(e) {
        if (Math.random() > 0.98) {
            const cursorGlitch = document.createElement('div');
            cursorGlitch.style.position = 'fixed';
            cursorGlitch.style.width = '10px';
            cursorGlitch.style.height = '10px';
            cursorGlitch.style.background = 'var(--primary-color)';
            cursorGlitch.style.borderRadius = '50%';
            cursorGlitch.style.filter = 'blur(2px)';
            cursorGlitch.style.boxShadow = '0 0 10px var(--primary-color)';
            cursorGlitch.style.pointerEvents = 'none';
            cursorGlitch.style.zIndex = '9999';
            cursorGlitch.style.opacity = '0.7';
            cursorGlitch.style.left = `${e.clientX}px`;
            cursorGlitch.style.top = `${e.clientY}px`;

            document.body.appendChild(cursorGlitch);

            setTimeout(() => {
                cursorGlitch.style.opacity = '0';
                cursorGlitch.style.transition = 'opacity 0.2s';
                setTimeout(() => {
                    document.body.removeChild(cursorGlitch);
                }, 200);
            }, 100);
        }
    });

    setInterval(() => {
        const elements = [
            document.querySelector('.app-title h1'),
            document.querySelector('.status-indicator'),
            document.querySelector('.created-by span')
        ];

        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        applyGlitchAnimation(randomElement);
    }, 5000);

    function createFloatingParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 4}px`;
        particle.style.height = particle.style.width;
        particle.style.background = 'var(--primary-color)';
        particle.style.borderRadius = '50%';
        particle.style.filter = 'blur(1px)';
        particle.style.opacity = `${Math.random() * 0.5}`;
        particle.style.pointerEvents = 'none';

        const startPos = Math.random() * 100;
        particle.style.left = `${startPos}vw`;
        particle.style.top = '100%';

        const duration = 5 + Math.random() * 15;
        particle.style.animation = `floatUp ${duration}s linear forwards`;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% {
                    transform: translateY(0) rotate(0deg);
                }
                100% {
                    transform: translateY(-100vh) rotate(${Math.random() * 360}deg);
                }
            }
        `;
        document.head.appendChild(style);

        document.querySelector('.app-container').appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, duration * 1000);
    }

    setInterval(createFloatingParticle, 1000);

    const customCursor = document.createElement('div');
    customCursor.classList.add('custom-cursor');
    document.body.appendChild(customCursor);

    const cursorGlitch = document.createElement('div');
    cursorGlitch.classList.add('cursor-glitch');
    document.body.appendChild(cursorGlitch);

    document.addEventListener('mousemove', function(e) {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;

        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;

        cursorGlitch.style.left = `${e.clientX + offsetX}px`;
        cursorGlitch.style.top = `${e.clientY + offsetY}px`;
    });

    document.addEventListener('click', function(e) {
        const clickEffect = document.createElement('div');
        clickEffect.classList.add('click-effect');
        clickEffect.style.left = `${e.clientX}px`;
        clickEffect.style.top = `${e.clientY}px`;
        document.body.appendChild(clickEffect);

        for (let i = 0; i < 5; i++) {
            createGlitchParticle(e.clientX, e.clientY);
        }

        setTimeout(() => {
            document.body.removeChild(clickEffect);
        }, 600);
    });

    function createGlitchParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = `${Math.random() * 10 + 5}px`;
        particle.style.background = Math.random() > 0.5 ? 
            'var(--primary-color)' : 'var(--secondary-color)';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.borderRadius = Math.random() > 0.7 ? '50%' : '0';
        particle.style.filter = 'blur(2px)';
        particle.style.opacity = '0.8';
        particle.style.zIndex = '9000';
        particle.style.pointerEvents = 'none';

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particle.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(particle);

        const startTime = performance.now();
        const duration = Math.random() * 600 + 300;

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            if (elapsed < duration) {
                const progress = elapsed / duration;
                const x_pos = x + vx * progress;
                const y_pos = y + vy * progress;
                const scale = 1 - progress;
                const opacity = 1 - progress;

                particle.style.left = `${x_pos}px`;
                particle.style.top = `${y_pos}px`;
                particle.style.transform = `translate(-50%, -50%) scale(${scale})`;
                particle.style.opacity = opacity;

                requestAnimationFrame(animate);
            } else {
                if (particle.parentNode) {
                    document.body.removeChild(particle);
                }
            }
        }

        requestAnimationFrame(animate);
    }

    function applyGlitch() {
        const title = document.querySelector('.app-title h1');
        wrapInGlitch(title);

        const labels = document.querySelectorAll('.text-area-wrapper label');
        labels.forEach(label => wrapInGlitch(label));

        const keyLabel = document.querySelector('.key-container label');
        wrapInGlitch(keyLabel);
    }

    function wrapInGlitch(element) {
        if (!element || element.querySelector('.glitch-effect')) return;

        const text = element.textContent;
        element.innerHTML = '';
        const glitchSpan = document.createElement('span');
        glitchSpan.className = 'glitch-effect';
        glitchSpan.setAttribute('data-text', text);
        glitchSpan.textContent = text;
        element.appendChild(glitchSpan);
    }

    applyGlitch();
});
