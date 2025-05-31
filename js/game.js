// Global game instance tracker
let gameInstance = null;

class Game {
    constructor() {
        // Singleton pattern - ensure only one game instance exists
        if (gameInstance) {
            // Game instance already exists, cleaning up old instance
            gameInstance.cleanup();
        }
        
        // Set this as the current game instance
        gameInstance = this;
        
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas dimensions
        this.resizeCanvas();
        this.resizeHandler = () => this.resizeCanvas();
        window.addEventListener('resize', this.resizeHandler);
        
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
        
        // Animation frame tracking
        this.animationFrameId = null;
        
        // Flag to prevent multiple game over triggers
        this.gameOverTriggered = false;
        
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
        
        // Store event handler references for cleanup
        this.startButtonHandler = () => this.showDifficultyScreen();
        this.restartButtonHandler = () => this.showDifficultyScreen();
        this.easyButtonHandler = () => this.selectDifficulty('Easy');
        this.mediumButtonHandler = () => this.selectDifficulty('Medium');
        this.hardButtonHandler = () => this.selectDifficulty('Hard');
        this.easyDescHandler = () => this.updateDifficultyDescription('Easy');
        this.mediumDescHandler = () => this.updateDifficultyDescription('Medium');
        this.hardDescHandler = () => this.updateDifficultyDescription('Hard');
        
        // Event listeners
        this.setupEventListeners();
    }
    
    // Clean up resources when a new game instance is created
    cleanup() {
        // Cleaning up game instance
        
        // Stop the game loop
        this.isRunning = false;
        this.gameOver = true;
        
        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.resizeHandler);
        
        // Remove button event listeners
        if (this.startButton) {
            this.startButton.removeEventListener('click', this.startButtonHandler);
        }
        if (this.restartButton) {
            this.restartButton.removeEventListener('click', this.restartButtonHandler);
        }
        if (this.easyButton) {
            this.easyButton.removeEventListener('click', this.easyButtonHandler);
            this.easyButton.removeEventListener('mouseover', this.easyDescHandler);
            this.easyButton.removeEventListener('touchstart', this.easyDescHandler);
        }
        if (this.mediumButton) {
            this.mediumButton.removeEventListener('click', this.mediumButtonHandler);
            this.mediumButton.removeEventListener('mouseover', this.mediumDescHandler);
            this.mediumButton.removeEventListener('touchstart', this.mediumDescHandler);
        }
        if (this.hardButton) {
            this.hardButton.removeEventListener('click', this.hardButtonHandler);
            this.hardButton.removeEventListener('mouseover', this.hardDescHandler);
            this.hardButton.removeEventListener('touchstart', this.hardDescHandler);
        }
        
        // Clean up player event listeners
        if (this.player) {
            window.removeEventListener('keydown', this.player.keydownHandler);
            window.removeEventListener('keyup', this.player.keyupHandler);
            document.removeEventListener('keydown', this.player.keydownHandler);
            document.removeEventListener('keyup', this.player.keyupHandler);
        }
        
