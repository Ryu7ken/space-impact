class Enemy {
    constructor(canvas, type, level) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.type = type;
        this.level = level;
        
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
    }
    
    setEnemyProperties() {
        switch(this.type) {
            case 'small':
                this.width = 25;
                this.height = 15;
                this.speed = 2 + this.level * 0.2;
                this.health = 1;
                this.points = 10;
                this.shootChance = 0.002;
                this.color = '#ff3333';
                break;
                
            case 'medium':
                this.width = 35;
                this.height = 20;
                this.speed = 1.5 + this.level * 0.15;
                this.health = 2;
                this.points = 20;
                this.shootChance = 0.005;
                this.color = '#ff9933';
                break;
                
            case 'large':
                this.width = 50;
                this.height = 30;
                this.speed = 1 + this.level * 0.1;
                this.health = 3;
                this.points = 30;
                this.shootChance = 0.008;
                this.color = '#ff0099';
                break;
                
            case 'teleporter':
                this.width = 30;
                this.height = 30;
                this.speed = 1.8 + this.level * 0.15;
                this.health = 2;
                this.points = 25;
                this.shootChance = 0.004;
                this.color = '#00ffff';
                break;
                
            case 'splitter':
                this.width = 40;
                this.height = 40;
                this.speed = 1.2 + this.level * 0.1;
                this.health = 2;
                this.points = 35;
                this.shootChance = 0.003;
                this.color = '#ffff00';
                break;
                
            case 'bomber':
                this.width = 45;
                this.height = 25;
                this.speed = 0.8 + this.level * 0.1;
                this.health = 4;
                this.points = 40;
                this.shootChance = 0.01;
                this.color = '#ff00ff';
                break;
                
            case 'boss':
                this.width = 80;
                this.height = 50;
                this.speed = 0.5 + this.level * 0.05;
                this.health = 10 + this.level * 2;
                this.points = 100;
                this.shootChance = 0.02;
                this.color = '#ff00ff';
                break;
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
        
        // Teleporter enemy behavior
        if (this.type === 'teleporter') {
            if (this.teleportCooldown > 0) {
                this.teleportCooldown--;
            } else if (Math.random() < 0.01) {
                // Teleport to a new position
                this.x = Math.min(this.canvas.width - this.width, this.x + (Math.random() < 0.5 ? -1 : 1) * 100);
                this.y = Math.random() * (this.canvas.height - this.height - 20) + 10;
                this.teleportCooldown = this.teleportCooldownMax;
            }
        }
        
        // Bomber enemy behavior - drops mini bombs
        if (this.type === 'bomber' && Math.random() < 0.005) {
            // This will be handled in the game class to create a bomb projectile
            return 'bomb';
        }
        
        // Keep enemy within canvas bounds
        if (this.y < 0) this.y = 0;
        if (this.y > this.canvas.height - this.height) this.y = this.canvas.height - this.height;
        
        return null;
    }
    
    draw() {
        // For teleporter, add teleport effect
        if (this.type === 'teleporter' && this.teleportCooldown > this.teleportCooldownMax - 10) {
            this.ctx.globalAlpha = 0.5;
        }
        
        this.ctx.fillStyle = this.color;
        
        // Draw different shapes based on enemy type in pixel art style
        switch(this.type) {
            case 'small':
                // Small enemy - pixel art style triangular ship
                this.ctx.fillRect(this.x, this.y + 6, 15, 3);
                this.ctx.fillRect(this.x + 5, this.y + 3, 15, 9);
                this.ctx.fillRect(this.x + 15, this.y + 6, 10, 3);
                
                // Details
                this.ctx.fillStyle = '#aa0000';
                this.ctx.fillRect(this.x + 8, this.y + 5, 4, 5);
                break;
                
            case 'medium':
                // Medium enemy - pixel art style wider ship
                this.ctx.fillRect(this.x, this.y + 8, 25, 4);
                this.ctx.fillRect(this.x + 5, this.y + 4, 20, 12);
                this.ctx.fillRect(this.x + 25, this.y + 8, 10, 4);
                
                // Details
                this.ctx.fillStyle = '#aa5500';
                this.ctx.fillRect(this.x + 15, this.y + 6, 6, 8);
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
                // Splitter - pixel art style square with X pattern
                this.ctx.fillRect(this.x, this.y, this.width, this.height);
                
                // X pattern
                this.ctx.strokeStyle = '#000';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 5, this.y + 5);
                this.ctx.lineTo(this.x + this.width - 5, this.y + this.height - 5);
                this.ctx.moveTo(this.x + this.width - 5, this.y + 5);
                this.ctx.lineTo(this.x + 5, this.y + this.height - 5);
                this.ctx.stroke();
                
                // Center dot
                this.ctx.fillStyle = '#000';
                this.ctx.beginPath();
                this.ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 4, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'bomber':
                // Bomber - pixel art style ship with bomb bay
                // Main body
                this.ctx.fillRect(this.x + 5, this.y, 35, 25);
                this.ctx.fillRect(this.x, this.y + 8, 5, 9);
                this.ctx.fillRect(this.x + 40, this.y + 8, 5, 9);
                
                // Bomb bay
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(this.x + 20, this.y + 20, 5, 5);
                
                // Details
                this.ctx.fillStyle = '#aa00aa';
                this.ctx.fillRect(this.x + 15, this.y + 5, 15, 10);
                break;
                
            case 'boss':
                // Boss - pixel art style large complex ship
                // Main body
                this.ctx.fillRect(this.x + 10, this.y + 10, 60, 30);
                
                // Front section
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 70, this.y + 15);
                this.ctx.lineTo(this.x + 80, this.y + 25);
                this.ctx.lineTo(this.x + 70, this.y + 35);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Rear fins
                this.ctx.beginPath();
                this.ctx.moveTo(this.x + 10, this.y + 10);
                this.ctx.lineTo(this.x, this.y);
                this.ctx.lineTo(this.x, this.y + 15);
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
        if (this.health > 1) {
            const healthBarWidth = this.width;
            const healthBarHeight = 3;
            const maxHealth = this.type === 'boss' ? (10 + this.level * 2) : 
                             (this.type === 'large' ? 3 : 
                             (this.type === 'bomber' ? 4 : 2));
            const healthPercentage = this.health / maxHealth;
            
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
            const smallEnemy = new Enemy(this.canvas, 'small', this.level);
            smallEnemy.x = this.x;
            smallEnemy.y = this.y + (i === 0 ? -20 : 20);
            smallEnemy.health = 1;
            smallEnemy.width = this.width * 0.6;
            smallEnemy.height = this.height * 0.6;
            smallerEnemies.push(smallEnemy);
        }
        
        return smallerEnemies;
    }
    
    dropPowerUp() {
        // Chance to drop a power-up when destroyed
        const dropChance = this.type === 'boss' ? 1.0 : 
                          (this.type === 'large' || this.type === 'bomber' ? 0.2 : 
                          (this.type === 'medium' || this.type === 'splitter' || this.type === 'teleporter' ? 0.1 : 0.05));
        
        if (Math.random() < dropChance) {
            // Determine power-up type
            let powerUpType;
            const rand = Math.random();
            
            if (this.type === 'boss') {
                // Boss always drops a good power-up
                if (rand < 0.4) powerUpType = 'shield';
                else if (rand < 0.7) powerUpType = 'rapidFire';
                else if (rand < 0.9) powerUpType = 'doubleDamage';
                else powerUpType = 'extraLife';
            } else {
                // Regular enemies
                if (rand < 0.3) powerUpType = 'shield';
                else if (rand < 0.6) powerUpType = 'rapidFire';
                else if (rand < 0.85) powerUpType = 'doubleDamage';
                else if (rand < 0.95) powerUpType = 'extraLife';
                else powerUpType = 'bomb';
            }
            
            return new PowerUp(this.x + this.width / 2, this.y + this.height / 2, powerUpType);
        }
        
        return null;
    }
}
