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
        footer: '© 2026 Luciano Ruz | HTML5 Canvas'
    },
    es: {
        gameTitle: 'LUCIANO RUZ PORTFOLIO',
        instructions: 'Usa ← → o A D para moverte | ↑ W ESPACIO para saltar',
        hint: '💡 ¡Golpea los bloques desde abajo!',
        neonSign: 'PROYECTOS',
        contactLabel: 'CONTACTO',
        contactTitle: '¡Conectemos!',
        contactDesc: '¡No dudes en contactarme! Siempre estoy abierta a nuevas oportunidades.',
        viewLive: 'Ver Proyecto',
        sourceCode: 'Repositorio',
        techStackLabel: 'Tecnologías',
        hudLabel: 'Info del Proyecto',
        emailTooltip: 'luciruzvelos@gmail.com',
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
    CODING: 'CODING'
};

// ============ CONFIGURATION ============
const CONFIG = {
    // Physics
    GRAVITY: 0.6,
    FRICTION: 0.85,
    PLAYER_SPEED: 5,
    JUMP_FORCE: -14,
    MAX_FALL_SPEED: 15,

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
        en: [
            "Feel free to reach out!",
            "I'm always open to new opportunities and collaborations."
        ],
        es: [
            "¡No dudes en contactarme!",
            "Siempre estoy abierto a nuevas oportunidades y colaboraciones."
        ]
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
        this.muted = false;
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

    playCoding() {
        if (!this.audioContext) this.init();
        // Keyboard typing sounds
        this.createBeep(800, 0.03, 'square', 0.1);
        setTimeout(() => this.createBeep(900, 0.03, 'square', 0.1), 80);
        setTimeout(() => this.createBeep(850, 0.03, 'square', 0.1), 160);
    }

    playTypingSound() {
        if (!this.audioContext) this.init();
        // Short mechanical keyboard burst
        this.createBeep(1200, 0.02, 'square', 0.05);
        setTimeout(() => this.createBeep(1100, 0.02, 'square', 0.05), 50);
        setTimeout(() => this.createBeep(1300, 0.02, 'square', 0.05), 100);
    }

    playDialogBlip() {
        if (!this.audioContext) this.init();
        // Short high pitch blip for dialogue
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

        // Catchy 8-bit melody - upbeat and fun
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
                        // Add bass note
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
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBGM();
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
            [PlayerState.CODING]: { frames: [0, 1, 2, 1], frameDuration: 80, draw: drawPlayerCoding }
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

// Draw pirate base body (shirt/torso)
function drawPirateBody(ctx, x, y, scale, shirtColor = '#c0392b') {
    const w = 40 * scale;

    // Torso/shirt
    ctx.fillStyle = shirtColor;
    ctx.strokeStyle = '#922b21';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.roundRect(x + 6 * scale, y + 22 * scale, w - 12 * scale, 20 * scale, 4 * scale);
    ctx.fill();
    ctx.stroke();

    // Belt
    ctx.fillStyle = '#5d4e37';
    ctx.fillRect(x + 6 * scale, y + 36 * scale, w - 12 * scale, 5 * scale);
    ctx.fillStyle = '#ffd93d';  // Belt buckle
    ctx.fillRect(x + 16 * scale, y + 36 * scale, 8 * scale, 5 * scale);
}

// Draw pirate head with hat
function drawPirateHead(ctx, x, y, scale, yOffset = 0) {
    const w = 40 * scale;

    // Face (tan skin)
    ctx.fillStyle = '#e8beac';
    ctx.strokeStyle = '#c9a590';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.roundRect(x + 8 * scale, y + 8 * scale - yOffset, w - 16 * scale, 18 * scale, 6 * scale);
    ctx.fill();
    ctx.stroke();

    // Pirate hat - main part (black)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(x + 2 * scale, y + 12 * scale - yOffset);  // Left brim
    ctx.lineTo(x + w - 2 * scale, y + 12 * scale - yOffset);  // Right brim
    ctx.lineTo(x + w - 6 * scale, y + 2 * scale - yOffset);  // Right top
    ctx.lineTo(x + w / 2, y - 4 * scale - yOffset);  // Peak
    ctx.lineTo(x + 6 * scale, y + 2 * scale - yOffset);  // Left top
    ctx.closePath();
    ctx.fill();

    // Hat brim
    ctx.fillRect(x, y + 10 * scale - yOffset, w, 4 * scale);

    // Skull on hat
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 5 * scale - yOffset, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x + w / 2 - 2 * scale, y + 4 * scale - yOffset, 1.5 * scale, 2 * scale);
    ctx.fillRect(x + w / 2 + 0.5 * scale, y + 4 * scale - yOffset, 1.5 * scale, 2 * scale);
}

// Draw pirate eyes with tracking
function drawPirateEyes(ctx, x, y, scale, yOffset = 0) {
    const w = 40 * scale;

    // Eye whites
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.35, y + 16 * scale - yOffset, 5 * scale, 5 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.65, y + 16 * scale - yOffset, 5 * scale, 5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils with eye tracking
    const eye1 = calcEyeOffset(x, y, w * 0.35 / scale, 16, 2.5, scale);
    const eye2 = calcEyeOffset(x, y, w * 0.65 / scale, 16, 2.5, scale);

    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(x + w * 0.35 + eye1.ox, y + 16 * scale - yOffset + eye1.oy, 2.5 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.65 + eye2.ox, y + 16 * scale - yOffset + eye2.oy, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Eye patch option (just an outline for now)
    // ctx.strokeStyle = '#1a1a1a';
    // ctx.lineWidth = 2 * scale;
    // ctx.beginPath();
    // ctx.ellipse(x + w * 0.65, y + 16 * scale - yOffset, 6 * scale, 6 * scale, 0, 0, Math.PI * 2);
    // ctx.stroke();
}

// Draw legs - one normal, one peg leg
function drawPirateLegs(ctx, x, y, scale, leftOffset = 0, rightOffset = 0) {
    const w = 40 * scale;
    const h = 50 * scale;

    // Left leg (normal - brown pants)
    ctx.fillStyle = '#5d4e37';
    ctx.strokeStyle = '#4a3f2e';
    ctx.lineWidth = 1 * scale;
    ctx.fillRect(x + 8 * scale, y + h - 10 * scale + leftOffset, 10 * scale, 10 * scale);
    ctx.strokeRect(x + 8 * scale, y + h - 10 * scale + leftOffset, 10 * scale, 10 * scale);

    // Right leg (PEG LEG - wooden stick!)
    ctx.fillStyle = '#8b6914';  // Wood color
    ctx.strokeStyle = '#6b5210';
    ctx.fillRect(x + w - 14 * scale, y + h - 12 * scale + rightOffset, 4 * scale, 12 * scale);
    ctx.strokeRect(x + w - 14 * scale, y + h - 12 * scale + rightOffset, 4 * scale, 12 * scale);
    // Wood grain
    ctx.strokeStyle = '#5a4510';
    ctx.lineWidth = 0.5 * scale;
    ctx.beginPath();
    ctx.moveTo(x + w - 12 * scale, y + h - 10 * scale + rightOffset);
    ctx.lineTo(x + w - 12 * scale, y + h - 2 * scale + rightOffset);
    ctx.stroke();
}

// Draw sword on belt
function drawPirateSword(ctx, x, y, scale) {
    const w = 40 * scale;

    // Sword handle (on right side of belt)
    ctx.fillStyle = '#5d4e37';
    ctx.fillRect(x + w - 10 * scale, y + 34 * scale, 3 * scale, 8 * scale);

    // Sword blade (angled up)
    ctx.fillStyle = '#c0c0c0';
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(x + w - 8 * scale, y + 34 * scale);
    ctx.lineTo(x + w - 4 * scale, y + 24 * scale);
    ctx.lineTo(x + w - 6 * scale, y + 24 * scale);
    ctx.lineTo(x + w - 10 * scale, y + 34 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Guard
    ctx.fillStyle = '#ffd93d';
    ctx.fillRect(x + w - 12 * scale, y + 33 * scale, 7 * scale, 2 * scale);
}

function drawPlayerIdle(ctx, x, y, scale, frame) {
    const w = 40 * scale;
    const h = 50 * scale;
    const breathOffset = frame === 0 ? 0 : 1 * scale;

    // Body - blue rectangle
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x + 5 * scale, y + 15 * scale - breathOffset, w - 10 * scale, h - 25 * scale);

    // Head - blue rectangle
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x + 8 * scale, y + 5 * scale - breathOffset, w - 16 * scale, 15 * scale);

    // Pirate Hat - black triangle
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(x + 5 * scale, y + 8 * scale - breathOffset);
    ctx.lineTo(x + w - 5 * scale, y + 8 * scale - breathOffset);
    ctx.lineTo(x + w / 2, y - 5 * scale - breathOffset);
    ctx.closePath();
    ctx.fill();

    // Hat brim
    ctx.fillRect(x + 3 * scale, y + 6 * scale - breathOffset, w - 6 * scale, 4 * scale);

    // Eye whites
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + w * 0.35, y + 12 * scale - breathOffset, 4 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.65, y + 12 * scale - breathOffset, 4 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Pupils with tracking
    const eye1 = calcEyeOffset(x, y, w * 0.35 / scale, 12, 2, scale);
    const eye2 = calcEyeOffset(x, y, w * 0.65 / scale, 12, 2, scale);
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(x + w * 0.35 + eye1.ox, y + 12 * scale - breathOffset + eye1.oy, 2 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.65 + eye2.ox, y + 12 * scale - breathOffset + eye2.oy, 2 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Left leg - normal (blue)
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x + 10 * scale, y + h - 12 * scale, 8 * scale, 12 * scale);

    // Right leg - PEG LEG (brown wooden stick)
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x + w - 16 * scale, y + h - 14 * scale, 4 * scale, 14 * scale);
}

