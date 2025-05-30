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
                this.width = 28; // Slightly increased from original
                this.height = 18; // Slightly increased from original
                this.speed = 2 + this.level * 0.2;
                this.health = 1;
                this.maxHealth = 1;
                this.points = 10;
                this.shootChance = 0.002;
                this.shootCooldown = 120;
                this.color = '#ff3333';
                break;
                
            case 'medium':
                this.width = 38; // Slightly increased from original
                this.height = 22; // Slightly increased from original
                this.speed = 1.5 + this.level * 0.15;
                this.health = 2;
                this.maxHealth = 2;
                this.points = 20;
                this.shootChance = 0.005;
                this.shootCooldown = 100;
                this.color = '#ff9933';
                break;
                
            case 'large':
                this.width = 52; // Slightly increased from original
                this.height = 32; // Slightly increased from original
                this.speed = 1 + this.level * 0.1;
                this.health = 3;
                this.maxHealth = 3;
                this.points = 30;
                this.shootChance = 0.008;
                this.shootCooldown = 90;
                this.color = '#ff0099';
                break;
                
            case 'teleporter':
                this.width = 32; // Slightly increased from original
                this.height = 32; // Slightly increased from original
                this.speed = 1.8 + this.level * 0.15;
                this.health = 2;
                this.maxHealth = 2;
                this.points = 25;
                this.shootChance = 0.004;
                this.shootCooldown = 110;
                this.color = '#00ffff';
                break;
                
            case 'splitter':
                this.width = 42; // Slightly increased from original
                this.height = 42; // Slightly increased from original
                this.speed = 1.2 + this.level * 0.1;
                this.health = 2;
                this.maxHealth = 2;
                this.points = 35;
                this.shootChance = 0.003;
                this.shootCooldown = 120;
                this.color = '#ffff00';
                break;
                
            case 'bomber':
                this.width = 48; // Slightly increased from original
                this.height = 28; // Slightly increased from original
                this.speed = 0.8 + this.level * 0.1;
                this.health = 4;
                this.maxHealth = 4;
                this.points = 40;
                this.shootChance = 0.01;
                this.shootCooldown = 80;
                this.color = '#ff00ff';
                break;
                
            case 'boss':
                this.width = 85; // Slightly increased from original
                this.height = 55; // Slightly increased from original
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
                this.y = this.baseY + Math.sin(this.movementCounter * this.movementSpeed) * this.movementAmplitude;
                this.movementCounter++;
                break;
                
            case 2: // Zigzag
                if (this.movementCounter % 60 < 30) {
                    this.y += this.speed * 0.5;
                } else {
                    this.y -= this.speed * 0.5;
                }
                this.movementCounter++;
                break;
                
            case 3: // Circular
                this.y = this.baseY + Math.sin(this.movementCounter * this.movementSpeed) * this.movementAmplitude;
                this.x += Math.cos(this.movementCounter * this.movementSpeed) * this.speed * 0.5;
                this.movementCounter++;
                break;
                
            case 4: // Erratic
                if (Math.random() < 0.05) {
                    this.y += (Math.random() - 0.5) * 10;
                }
                break;
        }
        
        // Keep enemy within canvas bounds
        this.y = Math.max(0, Math.min(this.canvas.height - this.height, this.y));
        
        // Handle teleporting enemies
        if (this.type === 'teleporter') {
            this.teleportCooldown++;
            if (this.teleportCooldown >= this.teleportCooldownMax) {
                // Teleport to a new position
                this.y = Math.random() * (this.canvas.height - this.height - 20) + 10;
                this.teleportCooldown = 0;
            }
        }
        
        // Handle bomber enemies
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
                // Small enemy - simple triangular ship
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + this.width, this.y + this.height / 2);
                this.ctx.lineTo(this.x, this.y);
                this.ctx.lineTo(this.x, this.y + this.height);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Simple details
                this.ctx.fillStyle = '#aa0000';
                this.ctx.fillRect(this.x + 5, this.y + this.height/2 - 3, 5, 6);
                break;
                
            case 'medium':
                // Medium enemy - simple rectangular ship
                this.ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
                
                // Front point
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + this.width, this.y + this.height / 2);
                this.ctx.lineTo(this.x + this.width - 10, this.y + 5);
                this.ctx.lineTo(this.x + this.width - 10, this.y + this.height - 5);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Simple details
                this.ctx.fillStyle = '#aa5500';
                this.ctx.fillRect(this.x + 10, this.y + this.height/2 - 3, 8, 6);
                break;
                
            case 'large':
                // Large enemy - simple bulky ship
                this.ctx.fillRect(this.x + 10, this.y + 5, this.width - 20, this.height - 10);
                
                // Front section
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + this.width, this.y + this.height / 2);
                this.ctx.lineTo(this.x + this.width - 15, this.y + 5);
                this.ctx.lineTo(this.x + this.width - 15, this.y + this.height - 5);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Simple details
                this.ctx.fillStyle = '#aa0066';
                this.ctx.fillRect(this.x + 20, this.y + this.height/2 - 5, 10, 10);
                break;
                
            case 'teleporter':
                // Teleporter - simple circular ship
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
                break;
                
            case 'splitter':
                // Splitter - simple octagonal ship
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 10, this.y);
                this.ctx.lineTo(this.x + this.width - 10, this.y);
                this.ctx.lineTo(this.x + this.width, this.y + 10);
                this.ctx.lineTo(this.x + this.width, this.y + this.height - 10);
                this.ctx.lineTo(this.x + this.width - 10, this.y + this.height);
                this.ctx.lineTo(this.x + 10, this.y + this.height);
                this.ctx.lineTo(this.x, this.y + this.height - 10);
                this.ctx.lineTo(this.x, this.y + 10);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Simple details
                this.ctx.fillStyle = '#aaaa00';
                this.ctx.beginPath();
                this.ctx.arc(this.x + this.width/2, this.y + this.height/2, 10, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Split line
                this.ctx.strokeStyle = '#000';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + this.width/2, this.y + 5);
                this.ctx.lineTo(this.x + this.width/2, this.y + this.height - 5);
                this.ctx.stroke();
                break;
                
            case 'bomber':
                // Bomber - simple wide ship
                this.ctx.fillRect(this.x + 10, this.y + 5, this.width - 20, this.height - 10);
                
                // Front section
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + this.width, this.y + this.height / 2);
                this.ctx.lineTo(this.x + this.width - 10, this.y + 5);
                this.ctx.lineTo(this.x + this.width - 10, this.y + this.height - 5);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Bombs
                this.ctx.fillStyle = '#ffff00';
                this.ctx.beginPath();
                this.ctx.arc(this.x + 15, this.y + this.height + 3, 3, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.arc(this.x + 30, this.y + this.height + 3, 3, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'boss':
                // Boss - simplified large ship
                // Main hull
                this.ctx.fillRect(this.x + 20, this.y + 15, this.width - 40, this.height - 30);
                
                // Front section
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + this.width, this.y + this.height / 2);
                this.ctx.lineTo(this.x + this.width - 20, this.y + 15);
                this.ctx.lineTo(this.x + this.width - 20, this.y + this.height - 15);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Upper and lower hulls
                this.ctx.fillRect(this.x + 20, this.y, this.width - 40, 15);
                this.ctx.fillRect(this.x + 20, this.y + this.height - 15, this.width - 40, 15);
                
                // Rear section
                this.ctx.beginPath();
                this.ctx.moveTo(this.x, this.y + this.height / 2);
                this.ctx.lineTo(this.x + 20, this.y + 15);
                this.ctx.lineTo(this.x + 20, this.y + this.height - 15);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Command bridge
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(this.x + this.width - 40, this.y + this.height / 2 - 10, 15, 20);
                
                // Weapon systems
                this.ctx.fillStyle = '#ff00ff';
                this.ctx.fillRect(this.x + this.width - 15, this.y + this.height / 2 - 10, 15, 20);
                break;
        }
        
        // Reset alpha
        this.ctx.globalAlpha = 1.0;
        
        // Draw health bar for enemies with more than 1 health
        if (this.maxHealth > 1) {
            const healthBarWidth = this.width;
            const healthBarHeight = 3;
            const healthPercentage = this.health / this.maxHealth;
            
            // Health bar background
            this.ctx.fillStyle = '#333333';
            this.ctx.fillRect(this.x, this.y - 8, healthBarWidth, healthBarHeight);
            
            // Health bar fill
            this.ctx.fillStyle = healthPercentage > 0.5 ? '#00ff00' : healthPercentage > 0.25 ? '#ffff00' : '#ff0000';
            this.ctx.fillRect(this.x, this.y - 8, healthBarWidth * healthPercentage, healthBarHeight);
        }
    }
    
    hit(damage) {
        this.health -= damage;
        
        // Log when boss is about to be destroyed
        if (this.type === 'boss' && this.health <= 0) {
            console.log("Boss health reduced to zero or below:", this.health);
        }
        
        return this.health <= 0;
    }
    
    isOffScreen() {
        return this.x + this.width < 0;
    }
    
    getShootChance() {
        return this.shootChance;
    }
    
    shoot() {
        return new Projectile(this.x, this.y + this.height / 2, true);
    }
    
    split() {
        if (!this.canSplit || this.splitCount > 0) return null;
        
        const smallerEnemies = [];
        const halfWidth = this.width * 0.6;
        const halfHeight = this.height * 0.6;
        
        // Create two smaller splitter enemies
        for (let i = 0; i < 2; i++) {
            const smallerEnemy = new Enemy(this.canvas, 'small', this.level, this.difficulty);
            smallerEnemy.width = halfWidth;
            smallerEnemy.height = halfHeight;
            smallerEnemy.x = this.x;
            smallerEnemy.y = this.y + (i === 0 ? -halfHeight : halfHeight);
            smallerEnemy.health = 1;
            smallerEnemy.maxHealth = 1;
            smallerEnemy.canSplit = false;
            smallerEnemy.splitCount = 1;
            smallerEnemy.color = '#dddd00';
            
            smallerEnemies.push(smallerEnemy);
        }
        
        return smallerEnemies;
    }
}
