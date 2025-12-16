You are helping me with a multiplayer web-based game project.

Tech stack:
- Client: Phaser 3 (Arcade Physics), JavaScript, Vite
- Server: FastAPI (Python) — server-authoritative planned later
- Rendering: client-side only (no server rendering)
- Assets: Tiled tilemap (JSON), embedded tileset (single spritesheet.png, 16x16 tiles)

Current state of the client:
- index.html → main.js → MainScene.js
- Tilemap loads correctly using an embedded tileset (no external .tsx)
- Map layers include:
  - ground
  - paths
  - plants-and-buildings-and-trees
  - ladders (tile layer, visual only)
  - spawnpoints (object layer)
  - boundaries (object layer, rectangle objects)

Player setup:
- Player is a Phaser Arcade Physics sprite using a spritesheet
- Player animations are defined via frame ranges (left/right/up/down)
- Player spawns at a random object from the "spawnpoints" object layer
- Camera follows the player and is bounded to the map
- World bounds are set to map.widthInPixels / map.heightInPixels

Collisions:
- Boundaries are implemented using Tiled object layers
- Each boundary object is converted into a Phaser Rectangle
- Rectangles are added as static physics bodies
- Player collides with these static rectangles
- Tile-based collision is NOT used
- Player hitbox is manually reduced and offset (feet-based collision)

Known constraints / rules:
- Do NOT use setCollisionByProperty
- Do NOT use external tilesets (.tsx)
- Object layers must be handled via physics bodies
- Visual ladder tiles are separate from ladder interaction logic
- Phaser camera bounds ≠ physics world bounds (both are set explicitly)

What I usually need help with:
- Phaser scene logic and architecture
- Object-layer collisions and interaction zones
- Player movement and animation
- Debugging rendering / physics mismatches
- Preparing the client for future multiplayer sync

Assume all of the above is already implemented and working unless I say otherwise.
Focus only on the next problem I ask.
