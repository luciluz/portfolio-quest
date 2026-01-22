
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
            en: ["Freelance Developer at TerraStudio.", "University Teaching Assistant (Ayudante de Segunda) at UBA."],
            es: ["Desarrollador Freelance en TerraStudio.", "Ayudante de Segunda (Docente) en la UBA."]
        },
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

    // Bio Block (Left) - Logical Coords
    meRoomBlocks.push(new InfoBlock(200, 350, '?', {
        type: 'info',
        data: ME_CONTENT.bio,
        icon: '★',
        color: '#FFD700',
        glow: 'rgba(255, 215, 0, 0.6)'
    }));

    // Experience Block (Right) - Logical Coords
    meRoomBlocks.push(new InfoBlock(600, 350, '?', {
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
    meRoomBlocks.forEach(block => {
        // Check if player overlaps block
        const isColliding = player.x < block.x + block.width &&
            player.x + player.width > block.x &&
            player.y < block.y + block.height &&
            player.y + player.height > block.y;

        if (isColliding) {
            // Determine collision direction
            const overlapTop = (block.y + block.height) - player.y; // Player hitting top of block
            const overlapBottom = (player.y + player.height) - block.y; // Player under block

            // Headbutt: Player is BELOW block and moving UP
            if (overlapTop < overlapBottom && player.vy < 0) {
                player.y = block.y + block.height; // Push player down
                player.vy = 2; // Bounce down

                // Trigger block only if not on cooldown
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

    // --- EXIT DOOR LOGIC ---
    const exitDoorLogical = {
        x: ROOM_WIDTH / 2 - 30, // Center
        y: FLOOR_Y - 80,        // Above floor
        w: 60,
        h: 80
    };

    const touchingDoor = player.x < exitDoorLogical.x + exitDoorLogical.w &&
        player.x + player.width > exitDoorLogical.x &&
        player.y < exitDoorLogical.y + exitDoorLogical.h &&
        player.y + player.height > exitDoorLogical.y;

    if (touchingDoor && keys.up && !hudOpen) {
        // Exit to Main Level
        gameState = 'MAIN';
        // Respawn player at ME Door position in Main Level
        player.x = 580; // ME Door X
        player.y = 400;
        player.vx = 0;
        player.vy = 0;
    }
}

// ==========================================
// DRAW ME ROOM
// ==========================================
function drawMeRoom() {
    const scale = getScale();
    const w = CONFIG.CANVAS_WIDTH * scale;
    const h = CONFIG.CANVAS_HEIGHT * scale;
    const FLOOR_Y_LOGICAL = 460;

    // 1. Background
    ctx.fillStyle = '#0f0f1a';
    ctx.fillRect(0, 0, w, h);

    // 2. Room Title (Watermark)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.font = `${100 * scale}px 'Press Start 2P'`;
    ctx.textAlign = "center";
    ctx.fillText("ME", w / 2, h / 2);

    // 3. Draw Floor
    ctx.fillStyle = '#222';
    const floorH = (CONFIG.CANVAS_HEIGHT - FLOOR_Y_LOGICAL) * scale;
    ctx.fillRect(0, FLOOR_Y_LOGICAL * scale, w, floorH);

    // 4. Draw Exit Door
    const exitDoor = {
        x: (CONFIG.CANVAS_WIDTH / 2 - 30) * scale,
        y: (FLOOR_Y_LOGICAL - 80) * scale,
        w: 60 * scale,
        h: 80 * scale
    };
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(exitDoor.x, exitDoor.y, exitDoor.w, exitDoor.h);

    // Draw "EXIT" prompt if player is near
    const exitDoorLogical = { x: CONFIG.CANVAS_WIDTH / 2 - 30, y: FLOOR_Y_LOGICAL - 80, w: 60, h: 80 };
    const nearDoor = player.x < exitDoorLogical.x + exitDoorLogical.w &&
        player.x + player.width > exitDoorLogical.x &&
        player.y < exitDoorLogical.y + exitDoorLogical.h &&
        player.y + player.height > exitDoorLogical.y;
    if (nearDoor) {
        ctx.fillStyle = "white";
        ctx.font = `${12 * scale}px 'Press Start 2P'`;
        ctx.textAlign = 'center';
        ctx.fillText("Press UP", exitDoor.x + exitDoor.w / 2, exitDoor.y - 10 * scale);
    }

    // 5. Draw Gold Blocks
    meRoomBlocks.forEach(block => block.draw());

    // 6. Draw Player (MUST be called for visibility)
    player.draw();
}
