/**
 * Simplified Mobile Controls for Space Impact
 */

// Wait for DOM to be fully loaded and game to be initialized
window.addEventListener('load', function() {
    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        setupMobileControls();
    }
});

function setupMobileControls() {
    // Setting up simplified mobile touch controls
    
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) {
        console.error("Game canvas not found");
        return;
    }
    
    // Touch start event
    gameCanvas.addEventListener('touchstart', handleTouch, false);
    
    // Touch move event
    gameCanvas.addEventListener('touchmove', handleTouch, false);
    
    function handleTouch(e) {
        // Prevent default behavior (scrolling, zooming)
        e.preventDefault();
        
        if (!window.game || !window.game.player || !window.game.isRunning) {
            return;
        }
        
        // Get touch position relative to canvas
        const rect = gameCanvas.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        const touchY = e.touches[0].clientY - rect.top;
        
        // Get player reference
        const player = window.game.player;
        
        // Set player position directly (center on touch point)
        player.x = touchX - (player.width / 2);
        player.y = touchY - (player.height / 2);
        
        // Keep player within bounds
        player.x = Math.max(0, Math.min(gameCanvas.width - player.width, player.x));
        player.y = Math.max(0, Math.min(gameCanvas.height - player.height, player.y));
        
        // Enable shooting
        player.isShooting = true;
    }
    
    // Prevent all default touch behaviors on the document
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName !== 'BUTTON') {
            e.preventDefault();
        }
    }, { passive: false });
}
