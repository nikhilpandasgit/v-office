
export const TILE_SIZE = 16
export const REGION_SIZE = 16

export function worldToTile(x, y) {
  return {
    x: Math.floor(x / TILE_SIZE),
    y: Math.floor(y / TILE_SIZE)
  }
}

export function tileToRegion(tileX, tileY) {
  return {
    x: Math.floor(tileX / REGION_SIZE),
    y: Math.floor(tileY / REGION_SIZE)
  }
}

export function getEntityLocation(entity) {
  const worldX = entity.x
  const worldY = entity.y

  const tile = worldToTile(worldX, worldY)
  const region = tileToRegion(tile.x, tile.y)

  return {
    world: {
      x: worldX,
      y: worldY
    },
    tile: {
      x: tile.x,
      y: tile.y
    },
    region: {
      x: region.x,
      y: region.y
    },
    regionId: `${region.x}:${region.y}`
  }
}

export function getFeetTile(entity) {
  const feetX = entity.body.center.x
  const feetY = entity.body.bottom
  return worldToTile(feetX, feetY)
}