
// Helper: Collision Direction (Copied/Adapted)
function getCollisionDir(colDirA, colDirB) {
    const dx = (colDirA.x + colDirA.width / 2) - (colDirB.x + colDirB.width / 2);
    const dy = (colDirA.y + colDirA.height / 2) - (colDirB.y + colDirB.height / 2);
    const width = (colDirA.width + colDirB.width) / 2;
    const height = (colDirA.height + colDirB.height) / 2;
    const crossWidth = width * dy;
    const crossHeight = height * dx;
    let collisionDirection = null;

    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
        if (crossWidth > crossHeight) {
            collisionDirection = (crossWidth > (-crossHeight)) ? 'b' : 'l';
        } else {
            collisionDirection = (crossWidth > (-crossHeight)) ? 'r' : 't';
        }
    }
    return collisionDirection;
}


// ==========================================
// SCENE MANAGEMENT: ME ROOM
// ==========================================

// Room State
let meRoomBlocks = [];

// Content Data
const ME_CONTENT = {
    bio: {
        id: 'bio',
        title: { en: "Bio", es: "Biografía" },
        description: {
            en: ["Data Scientist & Developer.", "Final-year student at UBA.", "Passionate about continuous learning.", "Freelancer open to new challenges.", "Teaching Assistant at UBA."],
            es: ["Científico de Datos y Desarrollador.", "Estudiante de último año en la UBA.", "Apasionado por el aprendizaje continuo.", "Freelancer abierto a nuevos desafíos.", "Ayudante de Cátedra en la UBA."]
        },
        techStack: [],
        liveUrl: "#",
        sourceUrl: "#"
    },
    experience: {
        id: 'experience',
        title: { en: "Experience", es: "Experiencia" },
        description: {
            // VERSIÓN INGLÉS
            en: [
                "<strong>2026 - Present | TerraStudio</strong>",
                "SOFTWARE ENGINEER & DATA ANALYST",
                "Leading digital transformation and Full Stack developer.",
                " ",
                "<strong>2024 - Present | UBA</strong>",
                "UNIVERSITY TEACHING ASSISTANT",
                "Algorithm Design Techniques"
            ],

            // VERSIÓN ESPAÑOL
            es: [
                "2026 - Presente | TerraStudio",
                "INGENIERO DE SOFTWARE & DATA ANALYST",
                "Liderando la transformación digital y desarrollo Full Stack.",
                " ",
                "2024 - Presente | UBA",
                "AYUDANTE DE CÁTEDRA",
                "Técnicas de Diseño de Algoritmos"
            ]
        },
        // Dejamos esto vacío o null para que nuestra función "inteligente" lo oculte y no crashee
        techStack: [],
        liveUrl: "#",
        sourceUrl: "#"
    }
};

// ==========================================
// SETUP ME ROOM
// ==========================================
function setupMeRoom() {
    // Force player to center of room (Logical Coordinates)
    player.x = 450;
    player.y = 400;
    player.vx = 0;
    player.vy = 0;
    player.onGround = true;

    // Create Gold Blocks
    meRoomBlocks = [];

    // Bio Block (Left) - Raised to y=90
    meRoomBlocks.push(new InfoBlock(160, 90, '?', {
        type: 'info',
        data: ME_CONTENT.bio,
        icon: '★',
        color: '#FFD700',
        glow: 'rgba(255, 215, 0, 0.6)'
    }));

    // Experience Block (Right) - Aligned with door, slightly lower
    // Player stands on door to hit it
    meRoomBlocks.push(new InfoBlock(420, 130, '?', {
        type: 'info',
        data: ME_CONTENT.experience,
        icon: '💻',
        color: '#FFD700',
        glow: 'rgba(255, 215, 0, 0.6)'
    }));
}

