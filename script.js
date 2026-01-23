/* ========================================
   2D PLATFORMER PORTFOLIO - GAME ENGINE
   v4.0 - Eye Tracking, Neon Signs, Better Audio
   ======================================== */

// ============ GLOBAL MOUSE POSITION ============
const mouse = { x: 450, y: 250, onCanvas: false };

// ============ NEON SIGN CONFIG ============
const NEON_SIGN = {
    x: 140, y: 100, // Shifted left by 40px
    baseColor: '#00d9ff',
    hoverColor: '#ff00ff',
    isHovered: false
};

const CONTACT_SIGN = {
    // x will be calculated dynamically (780)
    // y will be calculated dynamically (NEON_SIGN.y + 40)
    width: 250, height: 60,
    baseColor: '#00d9ff', // Match Projects Cyan
    hoverColor: '#ff00ff', // Match Projects Magenta
    isHovered: false
};

// ============ LOCALIZATION (i18n) ============
let currentLang = 'en';
const TRANSLATIONS = {
    en: {
        gameTitle: 'LUCIANO RUZ PORTFOLIO',
        instructions: 'Use ← → or A D to move | ↑ W SPACE to jump',
        hint: '💡 Head-butt the blocks from below! Walk off edges to wrap!',
        neonSign: 'PROJECTS',
        contactLabel: 'CONTACT',
        contactTitle: "Let's Connect!",
        contactDesc: "Feel free to reach out! I'm always open to new opportunities and collaborations.",
        viewLive: 'View Project',
        sourceCode: 'Repository',
        techStackLabel: 'Tech Stack',
        hudLabel: 'Project Info',
        emailTooltip: 'luciruzvelos@gmail.com',
        itsMe: "It's me!",
        footer: '© 2026 Luciano Ruz | HTML5 Canvas'
    },
    es: {
        gameTitle: 'LUCIANO RUZ PORTFOLIO',
        instructions: 'Usa ← → o A D para moverte | ↑ W ESPACIO para saltar',
        hint: '💡 ¡Golpea los bloques desde abajo!',
        neonSign: 'PROYECTOS',
        contactLabel: 'CONTACTO',
        contactTitle: '¡Conectemos!',
        contactDesc: '¡No dudes en contactarme! Siempre estoy abierto a nuevas oportunidades.',
        viewLive: 'Ver Proyecto',
        sourceCode: 'Repositorio',
        techStackLabel: 'Tecnologías',
        hudLabel: 'Info del Proyecto',
        emailTooltip: 'luciruzvelos@gmail.com',
        itsMe: "Soy yo!",
        footer: '© 2026 Luciano Ruz | HTML5 Canvas'
    }
};

function t(key) {
    return TRANSLATIONS[currentLang][key] || TRANSLATIONS['en'][key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    updateLanguageButtons();
    updateAllText();

    // Refresh modal if open
    const modal = document.getElementById('modal-overlay');
    if (modal && !modal.classList.contains('hidden')) {
        refreshModalContent();
    }
}

function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
}

function updateAllText() {
    // Update DOM elements with translations
    const title = document.getElementById('game-title');
    const instructions = document.getElementById('instructions-text');
    const hint = document.getElementById('hint-text');
    const hudLabel = document.querySelector('.hud-label');
    const footer = document.getElementById('footer-text');
    const techLabel = document.querySelector('#tech-stack h3');

    if (title) title.textContent = t('gameTitle');
    if (instructions) instructions.textContent = t('instructions');
    if (hint) hint.textContent = t('hint');
    if (hudLabel) hudLabel.textContent = t('hudLabel');
    if (footer) footer.textContent = t('footer');
    if (techLabel) techLabel.textContent = t('techStackLabel');
}

// ============ DAY/NIGHT THEME ============
let isNightMode = true;
const THEME = {
    night: {
        skyGradient: ['#0f0f23', '#1a1a2e', '#2d2d44'],
        buildingColor: '#1a1a2e',
        windowColor: '#ffd93d',
        celestial: { type: 'moon', color: '#f0f0f0' }
    },
    day: {
        skyGradient: ['#87CEEB', '#B0E0E6', '#E0F7FF'],
        buildingColor: '#4a4a5a',
        windowColor: '#87CEEB',
        celestial: { type: 'sun', color: '#FFD700' }
    }
};

function toggleTheme() {
    isNightMode = !isNightMode;
    updateThemeCheckbox();
}

function updateThemeCheckbox() {
    const checkbox = document.getElementById('theme-checkbox');
    if (checkbox) checkbox.checked = isNightMode;
}

// ============ PLAYER STATES ============
const PlayerState = {
    IDLE: 'IDLE',
    RUN: 'RUN',
    JUMP: 'JUMP',
    LOOK_UP: 'LOOK_UP',
    SHOCKED: 'SHOCKED',
    SLEEP: 'SLEEP',
    HAPPY: 'HAPPY'
};

// ============ CONFIGURATION ============
const CONFIG = {
    // Physics
    GRAVITY: 0.6,
    FRICTION: 0.85,
    PLAYER_SPEED: 5,
    JUMP_FORCE: -14,
    MAX_FALL_SPEED: 15,
    SLEEP_DELAY: 3000,

    // Canvas
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 500,

    // Block cooldown in milliseconds
    BLOCK_COOLDOWN: 2000,

    // Colors - Retro Theme
    COLORS: {
        player: '#00d9ff',
        playerOutline: '#0099cc',
        playerEyes: '#ffffff',
        playerPupils: '#1a1a2e',
        playerShocked: '#ff6b6b',
        playerLookUp: '#7bed9f',
        playerCoding: '#9b59b6',
        floor: '#4a4a6a',
        floorTop: '#5a5a7a',
        floorPattern: '#3a3a5a',
        block: '#e94560',
        blockHighlight: '#ff6b8a',
        blockShadow: '#b33350',
        blockPattern: '#d13a55',
        blockCooldown: '#666666',
        contactBlock: '#00d9ff',
        contactHighlight: '#4de8ff',
        contactShadow: '#0099cc',
        questionMark: '#ffd93d',
        particle: '#ffd93d',
        sky: ['#1a1a2e', '#2d2d44', '#3d3d5c']
    },

    // Animation
    FRAME_DURATION: 100
};

// ============ PROJECT DATA ============
const PROJECTS = [
    {
        id: 1,
        title: { en: "TerraStudio", es: "TerraStudio" },
        description: {
            en: [
                "A real estate web platform with data analytics applied to marketing.",
                "Features a custom SQLite database and full-stack architecture developed with Python and Django."
            ],
            es: [
                "Plataforma web inmobiliaria con analítica de datos aplicada al marketing.",
                "Cuenta con una base de datos SQLite personalizada y arquitectura full-stack desarrollada con Python y Django."
            ]
        },
        techStack: ["Python", "Django", "SQLite", "JavaScript", "CSS3"],
        liveUrl: "https://terrastudio.cl",
        sourceUrl: "https://github.com/luciluz/terrastudio"
    },
    {
        id: 2,
        title: { en: "Psiconexo", es: "Psiconexo" },
        description: {
            en: [
                "Appointment management system for psychologists.",
                "Built with a scalable architecture using Go for the backend."
            ],
            es: [
                "Sistema de gestión de turnos para psicólogos.",
                "Construido con una arquitectura escalable utilizando Go en el backend."
            ]
        },
        techStack: ["Go (Golang)", "HTML5", "CSS3", "JavaScript"],
        liveUrl: "#",
        sourceUrl: "https://github.com/luciluz/psiconexo"
    },
    {
        id: 3,
        title: { en: "Portfolio Quest", es: "Portfolio Quest" },
        description: {
            en: [
                "This interactive gamified portfolio.",
                "Features a custom 2D physics engine, collision detection, and HTML5 Canvas rendering."
            ],
            es: [
                "Este portafolio interactivo gamificado.",
                "Motor de físicas 2D personalizado, detección de colisiones y renderizado en Canvas."
            ]
        },
        techStack: ["JavaScript", "HTML5 Canvas", "CSS3", "Game Dev"],
        liveUrl: "#",
        sourceUrl: "https://github.com/luciluz/portfolio-quest"
    },
    {
        id: 4,
        title: { en: "Data Science Labs", es: "Laboratorio Data Science" },
        description: {
            en: [
                "A comprehensive repository of data science implementations.",
                "Includes Mathematical optimization, Deep Learning, and Data Quality processes."
            ],
            es: [
                "Repositorio integral de implementaciones de ciencia de datos.",
                "Incluye Optimización matemática, Deep Learning y procesos de Calidad de Datos."
            ]
        },
        techStack: ["Python", "PyTorch", "Pandas", "Scikit-learn", "Jupyter"],
        liveUrl: "#",
        sourceUrl: "https://github.com/luciluz/data_science"
    }
];

