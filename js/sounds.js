class SoundManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.isMuted = false;
        this.musicVolume = 0.4;
        this.sfxVolume = 0.6;
        
        // Initialize sounds
        this.initSounds();
        
        // Add mute toggle button to the game
        this.addMuteButton();
    }
    
    initSounds() {
        // Sound effects
        this.loadSound('playerShoot', 'assets/sounds/player_shoot.mp3');
        this.loadSound('enemyShoot', 'assets/sounds/enemy_shoot.mp3');
        this.loadSound('explosion', 'assets/sounds/explosion.mp3');
        this.loadSound('playerHit', 'assets/sounds/player_hit.mp3');
        this.loadSound('powerUp', 'assets/sounds/power_up.mp3');
        this.loadSound('bossAppear', 'assets/sounds/boss_appear.mp3');
        this.loadSound('bossExplode', 'assets/sounds/boss_explode.mp3');
        this.loadSound('levelUp', 'assets/sounds/level_up.mp3');
        this.loadSound('gameOver', 'assets/sounds/game_over.mp3');
        
        // Background music
        this.music = new Audio('assets/sounds/background_music.mp3');
        this.music.loop = true;
        this.music.volume = this.musicVolume;
    }
    
    loadSound(name, path) {
        this.sounds[name] = new Audio(path);
        this.sounds[name].volume = this.sfxVolume;
        
        // Add error handling for missing sound files
        this.sounds[name].onerror = () => {
            console.warn(`Sound file not found: ${path}`);
            // Create a silent audio element as fallback
            this.sounds[name] = new Audio();
            this.sounds[name].src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        };
    }
    
    play(soundName) {
        if (this.isMuted || !this.sounds[soundName]) return;
        
        // Clone the audio to allow overlapping sounds
        const sound = this.sounds[soundName].cloneNode();
        sound.volume = this.sfxVolume;
        sound.play().catch(e => console.warn('Audio play failed:', e));
    }
    
    startMusic() {
        if (this.isMuted) return;
        this.music.play().catch(e => console.warn('Music play failed:', e));
    }
    
    stopMusic() {
        this.music.pause();
        this.music.currentTime = 0;
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopMusic();
            document.getElementById('muteButton').textContent = '🔇';
        } else {
            this.startMusic();
            document.getElementById('muteButton').textContent = '🔊';
        }
        
        return this.isMuted;
    }
    
    addMuteButton() {
        // Create button element when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            const gameControls = document.querySelector('.game-controls');
            
            const muteButton = document.createElement('button');
            muteButton.id = 'muteButton';
            muteButton.textContent = '🔊';
            muteButton.style.position = 'absolute';
            muteButton.style.right = '10px';
            muteButton.style.top = '10px';
            muteButton.style.zIndex = '100';
            muteButton.style.background = 'transparent';
            muteButton.style.border = '1px solid #33ff33';
            muteButton.style.color = '#33ff33';
            muteButton.style.cursor = 'pointer';
            muteButton.style.width = '40px';
            muteButton.style.height = '40px';
            muteButton.style.borderRadius = '50%';
            muteButton.style.fontSize = '20px';
            muteButton.style.display = 'flex';
            muteButton.style.justifyContent = 'center';
            muteButton.style.alignItems = 'center';
            
            muteButton.addEventListener('click', () => this.toggleMute());
            
            document.querySelector('.game-container').appendChild(muteButton);
        });
    }
    
    // Create placeholder audio files for development
    createPlaceholderAudioFiles() {
        console.log('Creating placeholder audio files for development...');
        // This would be implemented in a real project to generate test audio files
    }
}
