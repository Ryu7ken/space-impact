class LevelManager {
    constructor(game) {
        this.game = game;
        this.currentLevel = 1;
        this.enemiesDefeated = 0;
        this.enemiesForNextLevel = 20;
        this.bossDefeated = false;
        this.bossSpawned = false;
        
        // Background stars
        this.stars = [];
        this.initStars();
        
        // Level themes
        this.levelThemes = [
            { name: "Space Sector Alpha", bgColor: "#000000" },
            { name: "Nebula Zone", bgColor: "#050520" },
            { name: "Asteroid Belt", bgColor: "#101010" },
            { name: "Red Planet Orbit", bgColor: "#200505" },
            { name: "Deep Space", bgColor: "#000015" },
            { name: "Black Hole Proximity", bgColor: "#050510" }
        ];
    }
    
    initStars() {
        const numStars = 100;
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.game.canvas.width,
                y: Math.random() * this.game.canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 2 + 1
            });
        }
    }
    
    updateStars() {
        for (let star of this.stars) {
            star.x -= star.speed;
            if (star.x < 0) {
                star.x = this.game.canvas.width;
                star.y = Math.random() * this.game.canvas.height;
            }
        }
    }
    
    drawStars() {
        const ctx = this.game.ctx;
        ctx.fillStyle = '#ffffff';
        for (let star of this.stars) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawBackground() {
        const ctx = this.game.ctx;
        
        // Get current theme
        const theme = this.levelThemes[(this.currentLevel - 1) % this.levelThemes.length];
        
        // Fill background
        ctx.fillStyle = theme.bgColor;
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        // Draw stars
        this.drawStars();
        
        // Draw level name
        ctx.fillStyle = '#33ff33';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'right';
        ctx.fillText(`${theme.name} - Level ${this.currentLevel}`, this.game.canvas.width - 10, 20);
    }
    
    enemyDefeated() {
        this.enemiesDefeated++;
        
        // Check if it's time to spawn a boss
        if (this.enemiesDefeated >= this.enemiesForNextLevel && !this.bossSpawned) {
            this.spawnBoss();
            this.bossSpawned = true;
            
            // Play boss appear sound
            if (this.game.soundManager) {
                this.game.soundManager.play('bossAppear');
            }
        }
    }
    
    bossDestroyed() {
        this.bossDefeated = true;
        
        // Play level up sound
        if (this.game.soundManager) {
            this.game.soundManager.play('levelUp');
        }
        
        this.advanceLevel();
    }
    
    advanceLevel() {
        this.currentLevel++;
        this.game.player.level = this.currentLevel;
        this.enemiesDefeated = 0;
        this.enemiesForNextLevel = 20 + this.currentLevel * 5;
        this.bossDefeated = false;
        this.bossSpawned = false;
    }
    
    spawnBoss() {
        this.game.enemies.push(new Enemy(this.game.canvas, 'boss', this.currentLevel));
    }
    
    getEnemySpawnRate() {
        // Decrease spawn interval as level increases
        return Math.max(30, 120 - this.currentLevel * 10);
    }
    
    getEnemyType() {
        const rand = Math.random();
        
        // Adjust enemy type probabilities based on level
        if (this.currentLevel <= 2) {
            if (rand < 0.7) return 'small';
            if (rand < 0.9) return 'medium';
            if (rand < 0.95) return 'large';
            if (rand < 0.98) return 'teleporter';
            return 'splitter';
        } else if (this.currentLevel <= 4) {
            if (rand < 0.5) return 'small';
            if (rand < 0.7) return 'medium';
            if (rand < 0.85) return 'large';
            if (rand < 0.92) return 'teleporter';
            if (rand < 0.97) return 'splitter';
            return 'bomber';
        } else {
            if (rand < 0.3) return 'small';
            if (rand < 0.5) return 'medium';
            if (rand < 0.65) return 'large';
            if (rand < 0.8) return 'teleporter';
            if (rand < 0.9) return 'splitter';
            return 'bomber';
        }
    }
}