// ============ CONTACT DATA ============
const CONTACT_INFO = {
    title: { en: "Let's Connect!", es: "¡Conectemos!" },
    description: {
        en: ["Feel free to reach out!", "I'm always open to new opportunities and collaborations."],
        es: ["¡No dudes en contactarme!", "Siempre estoy abierto a nuevas oportunidades y colaboraciones."]
    },
    links: [
        { type: 'github', label: 'GitHub', url: 'https://github.com/luciluz', icon: '🐙' },
        { type: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/luciruzveloso/', icon: '💼' },
        { type: 'email', label: 'Email', url: '#', icon: '✉️', email: 'luciruzveloso@gmail.com' }
    ]
};

// ============ SOUND MANAGER CLASS ============
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.muted = true;
        this.bgmPlaying = false;
        this.masterVolume = 0.3;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return true;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Resume context if suspended (browser autoplay policy)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            this.initialized = true;
            console.log('🔊 Audio system initialized and resumed');
            return true;
        } catch (e) {
            console.warn('Audio not supported:', e);
            this.enabled = false;
            return false;
        }
    }

    getVolume() {
        return this.muted ? 0 : this.masterVolume;
    }

    createBeep(frequency, duration, type = 'square', volume = 0.3) {
        if (!this.audioContext || !this.enabled || this.muted) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        const actualVolume = volume * this.getVolume();
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(actualVolume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playJump() {
        if (!this.audioContext) this.init();
        this.createBeep(400, 0.1, 'square', 0.2);
        setTimeout(() => this.createBeep(600, 0.1, 'square', 0.2), 50);
    }

    playBump() {
        if (!this.audioContext) this.init();
        this.createBeep(150, 0.15, 'square', 0.4);
        setTimeout(() => {
            this.createBeep(800, 0.05, 'sine', 0.3);
            this.createBeep(1000, 0.1, 'sine', 0.2);
        }, 30);
    }

    playCoin() {
        if (!this.audioContext) this.init();
        this.createBeep(988, 0.1, 'square', 0.25);
        setTimeout(() => this.createBeep(1319, 0.3, 'square', 0.25), 100);
    }

    playShocked() {
        if (!this.audioContext) this.init();
        this.createBeep(500, 0.08, 'sawtooth', 0.15);
        this.createBeep(700, 0.08, 'sawtooth', 0.15);
    }

    playDialogBlip() {
        if (!this.audioContext) this.init();
        this.createBeep(1500 + Math.random() * 200, 0.03, 'triangle', 0.02);
    }

    playBGM() {
        // Disabled by user request
        return;

        if (!this.audioContext) this.init();
        if (!this.enabled || this.bgmPlaying) return;
        this.bgmPlaying = true;
        this.playBGMLoop();
    }

    playBGMLoop() {
        if (!this.bgmPlaying || !this.enabled || this.muted) return;

        const melody = [
            { freq: 523, dur: 0.15 }, { freq: 659, dur: 0.15 }, { freq: 784, dur: 0.15 }, { freq: 659, dur: 0.15 },
            { freq: 523, dur: 0.15 }, { freq: 392, dur: 0.15 }, { freq: 523, dur: 0.3 }, { freq: 0, dur: 0.1 },
            { freq: 587, dur: 0.15 }, { freq: 698, dur: 0.15 }, { freq: 880, dur: 0.15 }, { freq: 698, dur: 0.15 },
            { freq: 587, dur: 0.15 }, { freq: 440, dur: 0.15 }, { freq: 587, dur: 0.3 }, { freq: 0, dur: 0.1 },
            { freq: 659, dur: 0.2 }, { freq: 784, dur: 0.2 }, { freq: 880, dur: 0.4 }, { freq: 0, dur: 0.2 },
            { freq: 784, dur: 0.15 }, { freq: 659, dur: 0.15 }, { freq: 523, dur: 0.3 }, { freq: 0, dur: 0.3 },
        ];

        let time = 0;
        melody.forEach(note => {
            if (note.freq > 0) {
                setTimeout(() => {
                    if (this.bgmPlaying && !this.muted) {
                        this.createBeep(note.freq, note.dur * 0.85, 'square', 0.08);
                        if (note.freq > 500) this.createBeep(note.freq / 2, note.dur * 0.5, 'triangle', 0.05);
                    }
                }, time * 1000);
            }
            time += note.dur;
        });

        setTimeout(() => {
            if (this.bgmPlaying) this.playBGMLoop();
        }, time * 1000);
    }

    stopBGM() {
        this.bgmPlaying = false;
    }

    toggleMute() {
        if (!this.audioContext) this.init();

        this.muted = !this.muted;

        if (this.muted) {
            this.stopBGM();
        } else {
            this.playBGM();
        }

        updateMuteButton();
        return this.muted;
    }

    toggleBGM() {
        if (this.bgmPlaying) {
            this.stopBGM();
        } else {
            this.playBGM();
        }
    }

    playSnore() {
        if (!this.audioContext) this.init();
        if (this.muted || !this.enabled) return;
        this.createBeep(80, 0.8, 'sawtooth', 0.05);
        setTimeout(() => this.createBeep(70, 0.8, 'sawtooth', 0.05), 50);
    }

    playHappy() {
        if (!this.audioContext) this.init();
        // Dos notas agudas y rápidas
        this.createBeep(880, 0.1, 'sine', 0.1);
        setTimeout(() => this.createBeep(1100, 0.2, 'sine', 0.1), 100);
    }
}

const soundManager = new SoundManager();

// ============ SPRITE CLASS ============
class Sprite {
    constructor(config) {
        this.states = config.states || {};
        this.currentState = config.initialState || PlayerState.IDLE;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDuration = config.frameDuration || CONFIG.FRAME_DURATION;
        this.width = config.width || 40;
        this.height = config.height || 50;
        this.facingRight = true;
    }

    update(deltaTime) {
        const stateData = this.states[this.currentState];
        if (!stateData || !stateData.frames || stateData.frames.length <= 1) return;

        this.frameTimer += deltaTime;
        const duration = stateData.frameDuration || this.frameDuration;

        if (this.frameTimer >= duration) {
            this.frameTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % stateData.frames.length;
        }
    }

    setState(newState) {
        if (this.currentState !== newState && this.states[newState]) {
            this.currentState = newState;
            this.currentFrame = 0;
            this.frameTimer = 0;
        }
    }

    draw(ctx, x, y, scale = 1) {
        const stateData = this.states[this.currentState];
        if (!stateData) return;

        ctx.save();
        if (!this.facingRight) {
            ctx.translate(x + this.width * scale, y);
            ctx.scale(-1, 1);
            ctx.translate(-x, -y);
        }
        if (stateData.draw) {
            stateData.draw(ctx, x, y, scale, this.currentFrame, this);
        }
        ctx.restore();
    }
}

// ============ CREATE PLAYER SPRITE ============
function createPlayerSprite() {
    return new Sprite({
        width: 40,
        height: 50,
        initialState: PlayerState.IDLE,
        frameDuration: 150,
        states: {
            [PlayerState.IDLE]: { frames: [0, 1], frameDuration: 500, draw: drawPlayerIdle },
            [PlayerState.RUN]: { frames: [0, 1, 2, 1], frameDuration: 100, draw: drawPlayerRun },
            [PlayerState.JUMP]: { frames: [0], frameDuration: 200, draw: drawPlayerJump },
            [PlayerState.LOOK_UP]: { frames: [0, 1], frameDuration: 300, draw: drawPlayerLookUp },
            [PlayerState.SHOCKED]: { frames: [0, 1], frameDuration: 100, draw: drawPlayerShocked },
            [PlayerState.HAPPY]: { frames: [0], frameDuration: 1000, draw: drawPlayerHappy },
            [PlayerState.SLEEP]: { frames: [0, 1], frameDuration: 1000, draw: drawPlayerSleep }
        }
    });
}

// ============ PIRATE SPRITE DRAW FUNCTIONS ============

// Helper: Calculate pupil offset toward mouse
function calcEyeOffset(playerX, playerY, eyeCenterX, eyeCenterY, maxOffset, scale) {
    if (!mouse.onCanvas) return { ox: 0, oy: 0 };
    const dx = mouse.x - (playerX / scale + eyeCenterX);
    const dy = mouse.y - (playerY / scale + eyeCenterY);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return { ox: 0, oy: 0 };
    const factor = Math.min(1, dist / 200);
    return {
        ox: (dx / dist) * maxOffset * factor * scale,
        oy: (dy / dist) * maxOffset * factor * scale
    };
}

// ============ ROBOT DRAWING FUNCTIONS ============

// Función Base: Dibuja el cuerpo y cabeza del robot
// (Las animaciones usarán esto y le agregarán ojos/piernas)
function drawPlayerBase(ctx, x, y, scale, colorOverride = null) {
    const w = 40 * scale;
    const h = 50 * scale;
    const baseColor = colorOverride || CONFIG.COLORS.player;
    const outlineColor = CONFIG.COLORS.playerOutline;

    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = outlineColor;
    ctx.fillStyle = baseColor;

    // 1. CUERPO (Rectángulo redondeado)
    ctx.beginPath();
    ctx.roundRect(x + 4 * scale, y + 20 * scale, w - 8 * scale, h - 28 * scale, 6 * scale);
    ctx.fill();
    ctx.stroke();

    // 2. CABEZA
    ctx.beginPath();
    ctx.roundRect(x + 2 * scale, y, w - 4 * scale, 24 * scale, 8 * scale);
    ctx.fill();
    ctx.stroke();
}

function drawPlayerIdle(ctx, x, y, scale, frame) {
    const w = 40 * scale;
    const h = 50 * scale;

    // 1. Base
    drawPlayerBase(ctx, x, y, scale);

    // 2. Ojos (Con seguimiento de mouse)
    const eyeY = y + 12 * scale;
    ctx.fillStyle = CONFIG.COLORS.playerEyes;
    ctx.beginPath();
    ctx.arc(x + w * 0.35, eyeY, 5 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.65, eyeY, 5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Pupilas
    let pOx1 = 0, pOy1 = 0, pOx2 = 0, pOy2 = 0;
    // Usamos tu función existente calcEyeOffset
    if (mouse.onCanvas) {
        const off1 = calcEyeOffset(x, y, w * 0.35 / scale, 12, 2.5, scale);
        const off2 = calcEyeOffset(x, y, w * 0.65 / scale, 12, 2.5, scale);
        pOx1 = off1.ox; pOy1 = off1.oy;
        pOx2 = off2.ox; pOy2 = off2.oy;
    }

    ctx.fillStyle = CONFIG.COLORS.playerPupils;
    ctx.beginPath();
    ctx.arc(x + w * 0.35 + pOx1, eyeY + pOy1, 2.5 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.65 + pOx2, eyeY + pOy2, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // 3. Piernas (Estáticas)
    ctx.fillStyle = CONFIG.COLORS.player;
    ctx.strokeStyle = CONFIG.COLORS.playerOutline;
    ctx.fillRect(x + 8 * scale, y + h - 10 * scale, 10 * scale, 10 * scale); // Izq
    ctx.strokeRect(x + 8 * scale, y + h - 10 * scale, 10 * scale, 10 * scale);
    ctx.fillRect(x + w - 18 * scale, y + h - 10 * scale, 10 * scale, 10 * scale); // Der
    ctx.strokeRect(x + w - 18 * scale, y + h - 10 * scale, 10 * scale, 10 * scale);
}

function drawPlayerSleep(ctx, x, y, scale, frame) {
    const w = 40 * scale;
    const h = 50 * scale;
    const breath = Math.sin(Date.now() / 500) * 2 * scale;
    drawPlayerBase(ctx, x, y + breath, scale);
    ctx.strokeStyle = CONFIG.COLORS.playerPupils;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.25, y + 12 * scale + breath);
    ctx.lineTo(x + w * 0.45, y + 12 * scale + breath);
    ctx.moveTo(x + w * 0.55, y + 12 * scale + breath);
    ctx.lineTo(x + w * 0.75, y + 12 * scale + breath);
    ctx.stroke();

    const zOffset = (Date.now() % 2000) / 50;
    const zAlpha = 1 - ((Date.now() % 2000) / 2000);

    ctx.fillStyle = `rgba(255, 255, 255, ${zAlpha})`;
    ctx.font = `bold ${12 * scale}px sans-serif`;
    ctx.fillText("Z", x + w, y - zOffset * scale);

    if (Math.abs(breath - 1.9 * scale) < 0.1 * scale && soundManager) {
        const now = Date.now();
        if (!player.lastSnoreTime || now - player.lastSnoreTime > 2000) {
            soundManager.playSnore();
            player.lastSnoreTime = now;
        }
    }
}

function drawPlayerRun(ctx, x, y, scale, frame) {
    const w = 40 * scale;
    const h = 50 * scale;
    const bob = (frame % 2) * 2 * scale; // Efecto rebote al correr

    // 1. Base (con rebote)
    drawPlayerBase(ctx, x, y - bob, scale);

    // 2. Ojos (Simple, sin tracking intenso al correr)
    ctx.fillStyle = CONFIG.COLORS.playerEyes;
    ctx.beginPath();
    ctx.arc(x + w * 0.35, y + 12 * scale - bob, 5 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.65, y + 12 * scale - bob, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = CONFIG.COLORS.playerPupils;
    ctx.beginPath(); // Mirando al frente
    ctx.arc(x + w * 0.40, y + 12 * scale - bob, 2.5 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.70, y + 12 * scale - bob, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // 3. Piernas (Animadas)
    const legOffset = (frame % 2 === 0) ? 0 : 4 * scale;
    ctx.fillStyle = CONFIG.COLORS.player;
    ctx.strokeStyle = CONFIG.COLORS.playerOutline;

    // Pierna Izq
    ctx.fillRect(x + 8 * scale, y + h - 10 * scale - legOffset, 10 * scale, 10 * scale);
    ctx.strokeRect(x + 8 * scale, y + h - 10 * scale - legOffset, 10 * scale, 10 * scale);
    // Pierna Der (Inversa)
    ctx.fillRect(x + w - 18 * scale, y + h - 14 * scale + legOffset, 10 * scale, 10 * scale);
    ctx.strokeRect(x + w - 18 * scale, y + h - 14 * scale + legOffset, 10 * scale, 10 * scale);
}

function drawPlayerJump(ctx, x, y, scale) {
    const w = 40 * scale;
    const h = 50 * scale;

    // 1. Dibujamos la base
    drawPlayerBase(ctx, x, y, scale);

    // 2. Ojos (Parte Blanca)
    ctx.fillStyle = CONFIG.COLORS.playerEyes;
    ctx.beginPath();
    ctx.ellipse(x + w * 0.35, y + 10 * scale, 5 * scale, 7 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.65, y + 10 * scale, 5 * scale, 7 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. PUPILAS
    ctx.fillStyle = CONFIG.COLORS.playerPupils;
    ctx.beginPath();
    ctx.arc(x + w * 0.35, y + 8 * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.65, y + 8 * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // 4. Piernas encogidas
    ctx.fillStyle = CONFIG.COLORS.player;
    ctx.strokeStyle = CONFIG.COLORS.playerOutline;

    // Pierna Izquierda subida
    ctx.fillRect(x + 8 * scale, y + h - 14 * scale, 10 * scale, 8 * scale);
    ctx.strokeRect(x + 8 * scale, y + h - 14 * scale, 10 * scale, 8 * scale);

    // Pierna Derecha subida
    ctx.fillRect(x + w - 18 * scale, y + h - 14 * scale, 10 * scale, 8 * scale);
    ctx.strokeRect(x + w - 18 * scale, y + h - 14 * scale, 10 * scale, 8 * scale);
}

function drawPlayerLookUp(ctx, x, y, scale) {
    // Usamos el diseño Idle pero mirando arriba
    drawPlayerIdle(ctx, x, y - 2 * scale, scale, 0);
}

function drawPlayerHappy(ctx, x, y, scale, frame, sprite) {
    const w = 40 * scale;
    const h = 50 * scale;

    // 1. Cuerpo Base
    drawPlayerBase(ctx, x, y, scale);

    // 2. Ojos Felices (^ ^)
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = CONFIG.COLORS.playerPupils;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.25, y + 14 * scale);
    ctx.lineTo(x + w * 0.35, y + 10 * scale);
    ctx.lineTo(x + w * 0.45, y + 14 * scale);
    ctx.moveTo(x + w * 0.55, y + 14 * scale);
    ctx.lineTo(x + w * 0.65, y + 10 * scale);
    ctx.lineTo(x + w * 0.75, y + 14 * scale);
    ctx.stroke();

    // 3. Sonrisa
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 18 * scale, 4 * scale, 0, Math.PI);
    ctx.stroke();

    // 4. GLOBO DE DIÁLOGO
    ctx.save();

    let textScaleX = 1;
    if (sprite && !sprite.facingRight) {
        textScaleX = -1;
    }

    const text = t('itsMe');
    ctx.font = `bold ${12 * scale}px sans-serif`;
    const textWidth = ctx.measureText(text).width;
    const bubbleW = textWidth + 20 * scale;
    const bubbleH = 25 * scale;

    // Calculamos el centro del globo para poder rotarlo/invertirlo desde ahí si hace falta
    const bubbleCenterX = x + w / 2;
    const bubbleY = y - bubbleH - 10 * scale;

    // Dibujamos el globo
    ctx.fillStyle = 'white';

    // Aquí aplicamos la des-inversión si es necesario
    ctx.translate(bubbleCenterX, bubbleY + bubbleH / 2);
    ctx.scale(textScaleX, 1);
    ctx.translate(-bubbleCenterX, -(bubbleY + bubbleH / 2));

    // Caja del globo (Centrada en 0,0 relativo a la transformación anterior)
    ctx.beginPath();
    ctx.roundRect(bubbleCenterX - bubbleW / 2, bubbleY, bubbleW, bubbleH, 5 * scale);
    ctx.fill();

    // Pico del globo
    ctx.beginPath();
    ctx.moveTo(bubbleCenterX, bubbleY + bubbleH);
    ctx.lineTo(bubbleCenterX - 5 * scale, bubbleY + bubbleH + 5 * scale);
    ctx.lineTo(bubbleCenterX + 5 * scale, bubbleY + bubbleH);
    ctx.fill();

    // Texto
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, bubbleCenterX, bubbleY + bubbleH / 2);

    ctx.restore();

    // 5. Piernas (Saltando de alegría)
    ctx.fillStyle = CONFIG.COLORS.player;
    ctx.strokeStyle = CONFIG.COLORS.playerOutline;
    ctx.fillRect(x + 4 * scale, y + h - 12 * scale, 10 * scale, 10 * scale);
    ctx.strokeRect(x + 4 * scale, y + h - 12 * scale, 10 * scale, 10 * scale);
    ctx.fillRect(x + w - 14 * scale, y + h - 12 * scale, 10 * scale, 10 * scale);
    ctx.strokeRect(x + w - 14 * scale, y + h - 12 * scale, 10 * scale, 10 * scale);
}

function drawPlayerShocked(ctx, x, y, scale, frame) {
    const w = 40 * scale;
    const h = 50 * scale;
    // Temblor
    const shake = (frame % 2 === 0) ? -2 * scale : 2 * scale;

    // Base Roja/Asustada
    drawPlayerBase(ctx, x + shake, y, scale, CONFIG.COLORS.playerShocked);

    // Ojos Grandes
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.35 + shake, y + 12 * scale, 7 * scale, 9 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.65 + shake, y + 12 * scale, 7 * scale, 9 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupilas Pequeñas (Susto)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + w * 0.35 + shake, y + 12 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.65 + shake, y + 12 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Boca "O"
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + w / 2 + shake, y + 25 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Signo !
    ctx.fillStyle = '#ffd93d';
    ctx.font = `bold ${14 * scale}px 'Press Start 2P'`;
    ctx.textAlign = 'center';
    ctx.fillText('!', x + w / 2 + shake, y - 5 * scale);

    // Piernas
    ctx.fillStyle = CONFIG.COLORS.playerShocked;
    ctx.strokeStyle = CONFIG.COLORS.playerOutline;
    ctx.fillRect(x + 8 * scale + shake, y + h - 10 * scale, 10 * scale, 10 * scale);
    ctx.strokeRect(x + 8 * scale + shake, y + h - 10 * scale, 10 * scale, 10 * scale);
    ctx.fillRect(x + w - 18 * scale + shake, y + h - 10 * scale, 10 * scale, 10 * scale);
    ctx.strokeRect(x + w - 18 * scale + shake, y + h - 10 * scale, 10 * scale, 10 * scale);
}

// ============ CANVAS SETUP ============
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const maxWidth = Math.min(CONFIG.CANVAS_WIDTH, window.innerWidth - 40);
    const ratio = CONFIG.CANVAS_HEIGHT / CONFIG.CANVAS_WIDTH;
    canvas.width = maxWidth;
    canvas.height = maxWidth * ratio;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getScale() {
    return canvas.width / CONFIG.CANVAS_WIDTH;
}

// ============ INPUT HANDLING ============
const keys = { left: false, right: false, jump: false };

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    // Close modal on navigation keys
    if (hudOpen && ['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 'd', 'w', 's'].includes(key)) {
        hideProjectModal();
    }

    switch (key) {
        case 'arrowleft': case 'a': keys.left = true; break;
        case 'arrowright': case 'd': keys.right = true; break;
        case 'arrowup': case 'w': case ' ':
            keys.jump = true;
            e.preventDefault();
            break;
        case 'm': soundManager.toggleBGM(); break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key.toLowerCase()) {
        case 'arrowleft': case 'a': keys.left = false; break;
        case 'arrowright': case 'd': keys.right = false; break;
        case 'arrowup': case 'w': case ' ': keys.jump = false; break;
    }
});

// Mouse tracking for eye movement
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scale = getScale();
    mouse.x = (e.clientX - rect.left) / scale;
    mouse.y = (e.clientY - rect.top) / scale;
    mouse.onCanvas = true;

    // Check neon sign hover
    const signWidth = 280, signHeight = 50;
    NEON_SIGN.isHovered = mouse.x >= NEON_SIGN.x - 20 && mouse.x <= NEON_SIGN.x + signWidth &&
        mouse.y >= NEON_SIGN.y - signHeight && mouse.y <= NEON_SIGN.y + 20;

    // Check contact sign hover
    // Position aligned with drawContactLabel (X=780, Y=NEON_SIGN.y)
    // Check contact sign hover
    // Position aligned with drawContactLabel (X=780, Y=NEON_SIGN.y + 40)
    const contactX = 780;
    const contactWidth = 250; // Increased width for larger font
    const contactHeight = 50; // Match signHeight

    // Use same offsets as NEON_SIGN (-20, +20 etc)
    // NEON_SIGN: y - 50 to y + 20. 
    // Contact Y base is NEON_SIGN.y + 40
    const contactYBase = NEON_SIGN.y + 40;

    CONTACT_SIGN.isHovered = mouse.x >= contactX - (contactWidth / 2) - 20 && mouse.x <= contactX + (contactWidth / 2) + 20 &&
        mouse.y >= contactYBase - contactHeight && mouse.y <= contactYBase + 20;

    // Note: collision logic above assumes 780 is Center X, because drawContactLabel uses textAlign='center'
    // drawContactLabel uses targetX = block.center. Block center is approx 770 (740 + 30).
    // Let's assume 780 is roughly the center we want to check around.
    // If text is centered at 780, range is 780 - width/2 to 780 + width/2.

    // Cursor pointer
    if (NEON_SIGN.isHovered || CONTACT_SIGN.isHovered) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
});
// Note: mouseleave listener ensures we don't get stuck in hover state
canvas.addEventListener('mouseleave', () => {
    mouse.onCanvas = false;
    NEON_SIGN.isHovered = false;
    CONTACT_SIGN.isHovered = false;
    // Also clear coding state if active
    player.isCoding = false;
});

