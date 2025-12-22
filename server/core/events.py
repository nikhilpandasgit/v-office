from core.game_state import players, SPAWNS, MAX_PLAYERS

async def register_events(sio):
    @sio.event
    async def connect(sid, environ):
        if(len(players) >= MAX_PLAYERS):
            await sio.disconnect(sid)
            return
        
        player_id = f"player-{len(players) + 1}"
        spawns = SPAWNS[len(players)]
        
        players[player_id] = {
            "x": spawns["x"],
            "y": spawns["y"],
            "dir": "down"
        }
        
        await sio.emit("init", {
            "playerId": player_id,
            "players": players
        }, to=sid)
        
        await sio.emit("state", players)
    
    @sio.event
    async def input(sid, data):
        player_id = data["playerId"]
        if player_id not in players:
            return
        
        players[player_id].update(data["state"])
        await sio.emit("state", players)
    
    @sio.event
    async def disconnect(sid):
        players.clear()
        await sio.emit("state", players)
    