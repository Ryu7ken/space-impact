# Space Impact Web Game

A recreation of the classic Nokia Space Impact game for web browsers developed using Amazon Q.

![Space Impact Gameplay](/assets/Space%20Impact.gif)

## Features

### Core Gameplay
- Side-scrolling shooter with classic Space Impact gameplay
- Multiple enemy types with different behaviors and attack patterns
- Boss battles at the end of each level
- Level progression system with increasing difficulty

### Enhanced Features
1. **Power-Up System**
   - Shield: Temporary invulnerability
   - Rapid Fire: Increased shooting speed
   - Double Damage: Projectiles deal double damage
   - Extra Life: Adds one life
   - Bomb: Destroys all enemies on screen

3. **New Enemy Types**
   - Teleporter: Can teleport to different positions
   - Splitter: Splits into smaller enemies when destroyed
   - Bomber: Drops bombs that fall vertically

4. **Dynamic Environments**
   - Unique themed backgrounds for each level
   - Visual effects like nebulas, stars, and planets
   - Special environments including asteroid fields and black holes
   - Parallax scrolling for depth perception

5. **Mobile Support**
   - Touch controls for mobile devices
   - Responsive design that adapts to screen size
   - Landscape orientation detection for optimal gameplay
   - Auto-firing on mobile for easier control

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

### Desktop Controls
1. Use arrow keys to move your ship
2. Press spacebar to shoot
3. Collect power-ups to enhance your ship
4. Defeat all enemies and the boss to advance to the next level

### Mobile Controls
1. Touch and drag to move your ship
2. Auto-firing is enabled by default
3. Rotate to landscape mode for the best experience
4. Use the "Continue" button if prompted to rotate your device

## Difficulty Levels

The game offers three difficulty levels:
- **Easy**: More lives, slower enemies, higher power-up drop rate
- **Medium**: Balanced gameplay with standard lives, enemy speed, and power-up drops
- **Hard**: Fewer lives, faster enemies, lower power-up drop rate

## Browser Compatibility

This game is designed for both desktop and mobile browsers and has been tested on:
- Chrome
- Firefox
- Edge
- Safari
- Mobile Chrome (Android)
- Mobile Safari (iOS)

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

## Troubleshooting

If you encounter any issues:
- Make sure your browser supports HTML5 Canvas
- Check that JavaScript is enabled
- For mobile devices, ensure you're in landscape orientation
- If the game canvas appears blank, try refreshing the page

## Credits

![Original Space Impact](/assets/Space%20Impact%202.png)

This game is a recreation of the classic Space Impact game that was pre-loaded on Nokia phones like the Nokia 2100 or 3310.
