// Enemy class definition
class Enemy {
    constructor(canvas, type, level = 1, difficulty = 'Medium') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.type = type;
        this.level = level;
        this.difficulty = difficulty;
        
        // Set properties based on enemy type
        this.setEnemyProperties();
        
        // Position enemy off-screen to the right
        this.x = canvas.width + Math.random() * 100;
        this.y = Math.random() * (canvas.height - this.height - 20) + 10;
        
        // Movement pattern
        this.movementPattern = Math.floor(Math.random() * 5); // Increased to 5 patterns
        this.movementCounter = 0;
        this.movementAmplitude = 30 + Math.random() * 30;
        this.movementSpeed = 0.05 + Math.random() * 0.03;
        this.baseY = this.y;
        
        // For teleporting enemies
        this.teleportCooldown = 0;
        this.teleportCooldownMax = 120; // 2 seconds at 60fps
        
        // For splitting enemies
        this.canSplit = type === 'splitter';
        this.splitCount = 0;
        
        // Apply difficulty modifiers after setting properties
        this.applyDifficultyModifiers();
    }
    
    setEnemyProperties() {
        switch(this.type) {
            case 'small':
                this.width = 25;
                this.height = 15;
                this.speed = 2 + this.level * 0.2;
                this.health = 1;
                this.maxHealth = 1;
                this.points = 10;
                this.shootChance = 0.002;
                this.shootCooldown = 120;
                this.color = '#ff3333';
                break;
                
            case 'medium':
                this.width = 35;
                this.height = 20;
                this.speed = 1.5 + this.level * 0.15;
                this.health = 2;
                this.maxHealth = 2;
                this.points = 20;
                this.shootChance = 0.005;
                this.shootCooldown = 100;
                this.color = '#ff9933';
                break;
                
            case 'large':
                this.width = 50;
                this.height = 30;
                this.speed = 1 + this.level * 0.1;
                this.health = 3;
                this.maxHealth = 3;
                this.points = 30;
                this.shootChance = 0.008;
                this.shootCooldown = 90;
                this.color = '#ff0099';
                break;
                
            case 'teleporter':
                this.width = 30;
                this.height = 30;
                this.speed = 1.8 + this.level * 0.15;
                this.health = 2;
                this.maxHealth = 2;
                this.points = 25;
                this.shootChance = 0.004;
                this.shootCooldown = 110;
                this.color = '#00ffff';
                break;
                
            case 'splitter':
                this.width = 40;
                this.height = 40;
                this.speed = 1.2 + this.level * 0.1;
                this.health = 2;
                this.maxHealth = 2;
                this.points = 35;
                this.shootChance = 0.003;
                this.shootCooldown = 120;
                this.color = '#ffff00';
                break;
                
            case 'bomber':
                this.width = 45;
                this.height = 25;
                this.speed = 0.8 + this.level * 0.1;
                this.health = 4;
                this.maxHealth = 4;
                this.points = 40;
                this.shootChance = 0.01;
                this.shootCooldown = 80;
                this.color = '#ff00ff';
                break;
                
            case 'boss':
                this.width = 80;
                this.height = 50;
                this.speed = 0.5 + this.level * 0.05;
                this.health = 10 + this.level * 2;
                this.maxHealth = 10 + this.level * 2;
                this.points = 100;
                this.shootChance = 0.02;
                this.shootCooldown = 60;
                this.color = '#ff00ff';
                break;
        }
    }
    
    applyDifficultyModifiers() {
        // Apply difficulty-based modifiers to enemy properties
        switch(this.difficulty) {
            case 'Easy':
                this.speed *= 0.8;
                this.health = Math.max(1, Math.floor(this.health * 0.8));
                this.maxHealth = this.health;
                this.shootCooldown = Math.floor(this.shootCooldown * 1.3);
                this.shootChance *= 0.7;
                break;
                
            case 'Hard':
                this.speed *= 1.3;
                this.health = Math.ceil(this.health * 1.3);
                this.maxHealth = this.health;
                this.shootCooldown = Math.floor(this.shootCooldown * 0.7);
                this.shootChance *= 1.3;
                this.points = Math.floor(this.points * 1.2); // More points on hard
                break;
                
            // Medium is default, no changes needed
        }
    }
    
    update() {
        // Basic movement
        this.x -= this.speed;
        
        // Apply movement pattern
        switch(this.movementPattern) {
            case 0: // Straight line
                break;
                
            case 1: // Sine wave
                this.movementCounter += this.movementSpeed;
                this.y = this.baseY + Math.sin(this.movementCounter) * this.movementAmplitude;
                break;
                
            case 2: // Zigzag
                this.movementCounter += this.movementSpeed;
                this.y = this.baseY + ((this.movementCounter % (2 * Math.PI) > Math.PI) ? 1 : -1) * this.movementAmplitude;
                break;
                
            case 3: // Circle pattern
                this.movementCounter += this.movementSpeed;
                this.y = this.baseY + Math.sin(this.movementCounter) * this.movementAmplitude;
                this.x += Math.cos(this.movementCounter) * 1 - this.speed;
                break;
                
            case 4: // Erratic movement
                if (Math.random() < 0.05) {
                    this.baseY = Math.random() * (this.canvas.height - this.height - 20) + 10;
                }
                this.y += (this.baseY - this.y) * 0.05;
                break;
        }
        
        // Handle teleporting for teleporter enemies
        if (this.type === 'teleporter') {
            this.teleportCooldown++;
            if (this.teleportCooldown >= this.teleportCooldownMax) {
                // Teleport to a new position
                this.y = Math.random() * (this.canvas.height - this.height - 20) + 10;
                this.baseY = this.y;
                this.teleportCooldown = 0;
            }
        }
        
        // Handle bombing for bomber enemies
        if (this.type === 'bomber' && Math.random() < 0.01) {
            return 'bomb';
        }
        
        return null;
    }
    
    draw() {
        // Fade effect for teleporting enemies
        if (this.type === 'teleporter' && this.teleportCooldown > this.teleportCooldownMax - 10) {
            this.ctx.globalAlpha = 0.5;
        }
        
        // Draw enemy based on type
        this.ctx.fillStyle = this.color;
        
        switch(this.type) {
            case 'small':
                // Small enemy - pixel art style triangular ship
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + this.width, this.y + this.height / 2);
                this.ctx.lineTo(this.x, this.y);
                this.ctx.lineTo(this.x, this.y + this.height);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Details
                this.ctx.fillStyle = '#aa0000';
                this.ctx.fillRect(this.x + 5, this.y + 5, 5, 5);
                break;
                
            case 'medium':
                // Medium enemy - pixel art style rectangular ship
                this.ctx.fillRect(this.x, this.y + 5, 25, 10);
                this.ctx.fillRect(this.x + 25, this.y + 7, 10, 6);
                
                // Details
                this.ctx.fillStyle = '#aa5500';
                this.ctx.fillRect(this.x + 5, this.y + 7, 10, 6);
                this.ctx.fillRect(this.x + 20, this.y + 8, 5, 4);
                break;
                
            case 'large':
                // Large enemy - pixel art style bulky ship
                this.ctx.fillRect(this.x, this.y + 10, 40, 10);
                this.ctx.fillRect(this.x + 10, this.y + 5, 30, 20);
                this.ctx.fillRect(this.x + 40, this.y + 12, 10, 6);
                
                // Details
                this.ctx.fillStyle = '#aa0066';
                this.ctx.fillRect(this.x + 20, this.y + 10, 10, 10);
                this.ctx.fillRect(this.x + 35, this.y + 13, 5, 4);
                break;
                
            case 'teleporter':
                // Teleporter - pixel art style circular ship with glow
                // Outer circle
                this.ctx.beginPath();
                this.ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Inner details
                this.ctx.fillStyle = '#000';
                this.ctx.beginPath();
                this.ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 3, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Center core
                this.ctx.fillStyle = this.color;
                this.ctx.beginPath();
                this.ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 6, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Teleport effect
                if (this.teleportCooldown > this.teleportCooldownMax - 10) {
                    this.ctx.strokeStyle = '#00ffff';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 
                                this.width / 2 + 5, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
                break;
                
            case 'splitter':
                // Splitter - pixel art style octagonal ship
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 10, this.y);
                this.ctx.lineTo(this.x + 30, this.y);
                this.ctx.lineTo(this.x + 40, this.y + 10);
                this.ctx.lineTo(this.x + 40, this.y + 30);
                this.ctx.lineTo(this.x + 30, this.y + 40);
                this.ctx.lineTo(this.x + 10, this.y + 40);
                this.ctx.lineTo(this.x, this.y + 30);
                this.ctx.lineTo(this.x, this.y + 10);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Inner details
                this.ctx.fillStyle = '#aaaa00';
                this.ctx.beginPath();
                this.ctx.arc(this.x + 20, this.y + 20, 10, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Split line
                this.ctx.strokeStyle = '#000';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 5, this.y + 20);
                this.ctx.lineTo(this.x + 35, this.y + 20);
                this.ctx.stroke();
                break;
                
            case 'bomber':
                // Bomber - pixel art style wide ship with bombs
                this.ctx.fillRect(this.x, this.y + 5, 45, 15);
                
                // Wings
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 10, this.y);
                this.ctx.lineTo(this.x + 35, this.y);
                this.ctx.lineTo(this.x + 45, this.y + 5);
                this.ctx.lineTo(this.x, this.y + 5);
                this.ctx.closePath();
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 10, this.y + 20);
                this.ctx.lineTo(this.x + 35, this.y + 20);
                this.ctx.lineTo(this.x + 45, this.y + 25);
                this.ctx.lineTo(this.x, this.y + 25);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Bombs
                this.ctx.fillStyle = '#ffff00';
                this.ctx.beginPath();
                this.ctx.arc(this.x + 15, this.y + 25, 3, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.arc(this.x + 30, this.y + 25, 3, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'boss':
                // Boss - pixel art style large complex ship
                // Main body
                this.ctx.fillRect(this.x + 10, this.y + 10, 60, 30);
                
                // Front
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 70, this.y + 10);
                this.ctx.lineTo(this.x + 80, this.y + 25);
                this.ctx.lineTo(this.x + 70, this.y + 40);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Wings
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 10, this.y);
                this.ctx.lineTo(this.x + 60, this.y);
                this.ctx.lineTo(this.x + 70, this.y + 10);
                this.ctx.lineTo(this.x, this.y + 10);
                this.ctx.closePath();
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 10, this.y + 40);
                this.ctx.lineTo(this.x + 60, this.y + 40);
                this.ctx.lineTo(this.x + 70, this.y + 50);
                this.ctx.lineTo(this.x, this.y + 50);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Rear fins
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 10, this.y + 10);
                this.ctx.lineTo(this.x, this.y);
                this.ctx.lineTo(this.x, this.y + 10);
                this.ctx.closePath();
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 10, this.y + 40);
                this.ctx.lineTo(this.x, this.y + 50);
                this.ctx.lineTo(this.x, this.y + 35);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Details - cockpit and weapons
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(this.x + 25, this.y + 20, 10, 10);
                
                this.ctx.fillStyle = '#aa00aa';
                this.ctx.fillRect(this.x + 45, this.y + 5, 10, 5);
                this.ctx.fillRect(this.x + 45, this.y + 40, 10, 5);
                this.ctx.fillRect(this.x + 60, this.y + 15, 5, 20);
                break;
        }
        
        // Reset alpha
        this.ctx.globalAlpha = 1.0;
        
        // Draw health bar for enemies with more than 1 health
        if (this.maxHealth > 1) {
            const healthBarWidth = this.width;
            const healthBarHeight = 3;
            const healthPercentage = this.health / this.maxHealth;
            
            // Background
            this.ctx.fillStyle = '#333333';
            this.ctx.fillRect(this.x, this.y - 8, healthBarWidth, healthBarHeight);
            
            // Health
            this.ctx.fillStyle = '#33ff33';
            this.ctx.fillRect(this.x, this.y - 8, healthBarWidth * healthPercentage, healthBarHeight);
        }
    }
    
    hit(damage = 1) {
        this.health -= damage;
        return this.health <= 0;
    }
    
    isOffScreen() {
        return this.x + this.width < 0;
    }
    
    shouldShoot() {
        return Math.random() < this.shootChance;
    }
    
    getShootChance() {
        return this.shootChance;
    }
    
    shoot() {
        if (this.type === 'bomber') {
            // Bombers drop bombs downward
            const bomb = new Projectile(this.x + this.width / 2, this.y + this.height, true);
            bomb.speed = 3; // Slower than regular projectiles
            bomb.width = 8;
            bomb.height = 8;
            bomb.color = '#ffff00';
            // Override the draw method for bombs
            bomb.draw = function(ctx) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
                ctx.fill();
            };
            return bomb;
        }
        
        return new Projectile(this.x, this.y + this.height / 2, true);
    }
    
    split() {
        if (!this.canSplit || this.splitCount > 0) return null;
        
        this.splitCount++;
        
        // Create two smaller enemies
        const smallerEnemies = [];
        
        for (let i = 0; i < 2; i++) {
            const smallEnemy = new Enemy(this.canvas, 'small', this.level, this.difficulty);
            smallEnemy.x = this.x;
            smallEnemy.y = this.y + (i === 0 ? -20 : 20);
            smallEnemy.health = 1;
            smallEnemy.maxHealth = 1;
            smallEnemy.width = this.width * 0.6;
            smallEnemy.height = this.height * 0.6;
            smallerEnemies.push(smallEnemy);
        }
        
        return smallerEnemies;
    }
    
    dropPowerUp() {
        // This function is no longer used - power-ups are handled by the game class
        return null;
    }
}