// ============ TOUCH CONTROLS (Mobile) ============
let touchStartX = 0;
let touchStartTime = 0;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartTime = performance.now();
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartX;

    // Slide Threshold: 30px
    if (diffX < -30) {
        keys.left = true;
        keys.right = false;
    } else if (diffX > 30) {
        keys.right = true;
        keys.left = false;
    } else {
        // Stop if within deadzone
        keys.left = false;
        keys.right = false;
    }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const touchDuration = performance.now() - touchStartTime;
    const touchEndX = e.changedTouches[0].clientX;
    const totalDist = Math.abs(touchEndX - touchStartX);

    // Stop movement
    keys.left = false;
    keys.right = false;

    // Check for Tap (Jump)
    // Short duration (< 200ms) and minimal movement (< 10px)
    if (touchDuration < 200 && totalDist < 10) {
        keys.jump = true;
        // Reset jump key shortly after to prevent infinite jump
        setTimeout(() => keys.jump = false, 150);
    }
});

// ============ DYNAMIC INSTRUCTIONS ============
function checkMobileInstructions() {
    const instructions = document.getElementById('instructions-text');
    const isMobile = window.innerWidth < 800 || 'ontouchstart' in window;

    if (isMobile) {
        instructions.textContent = currentLang === 'en'
            ? "Tap to JUMP | Slide to MOVE"
            : "Toca para SALTAR | Desliza para MOVER";
    } else {
        instructions.textContent = currentLang === 'en'
            ? "Use ← → or A D to move | ↑ W SPACE to jump"
            : "Usa ← → o A D para moverte | ↑ W ESPACIO para saltar";
    }
}

