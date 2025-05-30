class Projectile {
    constructor(x, y, isEnemy = false, damage = 1) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 3;
        this.speed = isEnemy ? -8 : 10;
        this.isEnemy = isEnemy;
        this.color = isEnemy ? '#ff3333' : '#33ff33';
        this.damage = damage;
    }
    
    update() {
        this.x += this.speed;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        
        if (!this.isEnemy) {
            // Player projectiles
            if (this.damage > 1) {
                // Double damage projectile - pixel art style
                ctx.fillRect(this.x, this.y - 3, 4, 6);
                ctx.fillRect(this.x + 4, this.y - 2, 4, 4);
                ctx.fillRect(this.x + 8, this.y - 1, 2, 2);
                
                // Glow effect
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(this.x + 4, this.y - 1, 2, 2);
            } else {
                // Regular projectile - pixel art style
                ctx.fillRect(this.x, this.y - 1, 6, 2);
                ctx.fillRect(this.x + 6, this.y - 1, 4, 2);
            }
        } else {
            // Enemy projectiles - pixel art style
            ctx.fillRect(this.x, this.y - 1, 6, 2);
            
            // Add a small tail
            ctx.fillRect(this.x + 6, this.y - 1, 2, 2);
        }
    }
    
    isOffScreen(canvasWidth) {
        return this.x > canvasWidth || this.x + this.width < 0;
    }
    
    collidesWith(entity) {
        return (
            this.x < entity.x + entity.width &&
            this.x + this.width > entity.x &&
            this.y < entity.y + entity.height &&
            this.y + this.height > entity.y
        );
    }
}
