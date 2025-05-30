class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 24;
        this.height = 24;
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
        
        // Draw based on power-up type with enhanced graphics
        switch(this.type) {
            case 'shield':
                // Shield - bubble shield with hexagonal pattern
                this.drawShield(-this.width/2, -this.height/2, this.width * pulseSize, ctx);
                break;
                
            case 'rapidFire':
                // Rapid fire - lightning bolt with energy waves
                this.drawRapidFire(-this.width/2, -this.height/2, this.width * pulseSize, ctx);
                break;
                
            case 'doubleDamage':
                // Double damage - explosive star with energy core
                this.drawDoubleDamage(-this.width/2, -this.height/2, this.width * pulseSize, ctx);
                break;
                
            case 'extraLife':
                // Extra life - detailed heart with pulse effect
                this.drawExtraLife(-this.width/2, -this.height/2, this.width * pulseSize, ctx);
                break;
                
            case 'bomb':
                // Bomb - detailed bomb with fuse and glow
                this.drawBomb(-this.width/2, -this.height/2, this.width * pulseSize, ctx);
                break;
        }
        
        // Restore context after rotation
        ctx.restore();
    }
    
    drawShield(x, y, size, ctx) {
        // Shield shape - hexagonal shield with glowing edges
        const radius = size / 2;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius);
        gradient.addColorStop(0, this.color + '80'); // Semi-transparent
        gradient.addColorStop(0.7, this.color + '40');
        gradient.addColorStop(1, this.color + '00'); // Transparent
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Shield hexagon
        ctx.fillStyle = this.secondaryColor;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const pointX = Math.cos(angle) * radius * 0.8;
            const pointY = Math.sin(angle) * radius * 0.8;
            
            if (i === 0) ctx.moveTo(pointX, pointY);
            else ctx.lineTo(pointX, pointY);
        }
        ctx.closePath();
        ctx.fill();
        
        // Inner shield
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const pointX = Math.cos(angle) * radius * 0.6;
            const pointY = Math.sin(angle) * radius * 0.6;
            
            if (i === 0) ctx.moveTo(pointX, pointY);
            else ctx.lineTo(pointX, pointY);
        }
        ctx.closePath();
        ctx.fill();
        
        // Center symbol
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawRapidFire(x, y, size, ctx) {
        const width = size;
        const height = size;
        
        // Background energy field
        const gradient = ctx.createRadialGradient(0, 0, width * 0.1, 0, 0, width * 0.6);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, this.color);
        gradient.addColorStop(1, this.secondaryColor);
        
        ctx.fillStyle = gradient;
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
        
        // Energy waves
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const waveRadius = (width * 0.7) + (i * width * 0.1);
            ctx.globalAlpha = 0.7 - (i * 0.2);
            ctx.beginPath();
            ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    
    drawDoubleDamage(x, y, size, ctx) {
        const radius = size / 2;
        
        // Explosive background
        const gradient = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, this.color);
        gradient.addColorStop(0.7, this.secondaryColor);
        gradient.addColorStop(1, '#330000');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Star shape
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        
        const outerRadius = radius * 0.9;
        const innerRadius = radius * 0.4;
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
        
        // Center core
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
        
        // Energy particles
        for (let i = 0; i < 12; i++) {
            const particleAngle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius * 0.8 + radius * 0.3;
            const particleX = Math.cos(particleAngle) * distance;
            const particleY = Math.sin(particleAngle) * distance;
            const particleSize = Math.random() * radius * 0.15 + radius * 0.05;
            
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = Math.random() * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    
    drawExtraLife(x, y, size, ctx) {
        const width = size;
        const height = size;
        
        // Heart glow
        const gradient = ctx.createRadialGradient(0, 0, width * 0.2, 0, 0, width * 0.7);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, this.secondaryColor);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Heart shape
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        
        // Left half of heart
        ctx.moveTo(0, height * 0.3);
        ctx.bezierCurveTo(
            -width * 0.4, -height * 0.3,
            -width * 0.8, height * 0.1,
            0, height * 0.5
        );
        
        // Right half of heart
        ctx.bezierCurveTo(
            width * 0.8, height * 0.1,
            width * 0.4, -height * 0.3,
            0, height * 0.3
        );
        
        ctx.closePath();
        ctx.fill();
        
        // Inner heart
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        // Left half of inner heart
        ctx.moveTo(0, height * 0.25);
        ctx.bezierCurveTo(
            -width * 0.3, -height * 0.2,
            -width * 0.6, height * 0.1,
            0, height * 0.4
        );
        
        // Right half of inner heart
        ctx.bezierCurveTo(
            width * 0.6, height * 0.1,
            width * 0.3, -height * 0.2,
            0, height * 0.25
        );
        
        ctx.closePath();
        ctx.fill();
        
        // Pulse rings
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        for (let i = 0; i < 2; i++) {
            ctx.globalAlpha = 0.7 - (i * 0.3);
            ctx.beginPath();
            ctx.arc(0, 0, (width * 0.7) + (i * width * 0.15), 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    
    drawBomb(x, y, size, ctx) {
        const width = size;
        const height = size;
        
        // Bomb glow
        const gradient = ctx.createRadialGradient(0, 0, width * 0.2, 0, 0, width * 0.7);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, this.color);
        gradient.addColorStop(0.7, this.secondaryColor);
        gradient.addColorStop(1, '#333300');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Bomb body
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(0, width * 0.1, width * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Bomb highlight
        ctx.fillStyle = '#666666';
        ctx.beginPath();
        ctx.arc(width * 0.1, 0, width * 0.15, 0, Math.PI * 2);
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
        ctx.quadraticCurveTo(width * 0.2, -width * 0.5, width * 0.1, -width * 0.7);
        ctx.stroke();
        
        // Fuse spark
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(width * 0.1, -width * 0.7, width * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Spark particles
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * width * 0.15;
            const sparkX = width * 0.1 + Math.cos(angle) * distance;
            const sparkY = -width * 0.7 + Math.sin(angle) * distance;
            const sparkSize = Math.random() * width * 0.05 + width * 0.02;
            
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = Math.random() * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
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
                // Permanently increase damage
                player.projectileDamage += 1;
                game.soundManager.play('powerUp');
                
                // Show temporary effect indicator
                player.activatePowerUp('doubleDamage', 3 * 60); // 3 second indicator
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
