class LevelManager {
    constructor(game, difficulty = 'Medium') {
        this.game = game;
        this.difficulty = difficulty;
        this.currentLevel = 1;
        this.enemiesDefeated = 0;
        
        // Flag to prevent multiple level transitions
        this.levelTransitionInProgress = false;
        
        // Adjust enemies needed for next level based on difficulty
        if (difficulty === 'Easy') {
            this.enemiesForNextLevel = 15;
        } else if (difficulty === 'Medium') {
            this.enemiesForNextLevel = 20;
        } else { // Hard
            this.enemiesForNextLevel = 25;
        }
        
        this.bossDefeated = false;
        this.bossSpawned = false;
        
        // Background stars
        this.stars = [];
        this.initStars();
        
        // Background nebulas
        this.nebulas = [];
        this.initNebulas();
        
        // Asteroids for asteroid belt levels
        this.asteroids = [];
        
        // Level themes with enhanced environments
        this.levelThemes = [
            { 
                name: "Space Sector Alpha", 
                bgColor: "#000022",
                bgGradient: ["#000033", "#000011"],
                hasNebula: false,
                hasAsteroids: false,
                hasPlanets: false,
                starColor: "#ffffff"
            },
            { 
                name: "Nebula Zone", 
                bgColor: "#050520",
                bgGradient: ["#0a0a30", "#030318"],
                hasNebula: true,
                nebulaColors: ["#4b0082", "#800080"],
                hasAsteroids: false,
                hasPlanets: false,
                starColor: "#aaccff"
            },
            { 
                name: "Asteroid Belt", 
                bgColor: "#101010",
                bgGradient: ["#151515", "#0a0a0a"],
                hasNebula: false,
                hasAsteroids: true,
                hasPlanets: false,
                starColor: "#ffddaa"
            },
            { 
                name: "Red Planet Orbit", 
                bgColor: "#200505",
                bgGradient: ["#300808", "#100202"],
                hasNebula: false,
                hasAsteroids: false,
                hasPlanets: true,
                planetColor: "#aa3333",
                starColor: "#ffcccc"
            },
            { 
                name: "Deep Space", 
                bgColor: "#000015",
                bgGradient: ["#000025", "#00000a"],
                hasNebula: true,
                nebulaColors: ["#000066", "#000099"],
                hasAsteroids: false,
                hasPlanets: false,
                starColor: "#ffffff"
            },
            { 
                name: "Black Hole Proximity", 
                bgColor: "#050510",
                bgGradient: ["#0a0a20", "#020205"],
                hasNebula: true,
                nebulaColors: ["#110022", "#220033"],
                hasAsteroids: true,
                hasPlanets: false,
                hasBlackHole: true,
                starColor: "#aaaaff"
            }
        ];
    }
    
