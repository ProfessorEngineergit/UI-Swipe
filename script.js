// UI Swipe - Satisfying UI Components
// Disable zoom gestures
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
}, false);

document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());
document.addEventListener('gestureend', e => e.preventDefault());

// Sound effects using Web Audio API
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
}

function playSound(type) {
    if (!soundEnabled || !audioCtx) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    const sounds = {
        click: { freq: 800, duration: 0.08, type: 'sine' },
        toggle: { freq: 600, duration: 0.12, type: 'sine' },
        success: { freq: 880, duration: 0.15, type: 'sine' },
        pop: { freq: 400, duration: 0.06, type: 'triangle' },
        slide: { freq: 300, duration: 0.1, type: 'sine' },
        flip: { freq: 500, duration: 0.2, type: 'triangle' }
    };
    
    const sound = sounds[type] || sounds.click;
    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + sound.duration);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + sound.duration);
}

// UI Components Data
const components = [
    {
        id: 'toggle-neon',
        name: 'Neon Toggle',
        description: 'Glühender Neon-Effekt beim Umschalten',
        category: 'toggles',
        html: `
            <div class="toggle-neon">
                <input type="checkbox" id="toggle-neon-1">
                <label for="toggle-neon-1"></label>
            </div>
        `,
        sound: 'toggle'
    },
    {
        id: 'toggle-liquid',
        name: 'Liquid Toggle',
        description: 'Flüssige Animation mit Farbverlauf',
        category: 'toggles',
        html: `
            <div class="toggle-liquid">
                <input type="checkbox" id="toggle-liquid-1">
                <label for="toggle-liquid-1"></label>
            </div>
        `,
        sound: 'toggle'
    },
    {
        id: 'toggle-daynight',
        name: 'Day/Night Toggle',
        description: 'Wechsel zwischen Tag und Nacht',
        category: 'toggles',
        html: `
            <div class="toggle-daynight">
                <input type="checkbox" id="toggle-daynight-1">
                <label for="toggle-daynight-1"></label>
            </div>
        `,
        sound: 'toggle'
    },
    {
        id: 'btn-glow',
        name: 'Glow Button',
        description: 'Pulsierender Leuchteffekt beim Hover',
        category: 'buttons',
        html: `<button class="btn-glow">Click Me</button>`,
        sound: 'click'
    },
    {
        id: 'btn-ripple',
        name: 'Ripple Button',
        description: 'Wellen-Effekt bei jedem Klick',
        category: 'buttons',
        html: `<button class="btn-ripple">Click Me</button>`,
        sound: 'pop'
    },
    {
        id: 'btn-3d',
        name: '3D Press Button',
        description: 'Physischer 3D-Drück-Effekt',
        category: 'buttons',
        html: `<button class="btn-3d">Press Me</button>`,
        sound: 'click'
    },
    {
        id: 'checkbox-bounce',
        name: 'Bounce Checkbox',
        description: 'Federnde Check-Animation',
        category: 'checkboxes',
        html: `
            <div class="checkbox-bounce">
                <input type="checkbox" id="cb-bounce-1">
                <label for="cb-bounce-1"></label>
            </div>
        `,
        sound: 'success'
    },
    {
        id: 'checkbox-fill',
        name: 'Fill Checkbox',
        description: 'Ausfüllende Kreis-Animation',
        category: 'checkboxes',
        html: `
            <div class="checkbox-fill">
                <input type="checkbox" id="cb-fill-1">
                <label for="cb-fill-1"></label>
            </div>
        `,
        sound: 'success'
    },
    {
        id: 'checkbox-morph',
        name: 'Morph Checkbox',
        description: 'X verwandelt sich in Häkchen',
        category: 'checkboxes',
        html: `
            <div class="checkbox-morph">
                <input type="checkbox" id="cb-morph-1">
                <label for="cb-morph-1"></label>
            </div>
        `,
        sound: 'success'
    },
    {
        id: 'slider-gradient',
        name: 'Gradient Slider',
        description: 'Farbverlauf mit leuchtendem Knopf',
        category: 'sliders',
        html: `
            <div class="slider-gradient">
                <input type="range" min="0" max="100" value="50">
            </div>
        `,
        sound: 'slide'
    },
    {
        id: 'slider-bubble',
        name: 'Bubble Slider',
        description: 'Wert-Anzeige folgt dem Slider',
        category: 'sliders',
        html: `
            <div class="slider-bubble">
                <span class="slider-bubble-value">50</span>
                <input type="range" min="0" max="100" value="50">
            </div>
        `,
        sound: 'slide'
    },
    {
        id: 'loader-orbit',
        name: 'Orbit Loader',
        description: 'Doppelte rotierende Ringe',
        category: 'loaders',
        html: `<div class="loader-orbit"></div>`
    },
    {
        id: 'loader-dots',
        name: 'Wave Dots',
        description: 'Pulsierende Punkte-Animation',
        category: 'loaders',
        html: `
            <div class="loader-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `
    },
    {
        id: 'loader-pulse',
        name: 'Pulse Ring',
        description: 'Ausbreitende Puls-Ringe',
        category: 'loaders',
        html: `<div class="loader-pulse"></div>`
    },
    {
        id: 'card-tilt',
        name: '3D Tilt Card',
        description: 'Folgt deiner Maus/Touch-Bewegung',
        category: 'cards',
        html: `
            <div class="card-tilt" data-tilt>
                <div class="card-tilt-content">
                    <span class="card-tilt-icon">🎴</span>
                    <span>Bewege mich!</span>
                </div>
            </div>
        `
    },
    {
        id: 'card-flip',
        name: 'Flip Card',
        description: 'Tippe zum Umdrehen',
        category: 'cards',
        html: `
            <div class="card-flip" data-flip>
                <div class="card-flip-inner">
                    <div class="card-flip-front">
                        <span class="card-flip-icon">✨</span>
                        <span>Vorderseite</span>
                    </div>
                    <div class="card-flip-back">
                        <span class="card-flip-icon">🎉</span>
                        <span>Rückseite!</span>
                    </div>
                </div>
            </div>
        `,
        sound: 'flip'
    },
    {
        id: 'card-glow',
        name: 'Glow Border Card',
        description: 'Animierter Leuchtrand beim Hover',
        category: 'cards',
        html: `
            <div class="card-glow">
                <span class="card-glow-icon">💎</span>
                <span>Hover me!</span>
            </div>
        `
    }
];