// ==========================================
// UPDATE ME ROOM (Physics, Collisions, Exit)
// ==========================================
function updateMeRoom() {
    // --- CONSTANTS ---
    const FLOOR_Y = 460; // Logical floor Y (player stands on this)
    const ROOM_WIDTH = CONFIG.CANVAS_WIDTH; // 900

    // --- PLAYER MOVEMENT (Using CONFIG values) ---
    if (keys.right) {
        player.vx = CONFIG.PLAYER_SPEED;
        player.facingRight = true;
    } else if (keys.left) {
        player.vx = -CONFIG.PLAYER_SPEED;
        player.facingRight = false;
    } else {
        player.vx *= CONFIG.FRICTION;
    }

    // Gravity
    player.vy += CONFIG.GRAVITY;
    if (player.vy > CONFIG.MAX_FALL_SPEED) player.vy = CONFIG.MAX_FALL_SPEED;

    // Jump
    if (keys.jump && player.onGround) {
        player.vy = CONFIG.JUMP_FORCE;
        player.onGround = false;
        soundManager.playJump();
    }

    // Apply Velocity
    player.x += player.vx;
    player.y += player.vy;

    // --- FLOOR COLLISION ---
    if (player.y + player.height > FLOOR_Y) {
        player.y = FLOOR_Y - player.height;
        player.vy = 0;
        player.onGround = true;
    }

    // --- DESK PLATFORM COLLISION ---
    // Desk acts as a platform for player to jump on
    const deskPlatform = { x: 100, y: 350, w: 200, h: 15 };
    const onDeskX = player.x + player.width > deskPlatform.x && player.x < deskPlatform.x + deskPlatform.w;
    const aboveDesk = player.y + player.height <= deskPlatform.y + 10;
    const fallingOnDesk = player.y + player.height >= deskPlatform.y && player.vy >= 0;

    if (onDeskX && aboveDesk && fallingOnDesk) {
        player.y = deskPlatform.y - player.height;
        player.vy = 0;
        player.onGround = true;
    }

    // --- MONITOR PLATFORM COLLISION (On top of desk) ---
    // Monitor is the stepping stone to reach Experience block
    const monitorPlatform = { x: 140, y: 220, w: 120, h: 10 };
    const onMonitorX = player.x + player.width > monitorPlatform.x && player.x < monitorPlatform.x + monitorPlatform.w;
    const aboveMonitor = player.y + player.height <= monitorPlatform.y + 10;
    const fallingOnMonitor = player.y + player.height >= monitorPlatform.y && player.vy >= 0;

    if (onMonitorX && aboveMonitor && fallingOnMonitor) {
        player.y = monitorPlatform.y - player.height;
        player.vy = 0;
        player.onGround = true;
    }

    // --- SPEAKER PLATFORM COLLISION (Right side) ---
    // Neon speaker/music equipment to reach Experience block
    const speakerPlatform = { x: 620, y: 200, w: 100, h: 12 };
    const onSpeakerX = player.x + player.width > speakerPlatform.x && player.x < speakerPlatform.x + speakerPlatform.w;
    const aboveSpeaker = player.y + player.height <= speakerPlatform.y + 10;
    const fallingOnSpeaker = player.y + player.height >= speakerPlatform.y && player.vy >= 0;

    if (onSpeakerX && aboveSpeaker && fallingOnSpeaker) {
        player.y = speakerPlatform.y - player.height;
        player.vy = 0;
        player.onGround = true;
    }

    // --- DOOR PLATFORM COLLISION (Center) ---
    // Allow standing on top of the exit door
    const doorPlatform = { x: ROOM_WIDTH / 2 - 30, y: FLOOR_Y - 80, w: 60, h: 10 };
    const onDoorX = player.x + player.width > doorPlatform.x && player.x < doorPlatform.x + doorPlatform.w;
    const falling = player.vy >= 0;
    const feetPos = player.y + player.height;
    const isLanding = feetPos >= doorPlatform.y && feetPos <= doorPlatform.y + 20;

    if (onDoorX && falling && isLanding) {
        player.y = doorPlatform.y - player.height; // Te pegamos a la superficie
        player.vy = 0;
        player.onGround = true;
    }

    // --- WALL COLLISION (Screen Edges) ---
    if (player.x < 0) {
        player.x = 0;
        player.vx = 0;
    }
    if (player.x + player.width > ROOM_WIDTH) {
        player.x = ROOM_WIDTH - player.width;
        player.vx = 0;
    }

    // --- UPDATE SPRITE STATE (Animation) ---
    player.updateSpriteState();
    player.sprite.facingRight = player.facingRight;
    player.sprite.update(16); // Approx 60fps delta

    // --- GOLD BLOCK COLLISIONS (Headbutt from Below) ---
    // Match exterior block behavior: blocks on cooldown can be passed through
    meRoomBlocks.forEach(block => {
        const onCooldown = block.isOnCooldown();

        // Check if player overlaps block
        const isColliding = player.x < block.x + block.width &&
            player.x + player.width > block.x &&
            player.y < block.y + block.height &&
            player.y + player.height > block.y;

        // Only collide if NOT on cooldown (match exterior behavior - pass through when loading)
        if (isColliding && !onCooldown) {
            // Determine collision direction
            const overlapTop = (block.y + block.height) - player.y;
            const overlapBottom = (player.y + player.height) - block.y;

            // Headbutt: Player is BELOW block and moving UP
            if (overlapTop < overlapBottom && player.vy < 0) {
                player.y = block.y + block.height;
                player.vy = 2;

                if (block.canTrigger()) {
                    block.startCooldown();
                    block.bounceVelocity = -8;
                    soundManager.playBump();
                    soundManager.playCoin();
                    showProjectModal(block.content.data);
                }
            }
            // Standing ON block
            else if (overlapBottom < overlapTop && player.vy >= 0) {
                player.y = block.y - player.height;
                player.vy = 0;
                player.onGround = true;
            }
        }

        // Update block animation
        block.update();
    });

    // --- EXIT DOOR LOGIC (FIXED) ---
    const exitDoorLogical = {
        x: ROOM_WIDTH / 2 - 30, // Center
        y: FLOOR_Y - 90,        // <--- Lo subimos un poco para envolver al jugador
        w: 60,
        h: 90
    };

    // Check collision logic
    const touchingDoor = player.x < exitDoorLogical.x + exitDoorLogical.w &&
        player.x + player.width > exitDoorLogical.x &&
        player.y < exitDoorLogical.y + exitDoorLogical.h &&
        player.y + player.height > exitDoorLogical.y;

    // FIX CRÍTICO: Usamos 'keys.jump' en lugar de 'keys.up'
    // 'keys.jump' suele ser la variable que agrupa (Espacio, W, Flecha Arriba)
    // Si tu juego no usa 'keys.jump', prueba con (keys.up || keys.w || keys.space)
    if (touchingDoor && (keys.jump || keys.up) && !hudOpen) {

        // 1. Cambiar estado
        gameState = 'MAIN';

        // 2. Spawn Seguro (A la izquierda de la puerta exterior)
        player.x = 500;
        player.y = 400;
        player.vx = 0;
        player.vy = 0;

        // 3. Resetear teclas para evitar saltos fantasma
        keys.jump = false;
        keys.up = false;
    }
}