// Call on load and resize
checkMobileInstructions();
window.addEventListener('resize', () => {
    resizeCanvas();
    checkMobileInstructions();
});

// Initialize audio on first interaction
const initAudioOnInteraction = async () => {
    await soundManager.init();
    soundManager.playBGM();
};
document.addEventListener('click', initAudioOnInteraction, { once: true });
document.addEventListener('keydown', initAudioOnInteraction, { once: true });

// ============ PLAYER CLASS ============
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.facingRight = true;
        this.sprite = createPlayerSprite();
        this.forcedState = null;
        this.lastTime = performance.now();
        this.prevY = y;
        this.sprite = createPlayerSprite();
        this.lastActionTime = Date.now();
        this.lastSnoreTime = 0;
    }

    setForcedState(state) {
        this.forcedState = state;
        if (state) this.sprite.setState(state);
    }

    clearForcedState() {
        this.forcedState = null;
    }

    update(platforms, blocks) {
        // NaN safety check - respawn if coordinates break
        if (isNaN(this.x) || isNaN(this.y) || isNaN(this.vx) || isNaN(this.vy)) {
            console.warn('Player NaN detected, respawning...');
            this.x = 430;
            this.y = 400;
            this.vx = 0;
            this.vy = 0;
        }

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Store previous Y before updating physics
        this.prevY = this.y;

        if (keys.left || keys.right || keys.jump || Math.abs(this.vx) > 0.1 || !this.onGround) {
            this.lastActionTime = Date.now();
        }

        if (this.forcedState) {
            this.sprite.update(deltaTime);
            return;
        }

        if (keys.left) {
            this.vx = -CONFIG.PLAYER_SPEED;
            this.facingRight = false;
        } else if (keys.right) {
            this.vx = CONFIG.PLAYER_SPEED;
            this.facingRight = true;
        } else {
            this.vx *= CONFIG.FRICTION;
        }

        if (keys.jump && this.onGround) {
            this.vy = CONFIG.JUMP_FORCE;
            this.onGround = false;
            createParticles(this.x + this.width / 2, this.y + this.height, 5, '#00d9ff');
            soundManager.playJump();
        }

        this.vy += CONFIG.GRAVITY;
        if (this.vy > CONFIG.MAX_FALL_SPEED) this.vy = CONFIG.MAX_FALL_SPEED;

        this.x += this.vx;
        this.y += this.vy;

        // SCREEN WRAP - Infinite world
        if (this.x + this.width < 0) {
            this.x = CONFIG.CANVAS_WIDTH;
        } else if (this.x > CONFIG.CANVAS_WIDTH) {
            this.x = -this.width;
        }

        this.onGround = false;

        platforms.forEach(platform => {
            if (this.checkCollision(platform)) this.resolveCollision(platform);
        });

        blocks.forEach(block => {
            if (block.canTrigger() && this.checkCollision(block)) {
                this.resolveBlockCollision(block);
            }
        });

        this.updateSpriteState();
        this.sprite.facingRight = this.facingRight;
        this.sprite.update(deltaTime);

    }

    updateSpriteState() {
        if (this.forcedState) return;
        if (!this.onGround) {
            this.sprite.setState(PlayerState.JUMP);
        } else if (Math.abs(this.vx) > 0.5) {
            this.sprite.setState(PlayerState.RUN);
        } else {
            const timeInactive = Date.now() - this.lastActionTime;
            if (timeInactive > CONFIG.SLEEP_DELAY) {
                this.sprite.setState(PlayerState.SLEEP);
            } else {
                this.sprite.setState(PlayerState.IDLE);
            }
        }
    }

    checkCollision(obj) {
        return this.x < obj.x + obj.width && this.x + this.width > obj.x &&
            this.y < obj.y + obj.height && this.y + this.height > obj.y;
    }

    resolveCollision(platform) {
        // One-Way Platform Logic (Mario Style)
        // Only collide if:
        // 1. Moving downwards (velocity >= 0)
        // 2. Was previously above the platform (prevY + height <= platform.y)
        if (this.vy >= 0 && (this.prevY + this.height <= platform.y + 10)) {
            const overlapBottom = (this.y + this.height) - platform.y;
            if (overlapBottom > 0 && overlapBottom < 30) { // Small buffer
                this.y = platform.y - this.height;
                this.vy = 0;
                this.onGround = true;
            }
        }
    }

    resolveBlockCollision(block) {
        const overlapBottom = (this.y + this.height) - block.y;
        const overlapTop = (block.y + block.height) - this.y;
        const overlapLeft = (this.x + this.width) - block.x;
        const overlapRight = (block.x + block.width) - this.x;
        const minOverlap = Math.min(overlapBottom, overlapTop, overlapLeft, overlapRight);

        if (minOverlap === overlapTop && this.vy < 0) {
            this.y = block.y + block.height;
            this.vy = 2;
            block.trigger();
        } else if (minOverlap === overlapBottom && this.vy > 0) {
            this.y = block.y - this.height;
            this.vy = 0;
            this.onGround = true;
        } else if (minOverlap === overlapLeft) {
            this.x = block.x - this.width;
            this.vx = 0;
        } else if (minOverlap === overlapRight) {
            this.x = block.x + block.width;
            this.vx = 0;
        }
    }

    draw() {
        const scale = getScale();
        this.sprite.draw(ctx, this.x, this.y, scale);
    }
}