        // Clear game objects
        this.enemies = [];
        this.playerProjectiles = [];
        this.enemyProjectiles = [];
        this.powerUps = [];
    }
    
    checkIfMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    setupEventListeners() {
        // Start and restart buttons
        this.startButton.addEventListener('click', this.startButtonHandler);
        this.restartButton.addEventListener('click', this.restartButtonHandler);
        
        // Difficulty buttons
        this.easyButton.addEventListener('click', this.easyButtonHandler);
        this.mediumButton.addEventListener('click', this.mediumButtonHandler);
        this.hardButton.addEventListener('click', this.hardButtonHandler);
        
        // Hover effects for difficulty descriptions
        this.easyButton.addEventListener('mouseover', this.easyDescHandler);
        this.mediumButton.addEventListener('mouseover', this.mediumDescHandler);
        this.hardButton.addEventListener('mouseover', this.hardDescHandler);
        
        // Touch events for mobile
        if (this.isMobile) {
            this.easyButton.addEventListener('touchstart', this.easyDescHandler);
            this.mediumButton.addEventListener('touchstart', this.mediumDescHandler);
            this.hardButton.addEventListener('touchstart', this.hardDescHandler);
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
        
        // Reset game over flag when starting a new game
        this.gameOverTriggered = false;
        
        this.startGame();
    }
    
    startGame() {
        // Starting game with selected difficulty
        
        // Cancel any existing animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
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
        this.gameOverTriggered = false;
        
        // Initialize game objects with difficulty settings
        this.player = new Player(this.canvas, this.difficulty);
        this.enemies = [];
        this.playerProjectiles = [];
        this.enemyProjectiles = [];
        this.powerUps = [];
        this.levelManager = new LevelManager(this, this.difficulty);
        
        // Make the game instance globally accessible
        window.game = this;
        
        // Update difficulty display
        this.difficultyDisplay.textContent = this.difficulty;
        
        // Set initial enemy spawn timer
        this.enemySpawnTimer = this.levelManager.getEnemySpawnRate();
        
        // Start background music
        this.soundManager.startMusic();
        
        // Make sure canvas is properly sized
        this.resizeCanvas();
        
        // Start game loop - ensure we're not starting multiple loops
        if (this.animationFrameId === null) {
            this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    showGameOverScreen() {
        // Prevent multiple game over triggers
        if (this.gameOverTriggered) {
            // Game over already triggered, ignoring duplicate call
            return;
        }
        
        // Double-check that player is actually out of lives
        if (this.player && this.player.lives > 0) {
            // Prevented false game over - player still has lives
            return; // Don't show game over if player still has lives
        }
        
        // Set flag to prevent multiple triggers
        this.gameOverTriggered = true;
        
        // Stop the game
        this.gameOver = true;
        this.isRunning = false;
        
        // Cancel any pending animation frames to prevent multiple game loops
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Update the final score
        this.finalScoreElement.textContent = this.player.score;
        
        // Show the game over screen
        this.gameOverScreen.classList.remove('hidden');
        
        // Play game over sound
        this.soundManager.stopMusic();
        this.soundManager.play('gameOver');
        
        // Clear all game objects to prevent any further processing
        this.enemies = [];
        this.enemyProjectiles = [];
        this.playerProjectiles = [];
        this.powerUps = [];
        
        // Completely disable player controls
        if (this.player) {
            this.player.movingUp = false;
            this.player.movingDown = false;
            this.player.movingLeft = false;
            this.player.movingRight = false;
            this.player.isShooting = false;
            
            // Remove event listeners to prevent any further input
            window.removeEventListener('keydown', this.player.keydownHandler);
            window.removeEventListener('keyup', this.player.keyupHandler);
            document.removeEventListener('keydown', this.player.keydownHandler);
            document.removeEventListener('keyup', this.player.keyupHandler);
        }
        
        // Force a complete redraw to ensure game over screen is visible
        this.drawGameOverState();
    }
    
    drawGameOverState() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw a dark overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // We're not drawing the Game Over text or score here anymore
        // as we're using the HTML game over screen instead
    }
    
    gameLoop() {
        // Don't continue if game is over or not running
        if (!this.isRunning || this.gameOver) {
            // Game loop stopped - game is over or not running
            return;
        }

        try {
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
            
            // Skip collision detection if level is transitioning
            const isLevelTransitioning = this.levelManager.bossDefeated;
            
            if (!isLevelTransitioning) {
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
                                    // Boss killed! Calling bossDestroyed()
                                    // Don't remove the boss yet - let the level transition happen first
                                    this.levelManager.bossDestroyed();
                                    this.soundManager.play('bossExplode');
                                    // Skip removing the boss from the array to prevent further collisions
                                    continue;
                                }
                                
                                // Chance to drop power-up
                                if (Math.random() < 0.2) { // 20% chance
                                    this.spawnPowerUp(enemy.x, enemy.y);
                                }
                                
                                // Check for splitter enemy
                                if (enemy.type === 'splitter') {
                                    const smallerEnemies = enemy.split();
                                    if (smallerEnemies) {
                                        this.enemies.push(...smallerEnemies);
                                    }
                                }
                                
                                // Remove enemy
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
                    if (projectile.collidesWith(this.player) && !this.player.isInvulnerable) {
                        // Skip collision if player is in level transition
                        if (this.levelManager.bossDefeated) {
                            continue;
                        }
                        
                        // Player hit
                        const isGameOver = this.player.hit();
                        if (isGameOver && !this.gameOverTriggered) {
                            // Double-check lives to prevent false game over
                            if (this.player.lives <= 0) {
                                // Game over triggered by enemy projectile hit
                                this.showGameOverScreen();
                                return;
                            } else {
                                // Prevented false game over - player still has lives
                            }
                        } else {
                            // Player was hit but not killed
                            this.soundManager.play('playerHit');
                        }
                        
                        // Remove projectile
                        this.enemyProjectiles.splice(i, 1);
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
                        // Skip collision if player is in level transition
                        if (this.levelManager.bossDefeated) {
                            continue;
                        }
                        
                        // Player hit
                        const isGameOver = this.player.hit();
                        if (isGameOver && !this.gameOverTriggered) {
                            // Double-check lives to prevent false game over
                            if (this.player.lives <= 0) {
                                // Game over triggered by enemy collision
                                this.showGameOverScreen();
                                return;
                            } else {
                                // Prevented false game over - player still has lives
                            }
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
            } else {
                // During level transition, still update player projectiles and power-ups
                // but don't check for collisions
                this.playerProjectiles.forEach(projectile => projectile.update());
                
                // Remove off-screen projectiles
                this.playerProjectiles = this.playerProjectiles.filter(p => !p.isOffScreen(this.canvas.width));
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
            
            // Spawn enemies
            this.enemySpawnTimer--;
            if (this.enemySpawnTimer <= 0 && !this.levelManager.bossSpawned && !this.levelManager.bossDefeated) {
                this.spawnEnemy();
                this.enemySpawnTimer = this.levelManager.getEnemySpawnRate();
            }
            
            // Draw everything
            this.drawGame();
            
            // Continue game loop if game is still running
            if (this.isRunning && !this.gameOver) {
                this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
            } else {
                // Game loop ended - game is no longer running or is over
            }
        } catch (error) {
            console.error("Error in game loop:", error);
            // If an error occurs, stop the game loop to prevent further errors
            this.isRunning = false;
            this.gameOver = true;
        }
    }
    
    spawnEnemy() {
        try {
            // Don't spawn regular enemies if boss is active
            if (this.levelManager.bossSpawned) {
                // Boss is active, skipping regular enemy spawn
                return;
            }
            
            // Spawning enemy...
            
            const enemyType = this.levelManager.getEnemyType();
            
            const newEnemy = new Enemy(this.canvas, enemyType, this.levelManager.currentLevel, this.difficulty);
            
            this.enemies.push(newEnemy);
        } catch (error) {
            console.error("Error spawning enemy:", error);
        }
    }
    
    spawnPowerUp(x, y) {
        // Select random power-up type
        const types = ['shield', 'rapidFire', 'doubleDamage', 'extraLife', 'bomb'];
        let randomType = types[Math.floor(Math.random() * types.length)];
        
        // Don't spawn bomb power-up if boss is active
        if (randomType === 'bomb' && this.levelManager.bossSpawned) {
            // Boss active, replacing bomb power-up with another type
            const otherTypes = types.filter(type => type !== 'bomb');
            randomType = otherTypes[Math.floor(Math.random() * otherTypes.length)];
        }
        
        // Adjust extra life probability based on difficulty
        if (randomType === 'extraLife') {
            const extraLifeChance = this.difficulty === 'Easy' ? 0.8 : 
                                   (this.difficulty === 'Medium' ? 0.5 : 0.3);
            if (Math.random() > extraLifeChance) {
                // Replace with another power-up
                const otherTypes = types.filter(type => type !== 'extraLife' && type !== 'bomb');
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
        
        // Draw game info (always visible)
        this.drawGameInfo();
    }
    
    drawGameInfo() {
        // Set up text style
        this.ctx.shadowColor = '#33ff33';
        this.ctx.shadowBlur = 3;
        this.ctx.fillStyle = '#33ff33';
        this.ctx.font = '14px Courier New';
        this.ctx.textAlign = 'left';
        
        // Draw only enemies killed counter at the top
        this.ctx.fillText(`Enemies: ${this.levelManager.enemiesDefeated}/${this.levelManager.enemiesForNextLevel}`, 10, 20);
        
        // Reset shadow for other elements
        this.ctx.shadowBlur = 0;
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
    // Create a single game instance
    window.game = new Game();
});
