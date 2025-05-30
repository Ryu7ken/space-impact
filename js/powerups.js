class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 20;
        this.height = 20;
        this.speed = 2;
        this.pulseValue = 0;
        this.pulseDirection = 0.05;
        
        // Set color and effect based on type
        this.setTypeProperties();
    }
    
    setTypeProperties() {
        switch(this.type) {
            case 'shield':
                this.color = '#00aaff';
                this.duration = 10 * 60; // 10 seconds at 60fps
                this.symbol = '🛡️';
                break;
                
            case 'rapidFire':
                this.color = '#ff5500';
                this.duration = 8 * 60; // 8 seconds at 60fps
                this.symbol = '🔥';
                break;
                
            case 'doubleDamage':
                this.color = '#ff0000';
                this.duration = 7 * 60; // 7 seconds at 60fps
                this.symbol = '💥';
                break;
                
            case 'extraLife':
                this.color = '#00ff00';
                this.duration = 0; // Instant effect
                this.symbol = '❤️';
                break;
                
            case 'bomb':
                this.color = '#ffff00';
                this.duration = 0; // Instant effect
                this.symbol = '💣';
                break;
        }
    }
    
    update() {
        // Move left
        this.x -= this.speed;
        
        // Pulse effect
        this.pulseValue += this.pulseDirection;
        if (this.pulseValue >= 1 || this.pulseValue <= 0) {
            this.pulseDirection *= -1;
        }
    }
    
    draw(ctx) {
        // Draw power-up in pixel art style
        ctx.fillStyle = this.color;
        
        // Base shape - pixel art capsule
        const pulseSize = 0.8 + this.pulseValue * 0.2;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // Draw based on power-up type
        switch(this.type) {
            case 'shield':
                // Shield - circular shield icon
                this.drawPixelCircle(ctx, centerX, centerY, 8 * pulseSize);
                ctx.fillStyle = '#000';
                this.drawPixelCircle(ctx, centerX, centerY, 4);
                ctx.fillStyle = this.color;
                ctx.fillRect(centerX - 1, centerY - 6, 2, 12);
                ctx.fillRect(centerX - 6, centerY - 1, 12, 2);
                break;
                
            case 'rapidFire':
                // Rapid fire - lightning bolt
                ctx.fillRect(centerX - 8, centerY - 8, 16, 16);
                ctx.fillStyle = '#000';
                ctx.fillRect(centerX - 6, centerY - 6, 12, 12);
                ctx.fillStyle = this.color;
                // Lightning shape
                ctx.fillRect(centerX - 2, centerY - 6, 4, 6);
                ctx.fillRect(centerX - 4, centerY - 1, 8, 2);
                ctx.fillRect(centerX - 2, centerY + 1, 4, 6);
                break;
                
            case 'doubleDamage':
                // Double damage - star shape
                this.drawPixelStar(ctx, centerX, centerY, 10 * pulseSize);
                break;
                
            case 'extraLife':
                // Extra life - heart shape
                this.drawPixelHeart(ctx, centerX, centerY, 8 * pulseSize);
                break;
                
            case 'bomb':
                // Bomb - bomb shape
                ctx.fillRect(centerX - 6, centerY - 2, 12, 8);
                ctx.fillRect(centerX - 2, centerY - 6, 4, 12);
                // Fuse
                ctx.fillRect(centerX, centerY - 8, 2, 4);
                ctx.fillRect(centerX + 2, centerY - 10, 2, 2);
                break;
        }
    }
    
    drawPixelCircle(ctx, x, y, radius) {
        // Draw a pixel art circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawPixelStar(ctx, x, y, size) {
        // Draw a pixel art star
        const outerRadius = size;
        const innerRadius = size / 2.5;
        
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = Math.PI * 2 * i / 10 - Math.PI / 2;
            const pointX = x + radius * Math.cos(angle);
            const pointY = y + radius * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(pointX, pointY);
            } else {
                ctx.lineTo(pointX, pointY);
            }
        }
        ctx.closePath();
        ctx.fill();
    }
    
    drawPixelHeart(ctx, x, y, size) {
        // Draw a pixel art heart
        const s = size / 8;
        
        // Draw heart shape using rectangles
        ctx.fillRect(x - 6*s, y - 2*s, 4*s, 2*s);
        ctx.fillRect(x + 2*s, y - 2*s, 4*s, 2*s);
        ctx.fillRect(x - 8*s, y, 16*s, 2*s);
        ctx.fillRect(x - 6*s, y + 2*s, 12*s, 2*s);
        ctx.fillRect(x - 4*s, y + 4*s, 8*s, 2*s);
        ctx.fillRect(x - 2*s, y + 6*s, 4*s, 2*s);
    }
    
    isOffScreen() {
        return this.x + this.width < 0;
    }
    
    applyEffect(player, game) {
        switch(this.type) {
            case 'shield':
                player.activatePowerUp('shield', this.duration);
                game.soundManager.play('powerUp');
                break;
                
            case 'rapidFire':
                player.activatePowerUp('rapidFire', this.duration);
                game.soundManager.play('powerUp');
                break;
                
            case 'doubleDamage':
                player.activatePowerUp('doubleDamage', this.duration);
                game.soundManager.play('powerUp');
                break;
                
            case 'extraLife':
                player.lives++;
                game.soundManager.play('powerUp');
                break;
                
            case 'bomb':
                // Destroy all enemies on screen
                game.enemies.forEach(enemy => {
                    player.addScore(enemy.points);
                    game.levelManager.enemyDefeated();
                });
                game.enemies = [];
                game.enemyProjectiles = [];
                game.soundManager.play('explosion');
                break;
        }
    }
}