// ==========================================
// DRAW ME ROOM (Cyberpunk Style)
// ==========================================

// Helper: Draw neon text (matching PROJECTS/CONTACT style)
function drawMeRoomNeonTitle(text, x, y, scale, pulseOffset = 0) {
    ctx.save();
    ctx.font = `bold ${14 * scale}px 'Press Start 2P', cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = 'bottom';

    // Animated glow intensity
    const glowIntensity = 15 + Math.sin(Date.now() / 500 + pulseOffset) * 5;

    // Glow layer (cyan)
    ctx.shadowColor = '#00d9ff';
    ctx.shadowBlur = glowIntensity * scale;
    ctx.fillStyle = '#00d9ff';
    ctx.fillText(text, x, y);

    // White center pass
    ctx.shadowBlur = 5 * scale;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, x, y);

    ctx.restore();
}

function drawMeRoom() {
    const scale = getScale();
    const w = CONFIG.CANVAS_WIDTH * scale;
    const h = CONFIG.CANVAS_HEIGHT * scale;
    const FLOOR_Y_LOGICAL = 460;
    const floorY = FLOOR_Y_LOGICAL * scale;
    const neonPulse = Date.now() / 1000;

    // ========================================
    // 1. SERVER ROOM BACKGROUND (Deep dark blue/black)
    // ========================================
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, w, h);

    // ========================================
    // 2. SERVER RACK SILHOUETTES (Background depth)
    // ========================================
    ctx.fillStyle = '#1a1a2e';
    // Left side server racks
    for (let i = 0; i < 3; i++) {
        const rackX = (40 + i * 60) * scale;
        const rackY = 80 * scale;
        const rackW = 45 * scale;
        const rackH = 350 * scale;
        ctx.fillRect(rackX, rackY, rackW, rackH);
        // Rack details (darker lines)
        ctx.fillStyle = '#0f0f1a';
        for (let j = 0; j < 8; j++) {
            ctx.fillRect(rackX + 5 * scale, rackY + (20 + j * 40) * scale, rackW - 10 * scale, 25 * scale);
        }
        ctx.fillStyle = '#1a1a2e';
    }
    // Right side server racks
    for (let i = 0; i < 3; i++) {
        const rackX = (700 + i * 60) * scale;
        const rackY = 80 * scale;
        const rackW = 45 * scale;
        const rackH = 350 * scale;
        ctx.fillRect(rackX, rackY, rackW, rackH);
        // Rack details
        ctx.fillStyle = '#0f0f1a';
        for (let j = 0; j < 8; j++) {
            ctx.fillRect(rackX + 5 * scale, rackY + (20 + j * 40) * scale, rackW - 10 * scale, 25 * scale);
        }
        ctx.fillStyle = '#1a1a2e';
    }

    // Faint server lights (blinking LEDs)
    ctx.fillStyle = '#00f3ff';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
            if (Math.sin(neonPulse * 2 + i + j) > 0.3) {
                ctx.fillRect((50 + i * 60) * scale, (95 + j * 40) * scale, 3 * scale, 2 * scale);
                ctx.fillRect((710 + i * 60) * scale, (95 + j * 40) * scale, 3 * scale, 2 * scale);
            }
        }
    }

    // ========================================
    // 3. NEON WALL STRIPS (Frame)
    // ========================================
    // Top horizontal neon strip (cyan) - Raised to y=20
    ctx.save();
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 15 + Math.sin(neonPulse * 2) * 5;
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(20 * scale, 20 * scale);
    ctx.lineTo((w / scale - 20) * scale, 20 * scale);
    ctx.stroke();
    ctx.restore();

    // Left vertical neon strip (magenta)
    ctx.save();
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 12 + Math.sin(neonPulse * 1.5) * 5;
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(15 * scale, 50 * scale);
    ctx.lineTo(15 * scale, (FLOOR_Y_LOGICAL - 30) * scale);
    ctx.stroke();
    ctx.restore();

    // Right vertical neon strip (magenta)
    ctx.save();
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 12 + Math.sin(neonPulse * 1.5 + 1) * 5;
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo((w / scale - 15) * scale, 50 * scale);
    ctx.lineTo((w / scale - 15) * scale, (FLOOR_Y_LOGICAL - 30) * scale);
    ctx.stroke();
    ctx.restore();

    // ========================================
    // 4. DIGITAL GRID FLOOR (Perspective cyan)
    // ========================================
    ctx.fillStyle = '#0a0a15';
    const floorH = (CONFIG.CANVAS_HEIGHT - FLOOR_Y_LOGICAL) * scale;
    ctx.fillRect(0, floorY, w, floorH);

    // Glowing perspective grid lines (brighter cyan)
    ctx.save();
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 3 * scale;
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 1 * scale;
    ctx.globalAlpha = 0.5;

    // Horizontal grid lines
    for (let y = FLOOR_Y_LOGICAL; y < CONFIG.CANVAS_HEIGHT; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y * scale);
        ctx.lineTo(w, y * scale);
        ctx.stroke();
    }
    // Vertical grid lines (perspective)
    for (let x = 0; x <= CONFIG.CANVAS_WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x * scale, floorY);
        ctx.lineTo(x * scale, h);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // ========================================
    // 4. GAMING DESK SETUP (Platform)
    // ========================================
    // Desk dimensions - matches collision in updateMeRoom
    const deskX = 100 * scale;
    const deskY = 350 * scale;
    const deskW = 200 * scale;
    const deskH = 15 * scale;

    // Desk legs (dark metal)
    ctx.fillStyle = '#1a1520';
    ctx.fillRect(deskX + 15 * scale, deskY + deskH, 12 * scale, (FLOOR_Y_LOGICAL - 350 - 15) * scale);
    ctx.fillRect(deskX + deskW - 27 * scale, deskY + deskH, 12 * scale, (FLOOR_Y_LOGICAL - 350 - 15) * scale);

    // Desk surface (dark with neon edge)
    const deskSurfaceGrad = ctx.createLinearGradient(deskX, deskY, deskX, deskY + deskH);
    deskSurfaceGrad.addColorStop(0, '#3a3545');
    deskSurfaceGrad.addColorStop(1, '#2a2535');
    ctx.fillStyle = deskSurfaceGrad;
    ctx.fillRect(deskX, deskY, deskW, deskH);

    // Neon edge on desk (cyan)
    ctx.save();
    ctx.shadowColor = '#00d9ff';
    ctx.shadowBlur = 8 * scale;
    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(deskX, deskY + deskH);
    ctx.lineTo(deskX + deskW, deskY + deskH);
    ctx.stroke();
    ctx.restore();

    // ========================================
    // 5. LARGE MONITOR WITH CODE
    // ========================================
    const monitorX = deskX + 40 * scale;
    const monitorY = deskY - 130 * scale;
    const monitorW = 120 * scale;
    const monitorH = 80 * scale;

    // Monitor stand
    ctx.fillStyle = '#1a1520';
    ctx.fillRect(deskX + 85 * scale, deskY - 45 * scale, 30 * scale, 45 * scale);
    ctx.fillRect(deskX + 70 * scale, deskY - 10 * scale, 60 * scale, 10 * scale);

    // Monitor bezel (black frame)
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(monitorX - 8 * scale, monitorY - 8 * scale, monitorW + 16 * scale, monitorH + 16 * scale);

    // Monitor screen background (dark blue)
    const screenBgGrad = ctx.createLinearGradient(monitorX, monitorY, monitorX, monitorY + monitorH);
    screenBgGrad.addColorStop(0, '#0d1a2d');
    screenBgGrad.addColorStop(1, '#0a1420');
    ctx.fillStyle = screenBgGrad;
    ctx.fillRect(monitorX, monitorY, monitorW, monitorH);

    // Code on screen (syntax highlighted)
    const codeLines = [
        { text: 'const', color: '#ff79c6', x: 8, w: 35 },
        { text: 'dev', color: '#f8f8f2', x: 45, w: 20 },
        { text: '=', color: '#ff79c6', x: 68, w: 8 },
        { text: '{', color: '#f8f8f2', x: 80, w: 8 },
    ];
    const codeLines2 = [
        { text: '  name:', color: '#8be9fd', x: 8, w: 40 },
        { text: '"Luciano"', color: '#f1fa8c', x: 52, w: 55 },
    ];
    const codeLines3 = [
        { text: '  role:', color: '#8be9fd', x: 8, w: 35 },
        { text: '"Developer"', color: '#f1fa8c', x: 48, w: 65 },
    ];
    const codeLines4 = [
        { text: '  skills:', color: '#8be9fd', x: 8, w: 45 },
        { text: '[...]', color: '#bd93f9', x: 58, w: 30 },
    ];
    const codeLines5 = [
        { text: '};', color: '#f8f8f2', x: 8, w: 15 },
    ];

    ctx.font = `${7 * scale}px monospace`;
    let lineY = monitorY + 12 * scale;
    const lineHeight = 12 * scale;

    [codeLines, codeLines2, codeLines3, codeLines4, codeLines5].forEach((line, idx) => {
        line.forEach(segment => {
            ctx.fillStyle = segment.color;
            ctx.fillText(segment.text, monitorX + segment.x * scale, lineY + idx * lineHeight);
        });
    });

    // Screen glow effect
    ctx.save();
    ctx.shadowColor = '#00d9ff';
    ctx.shadowBlur = 20 + Math.sin(neonPulse * 3) * 8;
    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(monitorX, monitorY, monitorW, monitorH);
    ctx.restore();

    // ========================================
    // 6. RGB KEYBOARD
    // ========================================
    const kbX = deskX + 60 * scale;
    const kbY = deskY - 18 * scale;
    const kbW = 80 * scale;
    const kbH = 16 * scale;

    // Keyboard body
    ctx.fillStyle = '#1a1a25';
    ctx.fillRect(kbX, kbY, kbW, kbH);

    // RGB keys with glow
    const keyColors = ['#ff0055', '#ff00ff', '#aa00ff', '#5500ff', '#00aaff', '#00ffaa', '#aaff00', '#ffaa00'];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 3; j++) {
            const keyColor = keyColors[(i + j) % keyColors.length];
            const brightness = 0.3 + Math.sin(neonPulse * 4 + i * 0.3 + j * 0.5) * 0.2;
            ctx.fillStyle = keyColor;
            ctx.globalAlpha = brightness;
            ctx.fillRect(kbX + (4 + i * 7.5) * scale, kbY + (2 + j * 4.5) * scale, 5 * scale, 3 * scale);
        }
    }
    ctx.globalAlpha = 1;

    // ========================================
    // 7. MOUSE
    // ========================================
    ctx.fillStyle = '#1a1a25';
    ctx.beginPath();
    ctx.ellipse(deskX + 160 * scale, deskY - 10 * scale, 12 * scale, 8 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    // Mouse RGB strip
    ctx.save();
    ctx.shadowColor = '#00ffaa';
    ctx.shadowBlur = 6 * scale;
    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.arc(deskX + 160 * scale, deskY - 10 * scale, 6 * scale, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();
    ctx.restore();

    // ========================================
    // 8. NEON SPEAKER / DJ EQUIPMENT (Platform for Experience block)
    // ========================================
    // Matches collision: { x: 620, y: 200, w: 100, h: 12 }
    const speakerX = 620 * scale;
    const speakerY = 200 * scale;
    const speakerW = 100 * scale;
    const speakerH = 260 * scale; // Height to floor

    // Speaker cabinet (main body)
    const cabinetGrad = ctx.createLinearGradient(speakerX, speakerY, speakerX + speakerW, speakerY);
    cabinetGrad.addColorStop(0, '#1a1525');
    cabinetGrad.addColorStop(0.5, '#252030');
    cabinetGrad.addColorStop(1, '#1a1525');
    ctx.fillStyle = cabinetGrad;
    ctx.fillRect(speakerX, speakerY, speakerW, speakerH);

    // Top platform surface (where player stands)
    ctx.fillStyle = '#2a2535';
    ctx.fillRect(speakerX - 5 * scale, speakerY, speakerW + 10 * scale, 12 * scale);

    // Neon edge on speaker top (magenta)
    ctx.save();
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 10 + Math.sin(neonPulse * 2) * 5;
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(speakerX - 5 * scale, speakerY + 12 * scale);
    ctx.lineTo(speakerX + speakerW + 5 * scale, speakerY + 12 * scale);
    ctx.stroke();
    ctx.restore();

    // Bass woofer (large circle with pulsing glow)
    const wooferX = speakerX + speakerW / 2;
    const wooferY = speakerY + 80 * scale;
    const wooferR = 35 * scale;
    const bassPulse = Math.sin(neonPulse * 8) * 0.2 + 0.8;

    // Woofer outer ring
    ctx.save();
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 15 * bassPulse;
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 4 * scale;
    ctx.beginPath();
    ctx.arc(wooferX, wooferY, wooferR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Woofer inner cone
    ctx.fillStyle = '#0a0a12';
    ctx.beginPath();
    ctx.arc(wooferX, wooferY, wooferR - 8 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Woofer center dust cap
    ctx.fillStyle = '#1a1a25';
    ctx.beginPath();
    ctx.arc(wooferX, wooferY, 12 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Tweeter 1 (smaller speaker, cyan)
    const tweeter1Y = speakerY + 160 * scale;
    ctx.save();
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.arc(speakerX + 30 * scale, tweeter1Y, 15 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#0a0a12';
    ctx.fill();
    ctx.restore();

    // Tweeter 2 (cyan)
    ctx.save();
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.arc(speakerX + 70 * scale, tweeter1Y, 15 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#0a0a12';
    ctx.fill();
    ctx.restore();

    // Sound bars / equalizer LEDs
    const eqY = speakerY + 200 * scale;
    for (let i = 0; i < 8; i++) {
        const barHeight = (15 + Math.sin(neonPulse * 6 + i * 0.8) * 10) * scale;
        const barColor = i % 2 === 0 ? '#00f3ff' : '#ff00ff';
        ctx.save();
        ctx.shadowColor = barColor;
        ctx.shadowBlur = 5;
        ctx.fillStyle = barColor;
        ctx.fillRect(speakerX + (10 + i * 10) * scale, eqY + (25 - barHeight / scale) * scale, 6 * scale, barHeight);
        ctx.restore();
    }

    // "BASS" label
    ctx.save();
    ctx.font = `bold ${8 * scale}px 'Press Start 2P'`;
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#ff00ff';
    ctx.fillText("BASS", wooferX, speakerY + 240 * scale);
    ctx.restore();

    // ========================================
    // 9. EXIT DOOR
    // ========================================
    const exitDoorLogical = {
        x: CONFIG.CANVAS_WIDTH / 2 - 30,
        y: FLOOR_Y_LOGICAL - 80,
        w: 60,
        h: 80
    };
    const exitDoor = {
        x: exitDoorLogical.x * scale,
        y: exitDoorLogical.y * scale,
        w: exitDoorLogical.w * scale,
        h: exitDoorLogical.h * scale
    };

    // Door frame
    ctx.fillStyle = '#1a1a25';
    ctx.fillRect(exitDoor.x - 5 * scale, exitDoor.y - 5 * scale, exitDoor.w + 10 * scale, exitDoor.h + 10 * scale);

    // Door interior
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(exitDoor.x, exitDoor.y, exitDoor.w, exitDoor.h);

    // Neon door border (magenta, pulsing)
    ctx.save();
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 10 + Math.sin(neonPulse * 2) * 5;
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(exitDoor.x, exitDoor.y, exitDoor.w, exitDoor.h);
    ctx.restore();

    // "EXIT" neon sign above door
    ctx.save();
    ctx.font = `bold ${10 * scale}px 'Press Start 2P'`;
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 10 * scale;
    ctx.fillStyle = '#ff00ff';
    ctx.fillText("EXIT", exitDoor.x + exitDoor.w / 2, exitDoor.y - 15 * scale);
    ctx.shadowBlur = 3 * scale;
    ctx.fillStyle = '#ffffff';
    ctx.fillText("EXIT", exitDoor.x + exitDoor.w / 2, exitDoor.y - 15 * scale);
    ctx.restore();

    // ========================================
    // 10. GOLD BLOCKS WITH NEON LABELS
    // ========================================
    const labelWhoAmI = typeof currentLang !== 'undefined' && currentLang === 'es' ? '¿Quién Soy?' : 'Who Am I?';
    const labelExperience = typeof currentLang !== 'undefined' && currentLang === 'es' ? 'Experiencia' : 'Experience';

    meRoomBlocks.forEach((block, index) => {
        block.draw();
        const labelX = (block.x + block.width / 2) * scale;
        const labelY = (block.y - 15) * scale;
        const label = index === 0 ? labelWhoAmI : labelExperience;
        drawMeRoomNeonTitle(label, labelX, labelY, scale, index * 2);
    });

    // ========================================
    // 10. DRAW PLAYER
    // ========================================
    player.draw();
}
