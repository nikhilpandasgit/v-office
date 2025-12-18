# 2D Top-Down Web Game - Architecture Overview

## Tech Stack
- **Client**: Phaser 3 + Vite
- **Backend** (planned): FastAPI (for future multiplayer)

## Current State
- Client-only for now (no networking yet)
- Tilemap created in Tiled
- **Tile size**: 16×16
- **Tileset**: Embedded (`spritesheet.png`)

### Map Layers
1. `ground`
2. `ladders and paths`
3. `plants-and-buildings-and-trees`

### Object Layers
- `spawnpoints` (player/NPC spawn)
- `boundaries` (rectangular collision objects)

### Current Features
- Map renders correctly
- Camera follows player
- World bounds are set

## Architecture Decisions

### Character System (Not Hardcoded Players)
- **`Character` class**:
  - Owns a Phaser physics sprite
  - Handles movement + animations
  - Does **NOT** read keyboard input

- **`MainScene`**:
  - Orchestrates the world
  - Handles input
  - Decides which character is locally controlled
  - Characters stored in `Map<id, Character>`
  - One character = local player
  - Other characters = NPCs (moved via code, no input)

### Movement Model
- Input → direction vector → Character.move(dir, speed)

Same movement pipeline for:
- Player
- NPCs
- Future multiplayer entities

## Coordinate System (Implemented)

### Hierarchy
1. **Canonical source**: World pixel coordinates
2. **Derived systems**:
   - Tile coordinates (world → tile)
   - Region coordinates (tile → region)

### Helper Function
`getEntityLocation(sprite)` returns:
- `world {x, y}`
- `tile {x, y}`
- `region {x, y}`
- `regionId "x:y"`

### Purpose
- Debugging
- Future triggers
- Multiplayer preparation
- **Note**: Coordinates describe position, they do **NOT** drive physics.

## Collisions
- Boundaries = Tiled object-layer rectangles
- Converted into static physics bodies
- All characters collide with boundaries

## Camera
- Follows the local player's sprite
- Zoomed (pixel-art style)
- Clamped to world bounds

## Animations
- Sprite atlas-based (single spritesheet)
- Directional animations: `up`, `down`, `left`, `right`
- Shared across all characters

## NPCs
- Implemented as `Character` instances
- Moved via simple AI logic (timed direction switching)
- No keyboard or input dependency

## Development Principles
### What I Care About
- Clean architecture
- Systems that scale to multiplayer
- Avoiding hacks / rewrites
- Understanding **why** things are designed a certain way

### Assumptions for Discussions
- Phaser 3 + Arcade Physics
- ES modules
- Prefer clean architecture over quick hacks
- Explain concepts clearly but practically
- Don't suggest rebuilding unless necessary