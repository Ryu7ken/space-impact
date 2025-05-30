class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 28; // Slightly increased from original
        this.height = 28; // Slightly increased from original
        this.speed = 2;
        this.pulseValue = 0;
        this.pulseDirection = 0.05;
        this.rotation = 0;
        this.rotationSpeed = 0.02;
        
        // Set color and effect based on type
        this.setTypeProperties();
    }
    
    setTypeProperties() {
        switch(this.type) {
            case 'shield':
                this.color = '#00aaff';
                this.secondaryColor = '#0066cc';
                this.duration = 10 * 60; // 10 seconds at 60fps
                this.symbol = '🛡️';
                break;
                
            case 'rapidFire':
                this.color = '#ff5500';
                this.secondaryColor = '#cc3300';
                this.duration = 30 * 60; // 30 seconds at 60fps
                this.symbol = '🔥';
                break;
                
            case 'doubleDamage':
                this.color = '#ff0000';
                this.secondaryColor = '#cc0000';
                this.duration = 0; // Permanent effect
                this.symbol = '💥';
                break;
                
            case 'extraLife':
                this.color = '#00ff00';
                this.secondaryColor = '#00cc00';
                this.duration = 0; // Instant effect
                this.symbol = '❤️';
                break;
                
            case 'bomb':
                this.color = '#ffff00';
                this.secondaryColor = '#cccc00';
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
        
        // Rotation effect
        this.rotation += this.rotationSpeed;
        if (this.rotation >= Math.PI * 2) {
            this.rotation = 0;
        }
    }
    
    draw(ctx) {
        const pulseSize = 0.8 + this.pulseValue * 0.2;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // Save context for rotation
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        
        // Draw based on power-up type with simplified graphics
        switch(this.type) {
            case 'shield':
                // Shield - simplified shield icon
                this.drawSimpleShield(-this.width/2, -this.height/2, this.width * pulseSize, ctx);
                break;
                
            case 'rapidFire':
                // Rapid fire - simplified lightning bolt
                this.drawSimpleRapidFire(-this.width/2, -this.height/2, this.width * pulseSize, ctx);
                break;
                
            case 'doubleDamage':
                // Double damage - simplified star
                this.drawSimpleDoubleDamage(-this.width/2, -this.height/2, this.width * pulseSize, ctx);
                break;
                
            case 'extraLife':
                // Extra life - simplified heart
                this.drawSimpleExtraLife(-this.width/2, -this.height/2, this.width * pulseSize, ctx);
                break;
                
            case 'bomb':
                // Bomb - simplified bomb
                this.drawSimpleBomb(-this.width/2, -this.height/2, this.width * pulseSize, ctx);
                break;
        }
        
        // Restore context after rotation
        ctx.restore();
    }
    
    drawSimpleShield(x, y, size, ctx) {
        const radius = size / 2;
        
        // Shield background
        ctx.fillStyle = this.secondaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // Shield symbol
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Draw a shield shape
        ctx.moveTo(0, -radius * 0.6);
        ctx.lineTo(radius * 0.6, 0);
        ctx.lineTo(0, radius * 0.6);
        ctx.lineTo(-radius * 0.6, 0);
        ctx.closePath();
        ctx.fill();
        
        // Center dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawSimpleRapidFire(x, y, size, ctx) {
        const width = size;
        const height = size;
        
        // Background circle
        ctx.fillStyle = this.secondaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Lightning bolt
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-width * 0.15, -height * 0.4);
        ctx.lineTo(width * 0.05, -height * 0.1);
        ctx.lineTo(-width * 0.1, -height * 0.05);
        ctx.lineTo(width * 0.15, height * 0.4);
        ctx.lineTo(width * 0.05, height * 0.1);
        ctx.lineTo(width * 0.2, height * 0.05);
        ctx.lineTo(-width * 0.15, -height * 0.4);
        ctx.closePath();
        ctx.fill();
    }
    
    drawSimpleDoubleDamage(x, y, size, ctx) {
        const radius = size / 2;
        
        // Background circle
        ctx.fillStyle = this.secondaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // Star shape
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        
        const outerRadius = radius * 0.7;
        const innerRadius = radius * 0.3;
        const spikes = 8;
        
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI / spikes) * i;
            const pointX = Math.cos(angle) * r;
            const pointY = Math.sin(angle) * r;
            
            if (i === 0) ctx.moveTo(pointX, pointY);
            else ctx.lineTo(pointX, pointY);
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Center dot
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawSimpleExtraLife(x, y, size, ctx) {
        const width = size;
        const height = size;
        
        // Background circle
        ctx.fillStyle = this.secondaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Heart shape
        ctx.fillStyle = '#ffffff';
        
        // Draw a simple heart
        ctx.beginPath();
        ctx.moveTo(0, height * 0.2);
        ctx.bezierCurveTo(
            -width * 0.3, -height * 0.2,
            -width * 0.5, height * 0.1,
            0, height * 0.4
        );
        ctx.bezierCurveTo(
            width * 0.5, height * 0.1,
            width * 0.3, -height * 0.2,
            0, height * 0.2
        );
        ctx.closePath();
        ctx.fill();
    }
    
    drawSimpleBomb(x, y, size, ctx) {
        const width = size;
        const height = size;
        
        // Background circle
        ctx.fillStyle = this.secondaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Bomb body
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(0, width * 0.1, width * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Bomb cap
        ctx.fillStyle = '#555555';
        ctx.beginPath();
        ctx.arc(0, -width * 0.3, width * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // Fuse
        ctx.strokeStyle = '#aa5500';
        ctx.lineWidth = width * 0.08;
        ctx.beginPath();
        ctx.moveTo(0, -width * 0.3);
        ctx.lineTo(0, -width * 0.5);
        ctx.stroke();
        
        // Fuse spark
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, -width * 0.5, width * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Add "No Boss" indicator
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = width * 0.05;
        ctx.beginPath();
        
        // Draw a small boss icon with a cross through it
        const bossSize = width * 0.2;
        const bossX = width * 0.3;
        const bossY = -width * 0.3;
        
        // Simple boss shape
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(bossX - bossSize/2, bossY - bossSize/2, bossSize, bossSize);
        
        // Red cross over boss
        ctx.beginPath();
        ctx.moveTo(bossX - bossSize/2, bossY - bossSize/2);
        ctx.lineTo(bossX + bossSize/2, bossY + bossSize/2);
        ctx.moveTo(bossX + bossSize/2, bossY - bossSize/2);
        ctx.lineTo(bossX - bossSize/2, bossY + bossSize/2);
        ctx.stroke();
    }
    
    isOffScreen() {
        return this.x + this.width < 0;
    }
    
    applyEffect(player, game) {
        switch(this.type) {
            case 'shield':
                player.activePowerUps.shield = this.duration;
                player.isInvulnerable = true;
                player.invulnerabilityTime = this.duration;
                game.soundManager.play('powerUp');
                break;
                
            case 'rapidFire':
                player.activePowerUps.rapidFire = this.duration;
                game.soundManager.play('powerUp');
                break;
                
            case 'doubleDamage':
                player.projectileDamage++;
                game.soundManager.play('powerUp');
                break;
                
            case 'extraLife':
                player.lives++;
                game.soundManager.play('powerUp');
                break;
                
            case 'bomb':
                // Destroy all enemies on screen except bosses
                const bosses = [];
                game.enemies.forEach(enemy => {
                    if (enemy.type === 'boss') {
                        // Save bosses to re-add later
                        bosses.push(enemy);
                    } else {
                        // Only add score and count defeated for non-boss enemies
                        player.addScore(enemy.points);
                        game.levelManager.enemyDefeated();
                    }
                });
                
                // Clear all enemies and projectiles
                game.enemies = [];
                game.enemyProjectiles = [];
                
                // Re-add bosses to the enemies array
                if (bosses.length > 0) {
                    game.enemies = bosses;
                    console.log("Bomb used: Boss is immune to bomb effect");
                }
                
                game.soundManager.play('explosion');
                break;
        }
    }
}