function drawPlayerRun(ctx, x, y, scale, frame) {
    const w = 40 * scale;
    const h = 50 * scale;
    const bobOffset = (frame % 2) * 2 * scale;
    const legOffsets = [{ left: -3, right: 3 }, { left: 0, right: 0 }, { left: 3, right: -3 }, { left: 0, right: 0 }];
    const legOffset = legOffsets[frame] || { left: 0, right: 0 };

    // Body - blue rectangle
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x + 5 * scale, y + 15 * scale - bobOffset, w - 10 * scale, h - 25 * scale);

    // Head - blue rectangle
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x + 8 * scale, y + 5 * scale - bobOffset, w - 16 * scale, 15 * scale);

    // Pirate Hat - black triangle
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(x + 5 * scale, y + 8 * scale - bobOffset);
    ctx.lineTo(x + w - 5 * scale, y + 8 * scale - bobOffset);
    ctx.lineTo(x + w / 2, y - 5 * scale - bobOffset);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x + 3 * scale, y + 6 * scale - bobOffset, w - 6 * scale, 4 * scale);

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + w * 0.35, y + 12 * scale - bobOffset, 4 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.65, y + 12 * scale - bobOffset, 4 * scale, 0, Math.PI * 2);
    ctx.fill();

    const eye1 = calcEyeOffset(x, y, w * 0.35 / scale, 12, 2, scale);
    const eye2 = calcEyeOffset(x, y, w * 0.65 / scale, 12, 2, scale);
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(x + w * 0.35 + eye1.ox, y + 12 * scale - bobOffset + eye1.oy, 2 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.65 + eye2.ox, y + 12 * scale - bobOffset + eye2.oy, 2 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Left leg (animated)
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x + 10 * scale, y + h - 12 * scale + legOffset.left * scale, 8 * scale, 12 * scale);

    // Peg leg (animated)
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x + w - 16 * scale, y + h - 14 * scale + legOffset.right * scale, 4 * scale, 14 * scale);
}