// ============ PLATFORM CLASS ============
class Platform {
    constructor(x, y, width, height, invisible = false) {
        this.x = x; this.y = y; this.width = width; this.height = height;
        this.invisible = invisible;
    }

    draw() {
        if (this.invisible) return; // Skip if invisible

        const scale = getScale();
        const x = this.x * scale, y = this.y * scale;
        const w = this.width * scale, h = this.height * scale;

        ctx.fillStyle = CONFIG.COLORS.floor;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = CONFIG.COLORS.floorTop;
        ctx.fillRect(x, y, w, 6 * scale);

        ctx.fillStyle = CONFIG.COLORS.floorPattern;
        const brickWidth = 40 * scale, brickHeight = 20 * scale;

        for (let row = 0; row < Math.ceil(h / brickHeight); row++) {
            const offset = row % 2 === 0 ? 0 : brickWidth / 2;
            for (let col = -1; col < Math.ceil(w / brickWidth) + 1; col++) {
                const bx = x + col * brickWidth + offset;
                const by = y + 6 * scale + row * brickHeight;
                if (bx < x + w && bx + brickWidth > x && by < y + h) {
                    ctx.strokeStyle = CONFIG.COLORS.floorPattern;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(bx, by, brickWidth, brickHeight);
                }
            }
        }
    }
}

// ============ BASE BLOCK CLASS ============
class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.cooldownEnd = 0;
        this.bounceOffset = 0;
        this.bounceVelocity = 0;
        this.glowIntensity = 0;
        this.glowDirection = 1;
    }

    canTrigger() {
        return Date.now() > this.cooldownEnd;
    }

    startCooldown() {
        this.cooldownEnd = Date.now() + CONFIG.BLOCK_COOLDOWN;
    }

    isOnCooldown() {
        return Date.now() < this.cooldownEnd;
    }

    getCooldownProgress() {
        if (!this.isOnCooldown()) return 1;
        const remaining = this.cooldownEnd - Date.now();
        return 1 - (remaining / CONFIG.BLOCK_COOLDOWN);
    }

    update() {
        if (this.bounceVelocity !== 0) {
            this.bounceOffset += this.bounceVelocity;
            this.bounceVelocity += 0.8;
            if (this.bounceOffset >= 0) {
                this.bounceOffset = 0;
                this.bounceVelocity = 0;
            }
        }

        if (!this.isOnCooldown()) {
            this.glowIntensity += 0.05 * this.glowDirection;
            if (this.glowIntensity >= 1 || this.glowIntensity <= 0) {
                this.glowDirection *= -1;
            }
        }
    }
}

// ============ INFO BLOCK CLASS (For ME Room) ============
class InfoBlock extends Block {
    constructor(x, y, symbol, options = {}) {
        super(x, y);
        this.symbol = symbol || '?';
        this.content = options; // { type, data, icon, color, glow }
        this.width = 60;
        this.height = 60;
    }

    trigger() {
        if (!this.canTrigger()) return;
        this.startCooldown();
        this.bounceVelocity = -8;
        createParticles(this.x + this.width / 2, this.y + this.height / 2, 15, CONFIG.COLORS.particle); // Default particle color
        soundManager.playBump();
        soundManager.playCoin();

        // Use generic showProjectModal
        showProjectModal(this.content.data);
    }

    draw() {
        const scale = getScale();
        const x = this.x * scale;
        const y = (this.y + this.bounceOffset) * scale;
        const w = this.width * scale;
        const h = this.height * scale;
        const onCooldown = this.isOnCooldown();

        // Custom Color or Gold Default
        const baseColor = this.content.color || '#FFD700';

        if (!onCooldown) {
            ctx.shadowColor = this.content.glow || baseColor;
            ctx.shadowBlur = 15 * this.glowIntensity;
        }

        const color = onCooldown ? CONFIG.COLORS.blockCooldown : baseColor;
        const highlight = onCooldown ? '#777' : 'rgba(255,255,255,0.4)';
        const shadow = onCooldown ? '#555' : 'rgba(0,0,0,0.2)';

        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);

        // 3D Bevels
        ctx.fillStyle = highlight;
        ctx.fillRect(x, y, w, 6 * scale);
        ctx.fillRect(x, y, 6 * scale, h);
        ctx.fillStyle = shadow;
        ctx.fillRect(x, y + h - 6 * scale, w, 6 * scale);
        ctx.fillRect(x + w - 6 * scale, y, 6 * scale, h);

        if (!onCooldown) {
            ctx.fillStyle = '#FFF'; // Symbol Color
            ctx.font = `bold ${24 * scale}px 'Press Start 2P', cursive`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Use custom icon if provided, else symbol
            const txt = this.content.icon || this.symbol;
            ctx.fillText(txt, x + w / 2, y + h / 2);
        } else {
            // Cooldown progress indicator
            const progress = this.getCooldownProgress();
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(x, y + h * (1 - progress), w, h * progress);
        }

        // Reset Shadow
        ctx.shadowBlur = 0;
    }
}

// ============ PROJECT BLOCK CLASS ============
class ProjectBlock extends Block {
    constructor(x, y, projectIndex) {
        super(x, y);
        this.projectIndex = projectIndex;
        this.project = PROJECTS[projectIndex];
    }

    trigger() {
        if (!this.canTrigger()) return;
        this.startCooldown();
        this.bounceVelocity = -8;
        createParticles(this.x + this.width / 2, this.y + this.height / 2, 15, CONFIG.COLORS.particle);
        soundManager.playBump();
        soundManager.playCoin();
        if (this.project.id === 3) {
            setTimeout(() => {
                soundManager.playHappy();
                if (Math.abs(player.vx) < 1) {
                    player.setForcedState(PlayerState.HAPPY);
                    setTimeout(() => {
                        player.clearForcedState();
                    }, 2000);
                }
            }, 500);
        }

        showProjectModal(this.project);
    }

    draw() {
        const scale = getScale();
        const x = this.x * scale;
        const y = (this.y + this.bounceOffset) * scale;
        const w = this.width * scale;
        const h = this.height * scale;
        const onCooldown = this.isOnCooldown();

        if (!onCooldown) {
            ctx.shadowColor = CONFIG.COLORS.block;
            ctx.shadowBlur = 15 * this.glowIntensity;
        }

        const color = onCooldown ? CONFIG.COLORS.blockCooldown : CONFIG.COLORS.block;
        const highlight = onCooldown ? '#777' : CONFIG.COLORS.blockHighlight;
        const shadow = onCooldown ? '#555' : CONFIG.COLORS.blockShadow;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = highlight;
        ctx.fillRect(x, y, w, 6 * scale);
        ctx.fillRect(x, y, 6 * scale, h);
        ctx.fillStyle = shadow;
        ctx.fillRect(x, y + h - 6 * scale, w, 6 * scale);
        ctx.fillRect(x + w - 6 * scale, y, 6 * scale, h);

        if (!onCooldown) {
            ctx.fillStyle = CONFIG.COLORS.questionMark;
            ctx.font = `bold ${24 * scale}px 'Press Start 2P', cursive`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', x + w / 2, y + h / 2);
        } else {
            // Cooldown progress indicator
            const progress = this.getCooldownProgress();
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(x + 10 * scale, y + h - 14 * scale, (w - 20 * scale) * progress, 4 * scale);
        }

        ctx.shadowBlur = 0;
        // Mini-label removed as per user request
        // ctx.fillStyle = onCooldown ? '#888' : '#fff';
        // ctx.font = `${10 * scale}px 'Press Start 2P', cursive`;
        // ctx.textAlign = 'center';
        // ctx.fillText(`P${this.projectIndex + 1}`, x + w / 2, y - 8 * scale);
    }
}

