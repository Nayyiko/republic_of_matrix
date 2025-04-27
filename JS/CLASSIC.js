document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const encryptBtn = document.getElementById('encrypt-btn');
    const decryptBtn = document.getElementById('decrypt-btn');
    const encryptionKey = document.getElementById('encryption-key');
    const algorithmSelect = document.getElementById('algorithm');
    const showInstructionsBtn = document.getElementById('show-instructions');
    const dismissInstructionsBtn = document.getElementById('dismiss-instructions');
    const instructionsPanel = document.getElementById('instructions-panel');

    // ElGamal key pair (simplified for demo purposes)
    let elGamalKeys = {
        publicKey: null,
        privateKey: null,
        prime: null,
        generator: null
    };

    // Generate ElGamal keys when the page loads
    generateElGamalKeys();

    function generateElGamalKeys() {
        // For demo purposes, we'll use small primes
        // In a real application, you'd use much larger primes
        elGamalKeys.prime = 23; // A small prime number
        elGamalKeys.generator = 5; // A primitive root modulo prime
        
        // Generate private key (1 < privateKey < prime-1)
        elGamalKeys.privateKey = Math.floor(Math.random() * (elGamalKeys.prime - 2)) + 2;
        
        // Generate public key (publicKey = generator^privateKey mod prime)
        elGamalKeys.publicKey = Math.pow(elGamalKeys.generator, elGamalKeys.privateKey) % elGamalKeys.prime;
    }

    function getSelectedAlgorithm() {
        return algorithmSelect.value;
    }

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

        switch (getSelectedAlgorithm()) {
            case 'AES':
                return CryptoJS.AES.encrypt(text, key).toString();
            case 'DES':
                return CryptoJS.DES.encrypt(text, key).toString();
            case 'RSA':
                const encryptor = new JSEncrypt();
                encryptor.setPublicKey(key);
                return encryptor.encrypt(text);
            case 'ELGAMAL':
                return elGamalEncrypt(text);
            default:
                return '';
        }
    }

    function decrypt(encryptedText, key) {
        if (!encryptedText) return '';

        try {
            switch (getSelectedAlgorithm()) {
                case 'AES':
                    return CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
                case 'DES':
                    return CryptoJS.DES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
                case 'RSA':
                    const decryptor = new JSEncrypt();
                    decryptor.setPrivateKey(key);
                    return decryptor.decrypt(encryptedText);
                case 'ELGAMAL':
                    return elGamalDecrypt(encryptedText);
                default:
                    return '';
            }
        } catch (e) {
            console.error('Decryption error:', e);
            return 'Error: Invalid encrypted text or wrong key';
        }
    }
// Generate better ElGamal keys
function generateElGamalKeys() {
    // Use a larger prime for better security (still small for demo)
    elGamalKeys.prime = 7919; // A larger prime number
    elGamalKeys.generator = findPrimitiveRoot(elGamalKeys.prime);
    
    // Generate private key (1 < privateKey < prime-1)
    elGamalKeys.privateKey = 2 + Math.floor(Math.random() * (elGamalKeys.prime - 3));
    
    // Generate public key (publicKey = generator^privateKey mod prime)
    elGamalKeys.publicKey = modExp(elGamalKeys.generator, elGamalKeys.privateKey, elGamalKeys.prime);
    
    console.log("Generated ElGamal keys:", elGamalKeys);
}

// Helper function to find a primitive root modulo p
function findPrimitiveRoot(p) {
    if (p === 2) return 1;
    
    // Factorize p-1
    const factors = factorize(p - 1);
    
    for (let g = 2; g < p; g++) {
        let isRoot = true;
        for (const factor of factors) {
            if (modExp(g, (p - 1) / factor, p) === 1) {
                isRoot = false;
                break;
            }
        }
        if (isRoot) return g;
    }
    return null;
}

// Factorize a number into its prime factors (without exponents)
function factorize(n) {
    const factors = new Set();
    while (n % 2 === 0) {
        factors.add(2);
        n /= 2;
    }
    
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        while (n % i === 0) {
            factors.add(i);
            n /= i;
        }
    }
    
    if (n > 2) factors.add(n);
    return Array.from(factors);
}

// Modular exponentiation (a^b mod m)
function modExp(a, b, m) {
    let result = 1n;
    a = BigInt(a);
    b = BigInt(b);
    m = BigInt(m);
    
    a = a % m;
    while (b > 0n) {
        if (b % 2n === 1n) {
            result = (result * a) % m;
        }
        b = b / 2n;
        a = (a * a) % m;
    }
    return Number(result);
}

// Updated ElGamal encryption
function elGamalEncrypt(text) {
    const numericText = text.split('').map(c => c.charCodeAt(0));
    const encryptedPairs = [];
    
    for (const m of numericText) {
        // Choose random k (1 < k < prime-1)
        const k = 2 + Math.floor(Math.random() * (elGamalKeys.prime - 3));
        
        // Compute c1 = generator^k mod prime
        const c1 = modExp(elGamalKeys.generator, k, elGamalKeys.prime);
        
        // Compute c2 = (m * publicKey^k) mod prime
        const s = modExp(elGamalKeys.publicKey, k, elGamalKeys.prime);
        const c2 = (m * s) % elGamalKeys.prime;
        
        encryptedPairs.push(`${c1},${c2}`);
    }
    
    return encryptedPairs.join('|');
}

// Fixed ElGamal decryption
function elGamalDecrypt(encryptedText) {
    try {
        const pairs = encryptedText.split('|');
        const decryptedChars = [];
        
        for (const pair of pairs) {
            const [c1, c2] = pair.split(',').map(Number);
            
            // Compute s = c1^privateKey mod prime
            const s = modExp(c1, elGamalKeys.privateKey, elGamalKeys.prime);
            
            // Compute s^-1 mod prime
            const sInverse = modInverse(s, elGamalKeys.prime);
            if (sInverse === null) {
                console.error("Could not find modular inverse");
                return "Decryption error";
            }
            
            // Compute m = (c2 * s^-1) mod prime
            const m = (c2 * sInverse) % elGamalKeys.prime;
            
            // Ensure m is within valid ASCII range
            if (m < 0 || m > 255) {
                console.error("Invalid character code:", m);
                return "Decryption error";
            }
            
            decryptedChars.push(String.fromCharCode(m));
        }
        
        return decryptedChars.join('');
    } catch (e) {
        console.error('ElGamal decryption error:', e);
        return 'Error: Invalid ElGamal encrypted text';
    }
}

// Extended Euclidean algorithm for modular inverse
function modInverse(a, m) {
    a = ((a % m) + m) % m;
    let [old_r, r] = [a, m];
    let [old_s, s] = [1, 0];
    let [old_t, t] = [0, 1];
    
    while (r !== 0) {
        const quotient = Math.floor(old_r / r);
        [old_r, r] = [r, old_r - quotient * r];
        [old_s, s] = [s, old_s - quotient * s];
        [old_t, t] = [t, old_t - quotient * t];
    }
    
    if (old_r !== 1) return null; // No inverse exists
    return ((old_s % m) + m) % m;
}

// Initialize ElGamal when the page loads
generateElGamalKeys();

    // Helper function to compute modular inverse
    function modInverse(a, m) {
        a = ((a % m) + m) % m;
        for (let x = 1; x < m; x++) {
            if ((a * x) % m === 1) {
                return x;
            }
        }
        return 1;
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

    
});