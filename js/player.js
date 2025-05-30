class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Player dimensions
        this.width = 40;
        this.height = 20;
        
        // Player position
        this.x = 50;
        this.y = canvas.height / 2 - this.height / 2;
        
        // Player movement
        this.speed = 5;
        this.movingUp = false;
        this.movingDown = false;
        this.movingLeft = false;
        this.movingRight = false;
        
        // Player stats
        this.lives = 3;
        this.score = 0;
        this.level = 1;
        
        // Shooting
        this.isShooting = false;
        this.shootCooldown = 0;
        this.shootCooldownMax = 15; // frames between shots
        this.projectileDamage = 1;
        
        // Invulnerability after hit
        this.isInvulnerable = false;
        this.invulnerabilityTime = 0;
        this.invulnerabilityTimeMax = 60; // frames of invulnerability
        
        // Power-ups
        this.activePowerUps = {
            shield: 0,
            rapidFire: 0,
            doubleDamage: 0
        };
        
        // Setup event listeners
        this.setupControls();
    }
    
    setupControls() {
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.movingUp = true;
                    break;
                case 'ArrowDown':
                    this.movingDown = true;
                    break;
                case 'ArrowLeft':
                    this.movingLeft = true;
                    break;
                case 'ArrowRight':
                    this.movingRight = true;
                    break;
                case ' ':
                    this.isShooting = true;
                    break;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.movingUp = false;
                    break;
                case 'ArrowDown':
                    this.movingDown = false;
                    break;
                case 'ArrowLeft':
                    this.movingLeft = false;
                    break;
                case 'ArrowRight':
                    this.movingRight = false;
                    break;
                case ' ':
                    this.isShooting = false;
                    break;
            }
        });
    }
    
    update() {
        // Handle movement
        if (this.movingUp && this.y > 0) {
            this.y -= this.speed;
        }
        if (this.movingDown && this.y < this.canvas.height - this.height) {
            this.y += this.speed;
        }
        if (this.movingLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.movingRight && this.x < this.canvas.width - this.width) {
            this.x += this.speed;
        }
        
        // Handle shooting cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
        
        // Handle invulnerability
        if (this.isInvulnerable) {
            this.invulnerabilityTime--;
            if (this.invulnerabilityTime <= 0) {
                this.isInvulnerable = false;
            }
        }
        
        // Update power-ups
        for (const [powerUp, timeLeft] of Object.entries(this.activePowerUps)) {
            if (timeLeft > 0) {
                this.activePowerUps[powerUp]--;
            }
        }
        
        // Update UI
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
    }
    
    draw() {
        // Don't draw if invulnerable and should be blinking
        if (this.isInvulnerable && !this.hasPowerUp('shield') && Math.floor(this.invulnerabilityTime / 5) % 2 === 0) {
            return;
        }
        
        // Draw shield if active
        if (this.hasPowerUp('shield')) {
            this.ctx.beginPath();
            this.ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 
                    this.width * 0.8, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#00aaff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        // Draw player ship in pixel art style similar to original Space Impact
        const pixelSize = 2;
        this.ctx.fillStyle = '#33ff33';
        
        // Main body - rectangular shape
        this.ctx.fillRect(this.x + 10, this.y + 6, 20, 8);
        
        // Front part - triangular nose
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 30, this.y + 6);
        this.ctx.lineTo(this.x + 40, this.y + 10);
        this.ctx.lineTo(this.x + 30, this.y + 14);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Rear fins
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 10, this.y + 6);
        this.ctx.lineTo(this.x, this.y);
        this.ctx.lineTo(this.x + 10, this.y + 4);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 10, this.y + 14);
        this.ctx.lineTo(this.x, this.y + 20);
        this.ctx.lineTo(this.x + 10, this.y + 16);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Cockpit
        this.ctx.fillStyle = '#007700';
        this.ctx.fillRect(this.x + 16, this.y + 8, 8, 4);
        
        // Engine glow
        this.ctx.fillStyle = '#ff3333';
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y + 8);
        this.ctx.lineTo(this.x - 6, this.y + 10);
        this.ctx.lineTo(this.x, this.y + 12);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw power-up indicators
        this.drawPowerUpIndicators();
    }
    
    drawPowerUpIndicators() {
        let yOffset = 10;
        
        // Draw active power-up indicators
        for (const [powerUp, timeLeft] of Object.entries(this.activePowerUps)) {
            if (timeLeft > 0) {
                let color, symbol;
                
                switch(powerUp) {
                    case 'shield':
                        color = '#00aaff';
                        symbol = '🛡️';
                        break;
                    case 'rapidFire':
                        color = '#ff5500';
                        symbol = '🔥';
                        break;
                    case 'doubleDamage':
                        color = '#ff0000';
                        symbol = '💥';
                        break;
                }
                
                // Draw indicator
                this.ctx.fillStyle = color;
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText(`${symbol} ${Math.ceil(timeLeft / 60)}s`, 10, yOffset);
                yOffset += 20;
            }
        }
    }
    
    shoot() {
        if (this.isShooting && this.shootCooldown === 0) {
            // Adjust cooldown based on rapid fire power-up
            this.shootCooldown = this.hasPowerUp('rapidFire') ? 
                Math.floor(this.shootCooldownMax / 2) : this.shootCooldownMax;
            
            // Create projectile with damage based on double damage power-up
            const damage = this.hasPowerUp('doubleDamage') ? 2 : 1;
            return new Projectile(this.x + this.width, this.y + this.height / 2, false, damage);
        }
        return null;
    }
    
    hit() {
        // Shield absorbs the hit
        if (this.hasPowerUp('shield')) {
            return false;
        }
        
        if (!this.isInvulnerable) {
            this.lives--;
            this.isInvulnerable = true;
            this.invulnerabilityTime = this.invulnerabilityTimeMax;
            return this.lives <= 0;
        }
        return false;
    }
    
    addScore(points) {
        this.score += points;
    }
    
    activatePowerUp(type, duration) {
        this.activePowerUps[type] = duration;
    }
    
    hasPowerUp(type) {
        return this.activePowerUps[type] > 0;
    }
}
