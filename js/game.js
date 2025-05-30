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
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.finalScoreElement = document.getElementById('finalScore');
        
        // Event listeners
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.startGame());
        
        // Initialize sound manager
        this.soundManager = new SoundManager();
        
        // Initial setup
        this.showStartScreen();
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight - 80; // Account for header and controls
    }
    
    startGame() {
        // Hide screens
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        
        // Reset game state
        this.isRunning = true;
        this.gameOver = false;
        
        // Initialize game objects
        this.player = new Player(this.canvas);
        this.enemies = [];
        this.playerProjectiles = [];
        this.enemyProjectiles = [];
        this.powerUps = [];
        this.levelManager = new LevelManager(this);
        
        // Start background music
        this.soundManager.startMusic();
        
        // Start game loop
        this.gameLoop();
    }
    
    showStartScreen() {
        this.startScreen.classList.remove('hidden');
        this.gameOverScreen.classList.add('hidden');
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
        this.levelManager.updateStars();
        this.levelManager.drawBackground();
        
        // Update player
        this.player.update();
        
        // Handle player shooting
        const newProjectile = this.player.shoot();
        if (newProjectile) {
            this.playerProjectiles.push(newProjectile);
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
                        
                        // Check for power-up drop
                        const powerUp = enemy.dropPowerUp();
                        if (powerUp) {
                            this.powerUps.push(powerUp);
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
            
            // Enemy shooting
            if (enemy.shouldShoot()) {
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
        const enemyType = this.levelManager.getEnemyType();
        this.enemies.push(new Enemy(this.canvas, enemyType, this.levelManager.currentLevel));
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