// ============ CONTACT BLOCK CLASS ============
class ContactBlock extends Block {
    constructor(x, y) {
        super(x, y);
    }

    trigger() {
        if (!this.canTrigger()) return;
        this.startCooldown();
        this.bounceVelocity = -8;
        createParticles(this.x + this.width / 2, this.y + this.height / 2, 15, '#00d9ff');
        soundManager.playBump();
        soundManager.playCoin();
        showContactModal();
    }

    draw() {
        const scale = getScale();
        const x = this.x * scale;
        const y = (this.y + this.bounceOffset) * scale;
        const w = this.width * scale;
        const h = this.height * scale;
        const onCooldown = this.isOnCooldown();

        if (!onCooldown) {
            ctx.shadowColor = CONFIG.COLORS.contactBlock;
            ctx.shadowBlur = 15 * this.glowIntensity;
        }

        const color = onCooldown ? CONFIG.COLORS.blockCooldown : CONFIG.COLORS.contactBlock;
        const highlight = onCooldown ? '#777' : CONFIG.COLORS.contactHighlight;
        const shadow = onCooldown ? '#555' : CONFIG.COLORS.contactShadow;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = highlight;
        ctx.fillRect(x, y, w, 6 * scale);
        ctx.fillRect(x, y, 6 * scale, h);
        ctx.fillStyle = shadow;
        ctx.fillRect(x, y + h - 6 * scale, w, 6 * scale);
        ctx.fillRect(x + w - 6 * scale, y, 6 * scale, h);

        if (!onCooldown) {
            ctx.fillStyle = '#fff';
            ctx.font = `${20 * scale}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('📧', x + w / 2, y + h / 2);
        } else {
            const progress = this.getCooldownProgress();
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(x + 10 * scale, y + h - 14 * scale, (w - 20 * scale) * progress, 4 * scale);
        }

        ctx.shadowBlur = 0;
        // Mini-label removed as per user request
        // ctx.fillStyle = onCooldown ? '#888' : '#fff';
        // ctx.font = `${8 * scale}px 'Press Start 2P', cursive`;
        // ctx.textAlign = 'center';
        // ctx.fillText('CONTACT', x + w / 2, y - 8 * scale);
    }
}

// ============ PARTICLE SYSTEM ============
const particles = [];

class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y;
        this.size = Math.random() * 6 + 2;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8 - 3;
        this.color = color;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.02;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.2;
        this.life -= this.decay;
    }

    draw() {
        const scale = getScale();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.fillRect(this.x * scale - this.size / 2, this.y * scale - this.size / 2, this.size * scale, this.size * scale);
        ctx.globalAlpha = 1;
    }
}

function createParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) particles.push(new Particle(x, y, color));
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) particles.splice(i, 1);
    }
}

function drawParticles() {
    particles.forEach(p => p.draw());
}

// ============ HUD PANEL HANDLING ============
const modalOverlay = document.getElementById('modal-overlay');
const projectModal = document.getElementById('project-modal');
const projectTitle = document.getElementById('project-title');
const projectDescription = document.getElementById('project-description');
const techTags = document.getElementById('tech-tags');
const projectLinks = document.getElementById('project-links');
const modalContent = document.getElementById('modal-content');

let hudOpen = false;
let gameState = 'MAIN';
let dialogueChunks = [];
let currentChunkIndex = 0;
let isTyping = false;
let typeInterval;

function typewriter(text, element, speed = 30) {
    element.innerHTML = '';
    isTyping = true;
    let i = 0;

    // Reset tech stack and links visibility during typing
    document.getElementById('tech-stack').style.opacity = '0';
    document.getElementById('project-links').style.opacity = '0';

    // Clear any existing interval to be safe
    clearInterval(typeInterval);

    typeInterval = setInterval(() => {
        element.textContent += text.charAt(i);
        soundManager.playDialogBlip();
        i++;
        if (i > text.length - 1) {
            clearInterval(typeInterval);
            isTyping = false;

            // Add blinking cursor if more chunks available
            if (currentChunkIndex < dialogueChunks.length - 1) {
                const cursor = document.createElement('span');
                cursor.className = 'blink-cursor';
                cursor.textContent = ' ▼';
                element.appendChild(cursor);
            } else {
                // Last chunk finished - show controls
                document.getElementById('tech-stack').style.transition = 'opacity 0.5s';
                document.getElementById('project-links').style.transition = 'opacity 0.5s';
                document.getElementById('tech-stack').style.opacity = '1';
                document.getElementById('project-links').style.opacity = '1';
            }
        }
    }, speed);
}


// ============ MOBILE RPG TYPEWRITER ============
let mobileTypingInterval;
let isMobileTyping = false;

function typeMobileText(text, elementId, speed = 20) {
    clearInterval(mobileTypingInterval);
    const target = document.getElementById(elementId);
    if (!target) return;

    target.textContent = '';
    isMobileTyping = true;

    let i = 0;
    mobileTypingInterval = setInterval(() => {
        target.textContent += text.charAt(i);
        // Optional: Play blip every few chars
        if (soundManager && i % 3 === 0) soundManager.playDialogBlip();
        i++;
        if (i >= text.length) {
            clearInterval(mobileTypingInterval);
            isMobileTyping = false;
        }
    }, speed);
}

function showProjectModal(project) {
    currentProjectId = project.id;
    // Localize
    const title = project.title[currentLang] || project.title['en'] || project.title;
    const descData = project.description[currentLang] || project.description['en'] || project.description;

    // Load full text
    dialogueChunks = Array.isArray(descData) ? descData : [descData];
    const fullDescription = dialogueChunks.join('<br>');

    // HYBRID SYSTEM
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // ==========================================
        // --- MOBILE: EXTERNAL PANEL ---
        // ==========================================
        const mobilePanel = document.getElementById('mobile-project-panel');

        // Populate Title
        document.getElementById('mobile-title').textContent = title;

        // Populate Description with RPG Typewriter
        typeMobileText(fullDescription, 'mobile-desc');

        // --- SAFE TECH STACK RENDER (Fix Crash) ---
        const mobileTechTags = document.getElementById('mobile-tech-stack');
        mobileTechTags.innerHTML = '';

        // Solo intentamos dibujar si techStack existe y tiene cosas inside
        if (project.techStack && Array.isArray(project.techStack) && project.techStack.length > 0) {
            mobileTechTags.style.display = 'flex';
            project.techStack.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                mobileTechTags.appendChild(tag);
            });
        } else {
            mobileTechTags.style.display = 'none'; // Ocultar si está vacío (Bio/Exp)
        }

        // --- UPDATE ACTIONS (Dynamic Rebuild) ---
        const actionsContainer = document.querySelector('.mobile-actions');
        actionsContainer.innerHTML = '';

        // Reset Style
        actionsContainer.style.display = 'flex';
        actionsContainer.style.flexDirection = 'row';
        actionsContainer.style.gap = '10px';
        actionsContainer.style.flexWrap = 'wrap';
        actionsContainer.style.justifyContent = 'center';

        // 1. Live Button (Solo si existe URL)
        if (project.liveUrl && project.liveUrl !== '#') {
            const liveBtn = document.createElement('a');
            liveBtn.className = 'btn btn-pink';
            liveBtn.href = project.liveUrl;
            liveBtn.target = '_blank';
            liveBtn.innerHTML = t('viewLive');
            liveBtn.style.flex = '1';
            actionsContainer.appendChild(liveBtn);
        }

        // 2. Source Button (Solo si existe URL)
        if (project.sourceUrl && project.sourceUrl !== '#') {
            const sourceBtn = document.createElement('a');
            sourceBtn.className = 'btn btn-cyan';
            sourceBtn.href = project.sourceUrl;
            sourceBtn.target = '_blank';
            sourceBtn.innerHTML = t('sourceCode');
            sourceBtn.style.flex = '1';
            actionsContainer.appendChild(sourceBtn);
        }

        // Si no se agregó ningún botón (caso Bio), ocultamos el contenedor de acciones
        if (actionsContainer.children.length === 0) {
            actionsContainer.style.display = 'none';
        }

        // VISIBILITY
        mobilePanel.classList.remove('hidden');
        mobilePanel.classList.add('active');
        hudOpen = true;

        modalOverlay.classList.add('hidden');
        projectModal.classList.remove('active');

        setTimeout(() => {
            mobilePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

    } else {
        // ==========================================
        // --- DESKTOP: OVERLAY MODAL ---
        // ==========================================
        projectTitle.textContent = title;

        clearInterval(typeInterval);
        isTyping = false;
        projectDescription.innerHTML = fullDescription;

        // --- SAFE TECH STACK RENDER (Fix Crash) ---
        const techStackContainer = document.getElementById('tech-stack');
        const techTags = document.getElementById('tech-tags'); // Asegúrate que este ID exista en tu HTML

        if (techStackContainer) {
            if (project.techStack && Array.isArray(project.techStack) && project.techStack.length > 0) {
                techStackContainer.style.display = 'block';
                techStackContainer.style.opacity = '1';
                techTags.innerHTML = ''; // Limpiar anteriores

                project.techStack.forEach(tech => {
                    const tag = document.createElement('span');
                    tag.className = 'tech-tag';
                    tag.textContent = tech;
                    tag.addEventListener('mouseenter', () => {
                        player.setForcedState(PlayerState.SHOCKED);
                        soundManager.playShocked(); // ¡Hará un ruido gracioso!
                    });
                    tag.addEventListener('mouseleave', () => {
                        player.clearForcedState();
                    });
                    techTags.appendChild(tag);
                });
            } else {
                // Si es Bio o Experiencia (sin tech), ocultamos la sección
                techStackContainer.style.display = 'none';
            }
        }

        // --- SAFE LINKS RENDER ---
        const linksContainer = document.getElementById('project-links');
        linksContainer.style.opacity = '1';
        linksContainer.innerHTML = ''; // Limpiar botones anteriores

        let hasLinks = false;

        // Botón Live
        if (project.liveUrl && project.liveUrl !== '#') {
            const btn = document.createElement('a');
            btn.href = project.liveUrl;
            btn.className = 'btn btn-pink';
            btn.target = '_blank';
            btn.innerText = t('viewLive');
            linksContainer.appendChild(btn);
            hasLinks = true;
        }

        // Botón Source
        if (project.sourceUrl && project.sourceUrl !== '#') {
            const btn = document.createElement('a');
            btn.href = project.sourceUrl;
            btn.className = 'btn btn-cyan';
            btn.target = '_blank';
            btn.innerText = t('sourceCode');
            linksContainer.appendChild(btn);
            hasLinks = true;
        }

        // Si no hay links, ocultamos el contenedor para que no ocupe espacio
        if (!hasLinks) {
            linksContainer.style.display = 'none';
        } else {
            linksContainer.style.display = 'flex'; // O 'block' según tu CSS
            linksContainer.style.gap = '10px';     // Añadir espacio si usas flex
        }

        modalOverlay.classList.remove('hidden');
        projectModal.classList.add('active');
        hudOpen = true;
    }
}

function refreshModalContent() {
    if (currentProjectId) {
        const project = PROJECTS.find(p => p.id === currentProjectId);
        if (project) {
            showProjectModal(project);
        }
    } else {
        // Contact modal logic if needed, but currently simplified
        showContactModal();
    }
}

function showContactModal() {
    currentProjectId = null;

    // Localize Data
    const title = CONTACT_INFO.title[currentLang] || CONTACT_INFO.title['en'];
    const descData = CONTACT_INFO.description[currentLang] || CONTACT_INFO.description['en'];
    const descText = Array.isArray(descData) ? descData.join(' ') : descData;

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // --- MOBILE: CONTACT PANEL ---
        const mobilePanel = document.getElementById('mobile-project-panel');

        // Set Title
        document.getElementById('mobile-title').textContent = title;

        // Type Description
        typeMobileText(descText, 'mobile-desc');

        // HIDE Tech Stack
        document.getElementById('mobile-tech-stack').style.display = 'none';

        // SHOW Actions and Populate
        const actionsContainer = document.querySelector('.mobile-actions');
        actionsContainer.style.display = 'flex';
        actionsContainer.style.flexDirection = 'column'; // Vertical Stack for Rows
        actionsContainer.style.gap = '15px';
        actionsContainer.innerHTML = '';

        // Row 1: Socials (Cyan)
        const socialRow = document.createElement('div');
        socialRow.style.display = 'flex';
        socialRow.style.gap = '10px';
        socialRow.style.justifyContent = 'center';

        // Row 2: Email (Pink)
        const emailRow = document.createElement('div');
        emailRow.style.display = 'flex';
        emailRow.style.justifyContent = 'center';

        CONTACT_INFO.links.forEach(link => {
            const btn = document.createElement('a');

            if (link.type === 'email') {
                btn.className = 'btn btn-pink'; // Pink for Email
                btn.href = '#';
                btn.innerHTML = `${link.icon} ${link.email} <i class="fas fa-copy" style="margin-left:5px"></i>`;
                btn.style.width = '100%';
                btn.style.textAlign = 'center';

                btn.onclick = (e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(link.email).then(() => {
                        const originalHTML = btn.innerHTML;
                        btn.innerHTML = `<i class="fas fa-check"></i> ${t('copied')}`;
                        setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
                    });
                };
                emailRow.appendChild(btn);
            } else {
                btn.className = 'btn btn-cyan'; // Cyan for Socials
                btn.target = '_blank';
                btn.innerHTML = `${link.icon} ${link.label}`;
                btn.href = link.url;
                socialRow.appendChild(btn);
            }
        });

        actionsContainer.appendChild(socialRow);
        actionsContainer.appendChild(emailRow);


        // SHOW PANEL
        mobilePanel.classList.remove('hidden');
        mobilePanel.classList.add('active');
        hudOpen = true;

        modalOverlay.classList.add('hidden');
        projectModal.classList.remove('active');

        setTimeout(() => {
            mobilePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

    } else {
        // --- DESKTOP: OVERLAY MODAL ---

        projectTitle.textContent = title;

        clearInterval(typeInterval);
        isTyping = false;
        projectDescription.innerHTML = descText;

        const techStackContainer = document.getElementById('tech-stack');
        if (techStackContainer) techStackContainer.style.display = 'none';
        document.getElementById('project-links').style.opacity = '1';

        projectLinks.innerHTML = '';

        // 1. Social Row (GitHub, LinkedIn) - Cyan
        const socialRow = document.createElement('div');
        socialRow.style.display = 'flex';
        socialRow.style.gap = '15px';
        socialRow.style.justifyContent = 'center';
        socialRow.style.marginBottom = '10px';

        // 2. Email Row (Email) - Pink
        const emailRow = document.createElement('div');
        emailRow.style.display = 'flex';
        emailRow.style.justifyContent = 'center';

        CONTACT_INFO.links.forEach(link => {
            const btn = document.createElement('a');

            if (link.type === 'email') {
                btn.className = 'btn btn-pink'; // Pink
                btn.href = '#';
                btn.innerHTML = `${link.icon} ${link.email} <i class="fas fa-copy" style="margin-left:5px"></i>`;
                btn.style.minWidth = '250px';
                btn.style.textAlign = 'center';

                btn.onclick = (e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(link.email).then(() => {
                        const originalHTML = btn.innerHTML;
                        btn.innerHTML = `<i class="fas fa-check"></i> ${t('copied')}`;
                        setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
                    });
                };
                emailRow.appendChild(btn);
            } else {
                btn.className = 'btn btn-cyan'; // Cyan
                btn.target = '_blank';
                btn.innerHTML = `${link.icon} ${link.label}`;
                btn.href = link.url;
                socialRow.appendChild(btn);
            }
        });

        const mainContainer = document.createElement('div');
        mainContainer.style.display = 'flex';
        mainContainer.style.flexDirection = 'column';
        mainContainer.appendChild(socialRow);
        mainContainer.appendChild(emailRow);

        projectLinks.appendChild(mainContainer);

        modalOverlay.classList.remove('hidden');
        projectModal.classList.add('active');
        hudOpen = true;
    }
}

function hideProjectModal() {
    // Hide Overlay (Desktop)
    modalOverlay.classList.add('hidden');
    projectModal.classList.remove('active');

    // Hide External Panel (Mobile)
    const mobilePanel = document.getElementById('mobile-project-panel');
    if (mobilePanel) {
        mobilePanel.classList.remove('active');
        mobilePanel.classList.add('hidden');
    }

    // Cleanup Mobile Typewriter
    clearInterval(mobileTypingInterval);
    isMobileTyping = false;

    // Reset Mobile Panel State for next open
    const mobileTechStack = document.getElementById('mobile-tech-stack');
    if (mobileTechStack) mobileTechStack.style.display = 'flex';
    const mobileActions = document.querySelector('.mobile-actions');
    if (mobileActions) mobileActions.style.display = 'flex';

    hudOpen = false;
    clearInterval(typeInterval);
    isTyping = false;
    player.clearForcedState();
}


modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) hideProjectModal();
});

// Tap-to-Advance / Skip Logic
modalContent.addEventListener('click', (e) => {
    // DESKTOP CHECK: Disable text advancement on desktop
    if (window.innerWidth > 768) return;

    // Ignore clicks on buttons/links/tags to allow interaction
    if (e.target.closest('a') || e.target.closest('.tech-tag')) return;

    if (isTyping) {
        // SKIP ANIMATION
        clearInterval(typeInterval);
        isTyping = false;
        projectDescription.textContent = dialogueChunks[currentChunkIndex];

        // Add blinking cursor if more chunks available
        if (currentChunkIndex < dialogueChunks.length - 1) {
            const cursor = document.createElement('span');
            cursor.className = 'blink-cursor';
            cursor.textContent = ' ▼';
            projectDescription.appendChild(cursor);
        } else {
            // Last chunk finished - show controls
            document.getElementById('tech-stack').style.transition = 'opacity 0.5s';
            document.getElementById('project-links').style.transition = 'opacity 0.5s';
            document.getElementById('tech-stack').style.opacity = '1';
            document.getElementById('project-links').style.opacity = '1';
        }
    } else {
        // ADVANCE TO NEXT CHUNK
        if (currentChunkIndex < dialogueChunks.length - 1) {
            currentChunkIndex++;
            typewriter(dialogueChunks[currentChunkIndex], projectDescription);
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideProjectModal();
});

// Handle Window Resize - Close modal to prevent mixed states
window.addEventListener('resize', () => {
    if (hudOpen) hideProjectModal();
});

// ============ MUTE BUTTON HANDLING ============
function updateMuteButton() {
    const btn = document.getElementById('mute-btn');
    if (btn) {
        btn.innerHTML = soundManager.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        btn.title = soundManager.muted ? 'Unmute' : 'Mute';
    }
}

// Setup mute button
// Setup mute button & Respawn
document.addEventListener('DOMContentLoaded', () => {
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            soundManager.toggleMute();
            updateMuteButton();
        });
        updateMuteButton();
    }

    // Respawn Button Listener
    const respawnBtn = document.getElementById('respawn-btn');
    if (respawnBtn) {
        respawnBtn.addEventListener('click', () => {
            location.reload();
        });
    }
});

// ============ BACKGROUND ============
function drawBackground() {
    const scale = getScale();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    [[50, 30], [150, 60], [300, 40], [450, 70], [600, 35], [750, 55], [850, 45], [100, 100], [400, 120], [700, 90]].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x * scale, y * scale, 2 * scale, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    [[100, 80, 60], [400, 50, 80], [700, 100, 50]].forEach(([x, y, size]) => {
        ctx.beginPath();
        ctx.arc(x * scale, y * scale, size * scale * 0.4, 0, Math.PI * 2);
        ctx.arc((x + size * 0.3) * scale, (y - size * 0.1) * scale, size * scale * 0.35, 0, Math.PI * 2);
        ctx.arc((x + size * 0.5) * scale, y * scale, size * scale * 0.3, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ============ NEON SIGN DRAWING ============
let neonPulse = 0;
function drawNeonSign() {
    const scale = getScale();
    neonPulse += 0.05;

    const color = NEON_SIGN.isHovered ? NEON_SIGN.hoverColor : NEON_SIGN.baseColor;
    const glowIntensity = NEON_SIGN.isHovered ? 25 + Math.sin(neonPulse * 3) * 10 : 15 + Math.sin(neonPulse) * 5;

    ctx.save();
    ctx.font = `bold ${28 * scale}px 'Press Start 2P', cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Glow layers
    ctx.shadowColor = color;
    ctx.shadowBlur = glowIntensity * scale;
    const signText = t('neonSign');
    ctx.fillStyle = color;
    ctx.fillText(signText, NEON_SIGN.x * scale + 140 * scale, NEON_SIGN.y * scale);

    // Bright center
    ctx.shadowBlur = 5 * scale;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(signText, NEON_SIGN.x * scale + 140 * scale, NEON_SIGN.y * scale);

    ctx.restore();
}

// Draw contact neon label (same style as projects)
function drawContactLabel() {
    const scale = getScale();
    ctx.save();

    // Find contact block to align text
    let targetX = 780 * scale;
    let targetY = NEON_SIGN.y * scale;

    // Attempt to find the ContactBlock to align perfectly if blocks exist
    if (typeof blocks !== 'undefined') {
        const contactBlock = blocks.find(b => b instanceof ContactBlock);
        if (contactBlock) {
            // Align horizontally to center of block
            targetX = (contactBlock.x + contactBlock.width / 2) * scale;
            // targetY = NEON_SIGN.y * scale; 
            // Move down 40px as requested
            targetY = (NEON_SIGN.y + 40) * scale;
        }
    }

    // Use CONTACT_SIGN config for colors
    const color = CONTACT_SIGN.isHovered ? CONTACT_SIGN.hoverColor : CONTACT_SIGN.baseColor;
    const glowIntensity = CONTACT_SIGN.isHovered ?
        25 + Math.sin(neonPulse * 3) * 10 :
        15 + Math.sin(neonPulse) * 5;

    ctx.shadowBlur = glowIntensity * scale; // Ensure * scale matches drawNeonSign
    ctx.shadowColor = color;
    ctx.fillStyle = color;

    // Strict Consistency: Match drawNeonSign exactly
    ctx.font = `bold ${28 * scale}px 'Press Start 2P', cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle'; // Match drawNeonSign

    // Label
    const labelText = t('contactLabel') || (currentLang === 'en' ? "CONTACT" : "CONTACTO");
    ctx.fillText(labelText, targetX, targetY);

    // Bright center pass
    // if (CONTACT_SIGN.isHovered) {  <-- Removed logic to match drawNeonSign
    ctx.shadowBlur = 5 * scale;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(labelText, targetX, targetY);
    // }

    ctx.restore();
}

// ============ CITY SKYLINE BACKGROUND ============
const buildings = [];
for (let i = 0; i < 15; i++) {
    buildings.push({
        x: i * 65 - 20,
        width: 40 + Math.random() * 30,
        height: 60 + Math.random() * 100,
        windows: Math.floor(Math.random() * 6) + 2
    });
}

function drawCity() {
    const scale = getScale();
    const theme = isNightMode ? THEME.night : THEME.day;

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
    skyGrad.addColorStop(0, theme.skyGradient[0]);
    skyGrad.addColorStop(0.5, theme.skyGradient[1]);
    skyGrad.addColorStop(1, theme.skyGradient[2]);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.85);

    // Sun/Moon
    ctx.fillStyle = theme.celestial.color;
    ctx.shadowColor = theme.celestial.color;
    ctx.shadowBlur = isNightMode ? 15 * scale : 30 * scale;
    ctx.beginPath();
    ctx.arc(800 * scale, 60 * scale, 25 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Buildings
    buildings.forEach(b => {
        const bx = b.x * scale;
        const bw = b.width * scale;
        const bh = b.height * scale;
        const by = canvas.height * 0.85 - bh;

        ctx.fillStyle = theme.buildingColor;
        ctx.fillRect(bx, by, bw, bh);

        // Windows
        ctx.fillStyle = theme.windowColor;
        const winSize = 5 * scale;
        const winGap = 10 * scale;
        for (let row = 0; row < b.windows; row++) {
            for (let col = 0; col < 2; col++) {
                const wx = bx + 8 * scale + col * winGap;
                const wy = by + 10 * scale + row * winGap;
                if (wy + winSize < by + bh - 5 * scale) {
                    ctx.fillRect(wx, wy, winSize, winSize);
                }
            }
        }
    });
}

// ============ GAME INITIALIZATION ============
// Spawn at center of main floor
const player = new Player(430, 400);

// Level layout: Adjusted spacing
const platforms = [
    new Platform(0, 460, 900, 50),           // Main floor
    new Platform(80, 360, 400, 20),          // Project platform (moved down 60px)
    new Platform(680, 380, 180, 18),         // Contact platform
    // Invisible Title Platforms (Moved up to stand ON TOP of text)
    new Platform(140, 83, 280, 10, true),    // Projects (Text Y=100)
    new Platform(655, 123, 250, 10, true)    // Contact (Text Y=140)
];

// Blocks with more room
const blocks = [
    new ProjectBlock(100, 180, 0),
    new ProjectBlock(190, 180, 1),
    new ProjectBlock(280, 180, 2),
    new ProjectBlock(370, 180, 3),
    new ContactBlock(740, 210),              // Moved up 50px
];

// ============ GAME LOOP ============

function drawMeDoor() {
    const scale = getScale();
    // Position: Between platforms. 
    // Left platform ends ~480. Right starts 680. Center area ~580. Y=460 (Main floor).
    // Door size ~50x70.
    const meDoor = { x: 580 * scale, y: 390 * scale, w: 50 * scale, h: 70 * scale };

    ctx.save();
    ctx.strokeStyle = '#00d9ff';
    ctx.shadowColor = '#00d9ff';
    ctx.shadowBlur = 10 * scale;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(meDoor.x, meDoor.y, meDoor.w, meDoor.h);

    // Text ME
    ctx.fillStyle = '#e94560'; // Pink
    ctx.font = `bold ${20 * scale}px 'Press Start 2P'`;
    ctx.textAlign = 'center';

    // Floating effect
    const floatY = Math.sin(Date.now() / 300) * 5 * scale;
    ctx.fillText("ME", meDoor.x + meDoor.w / 2, meDoor.y - 25 * scale + floatY);

    ctx.restore();
}

function gameLoop() {
    if (gameState === 'MAIN') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCity();  // City skyline background
        drawBackground();  // Stars/clouds
        drawNeonSign();
        drawContactLabel();  // Contact neon sign

        // Draw ME Door
        drawMeDoor();

        // Update
        player.update(platforms, blocks);
        blocks.forEach(block => block.update());
        updateParticles();

        // ME Door Logic
        const scale = getScale();
        const meDoor = { x: 580 * scale, y: 390 * scale, w: 50 * scale, h: 70 * scale };
        // Player hitbox center
        const px = player.x + player.width / 2;
        const py = player.y + player.height / 2;

        if (px > meDoor.x && px < meDoor.x + meDoor.w &&
            py > meDoor.y && py < meDoor.y + meDoor.h) {
            // Hint
            ctx.save();
            ctx.fillStyle = "white";
            ctx.font = `10px 'Press Start 2P'`;
            ctx.textAlign = 'center';
            ctx.fillText("Press UP", meDoor.x + meDoor.w / 2, meDoor.y - 50 * scale);
            ctx.restore();

            if (keys.jump && !hudOpen) { // keys.jump is usually UP/W/Space
                gameState = 'ME_ROOM';
                setupMeRoom();
                player.x = 500;
                player.y = 380;
                keys.jump = false;
            }
        }

        // Draw
        platforms.forEach(platform => platform.draw());
        blocks.forEach(block => block.draw());
        player.draw();
        drawParticles();

    } else if (gameState === 'ME_ROOM') {
        updateMeRoom();
        drawMeRoom();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

// ============ POLYFILL ============
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
}

console.log('🎮 Portfolio Quest v3.0 loaded!');
console.log('Screen wrap enabled - walk off one side, appear on the other!');
console.log('Blocks now have cooldowns and can be re-triggered!');