function drawPlayerJump(ctx, x, y, scale) {
    const w = 40 * scale;
    const h = 50 * scale;

    drawPlayerBase(ctx, x, y, scale);

    ctx.fillStyle = CONFIG.COLORS.playerEyes;
    ctx.beginPath();
    ctx.ellipse(x + w * 0.55, y + 8 * scale, 6 * scale, 8 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.8, y + 8 * scale, 5 * scale, 7 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = CONFIG.COLORS.playerPupils;
    ctx.beginPath();
    ctx.arc(x + w * 0.55, y + 5 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.80, y + 5 * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = CONFIG.COLORS.player;
    ctx.strokeStyle = CONFIG.COLORS.playerOutline;
    ctx.fillRect(x + 10 * scale, y + h - 14 * scale, 8 * scale, 8 * scale);
    ctx.strokeRect(x + 10 * scale, y + h - 14 * scale, 8 * scale, 8 * scale);
    ctx.fillRect(x + w - 18 * scale, y + h - 14 * scale, 8 * scale, 8 * scale);
    ctx.strokeRect(x + w - 18 * scale, y + h - 14 * scale, 8 * scale, 8 * scale);
}

function drawPlayerLookUp(ctx, x, y, scale, frame) {
    const w = 40 * scale;
    const h = 50 * scale;

    drawPlayerBase(ctx, x, y, scale, CONFIG.COLORS.playerLookUp);

    ctx.fillStyle = CONFIG.COLORS.playerLookUp;
    ctx.strokeStyle = CONFIG.COLORS.playerOutline;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.roundRect(x + 2 * scale, y - 3 * scale, w - 4 * scale, 25 * scale, 8 * scale);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = CONFIG.COLORS.playerEyes;
    ctx.beginPath();
    ctx.ellipse(x + w * 0.4, y + 6 * scale, 7 * scale, 9 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.7, y + 6 * scale, 7 * scale, 9 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = CONFIG.COLORS.playerPupils;
    ctx.beginPath();
    ctx.arc(x + w * 0.4, y + 2 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.7, y + 2 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();

    if (frame === 1) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + w * 0.35, y, 2 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = CONFIG.COLORS.playerLookUp;
    ctx.strokeStyle = CONFIG.COLORS.playerOutline;
    ctx.fillRect(x + 8 * scale, y + h - 10 * scale, 10 * scale, 10 * scale);
    ctx.strokeRect(x + 8 * scale, y + h - 10 * scale, 10 * scale, 10 * scale);
    ctx.fillRect(x + w - 18 * scale, y + h - 10 * scale, 10 * scale, 10 * scale);
    ctx.strokeRect(x + w - 18 * scale, y + h - 10 * scale, 10 * scale, 10 * scale);
}

function drawPlayerShocked(ctx, x, y, scale, frame) {
    const w = 40 * scale;
    const h = 50 * scale;
    const shakeX = (frame % 2) * 2 * scale - 1 * scale;

    drawPlayerBase(ctx, x + shakeX, y, scale, CONFIG.COLORS.playerShocked);

    ctx.fillStyle = CONFIG.COLORS.playerEyes;
    ctx.beginPath();
    ctx.ellipse(x + w * 0.4 + shakeX, y + 10 * scale, 9 * scale, 10 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.75 + shakeX, y + 10 * scale, 9 * scale, 10 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = CONFIG.COLORS.playerPupils;
    ctx.beginPath();
    ctx.arc(x + w * 0.4 + shakeX, y + 10 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.75 + shakeX, y + 10 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffd93d';
    ctx.font = `bold ${14 * scale}px 'Press Start 2P', cursive`;
    ctx.textAlign = 'center';
    ctx.fillText('!', x + w * 0.5 + shakeX, y - 8 * scale);

    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.5 + shakeX, y + 20 * scale, 4 * scale, 3 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = CONFIG.COLORS.playerShocked;
    ctx.strokeStyle = CONFIG.COLORS.playerOutline;
    ctx.fillRect(x + 8 * scale + shakeX, y + h - 10 * scale, 10 * scale, 10 * scale);
    ctx.strokeRect(x + 8 * scale + shakeX, y + h - 10 * scale, 10 * scale, 10 * scale);
    ctx.fillRect(x + w - 18 * scale + shakeX, y + h - 10 * scale, 10 * scale, 10 * scale);
    ctx.strokeRect(x + w - 18 * scale + shakeX, y + h - 10 * scale, 10 * scale, 10 * scale);
}

// NEW: Coding animation - character with glasses typing on laptop
function drawPlayerCoding(ctx, x, y, scale, frame) {
    const w = 40 * scale;
    const h = 50 * scale;

    // Body (purple tint for coding mode)
    drawPlayerBase(ctx, x, y, scale, CONFIG.COLORS.playerCoding);

    // Glasses frame
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    // Left lens
    ctx.roundRect(x + w * 0.25, y + 6 * scale, 12 * scale, 10 * scale, 2 * scale);
    // Right lens
    ctx.roundRect(x + w * 0.55, y + 6 * scale, 12 * scale, 10 * scale, 2 * scale);
    ctx.stroke();
    // Bridge
    ctx.beginPath();
    ctx.moveTo(x + w * 0.25 + 12 * scale, y + 10 * scale);
    ctx.lineTo(x + w * 0.55, y + 10 * scale);
    ctx.stroke();

    // Eyes behind glasses (focused)
    ctx.fillStyle = CONFIG.COLORS.playerEyes;
    ctx.beginPath();
    ctx.ellipse(x + w * 0.35, y + 11 * scale, 4 * scale, 5 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.65, y + 11 * scale, 4 * scale, 5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils - looking down at "screen"
    ctx.fillStyle = CONFIG.COLORS.playerPupils;
    ctx.beginPath();
    ctx.arc(x + w * 0.35, y + 13 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.arc(x + w * 0.65, y + 13 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Mini laptop in front
    const laptopY = y + h - 20 * scale;
    const laptopX = x + w * 0.1;
    const laptopW = w * 0.8;
    const laptopH = 12 * scale;

    // Laptop base
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(laptopX, laptopY, laptopW, laptopH);
    ctx.strokeStyle = '#1a252f';
    ctx.strokeRect(laptopX, laptopY, laptopW, laptopH);

    // Screen (with glow)
    ctx.fillStyle = frame % 2 === 0 ? '#3498db' : '#2ecc71';
    ctx.fillRect(laptopX + 2 * scale, laptopY + 2 * scale, laptopW - 4 * scale, 6 * scale);

    // Code lines on screen
    ctx.fillStyle = '#fff';
    const lineY = laptopY + 4 * scale;
    for (let i = 0; i < 3; i++) {
        const lineW = (3 + (frame + i) % 3) * scale;
        ctx.fillRect(laptopX + 4 * scale + i * 8 * scale, lineY, lineW, 1 * scale);
    }

    // Hands/arms typing (animated)
    ctx.fillStyle = CONFIG.COLORS.playerCoding;
    const handOffset = frame % 2 === 0 ? 0 : 2 * scale;
    // Left hand
    ctx.fillRect(x + 6 * scale, laptopY - 4 * scale + handOffset, 8 * scale, 6 * scale);
    // Right hand
    ctx.fillRect(x + w - 14 * scale, laptopY - 4 * scale - handOffset, 8 * scale, 6 * scale);

    // Legs (sitting)
    ctx.fillStyle = CONFIG.COLORS.playerCoding;
    ctx.strokeStyle = CONFIG.COLORS.playerOutline;
    ctx.fillRect(x + 8 * scale, y + h - 8 * scale, 10 * scale, 8 * scale);
    ctx.strokeRect(x + 8 * scale, y + h - 8 * scale, 10 * scale, 8 * scale);
    ctx.fillRect(x + w - 18 * scale, y + h - 8 * scale, 10 * scale, 8 * scale);
    ctx.strokeRect(x + w - 18 * scale, y + h - 8 * scale, 10 * scale, 8 * scale);

    // Thought bubble with code
    if (frame === 2) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(x + w + 5 * scale, y - 5 * scale, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.font = `${6 * scale}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('{ }', x + w + 5 * scale, y - 3 * scale);
    }
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
        this.forcedState = null;
        this.forcedState = null;
        this.isCoding = false; // Hacker Mode State
        this.lastTime = performance.now();
        this.prevY = y;  // Track previous Y position for one-way platforms
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
            this.sprite.setState(PlayerState.IDLE);
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
        const x = this.x * scale;
        const y = this.y * scale;
        const w = this.width * scale;
        const h = this.height * scale;

        ctx.save();

        // Flip if facing left
        if (!this.facingRight) {
            ctx.translate(x + w, 0);
            ctx.scale(-1, 1);
            ctx.translate(-x, 0);
        }

        // Outline color
        ctx.strokeStyle = '#0099cc';
        ctx.lineWidth = 2 * scale;

        // BODY - cyan rounded rectangle
        ctx.fillStyle = '#00d9ff';
        ctx.beginPath();
        ctx.roundRect(x + 4 * scale, y + 20 * scale, w - 8 * scale, h - 28 * scale, 6 * scale);
        ctx.fill();
        ctx.stroke();

        // HEAD - cyan rounded rectangle
        ctx.fillStyle = '#00d9ff';
        ctx.beginPath();
        ctx.roundRect(x + 2 * scale, y, w - 4 * scale, 24 * scale, 8 * scale);
        ctx.fill();
        ctx.stroke();

        // EYES - white circles (positioned in head)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + w * 0.35, y + 12 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.arc(x + w * 0.65, y + 12 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.fill();

        // PUPILS - with mouse tracking
        let pupilOffsetX1 = 0, pupilOffsetY1 = 0;
        let pupilOffsetX2 = 0, pupilOffsetY2 = 0;
        if (mouse.onCanvas) {
            const eyeX1 = this.x + this.width * 0.35;
            const eyeY1 = this.y + 12;
            const dx1 = mouse.x - eyeX1;
            const dy1 = mouse.y - eyeY1;
            const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1) || 1;
            pupilOffsetX1 = (dx1 / dist1) * 2.5 * scale;
            pupilOffsetY1 = (dy1 / dist1) * 2.5 * scale;

            const eyeX2 = this.x + this.width * 0.65;
            const dx2 = mouse.x - eyeX2;
            const dy2 = mouse.y - eyeY1;
            const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
            pupilOffsetX2 = (dx2 / dist2) * 2.5 * scale;
            pupilOffsetY2 = (dy2 / dist2) * 2.5 * scale;
        }

        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(x + w * 0.35 + pupilOffsetX1, y + 12 * scale + pupilOffsetY1, 2.5 * scale, 0, Math.PI * 2);
        ctx.arc(x + w * 0.65 + pupilOffsetX2, y + 12 * scale + pupilOffsetY2, 2.5 * scale, 0, Math.PI * 2);
        ctx.fill();

        // LEGS - both cyan, matching body
        ctx.fillStyle = '#00d9ff';
        ctx.strokeStyle = '#0099cc';

        // Left leg
        ctx.fillRect(x + 8 * scale, y + h - 10 * scale, 10 * scale, 10 * scale);
        ctx.strokeRect(x + 8 * scale, y + h - 10 * scale, 10 * scale, 10 * scale);

        // Right leg
        ctx.fillRect(x + w - 18 * scale, y + h - 10 * scale, 10 * scale, 10 * scale);
        ctx.strokeRect(x + w - 18 * scale, y + h - 10 * scale, 10 * scale, 10 * scale);

        // ============ HACKER MODE OVERLAY (Simple) ============
        if (this.isCoding) {
            // Screen Glow (Reflection on body)
            // Flicker between cyan and green to simulate active terminal
            const flicker = Math.floor(performance.now() / 100) % 2 === 0;
            ctx.fillStyle = flicker ? 'rgba(0, 255, 255, 0.2)' : 'rgba(0, 255, 0, 0.2)';
            ctx.beginPath();
            ctx.roundRect(x + 4 * scale, y + 20 * scale, w - 8 * scale, h - 28 * scale, 6 * scale);
            ctx.fill();

            // Sunglasses (Black rects over eyes)
            ctx.fillStyle = '#111';
            // Left Lens
            ctx.beginPath();
            ctx.roundRect(x + w * 0.25, y + 8 * scale, 12 * scale, 8 * scale, 2 * scale);
            ctx.fill();
            // Right Lens
            ctx.beginPath();
            ctx.roundRect(x + w * 0.55, y + 8 * scale, 12 * scale, 8 * scale, 2 * scale);
            ctx.fill();
            // Bridge
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 2 * scale;
            ctx.beginPath();
            ctx.moveTo(x + w * 0.45, y + 10 * scale);
            ctx.lineTo(x + w * 0.55, y + 10 * scale);
            ctx.stroke();

            // Laptop (Moved UP: Chest level)
            ctx.fillStyle = '#333'; // Dark Gray Case
            // Position: y + h - 25 (Higher up)
            ctx.fillRect(x + w * 0.1, y + h - 25 * scale, w * 0.8, 12 * scale);

            // Laptop Logo (Apple-ish style)
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x + w * 0.5, y + h - 19 * scale, 2.5 * scale, 0, Math.PI * 2);
            ctx.fill();

            // Optional: Matrix Rain Effect around player? (Maybe too much, keeping it simple as requested)
        }

        ctx.restore();
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
    const fullDescription = dialogueChunks.join(' ');
    
    // HYBRID SYSTEM
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // --- MOBILE: EXTERNAL PANEL ---
        const mobilePanel = document.getElementById('mobile-project-panel');
        
        // Populate Title
        document.getElementById('mobile-title').textContent = title;
        
        // Populate Description with RPG Typewriter
        typeMobileText(fullDescription, 'mobile-desc');
        
        // Tech Stack
        const mobileTechTags = document.getElementById('mobile-tech-stack');
        mobileTechTags.innerHTML = '';
        project.techStack.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            mobileTechTags.appendChild(tag);
        });

        // Actions
        const liveBtn = document.getElementById('mobile-live-btn');
        const sourceBtn = document.getElementById('mobile-source-btn');
        liveBtn.href = project.liveUrl;
        sourceBtn.href = project.sourceUrl;
        
        // Ensure visibility (reset from Contact mode)
        document.getElementById('mobile-tech-stack').style.display = 'flex';
        document.querySelector('.mobile-actions').style.display = 'flex';

        // VISIBILITY
        mobilePanel.classList.remove('hidden');
        mobilePanel.classList.add('active');
        hudOpen = true;
        
        // Ensure overlay is hidden
        modalOverlay.classList.add('hidden');
        projectModal.classList.remove('active');

        // SCROLL
        setTimeout(() => {
            mobilePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

    } else {
        // --- DESKTOP: OVERLAY MODAL ---
        projectTitle.textContent = title;

        // Instant Render
        clearInterval(typeInterval);
        isTyping = false;
        projectDescription.innerHTML = fullDescription;
        
        // Ensure UI is visible
        const techStackContainer = document.getElementById('tech-stack');
        if (techStackContainer) {
            techStackContainer.style.display = 'block';
            techStackContainer.style.opacity = '1';
        }
        document.getElementById('project-links').style.opacity = '1';

        // Tech Stack
        techTags.innerHTML = '';
        project.techStack.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            tag.addEventListener('mouseenter', () => {
                player.isCoding = true;
                soundManager.playTypingSound();
            });
            tag.addEventListener('mouseleave', () => player.isCoding = false);
            techTags.appendChild(tag);
        });

        projectLinks.innerHTML = `
            <a href="${project.liveUrl}" class="btn btn-primary" target="_blank">${t('viewLive')}</a>
            <a href="${project.sourceUrl}" class="btn btn-secondary" target="_blank">${t('sourceCode')}</a>
        `;

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
    
    const titleText = "CONTACT / LINKS";
    const contactText = "Connect with me on LinkedIn, check out my GitHub repositories, or send me an email to get in touch!";
    
    // Localize for Desktop (Legacy)
    const titleStr = CONTACT_INFO.title[currentLang] || CONTACT_INFO.title['en'];
    const descData = CONTACT_INFO.description[currentLang] || CONTACT_INFO.description['en'];
    const dialogueChunks = Array.isArray(descData) ? descData : [descData];

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // --- MOBILE: CONTACT PANEL ---
        const mobilePanel = document.getElementById('mobile-project-panel');
        
        // Set Title
        document.getElementById('mobile-title').textContent = titleText;
        
        // Type Description
        typeMobileText(contactText, 'mobile-desc');

        // HIDE Project-Specific Elements
        document.getElementById('mobile-tech-stack').style.display = 'none';
        document.querySelector('.mobile-actions').style.display = 'none';

        // SHOW PANEL
        mobilePanel.classList.remove('hidden');
        mobilePanel.classList.add('active');
        hudOpen = true;
        
        // Ensure overlay hidden
        modalOverlay.classList.add('hidden');
        projectModal.classList.remove('active');

        setTimeout(() => {
            mobilePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

    } else {
        // --- DESKTOP: OVERLAY MODAL ---
        
        projectTitle.textContent = titleStr;
        clearInterval(typeInterval);
        isTyping = false;
        projectDescription.innerHTML = dialogueChunks.join(' ');
        
        const techStackContainer = document.getElementById('tech-stack');
        if (techStackContainer) techStackContainer.style.display = 'none';
        document.getElementById('project-links').style.opacity = '1';

        projectLinks.innerHTML = '';
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '10px';
        container.style.justifyContent = 'center';

        const emailGroup = document.createElement('div');
        emailGroup.className = 'email-group';
        
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.innerHTML = `<i class="fas fa-envelope"></i> ${CONTACT_INFO.email} <i class="fas fa-copy"></i>`;
        
        btn.addEventListener('click', () => {
             navigator.clipboard.writeText(CONTACT_INFO.email).then(() => {
                const originalText = btn.innerHTML;
                btn.innerHTML = `<i class="fas fa-check"></i> ${t('copied')}`;
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });

        emailGroup.appendChild(btn);
        container.appendChild(emailGroup);
        
        const linkedInBtn = document.createElement('a');
        linkedInBtn.href = CONTACT_INFO.linkedin;
        linkedInBtn.className = 'btn btn-secondary';
        linkedInBtn.target = '_blank';
        linkedInBtn.innerHTML = `<i class="fab fa-linkedin"></i> LinkedIn`;
        container.appendChild(linkedInBtn);

        projectLinks.appendChild(container);

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
            player.x = 430;
            player.y = 400;
            player.vx = 0;
            player.vy = 0;
            player.width = 40;
            player.forcedState = null; // Clear states
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
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCity();  // City skyline background
    drawBackground();  // Stars/clouds
    drawNeonSign();
    drawContactLabel();  // Contact neon sign

    player.update(platforms, blocks);
    blocks.forEach(block => block.update());
    updateParticles();

    platforms.forEach(platform => platform.draw());
    blocks.forEach(block => block.draw());
    player.draw();
    drawParticles();

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
