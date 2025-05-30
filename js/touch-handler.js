/**
 * Direct touch handler for Space Impact
 * This implementation directly manipulates the player object
 */

// Wait for the page to fully load
window.addEventListener('load', function() {
    // Wait a bit to ensure game is fully initialized
    setTimeout(function() {
        setupDirectTouchControls();
    }, 1000);
});

function setupDirectTouchControls() {
    console.log("Setting up direct touch controls");
    
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) {
        console.error("Game canvas not found");
        return;
    }
    
    // Update the controls text
    const controlsText = document.getElementById('controlsText');
    if (controlsText) {
        controlsText.textContent = 'Touch and drag to move, auto-firing enabled';
    }
    
    // Add touch event listeners directly to the canvas
    gameCanvas.addEventListener('touchstart', handleTouch, { passive: false });
    gameCanvas.addEventListener('touchmove', handleTouch, { passive: false });
    
    // Function to handle touch events
    function handleTouch(e) {
        e.preventDefault();
        
        // Make sure the game is running
        if (!window.game || !window.game.isRunning) {
            return;
        }
        
        // Get the touch position relative to the canvas
        const rect = gameCanvas.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        const touchY = e.touches[0].clientY - rect.top;
        
        // Directly modify player position if available
        if (window.game.player) {
            // Set the player position directly
            window.game.player.x = touchX - (window.game.player.width / 2);
            window.game.player.y = touchY - (window.game.player.height / 2);
            
            // Force player to stay within bounds
            window.game.player.x = Math.max(0, Math.min(gameCanvas.width - window.game.player.width, window.game.player.x));
            window.game.player.y = Math.max(0, Math.min(gameCanvas.height - window.game.player.height, window.game.player.y));
            
            // Force shooting
            window.game.player.isShooting = true;
            
            console.log("Player moved to:", window.game.player.x, window.game.player.y);
        }
    }
    
    // Prevent default touch behaviors on the document
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Set up continuous auto-firing
    setInterval(function() {
        if (window.game && window.game.player && window.game.isRunning) {
            window.game.player.isShooting = true;
        }
    }, 50);
    
    console.log("Direct touch controls setup complete");
}