    initStars() {
        const numStars = 100;
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.game.canvas.width,
                y: Math.random() * this.game.canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.8 + 0.3, // Reduced speed range for smoother movement
                brightness: Math.random() * 0.5 + 0.5, // Varying brightness
                twinkleSpeed: Math.random() * 0.01 + 0.005, // Slower twinkle for gentler effect
                twinkleValue: Math.random()
            });
        }
    }
    
    initNebulas() {
        const numNebulas = 3;
        for (let i = 0; i < numNebulas; i++) {
            this.nebulas.push({
                x: Math.random() * this.game.canvas.width,
                y: Math.random() * this.game.canvas.height,
                width: Math.random() * 300 + 200,
                height: Math.random() * 200 + 100,
                speed: Math.random() * 0.08 + 0.02, // Much slower movement for nebulas
                opacity: Math.random() * 0.2 + 0.1,
                pulseSpeed: Math.random() * 0.002 + 0.001, // Very slow pulsing
                pulseValue: Math.random(),
                pulseDirection: 1
            });
        }
    }
    
    initAsteroids() {
        this.asteroids = [];
        const numAsteroids = 12; // Fewer asteroids
        for (let i = 0; i < numAsteroids; i++) {
            this.asteroids.push({
                x: Math.random() * this.game.canvas.width,
                y: Math.random() * this.game.canvas.height,
                size: Math.random() * 30 + 10,
                speed: Math.random() * 0.4 + 0.2, // Much slower asteroid movement
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.005, // Slower rotation
                vertices: Math.floor(Math.random() * 3) + 5, // 5-7 vertices
                irregularity: Math.random() * 0.3 + 0.7 // How irregular the shape is
            });
        }
    }
    
    updateStars() {
        for (let star of this.stars) {
            // Move stars
            star.x -= star.speed;
            if (star.x < 0) {
                star.x = this.game.canvas.width;
                star.y = Math.random() * this.game.canvas.height;
            }
            
            // Twinkle effect
            star.twinkleValue += star.twinkleSpeed;
            if (star.twinkleValue > 1) star.twinkleValue = 0;
        }
    }
    
    updateNebulas() {
        for (let nebula of this.nebulas) {
            // Slow horizontal movement
            nebula.x -= nebula.speed;
            if (nebula.x + nebula.width < 0) {
                nebula.x = this.game.canvas.width;
                nebula.y = Math.random() * this.game.canvas.height;
            }
            
            // Gentle pulsing effect
            nebula.pulseValue += nebula.pulseSpeed * nebula.pulseDirection;
            if (nebula.pulseValue > 1) {
                nebula.pulseValue = 1;
                nebula.pulseDirection = -1;
            } else if (nebula.pulseValue < 0.7) {
                nebula.pulseValue = 0.7;
                nebula.pulseDirection = 1;
            }
        }
    }
    
    updateAsteroids() {
        for (let asteroid of this.asteroids) {
            // Slow horizontal movement
            asteroid.x -= asteroid.speed;
            
            // Gentle rotation
            asteroid.rotation += asteroid.rotationSpeed;
            
            // Reset position when off-screen
            if (asteroid.x + asteroid.size < 0) {
                asteroid.x = this.game.canvas.width + asteroid.size;
                asteroid.y = Math.random() * this.game.canvas.height;
            }
        }
    }
    
    drawStars() {
        const ctx = this.game.ctx;
        const theme = this.getCurrentTheme();
        
        for (let star of this.stars) {
            // Calculate twinkle effect (sine wave) - gentler transition
            const twinkleFactor = 0.8 + Math.sin(star.twinkleValue * Math.PI * 2) * 0.2;
            
            // Draw star with softer glow effect
            const gradient = ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.size * 3
            );
            
            const starColor = theme.starColor || "#ffffff";
            gradient.addColorStop(0, starColor);
            gradient.addColorStop(0.4, `rgba(${parseInt(starColor.substr(1, 2), 16)}, ${parseInt(starColor.substr(3, 2), 16)}, ${parseInt(starColor.substr(5, 2), 16)}, 0.3)`);
            gradient.addColorStop(0.7, `rgba(${parseInt(starColor.substr(1, 2), 16)}, ${parseInt(starColor.substr(3, 2), 16)}, ${parseInt(starColor.substr(5, 2), 16)}, 0.1)`);
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
            
            ctx.globalAlpha = star.brightness * twinkleFactor;
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Star core - smaller and softer
            ctx.fillStyle = starColor;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 1;
        }
    }
    
    drawNebulas() {
        if (!this.getCurrentTheme().hasNebula) return;
        
        const ctx = this.game.ctx;
        const theme = this.getCurrentTheme();
        const nebulaColors = theme.nebulaColors || ["#4b0082", "#800080"];
        
        for (let nebula of this.nebulas) {
            // Apply gentle pulse effect to size
            const pulseScale = nebula.pulseValue || 1;
            
            // Create gradient for nebula with softer edges
            const gradient = ctx.createRadialGradient(
                nebula.x + nebula.width / 2, nebula.y + nebula.height / 2, 0,
                nebula.x + nebula.width / 2, nebula.y + nebula.height / 2, nebula.width / 2 * pulseScale
            );
            
            // Softer color transitions
            gradient.addColorStop(0, nebulaColors[0] + Math.floor(nebula.opacity * 180).toString(16).padStart(2, '0'));
            gradient.addColorStop(0.6, nebulaColors[0] + Math.floor(nebula.opacity * 100).toString(16).padStart(2, '0'));
            gradient.addColorStop(0.9, nebulaColors[1] + Math.floor(nebula.opacity * 50).toString(16).padStart(2, '0'));
            gradient.addColorStop(1, nebulaColors[1] + "00"); // Transparent at edges
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(
                nebula.x + nebula.width / 2, 
                nebula.y + nebula.height / 2,
                nebula.width / 2 * pulseScale,
                nebula.height / 2 * pulseScale,
                0, 0, Math.PI * 2
            );
            ctx.fill();
            
            // Add subtle stars within nebula instead of random circles
            const numStars = 3;
            ctx.fillStyle = "#ffffff";
            
            for (let i = 0; i < numStars; i++) {
                const starX = nebula.x + Math.random() * nebula.width;
                const starY = nebula.y + Math.random() * nebula.height;
                const distFromCenter = Math.sqrt(
                    Math.pow(starX - (nebula.x + nebula.width/2), 2) + 
                    Math.pow(starY - (nebula.y + nebula.height/2), 2)
                );
                
                // Only draw if within nebula bounds
                if (distFromCenter < nebula.width/2 * 0.8) {
                    const starSize = Math.random() * 1.5 + 0.5;
                    ctx.globalAlpha = Math.random() * 0.3 + 0.2;
                    ctx.beginPath();
                    ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1.0;
        }
    }
    
    drawAsteroids() {
        if (!this.getCurrentTheme().hasAsteroids) return;
        
        const ctx = this.game.ctx;
        
        for (let asteroid of this.asteroids) {
            ctx.save();
            ctx.translate(asteroid.x, asteroid.y);
            ctx.rotate(asteroid.rotation);
            
            // Create irregular asteroid shape with softer edges
            const baseColor = "#8B8B8B";
            const shadowColor = "#666666";
            const highlightColor = "#AAAAAA";
            
            // Draw asteroid shadow/glow for depth
            const shadowGradient = ctx.createRadialGradient(0, 0, asteroid.size * 0.5, 0, 0, asteroid.size * 1.2);
            shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0.2)");
            shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
            
            ctx.fillStyle = shadowGradient;
            ctx.beginPath();
            ctx.arc(5, 5, asteroid.size * 1.1, 0, Math.PI * 2);
            ctx.fill();
            
            // Main asteroid body with gradient for 3D effect
            const asteroidGradient = ctx.createRadialGradient(-asteroid.size * 0.3, -asteroid.size * 0.3, 0, 0, 0, asteroid.size);
            asteroidGradient.addColorStop(0, highlightColor);
            asteroidGradient.addColorStop(0.5, baseColor);
            asteroidGradient.addColorStop(1, shadowColor);
            
            ctx.fillStyle = asteroidGradient;
            ctx.beginPath();
            
            // Create smoother asteroid shape
            const points = [];
            for (let i = 0; i < asteroid.vertices; i++) {
                const angle = (Math.PI * 2 / asteroid.vertices) * i;
                // Use a consistent radius with small variations for a more natural look
                const radius = asteroid.size * (0.8 + Math.sin(angle * 3) * 0.1 + Math.cos(angle * 2) * 0.1);
                points.push({
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius
                });
            }
            
            // Draw with bezier curves for smoother shape
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 0; i < points.length; i++) {
                const p1 = points[i];
                const p2 = points[(i + 1) % points.length];
                
                // Control points for bezier curve
                const cp1x = p1.x + (p2.x - p1.x) * 0.3;
                const cp1y = p1.y + (p2.y - p1.y) * 0.1;
                const cp2x = p1.x + (p2.x - p1.x) * 0.7;
                const cp2y = p1.y + (p2.y - p1.y) * 0.9;
                
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
            }
            
            ctx.closePath();
            ctx.fill();
            
            // Add crater details - more defined and realistic
            const craters = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < craters; i++) {
                // Position craters more strategically
                const angle = (Math.PI * 2 / craters) * i + Math.random() * 0.5;
                const distance = Math.random() * asteroid.size * 0.5;
                const craterX = Math.cos(angle) * distance;
                const craterY = Math.sin(angle) * distance;
                const craterSize = Math.random() * asteroid.size * 0.15 + asteroid.size * 0.05;
                
                // Crater with gradient for 3D effect
                const craterGradient = ctx.createRadialGradient(
                    craterX, craterY, 0,
                    craterX, craterY, craterSize
                );
                craterGradient.addColorStop(0, shadowColor);
                craterGradient.addColorStop(0.7, darkenColor(shadowColor, 10));
                craterGradient.addColorStop(1, baseColor);
                
                ctx.fillStyle = craterGradient;
                ctx.beginPath();
                ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
                ctx.fill();
                
                // Add crater rim highlight
                ctx.strokeStyle = lightenColor(baseColor, 10);
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(craterX, craterY, craterSize * 0.8, Math.PI * 0.8, Math.PI * 1.5);
                ctx.stroke();
            }
            
            ctx.restore();
        }
    }
    
    drawPlanet() {
        if (!this.getCurrentTheme().hasPlanets) return;
        
        const ctx = this.game.ctx;
        const theme = this.getCurrentTheme();
        const planetColor = theme.planetColor || "#aa3333";
        
        // Draw planet in the background - fixed position
        const planetX = this.game.canvas.width * 0.8;
        const planetY = this.game.canvas.height * 0.5;
        const planetRadius = this.game.canvas.height * 0.4;
        
        // Planet atmosphere glow
        const atmosphereGradient = ctx.createRadialGradient(
            planetX, planetY, planetRadius * 0.95,
            planetX, planetY, planetRadius * 1.15
        );
        atmosphereGradient.addColorStop(0, `rgba(${parseInt(planetColor.substr(1, 2), 16)}, ${parseInt(planetColor.substr(3, 2), 16)}, ${parseInt(planetColor.substr(5, 2), 16)}, 0.3)`);
        atmosphereGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = atmosphereGradient;
        ctx.beginPath();
        ctx.arc(planetX, planetY, planetRadius * 1.15, 0, Math.PI * 2);
        ctx.fill();
        
        // Planet main body with enhanced gradient
        const gradient = ctx.createRadialGradient(
            planetX - planetRadius * 0.3, planetY - planetRadius * 0.3, 0,
            planetX, planetY, planetRadius
        );
        
        gradient.addColorStop(0, lightenColor(planetColor, 40));
        gradient.addColorStop(0.4, lightenColor(planetColor, 20));
        gradient.addColorStop(0.7, planetColor);
        gradient.addColorStop(0.9, darkenColor(planetColor, 20));
        gradient.addColorStop(1, darkenColor(planetColor, 40));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add surface details - more subtle and varied
        const detailColors = [
            darkenColor(planetColor, 15),
            darkenColor(planetColor, 25),
            lightenColor(planetColor, 10)
        ];
        
        // Create a consistent pattern of surface features
        ctx.save();
        ctx.beginPath();
        ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
        ctx.clip(); // Clip to planet circle
        
        // Large surface features - use smooth curves instead of jiggling circles
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = detailColors[i % detailColors.length];
            
            // Draw smooth continent-like shapes
            ctx.beginPath();
            const startX = planetX - planetRadius * 0.8 + (i * planetRadius * 0.4);
            const startY = planetY - planetRadius * 0.3 + (i * planetRadius * 0.3);
            
            // Create a smooth, flowing shape
            ctx.moveTo(startX, startY);
            
            // First curve - top part of continent
            ctx.bezierCurveTo(
                startX + planetRadius * 0.3, startY - planetRadius * 0.2,
                startX + planetRadius * 0.6, startY - planetRadius * 0.1,
                startX + planetRadius * 0.9, startY
            );
            
            // Second curve - right side
            ctx.bezierCurveTo(
                startX + planetRadius * 1.0, startY + planetRadius * 0.2,
                startX + planetRadius * 0.9, startY + planetRadius * 0.4,
                startX + planetRadius * 0.7, startY + planetRadius * 0.5
            );
            
            // Third curve - bottom part
            ctx.bezierCurveTo(
                startX + planetRadius * 0.5, startY + planetRadius * 0.6,
                startX + planetRadius * 0.2, startY + planetRadius * 0.5,
                startX, startY + planetRadius * 0.3
            );
            
            // Close the shape
            ctx.closePath();
            ctx.fill();
        }
        
        // Add some larger crater features
        ctx.fillStyle = darkenColor(planetColor, 30);
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * planetRadius * 0.7;
            const size = Math.random() * planetRadius * 0.1 + planetRadius * 0.05;
            
            const x = planetX + Math.cos(angle) * distance;
            const y = planetY + Math.sin(angle) * distance;
            
            // Draw crater with gradient for 3D effect
            const craterGradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, size
            );
            craterGradient.addColorStop(0, darkenColor(planetColor, 20));
            craterGradient.addColorStop(0.7, darkenColor(planetColor, 40));
            craterGradient.addColorStop(1, darkenColor(planetColor, 30));
            
            ctx.fillStyle = craterGradient;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
        
        // Add subtle highlight reflection
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.arc(planetX - planetRadius * 0.5, planetY - planetRadius * 0.5, planetRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawBlackHole() {
        if (!this.getCurrentTheme().hasBlackHole) return;
        
        const ctx = this.game.ctx;
        
        // Draw black hole in the background
        const holeX = this.game.canvas.width * 0.8;
        const holeY = this.game.canvas.height * 0.5;
        const holeRadius = this.game.canvas.height * 0.2;
        
        // Event horizon - softer gradient
        const gradient = ctx.createRadialGradient(
            holeX, holeY, 0,
            holeX, holeY, holeRadius * 2.5
        );
        
        gradient.addColorStop(0, "#000000");
        gradient.addColorStop(0.4, "#000000");
        gradient.addColorStop(0.7, "rgba(50, 0, 80, 0.3)");
        gradient.addColorStop(0.9, "rgba(30, 0, 50, 0.1)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(holeX, holeY, holeRadius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Black hole center
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(holeX, holeY, holeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Accretion disk - smooth, elegant design
        ctx.save();
        ctx.translate(holeX, holeY);
        ctx.rotate(performance.now() / 10000); // Very slow rotation
        
        // Create a more realistic accretion disk with multiple color bands
        const diskColors = [
            {stop: 0, color: "rgba(255, 100, 0, 0.7)"},
            {stop: 0.3, color: "rgba(255, 50, 0, 0.5)"},
            {stop: 0.6, color: "rgba(150, 20, 0, 0.3)"},
            {stop: 0.9, color: "rgba(100, 0, 0, 0.1)"},
            {stop: 1, color: "rgba(50, 0, 0, 0)"}
        ];
        
        // Draw the accretion disk as a smooth ellipse
        const diskGradient = ctx.createRadialGradient(0, 0, holeRadius, 0, 0, holeRadius * 1.8);
        diskColors.forEach(color => {
            diskGradient.addColorStop(color.stop, color.color);
        });
        
        ctx.fillStyle = diskGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, holeRadius * 1.8, holeRadius * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Add light distortion effect (gravitational lensing)
        ctx.strokeStyle = "rgba(255, 150, 50, 0.15)";
        ctx.lineWidth = 1.5;
        
        // Draw smooth curved light streaks
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const length = holeRadius * 2;
            
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * holeRadius * 1.1, Math.sin(angle) * holeRadius * 1.1);
            
            // Create a smooth curve that bends around the black hole
            const controlAngle = angle + Math.PI * 0.15;
            ctx.quadraticCurveTo(
                Math.cos(controlAngle) * holeRadius * 0.8,
                Math.sin(controlAngle) * holeRadius * 0.8,
                Math.cos(angle + Math.PI * 0.3) * length,
                Math.sin(angle + Math.PI * 0.3) * length
            );
            ctx.stroke();
        }
        
        // Add subtle glow around the event horizon
        const glowGradient = ctx.createRadialGradient(0, 0, holeRadius * 0.9, 0, 0, holeRadius * 1.2);
        glowGradient.addColorStop(0, "rgba(100, 0, 150, 0.2)");
        glowGradient.addColorStop(1, "rgba(100, 0, 150, 0)");
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(0, 0, holeRadius * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    drawBackground() {
        const ctx = this.game.ctx;
        
        // Get current theme
        const theme = this.getCurrentTheme();
        
        // Create background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, this.game.canvas.height);
        if (theme.bgGradient) {
            gradient.addColorStop(0, theme.bgGradient[0]);
            gradient.addColorStop(1, theme.bgGradient[1]);
        } else {
            gradient.addColorStop(0, theme.bgColor);
            gradient.addColorStop(1, darkenColor(theme.bgColor, 20));
        }
        
        // Fill background
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        // Draw environment elements based on theme
        if (theme.hasBlackHole) {
            this.drawBlackHole();
        }
        
        if (theme.hasPlanets) {
            this.drawPlanet();
        }
        
        if (theme.hasNebula) {
            this.drawNebulas();
        }
        
        if (theme.hasAsteroids) {
            this.drawAsteroids();
        }
        
        // Draw stars
        this.drawStars();
        
        // Draw level name with glow effect
        ctx.fillStyle = '#33ff33';
        ctx.shadowColor = '#33ff33';
        ctx.shadowBlur = 10;
        ctx.font = '14px "Courier New", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${theme.name} - Level ${this.currentLevel}`, this.game.canvas.width - 20, 30);
        ctx.shadowBlur = 0;
    }
    
    getCurrentTheme() {
        return this.levelThemes[(this.currentLevel - 1) % this.levelThemes.length];
    }
    
    update() {
        this.updateStars();
        
        if (this.getCurrentTheme().hasNebula) {
            this.updateNebulas();
        }
        
        if (this.getCurrentTheme().hasAsteroids) {
            this.updateAsteroids();
        }
        
        // Initialize asteroids if needed for this level
        if (this.getCurrentTheme().hasAsteroids && this.asteroids.length === 0) {
            this.initAsteroids();
        }
    }
    
    enemyDefeated() {
        // Don't count enemies if game is over or if this isn't the current game instance
        if (this.game && (this.game.gameOver || this.game !== window.game)) {
            return;
        }
        
        this.enemiesDefeated++;
        // Enemy defeated: ${this.enemiesDefeated}/${this.enemiesForNextLevel}
        
        // Check if it's time to spawn a boss
        if (this.enemiesDefeated >= this.enemiesForNextLevel && !this.bossSpawned && !this.levelTransitionInProgress) {
            // Spawning boss!
            this.spawnBoss();
            this.bossSpawned = true;
            
            // Play boss appear sound
            if (this.game.soundManager) {
                this.game.soundManager.play('bossAppear');
            }
        }
    }
    
    bossDestroyed() {
        // Prevent multiple calls
        if (this.levelTransitionInProgress) {
            // Level transition already in progress, ignoring duplicate call
            return;
        }
        
        // Boss destroyed! Preparing level transition...
        this.bossDefeated = true;
        this.levelTransitionInProgress = true;
        
        // Play level up sound
        if (this.game.soundManager) {
            this.game.soundManager.play('levelUp');
        }
        
        // Clear all enemies and projectiles to prevent collisions during level transition
        if (this.game) {
            // Clear all enemies except the boss (which will be removed after transition)
            this.game.enemies = this.game.enemies.filter(enemy => enemy.type === 'boss');
            this.game.enemyProjectiles = [];
        }
        
        // Create a level transition effect
        this.startLevelTransitionEffect();
    }
    
    startLevelTransitionEffect() {
        // Create a transition overlay
        const overlay = document.createElement('div');
        overlay.id = 'levelTransitionOverlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 255, 0, 0)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '100';
        overlay.style.transition = 'background-color 0.5s ease-in-out';
        
        // Create level text
        const levelText = document.createElement('div');
        levelText.textContent = `LEVEL ${this.currentLevel + 1}`;
        levelText.style.color = '#33ff33';
        levelText.style.fontFamily = 'Courier New, monospace';
        levelText.style.fontSize = '48px';
        levelText.style.fontWeight = 'bold';
        levelText.style.opacity = '0';
        levelText.style.transition = 'opacity 0.5s ease-in-out';
        
        overlay.appendChild(levelText);
        document.querySelector('.game-container').appendChild(overlay);
        
        // Store player's current damage before level transition
        const currentDamage = this.game.player.projectileDamage;
        
        // Fade in
        setTimeout(() => {
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            levelText.style.opacity = '1';
        }, 100);
        
        // Hold
        setTimeout(() => {
            // Advance to next level
            this.advanceLevel();
            // Level advanced to: ${this.currentLevel}
            
            // Update level text
            levelText.textContent = `LEVEL ${this.currentLevel}`;
            
            // Double-check damage preservation
            if (this.game.player.projectileDamage !== currentDamage) {
                // Damage was not preserved, restoring
                this.game.player.projectileDamage = currentDamage;
            }
        }, 1000);
        
        // Fade out
        setTimeout(() => {
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            levelText.style.opacity = '0';
        }, 2000);
        
        // Remove overlay
        setTimeout(() => {
            overlay.remove();
        }, 2500);
    }
    
    advanceLevel() {
        // Store the current game instance to ensure we're working with the same one
        const gameInstance = this.game;
        
        this.currentLevel++;
        // Advancing to level: ${this.currentLevel}
        
        if (gameInstance && gameInstance.player) {
            // Store the current lives, score, and damage before updating level
            const currentLives = gameInstance.player.lives;
            const currentScore = gameInstance.player.score;
            const currentDamage = gameInstance.player.projectileDamage;
            const currentPowerUps = {...gameInstance.player.activePowerUps};
            
            // Update player level
            gameInstance.player.level = this.currentLevel;
            
            // Ensure lives, score, and damage are preserved
            // Make sure lives is a valid number
            if (typeof currentLives !== 'number' || isNaN(currentLives) || currentLives < 0) {
                console.error("Invalid lives value during level advancement:", currentLives);
                gameInstance.player.lives = 1; // Reset to 1 if invalid
            } else {
                gameInstance.player.lives = Math.max(1, currentLives); // Ensure at least 1 life
            }
            
            gameInstance.player.score = currentScore;
            
            // Preserve damage power-up
            gameInstance.player.projectileDamage = currentDamage;
            
            // Make player temporarily invulnerable during level transition
            gameInstance.player.isInvulnerable = true;
            gameInstance.player.invulnerabilityTime = 180; // 3 seconds at 60fps
            
            // Update UI immediately
            document.getElementById('lives').textContent = gameInstance.player.lives;
            document.getElementById('score').textContent = gameInstance.player.score;
            document.getElementById('level').textContent = this.currentLevel;
            
            // Clear any remaining enemies to ensure a clean level start
            gameInstance.enemies = [];
            gameInstance.enemyProjectiles = [];
        }
        
        this.enemiesDefeated = 0;
        
        // Adjust enemies needed for next level based on difficulty and current level
        const levelMultiplier = 5;
        if (this.difficulty === 'Easy') {
            this.enemiesForNextLevel = 15 + this.currentLevel * levelMultiplier;
        } else if (this.difficulty === 'Medium') {
            this.enemiesForNextLevel = 20 + this.currentLevel * levelMultiplier;
        } else { // Hard
            this.enemiesForNextLevel = 25 + this.currentLevel * levelMultiplier;
        }
        
        // Enemies needed for next level: ${this.enemiesForNextLevel}
        
        this.bossDefeated = false;
        this.bossSpawned = false;
        this.levelTransitionInProgress = false;
        
        // Reset asteroids for new level
        this.asteroids = [];
    }
    
    spawnBoss() {
        // Creating boss enemy for level
        // Create boss with appropriate difficulty
        const boss = new Enemy(this.game.canvas, 'boss', this.currentLevel, this.difficulty);
        this.game.enemies.push(boss);
    }
    
    getEnemySpawnRate() {
        // Base spawn rate adjusted by difficulty
        let baseRate = 120 - this.currentLevel * 10;
        
        switch(this.difficulty) {
            case 'Easy':
                baseRate = Math.max(40, baseRate + 20); // Slower spawning on easy
                break;
            case 'Hard':
                baseRate = Math.max(20, baseRate - 20); // Faster spawning on hard
                break;
            default: // Medium
                baseRate = Math.max(30, baseRate);
        }
        
        return baseRate;
    }
    
    getEnemyType() {
        const rand = Math.random();
        
        // Adjust enemy type probabilities based on level
        if (this.currentLevel <= 2) {
            if (rand < 0.7) return 'small';
            if (rand < 0.9) return 'medium';
            if (rand < 0.95) return 'large';
            if (rand < 0.98) return 'teleporter';
            return 'splitter';
        } else if (this.currentLevel <= 4) {
            if (rand < 0.5) return 'small';
            if (rand < 0.7) return 'medium';
            if (rand < 0.85) return 'large';
            if (rand < 0.92) return 'teleporter';
            if (rand < 0.97) return 'splitter';
            return 'bomber';
        } else {
            if (rand < 0.3) return 'small';
            if (rand < 0.5) return 'medium';
            if (rand < 0.65) return 'large';
            if (rand < 0.8) return 'teleporter';
            if (rand < 0.9) return 'splitter';
            return 'bomber';
        }
    }
}

// Helper functions for color manipulation
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return "#" + (
        0x1000000 +
        (R > 0 ? (R > 255 ? 255 : R) : 0) * 0x10000 +
        (G > 0 ? (G > 255 ? 255 : G) : 0) * 0x100 +
        (B > 0 ? (B > 255 ? 255 : B) : 0)
    ).toString(16).slice(1);
}
