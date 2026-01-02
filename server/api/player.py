from fastapi import APIRouter, HTTPException, Request
from repositories.player_repo import PlayerRepository

router = APIRouter()

@router.get("/get-active-player-by-user-id")
async def get_active_player_by_user_id(request: Request):
    user = request.state.user
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    player_character = PlayerRepository.get_active_player_by_user_id(user.id)
    return player_character