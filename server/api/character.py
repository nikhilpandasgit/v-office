from fastapi import APIRouter, HTTPException, Request
from repositories.character_repo import CharacterRepository
from models.character_models import UpsertCharacterRequest

router = APIRouter()

@router.get('/get-all-characters')
async def get_all_characters():
    all_characters = CharacterRepository.get_all_characters()
    return all_characters

@router.post('/upsert-character')
async def upsert_character(payload: UpsertCharacterRequest, request: Request):
    user = request.state.user
    data = {
            "name": payload.name,
            "character_sprite_set_id": payload.character_sprite_set_id
        }
    
    if payload.id:
        data["id"] = payload.id

    character = CharacterRepository.upsert_character(data)
    if not character.data:
        raise HTTPException(status_code=500, detail="Character Upsert Failed")
    
    player_update = CharacterRepository.update_player_character(character.data[0], user)
    if not player_update.data:
        raise HTTPException(status_code=500, detail="Updating players character failed")
    
    return player_update

@router.get('/get-character-sprite-details')
async def get_character_sprite_details(request: Request):
    user = request.state.user
    
    character_sprite = CharacterRepository.get_character_sprite_details(user)
    # if not character_sprite.data:
    #     raise HTTPException(status_code=500, detail="Fetching character sprite details failed")
    
    return character_sprite
    