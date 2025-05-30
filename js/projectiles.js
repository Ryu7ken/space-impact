class Projectile {
    constructor(x, y, isEnemy = false, damage = 1, offsetY = 0) {
        this.x = x;
        this.y = y + offsetY; // Allow vertical offset for multiple bullets
        this.width = 12;
        this.height = 6;
        this.speed = isEnemy ? -8 : 12; // Increased player bullet speed
        this.isEnemy = isEnemy;
        this.damage = damage;
        
        // Set color based on type and damage
        if (isEnemy) {
            this.color = '#ff3333';
            this.glowColor = '#ff6666';
        } else {
            // Player projectile color based on damage
            if (damage <= 1) {
                this.color = '#33ff33';
                this.glowColor = '#66ff66';
            } else if (damage <= 3) {
                this.color = '#ffaa00';
                this.glowColor = '#ffcc33';
            } else if (damage <= 5) {
                this.color = '#ff3333';
                this.glowColor = '#ff6666';
            } else {
                this.color = '#aa00ff';
                this.glowColor = '#cc33ff';
            }
        }
        
        // Particle trail effect
        this.particles = [];
        this.particleTimer = 0;
    }
    
    update() {
        this.x += this.speed;
        
        // Update particle trail
        if (!this.isEnemy && this.damage > 1) {
            this.particleTimer++;
            if (this.particleTimer >= 3) {
                this.particleTimer = 0;
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    size: Math.random() * 2 + 1,
                    opacity: 1,
                    speed: Math.random() * 1 + 0.5
                });
            }
            
            // Update existing particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].opacity -= 0.05;
                this.particles[i].x -= this.particles[i].speed;
                
                if (this.particles[i].opacity <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }
    }
    
    draw(ctx) {
        // Draw particle trail first (behind projectile)
        if (!this.isEnemy && this.damage > 1) {
            for (const particle of this.particles) {
                ctx.fillStyle = `rgba(${parseInt(this.color.substr(1, 2), 16)}, 
                                      ${parseInt(this.color.substr(3, 2), 16)}, 
                                      ${parseInt(this.color.substr(5, 2), 16)}, 
                                      ${particle.opacity})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Add glow effect for higher damage projectiles
        if (!this.isEnemy && this.damage > 1) {
            ctx.shadowColor = this.glowColor;
            ctx.shadowBlur = Math.min(10, this.damage * 2);
        }
        
        if (!this.isEnemy) {
            // Player projectiles with enhanced graphics based on damage
            if (this.damage <= 1) {
                // Basic projectile - straight laser beam for better alignment
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y - 1.5, 12, 3);
                
                // Small glow at the tip
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(this.x + 10, this.y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.damage <= 3) {
                // Enhanced projectile - thicker beam
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y - 2.5, 14, 5);
                
                // Energy tip
                ctx.beginPath();
                ctx.moveTo(this.x + 14, this.y);
                ctx.lineTo(this.x + 18, this.y - 2);
                ctx.lineTo(this.x + 18, this.y + 2);
                ctx.closePath();
                ctx.fill();
                
                // Core highlight
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(this.x + 4, this.y - 1, 6, 2);
            } else if (this.damage <= 5) {
                // Advanced projectile - energy bolt
                ctx.fillStyle = this.color;
                
                // Main body - wider for better hit detection
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - 4);
                ctx.lineTo(this.x + 16, this.y);
                ctx.lineTo(this.x, this.y + 4);
                ctx.closePath();
                ctx.fill();
                
                // Core
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(this.x + 6, this.y, 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Ultimate projectile - plasma beam
                ctx.fillStyle = this.color;
                
                // Main body - even wider
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - 5);
                ctx.lineTo(this.x + 20, this.y);
                ctx.lineTo(this.x, this.y + 5);
                ctx.closePath();
                ctx.fill();
                
                // Energy core
                const gradient = ctx.createRadialGradient(
                    this.x + 7, this.y, 0,
                    this.x + 7, this.y, 5
                );
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.5, this.color);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x + 7, this.y, 4, 0, Math.PI * 2);
                ctx.fill();
                
                // Additional energy rings
                ctx.strokeStyle = this.glowColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(this.x + 7, this.y, 6, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else {
            // Enemy projectiles with enhanced graphics
            ctx.fillStyle = this.color;
            
            // Add glow effect
            ctx.shadowColor = this.glowColor;
            ctx.shadowBlur = 5;
            
            // Main body
            ctx.beginPath();
            ctx.moveTo(this.x + 8, this.y);
            ctx.lineTo(this.x, this.y - 2);
            ctx.lineTo(this.x, this.y + 2);
            ctx.closePath();
            ctx.fill();
            
            // Energy core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x + 4, this.y, 1, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Reset shadow effect
        ctx.shadowBlur = 0;
    }
    
    isOffScreen(canvasWidth) {
        return this.x > canvasWidth || this.x + this.width < 0;
    }
    
    collidesWith(entity) {
        return (
            this.x < entity.x + entity.width &&
            this.x + this.width > entity.x &&
            this.y - this.height/2 < entity.y + entity.height &&
            this.y + this.height/2 > entity.y
        );
    }
}
