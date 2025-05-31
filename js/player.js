class Player {
    constructor(canvas, difficulty = 'Medium') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.difficulty = difficulty;
        
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
        
        // Player stats - adjusted by difficulty
        if (difficulty === 'Easy') {
            this.lives = 5;
        } else if (difficulty === 'Medium') {
            this.lives = 3;
        } else { // Hard
            this.lives = 2;
        }
        
        this.score = 0;
        this.level = 1;
        
        // Shooting
        this.isShooting = false;
        this.shootCooldown = 0;
        this.shootCooldownMax = difficulty === 'Hard' ? 18 : 15; // Slower shooting on hard
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
        
        // Store event handler references so they can be removed later
        this.keydownHandler = this.handleKeyDown.bind(this);
        this.keyupHandler = this.handleKeyUp.bind(this);
        
        // Setup event listeners - make sure to remove any existing ones first
        this.removeEventListeners();
        this.setupControls();
    }
    
    setupControls() {
        // Keyboard controls
        window.addEventListener('keydown', this.keydownHandler);
        window.addEventListener('keyup', this.keyupHandler);
        
        // Add event listeners for touch events on document
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }
    
    removeEventListeners() {
        // Remove any existing event listeners to prevent duplicates
        window.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('keyup', this.keyupHandler);
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);
    }
    
    handleKeyDown(e) {
        // Only process key events if the game is running
        if (window.game && (window.game.gameOver || !window.game.isRunning)) {
            return;
        }
        
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
    }
    
    handleKeyUp(e) {
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
            // Create shield glow effect
            const gradient = this.ctx.createRadialGradient(
                this.x + this.width / 2, this.y + this.height / 2, this.width * 0.4,
                this.x + this.width / 2, this.y + this.height / 2, this.width * 0.8
            );
            gradient.addColorStop(0, 'rgba(0, 170, 255, 0.1)');
            gradient.addColorStop(0.7, 'rgba(0, 170, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 170, 255, 0.1)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 
                    this.width * 0.8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Shield border
            this.ctx.beginPath();
            this.ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 
                    this.width * 0.8, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#00aaff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Shield hexagonal pattern
            this.ctx.strokeStyle = 'rgba(0, 170, 255, 0.5)';
            this.ctx.lineWidth = 1;
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const startX = this.x + this.width / 2 + Math.cos(angle) * this.width * 0.4;
                const startY = this.y + this.height / 2 + Math.sin(angle) * this.width * 0.4;
                const endX = this.x + this.width / 2 + Math.cos(angle) * this.width * 0.8;
                const endY = this.y + this.height / 2 + Math.sin(angle) * this.width * 0.8;
                
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
            }
        }
        
        // Draw player ship with enhanced graphics
        this.drawEnhancedShip();
        
        // Draw power-up indicators
        this.drawPowerUpIndicators();
        
        // Draw damage level indicator
        this.drawDamageLevel();
    }
    
    drawEnhancedShip() {
        // Main body gradient
        const bodyGradient = this.ctx.createLinearGradient(
            this.x, this.y + this.height / 2,
            this.x + this.width, this.y + this.height / 2
        );
        bodyGradient.addColorStop(0, '#1a7a1a');
        bodyGradient.addColorStop(0.4, '#33ff33');
        bodyGradient.addColorStop(1, '#88ff88');
        
        // Main body - sleek shape
        this.ctx.fillStyle = bodyGradient;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 10, this.y + 4);
        this.ctx.lineTo(this.x + 30, this.y + 4);
        this.ctx.lineTo(this.x + 40, this.y + 10);
        this.ctx.lineTo(this.x + 30, this.y + 16);
        this.ctx.lineTo(this.x + 10, this.y + 16);
        this.ctx.lineTo(this.x + 5, this.y + 10);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Cockpit with gradient
        const cockpitGradient = this.ctx.createLinearGradient(
            this.x + 16, this.y + 8,
            this.x + 24, this.y + 12
        );
        cockpitGradient.addColorStop(0, '#007700');
        cockpitGradient.addColorStop(0.5, '#00aa00');
        cockpitGradient.addColorStop(1, '#007700');
        
        this.ctx.fillStyle = cockpitGradient;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 16, this.y + 8);
        this.ctx.lineTo(this.x + 26, this.y + 8);
        this.ctx.lineTo(this.x + 24, this.y + 12);
        this.ctx.lineTo(this.x + 16, this.y + 12);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Wing details
        this.ctx.fillStyle = '#1a7a1a';
        
        // Top wing
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 15, this.y + 4);
        this.ctx.lineTo(this.x + 25, this.y + 4);
        this.ctx.lineTo(this.x + 20, this.y);
        this.ctx.lineTo(this.x + 10, this.y + 2);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Bottom wing
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 15, this.y + 16);
        this.ctx.lineTo(this.x + 25, this.y + 16);
        this.ctx.lineTo(this.x + 20, this.y + 20);
        this.ctx.lineTo(this.x + 10, this.y + 18);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Engine glow with gradient
        const engineGradient = this.ctx.createRadialGradient(
            this.x, this.y + 10, 1,
            this.x, this.y + 10, 8
        );
        engineGradient.addColorStop(0, '#ffffff');
        engineGradient.addColorStop(0.3, '#ffaa33');
        engineGradient.addColorStop(0.7, '#ff3333');
        engineGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        this.ctx.fillStyle = engineGradient;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y + 10, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Weapon hardpoints - base color (will be overridden by drawDamageLevel if powered up)
        if (this.projectileDamage <= 1) {
            this.ctx.fillStyle = '#555555';
            this.ctx.fillRect(this.x + 30, this.y + 5, 5, 2);
            this.ctx.fillRect(this.x + 30, this.y + 13, 5, 2);
        }
        
        // Highlight details
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 10, this.y + 4);
        this.ctx.lineTo(this.x + 30, this.y + 4);
        this.ctx.stroke();
    }
    
    drawDamageLevel() {
        // Draw damage level indicator
        const damageLevel = this.projectileDamage - 1; // Base damage is 1
        
        if (damageLevel > 0) {
            // Draw weapon glow based on damage level
            const glowSize = 3 + damageLevel;
            const glowAlpha = Math.min(0.7, 0.3 + (damageLevel * 0.1));
            
            // Draw weapon hardpoints with glow based on damage level
            let weaponColor;
            if (damageLevel <= 2) {
                weaponColor = '#33ff33'; // Green for low damage
            } else if (damageLevel <= 4) {
                weaponColor = '#ffaa00'; // Orange for medium damage
            } else if (damageLevel <= 6) {
                weaponColor = '#ff3333'; // Red for high damage
            } else {
                weaponColor = '#aa00ff'; // Purple for ultimate damage
            }
            
            // Draw enhanced weapon hardpoints
            this.ctx.fillStyle = weaponColor;
            
            // Top weapon
            this.ctx.fillRect(this.x + 30, this.y + 4, 7, 3);
            
            // Bottom weapon
            this.ctx.fillRect(this.x + 30, this.y + 13, 7, 3);
            
            // Weapon glow
            this.ctx.fillStyle = `rgba(${parseInt(weaponColor.substr(1, 2), 16)}, 
                                  ${parseInt(weaponColor.substr(3, 2), 16)}, 
                                  ${parseInt(weaponColor.substr(5, 2), 16)}, 
                                  ${glowAlpha})`;
            this.ctx.beginPath();
            this.ctx.arc(this.x + 35, this.y + 5.5, glowSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(this.x + 35, this.y + 14.5, glowSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw firing pattern indicator
            let patternText = "";
            if (this.hasPowerUp('rapidFire') && this.projectileDamage >= 3) {
                patternText = "Triple Shot";
            } else if (this.hasPowerUp('rapidFire') || this.projectileDamage >= 4) {
                patternText = "Double Shot";
            }
            
            if (patternText) {
                this.ctx.fillStyle = weaponColor;
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText(patternText, 10, this.canvas.height - 25);
            }
        }
    }
    
    drawPowerUpIndicators() {
        // Start y-offset below the game info
        let yOffset = 40;
        
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
                
                // Draw indicator with glow effect
                this.ctx.shadowColor = color;
                this.ctx.shadowBlur = 5;
                this.ctx.fillStyle = color;
                this.ctx.font = '14px Arial';
                this.ctx.textAlign = 'left';
                
                // Format time display - show minutes:seconds for longer durations
                let timeDisplay;
                const totalSeconds = Math.ceil(timeLeft / 60);
                if (totalSeconds >= 60) {
                    const minutes = Math.floor(totalSeconds / 60);
                    const seconds = totalSeconds % 60;
                    timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                } else {
                    timeDisplay = `${totalSeconds}s`;
                }
                
                this.ctx.fillText(`${symbol} ${timeDisplay}`, 10, yOffset);
                this.ctx.shadowBlur = 0;
                yOffset += 25;
            }
        }
        
        // Draw permanent damage boost indicator
        if (this.projectileDamage > 1) {
            const damageBoost = this.projectileDamage - 1;
            this.ctx.shadowColor = '#ff0000';
            this.ctx.shadowBlur = 5;
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`💥 Damage +${damageBoost} (Permanent)`, 10, yOffset);
            this.ctx.shadowBlur = 0;
        }
    }
    
    shoot() {
        // Check if player is shooting and cooldown is ready
        // Also check for auto-firing mode on mobile
        if ((this.isShooting || window.autoFiring) && this.shootCooldown === 0) {
            // Adjust cooldown based on rapid fire power-up
            this.shootCooldown = this.hasPowerUp('rapidFire') ? 
                Math.floor(this.shootCooldownMax / 3) : this.shootCooldownMax;
            
            // Calculate damage based on accumulated damage and double damage power-up
            const damage = this.hasPowerUp('doubleDamage') ? 
                this.projectileDamage * 2 : this.projectileDamage;
            
            // Create projectile array to return
            const projectiles = [];
            
            // Determine firing pattern based on damage and rapid fire
            if (this.hasPowerUp('rapidFire') && this.projectileDamage >= 3) {
                // Triple shot for high damage + rapid fire
                projectiles.push(new Projectile(this.x + this.width, this.y + this.height / 2, false, damage));
                projectiles.push(new Projectile(this.x + this.width, this.y + this.height / 2, false, damage, -6));
                projectiles.push(new Projectile(this.x + this.width, this.y + this.height / 2, false, damage, 6));
            } else if (this.hasPowerUp('rapidFire') || this.projectileDamage >= 4) {
                // Double shot for rapid fire or very high damage
                projectiles.push(new Projectile(this.x + this.width, this.y + this.height / 2 - 4, false, damage));
                projectiles.push(new Projectile(this.x + this.width, this.y + this.height / 2 + 4, false, damage));
            } else {
                // Single shot for normal firing
                projectiles.push(new Projectile(this.x + this.width, this.y + this.height / 2, false, damage));
            }
            
            return projectiles;
        }
        return null;
    }
    
    hit() {
        // Don't process hits if game is over
        if (window.game && window.game.gameOver) {
            console.log("Hit ignored - game is already over");
            return false;
        }
        
        // Shield absorbs the hit
        if (this.hasPowerUp('shield')) {
            console.log("Hit absorbed by shield");
            return false;
        }
        
        if (!this.isInvulnerable) {
            // Safety check - ensure lives is a valid number
            if (typeof this.lives !== 'number' || isNaN(this.lives)) {
                console.error("Invalid lives value:", this.lives);
                this.lives = 1; // Reset to 1 if invalid
            }
            
            this.lives = Math.max(0, this.lives - 1); // Ensure lives doesn't go below 0
            console.log(`Player hit! Lives remaining: ${this.lives}`);
            
            // Make player invulnerable after hit
            this.isInvulnerable = true;
            this.invulnerabilityTime = this.invulnerabilityTimeMax;
            
            // Update UI immediately
            document.getElementById('lives').textContent = this.lives;
            
            // Only return true (game over) if lives are actually 0
            if (this.lives <= 0) {
                console.log("Player out of lives - Game Over");
                return true;
            }
            return false;
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
