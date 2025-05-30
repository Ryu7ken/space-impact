# Space Impact Web Game

A recreation of the classic Nokia Space Impact game for web browsers.

## Features

### Core Gameplay
- Side-scrolling shooter with classic Space Impact gameplay
- Multiple enemy types with different behaviors and attack patterns
- Boss battles at the end of each level
- Level progression system with increasing difficulty

### Enhanced Features
1. **Sound Effects & Music**
   - Background music similar to the original game
   - Sound effects for shooting, explosions, power-ups, etc.
   - Mute button to toggle sound on/off

2. **Power-Up System**
   - Shield: Temporary invulnerability
   - Rapid Fire: Increased shooting speed
   - Double Damage: Projectiles deal double damage
   - Extra Life: Adds one life
   - Bomb: Destroys all enemies on screen

3. **New Enemy Types**
   - Teleporter: Can teleport to different positions
   - Splitter: Splits into smaller enemies when destroyed
   - Bomber: Drops bombs that fall vertically

## Docker Installation

### Prerequisites
- Docker installed on your system
- Docker Compose (optional, for using docker-compose.yml)

### Quick Start
1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd space-impact
   ```

2. Using the build script:
   ```bash
   ./build-and-run.sh
   ```
   This will build and run the Docker container. The game will be available at http://localhost:8080

   OR

3. Using Docker Compose:
   ```bash
   docker-compose up -d
   ```
   This will also make the game available at http://localhost:8080

### Manual Docker Commands
If you prefer to run the Docker commands manually:

1. Build the image:
   ```bash
   docker build -t space-impact .
   ```

2. Run the container:
   ```bash
   docker run -d -p 8080:80 --name space-impact-game space-impact
   ```

3. Stop the container:
   ```bash
   docker stop space-impact-game
   ```

4. Remove the container:
   ```bash
   docker rm space-impact-game
   ```

## How to Play

1. Use arrow keys to move your ship
2. Press spacebar to shoot
3. Collect power-ups to enhance your ship
4. Defeat all enemies and the boss to advance to the next level

## Sound Files

The game requires the following sound files in the `assets/sounds` directory:
- player_shoot.mp3
- enemy_shoot.mp3
- explosion.mp3
- player_hit.mp3
- power_up.mp3
- boss_appear.mp3
- boss_explode.mp3
- level_up.mp3
- game_over.mp3
- background_music.mp3

For the best experience, use sound files that match the retro style of the original Nokia game.

## Browser Compatibility

This game is designed for desktop browsers and has been tested on:
- Chrome
- Firefox
- Edge
- Safari

## Development

To modify the game:
1. Make your changes to the source files
2. Rebuild the Docker image:
   ```bash
   docker-compose build
   # or
   docker build -t space-impact .
   ```
3. Restart the container with the new image

## Credits

This game is a fan recreation of the classic Nokia Space Impact game that was pre-loaded on Nokia phones like the 3310.
