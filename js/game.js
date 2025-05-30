class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas dimensions
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Game state
        this.isRunning = false;
        this.gameOver = false;
        this.difficulty = 'Medium'; // Default difficulty
        this.isMobile = this.checkIfMobile();
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.playerProjectiles = [];
        this.enemyProjectiles = [];
        this.powerUps = [];
        this.levelManager = null;
        this.soundManager = null;
        
        // Game timers
        this.enemySpawnTimer = 0;
        
        // UI elements
        this.startScreen = document.getElementById('startScreen');
        this.difficultyScreen = document.getElementById('difficultyScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.rotationMessage = document.getElementById('rotationMessage');
        this.startButton = document.getElementById('startButton');
        this.easyButton = document.getElementById('easyButton');
        this.mediumButton = document.getElementById('mediumButton');
        this.hardButton = document.getElementById('hardButton');
        this.restartButton = document.getElementById('restartButton');
        this.finalScoreElement = document.getElementById('finalScore');
        this.difficultyDescription = document.getElementById('difficultyDescription');
        this.difficultyDisplay = document.getElementById('difficulty');
        
        // Initialize sound manager
        this.soundManager = new SoundManager();
        
        // Event listeners
        this.setupEventListeners();
        
        // Initial setup - don't call showStartScreen here, it's handled by mobile-controls.js
    }
    
    checkIfMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    setupEventListeners() {
        // Start and restart buttons
        this.startButton.addEventListener('click', () => this.showDifficultyScreen());
        this.restartButton.addEventListener('click', () => this.showDifficultyScreen());
        
        // Difficulty buttons
        this.easyButton.addEventListener('click', () => this.selectDifficulty('Easy'));
        this.mediumButton.addEventListener('click', () => this.selectDifficulty('Medium'));
        this.hardButton.addEventListener('click', () => this.selectDifficulty('Hard'));
        
        // Hover effects for difficulty descriptions
        this.easyButton.addEventListener('mouseover', () => this.updateDifficultyDescription('Easy'));
        this.mediumButton.addEventListener('mouseover', () => this.updateDifficultyDescription('Medium'));
        this.hardButton.addEventListener('mouseover', () => this.updateDifficultyDescription('Hard'));
        
        // Touch events for mobile
        if (this.isMobile) {
            this.easyButton.addEventListener('touchstart', () => this.updateDifficultyDescription('Easy'));
            this.mediumButton.addEventListener('touchstart', () => this.updateDifficultyDescription('Medium'));
            this.hardButton.addEventListener('touchstart', () => this.updateDifficultyDescription('Hard'));
        }
    }
    
    resizeCanvas() {
        // Get the container dimensions
        const container = this.canvas.parentElement;
        const header = document.querySelector('.game-header');
        const controls = document.querySelector('.game-controls');
        
        // Calculate available height
        const headerHeight = header ? header.offsetHeight : 0;
        const controlsHeight = controls ? controls.offsetHeight : 0;
        const availableHeight = container.clientHeight - headerHeight - controlsHeight;
        
        // Set canvas size to fill the container
        this.canvas.width = container.clientWidth;
        this.canvas.height = availableHeight;
        
        console.log("Canvas resized to:", this.canvas.width, "x", this.canvas.height);
        console.log("Container size:", container.clientWidth, "x", container.clientHeight);
        console.log("Header height:", headerHeight, "Controls height:", controlsHeight);
        
        // If we're in the middle of a game, redraw everything
        if (this.isRunning && this.player) {
            // Ensure player stays in bounds after resize
            this.player.y = Math.min(this.player.y, this.canvas.height - this.player.height);
            
            // Redraw the game
            this.drawGame();
        }
    }
    
    showStartScreen() {
        // Simply show the start screen and hide others
        this.startScreen.classList.remove('hidden');
        this.difficultyScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.rotationMessage.classList.add('hidden');
    }
    
    showDifficultyScreen() {
        this.startScreen.classList.add('hidden');
        this.difficultyScreen.classList.remove('hidden');
        this.gameOverScreen.classList.add('hidden');
        
        // Reset button styles
        this.easyButton.classList.remove('selected');
        this.mediumButton.classList.remove('selected');
        this.hardButton.classList.remove('selected');
        
        // Set default description
        this.updateDifficultyDescription('Medium');
    }
    
    updateDifficultyDescription(difficulty) {
        switch(difficulty) {
            case 'Easy':
                this.difficultyDescription.textContent = 'More lives, slower enemies, higher power-up drop rate. Perfect for beginners.';
                break;
            case 'Medium':
                this.difficultyDescription.textContent = 'Balanced gameplay with standard lives, enemy speed, and power-up drops.';
                break;
            case 'Hard':
                this.difficultyDescription.textContent = 'Fewer lives, faster enemies, lower power-up drop rate. For experienced players.';
                break;
        }
    }
    
    selectDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.difficultyDisplay.textContent = difficulty;
        this.startGame();
    }
    
    startGame() {
        console.log("Starting game with difficulty:", this.difficulty);
        
        // Hide screens
        this.startScreen.classList.add('hidden');
        this.difficultyScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        
        // Hide rotation message if visible
        const rotationMessage = document.getElementById('rotationMessage');
        if (rotationMessage) {
            rotationMessage.style.display = 'none';
        }
        
        // Reset game state
        this.isRunning = true;
        this.gameOver = false;
        
        // Initialize game objects with difficulty settings
        this.player = new Player(this.canvas, this.difficulty);
        this.enemies = [];
        this.playerProjectiles = [];
        this.enemyProjectiles = [];
        this.powerUps = [];
        this.levelManager = new LevelManager(this, this.difficulty);
        
        // Update difficulty display
        this.difficultyDisplay.textContent = this.difficulty;
        
        // Set initial enemy spawn timer
        this.enemySpawnTimer = this.levelManager.getEnemySpawnRate();
        
        // Start background music
        this.soundManager.startMusic();
        
        // Make sure canvas is properly sized
        this.resizeCanvas();
        
        // Start game loop
        requestAnimationFrame(() => this.gameLoop());
        
        // Enable auto-firing on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            // Set auto-firing flag
            window.autoFiring = true;
            
            // Update controls text
            const controlsText = document.getElementById('controlsText');
            if (controlsText) {
                controlsText.textContent = 'Touch and drag to move, auto-firing enabled';
            }
        }
    }
    
    showGameOverScreen() {
        this.gameOver = true;
        this.isRunning = false;
        this.finalScoreElement.textContent = this.player.score;
        this.gameOverScreen.classList.remove('hidden');
        
        // Play game over sound
        this.soundManager.stopMusic();
        this.soundManager.play('gameOver');
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw background
        this.levelManager.update();
        this.levelManager.drawBackground();
        
        // Update player
        this.player.update();
        
        // Handle player shooting
        const newProjectiles = this.player.shoot();
        if (newProjectiles) {
            // Add all projectiles to the array
            newProjectiles.forEach(projectile => {
                this.playerProjectiles.push(projectile);
            });
            this.soundManager.play('playerShoot');
        }
        
        // Update player projectiles
        for (let i = this.playerProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.playerProjectiles[i];
            projectile.update();
            
            // Remove off-screen projectiles
            if (projectile.isOffScreen(this.canvas.width)) {
                this.playerProjectiles.splice(i, 1);
                continue;
            }
            
            // Check for collisions with enemies
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (projectile.collidesWith(enemy)) {
                    // Enemy hit
                    if (enemy.hit(projectile.damage)) {
                        // Enemy destroyed
                        this.player.addScore(enemy.points);
                        this.levelManager.enemyDefeated();
                        
                        // Play explosion sound
                        this.soundManager.play('explosion');
                        
                        // Check if it was a boss
                        if (enemy.type === 'boss') {
                            this.levelManager.bossDestroyed();
                            this.soundManager.play('bossExplode');
                        }
                        
                        // Check for power-up drop - adjusted by difficulty
                        let dropChance = 0.2; // Default medium
                        if (this.difficulty === 'Easy') dropChance = 0.3;
                        if (this.difficulty === 'Hard') dropChance = 0.1;
                        
                        if (Math.random() < dropChance) {
                            this.spawnPowerUp(enemy.x, enemy.y);
                        }
                        
                        // Check for splitter enemy
                        if (enemy.type === 'splitter') {
                            const smallerEnemies = enemy.split();
                            if (smallerEnemies) {
                                this.enemies.push(...smallerEnemies);
                            }
                        }
                        
                        this.enemies.splice(j, 1);
                    }
                    
                    // Remove projectile
                    this.playerProjectiles.splice(i, 1);
                    break;
                }
            }
        }
        
        // Update enemy projectiles
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.enemyProjectiles[i];
            projectile.update();
            
            // Remove off-screen projectiles
            if (projectile.isOffScreen(this.canvas.width)) {
                this.enemyProjectiles.splice(i, 1);
                continue;
            }
            
            // Check for collision with player
            if (projectile.collidesWith(this.player)) {
                // Player hit
                if (this.player.hit()) {
                    // Game over
                    this.showGameOverScreen();
                    return;
                } else {
                    // Player was hit but not killed
                    this.soundManager.play('playerHit');
                }
                
                // Remove projectile
                this.enemyProjectiles.splice(i, 1);
            }
        }
        
        // Update power-ups
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.update();
            
            // Remove off-screen power-ups
            if (powerUp.isOffScreen()) {
                this.powerUps.splice(i, 1);
                continue;
            }
            
            // Check for collision with player
            if (this.checkCollision(powerUp, this.player)) {
                // Apply power-up effect
                powerUp.applyEffect(this.player, this);
                
                // Remove power-up
                this.powerUps.splice(i, 1);
            }
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const action = enemy.update();
            
            // Handle special enemy actions
            if (action === 'bomb') {
                this.enemyProjectiles.push(enemy.shoot());
            }
            
            // Remove off-screen enemies
            if (enemy.isOffScreen()) {
                this.enemies.splice(i, 1);
                continue;
            }
            
            // Check for collision with player
            if (this.checkCollision(enemy, this.player)) {
                // Player hit
                if (this.player.hit()) {
                    // Game over
                    this.showGameOverScreen();
                    return;
                } else {
                    // Player was hit but not killed
                    this.soundManager.play('playerHit');
                }
                
                // Remove enemy
                this.enemies.splice(i, 1);
                continue;
            }
            
            // Enemy shooting - adjusted by difficulty
            let shootChance = enemy.getShootChance();
            if (this.difficulty === 'Easy') shootChance *= 0.7;
            if (this.difficulty === 'Hard') shootChance *= 1.3;
            
            if (Math.random() < shootChance) {
                this.enemyProjectiles.push(enemy.shoot());
                this.soundManager.play('enemyShoot');
            }
        }
        
        // Spawn enemies
        this.enemySpawnTimer--;
        if (this.enemySpawnTimer <= 0 && !this.levelManager.bossSpawned) {
            this.spawnEnemy();
            this.enemySpawnTimer = this.levelManager.getEnemySpawnRate();
        }
        
        // Draw everything
        this.drawGame();
        
        // Continue game loop
        requestAnimationFrame(() => this.gameLoop());
    }
    
    spawnEnemy() {
        try {
            console.log("Spawning enemy...");
            console.log("Enemy class exists:", typeof Enemy !== 'undefined');
            
            const enemyType = this.levelManager.getEnemyType();
            console.log("Enemy type:", enemyType);
            
            const newEnemy = new Enemy(this.canvas, enemyType, this.levelManager.currentLevel, this.difficulty);
            console.log("Enemy created:", newEnemy);
            
            this.enemies.push(newEnemy);
        } catch (error) {
            console.error("Error spawning enemy:", error);
        }
    }
    
    spawnPowerUp(x, y) {
        // Select random power-up type
        const types = ['shield', 'rapidFire', 'doubleDamage', 'extraLife', 'bomb'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        // Adjust extra life probability based on difficulty
        if (randomType === 'extraLife') {
            const extraLifeChance = this.difficulty === 'Easy' ? 0.8 : 
                                   (this.difficulty === 'Medium' ? 0.5 : 0.3);
            if (Math.random() > extraLifeChance) {
                // Replace with another power-up
                const otherTypes = types.filter(type => type !== 'extraLife');
                const newType = otherTypes[Math.floor(Math.random() * otherTypes.length)];
                this.powerUps.push(new PowerUp(x, y, newType));
                return;
            }
        }
        
        this.powerUps.push(new PowerUp(x, y, randomType));
    }
    
    drawGame() {
        // Draw power-ups
        this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
        
        // Draw player
        this.player.draw();
        
        // Draw enemies
        this.enemies.forEach(enemy => enemy.draw());
        
        // Draw projectiles
        this.playerProjectiles.forEach(projectile => projectile.draw(this.ctx));
        this.enemyProjectiles.forEach(projectile => projectile.draw(this.ctx));
        
        // Draw level info
        this.ctx.fillStyle = '#33ff33';
        this.ctx.font = '12px Courier New';
        this.ctx.fillText(`Enemies: ${this.levelManager.enemiesDefeated}/${this.levelManager.enemiesForNextLevel}`, 10, 20);
    }
    
    checkCollision(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
