from core.game_state import players, SPAWNS, MAX_PLAYERS, sid_to_player

# Events
# 1. init - when a player joins freshly, sends their ID and all current players
# 2. player-joined - data of the newly joined player emitted to OTHER clients
# 3. state - current state of all players emitted to all clients
# 4. player-left - data of the disconnected player emitted to all clients

async def register_events(sio):
    @sio.event
    async def connect(sid, environ):
        if len(players) >= MAX_PLAYERS:
            await sio.disconnect(sid)
            return
        
        player_index = len(players)
        player_id = f"player-{player_index + 1}"
        spawns = SPAWNS[player_index]
        
        players[player_id] = {
            "x": spawns["x"],
            "y": spawns["y"],
            "dir": "down",
            "moving": False
        }
        
        sid_to_player[sid] = player_id
        
        # Send init only to the connecting player
        await sio.emit(
            "init", 
            {
                "playerId": player_id,
                "players": players
            },
            to=sid
        )
        
        # Notify other clients that a new player joined (skip the new player)
        await sio.emit(
            "player-joined", 
            {
                "playerId": player_id,
                "state": players[player_id]
            },
            skip_sid=sid
        )
    
    @sio.event
    async def input(sid, data):
        player_id = sid_to_player.get(sid)
        if not player_id:
            return
        
        players[player_id] = data["state"]
        
        # Broadcast updated state to all clients
        await sio.emit("state", players)
    
    @sio.event
    async def disconnect(sid):
        player_id = sid_to_player.pop(sid, None)
        if not player_id:
            return
        
        print(f"Player {player_id} disconnected. Total players: {len(players)}")
        players.pop(player_id, None)
        
        # Notify all remaining players
        await sio.emit("player-left", {"playerId": player_id})
        await sio.emit("state", players)