// State
let currentIndex = 0;
let filteredComponents = [...components];
let currentCategory = 'all';

// DOM Elements
const container = document.getElementById('componentContainer');
const navDots = document.getElementById('navDots');
const swipeHint = document.getElementById('swipeHint');
const categoryNav = document.getElementById('categoryNav');
const soundToggle = document.getElementById('soundToggle');
const currentCategoryDisplay = document.getElementById('currentCategory');

// Initialize
function init() {
    initAudio();
    renderComponents();
    setupEventListeners();
    updateNavDots();
    
    // Hide swipe hint after 4 seconds
    setTimeout(() => {
        swipeHint.classList.add('hidden');
    }, 4000);
}

// Render all components
function renderComponents() {
    container.innerHTML = '';
    navDots.innerHTML = '';
    
    filteredComponents.forEach((comp, index) => {
        // Create card
        const card = document.createElement('div');
        card.className = 'component-card';
        card.dataset.index = index;
        card.innerHTML = `
            <div class="component-wrapper">
                <div class="component-display">
                    ${comp.html}
                </div>
                <div class="component-info">
                    <div class="component-name">${comp.name}</div>
                    <div class="component-description">${comp.description}</div>
                    <span class="component-tag">${comp.category}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
        
        // Create nav dot
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        dot.dataset.index = index;
        dot.addEventListener('click', () => scrollToComponent(index));
        navDots.appendChild(dot);
    });
    
    setupComponentInteractions();
}

// Setup component-specific interactions
function setupComponentInteractions() {
    // Ripple buttons
    document.querySelectorAll('.btn-ripple').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
            this.appendChild(ripple);
            playSound('pop');
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Regular buttons
    document.querySelectorAll('.btn-glow, .btn-3d').forEach(btn => {
        btn.addEventListener('click', () => playSound('click'));
    });
    
    // Toggles
    document.querySelectorAll('.toggle-neon input, .toggle-liquid input, .toggle-daynight input').forEach(toggle => {
        toggle.addEventListener('change', () => {
            playSound('toggle');
            if (navigator.vibrate) navigator.vibrate(30);
        });
    });
    
    // Checkboxes
    document.querySelectorAll('.checkbox-bounce input, .checkbox-fill input, .checkbox-morph input').forEach(cb => {
        cb.addEventListener('change', () => {
            playSound('success');
            if (navigator.vibrate) navigator.vibrate(20);
        });
    });
    
    // Sliders
    document.querySelectorAll('.slider-gradient input, .slider-bubble input').forEach(slider => {
        let lastSoundTime = 0;
        slider.addEventListener('input', function() {
            const now = Date.now();
            if (now - lastSoundTime > 100) {
                playSound('slide');
                lastSoundTime = now;
            }
            
            // Update bubble value if exists
            const bubble = this.parentElement.querySelector('.slider-bubble-value');
            if (bubble) {
                bubble.textContent = this.value;
                const percent = (this.value - this.min) / (this.max - this.min);
                const thumbWidth = 20;
                const trackWidth = this.offsetWidth - thumbWidth;
                bubble.style.left = (percent * trackWidth + thumbWidth/2) + 'px';
            }
        });
    });
    
    // 3D Tilt cards
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('touchmove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
        card.addEventListener('touchend', resetTilt);
    });
    
    // Flip cards
    document.querySelectorAll('[data-flip]').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            playSound('flip');
            if (navigator.vibrate) navigator.vibrate(40);
        });
    });
}

// Handle 3D tilt effect
function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    let x, y;
    if (e.touches) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
}

function resetTilt(e) {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
}

// Setup event listeners
function setupEventListeners() {
    // Scroll detection for nav dots
    container.addEventListener('scroll', () => {
        const cardHeight = container.firstElementChild?.offsetHeight || 0;
        if (cardHeight > 0) {
            currentIndex = Math.round(container.scrollTop / cardHeight);
            updateNavDots();
            updateCategoryDisplay();
        }
    });
    
    // Category filter
    categoryNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            currentCategory = e.target.dataset.category;
            filterComponents(currentCategory);
            playSound('click');
        }
    });
    
    // Sound toggle
    soundToggle.addEventListener('click', () => {
        initAudio();
        soundEnabled = !soundEnabled;
        soundToggle.querySelector('.sound-on').style.display = soundEnabled ? 'block' : 'none';
        soundToggle.querySelector('.sound-off').style.display = soundEnabled ? 'none' : 'block';
        if (soundEnabled) playSound('click');
    });
    
    // Enable audio on first user interaction
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
}

// Filter components by category
function filterComponents(category) {
    if (category === 'all') {
        filteredComponents = [...components];
    } else {
        filteredComponents = components.filter(c => c.category === category);
    }
    currentIndex = 0;
    renderComponents();
    updateNavDots();
    updateCategoryDisplay();
}

// Scroll to specific component
function scrollToComponent(index) {
    const cardHeight = container.firstElementChild?.offsetHeight || 0;
    container.scrollTo({
        top: index * cardHeight,
        behavior: 'smooth'
    });
    playSound('click');
}

// Update navigation dots
function updateNavDots() {
    document.querySelectorAll('.nav-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

// Update category display in header
function updateCategoryDisplay() {
    if (filteredComponents[currentIndex]) {
        const category = filteredComponents[currentIndex].category;
        currentCategoryDisplay.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }
}

// Start app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('✨ UI Swipe loaded!');
