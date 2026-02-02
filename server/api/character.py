from fastapi import APIRouter, HTTPException, Request
from repositories.character_repo import CharacterRepository
from models.character_models import UpsertCharacterRequest

router = APIRouter()

@router.get('/get-all-characters')
async def get_all_characters():
    all_characters = CharacterRepository.get_all_characters()
    return all_characters

@router.post('/upsert-character')
async def upsert_character(request: Request, payload: UpsertCharacterRequest):
    data = {
            "name": payload.name,
            "character_sprite_set_id": payload.character_sprite_set_id
        }
    
    if payload.id:
        data["id"] = payload.id

    response = CharacterRepository.upsert_character(request, data)
    if not response.data:
        raise HTTPException(status_code=500, detail="Character Upsert Failed")
    
    return response.data[0]