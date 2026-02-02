from fastapi import Request
from core.supabase import supabase
from models.character_models import UpsertCharacterRequest

class CharacterRepository:
    @staticmethod
    def get_all_characters():
        response = (
            supabase
            .table('character_sprite_set')
            .select('*')
            .eq("is_deleted", False)
            .execute()
        )
        
        return response.data if response.data else None
    
    def upsert_character(request, payload):
        user = request.state.user
        result = (
            supabase
            .table("character")
            .upsert(
                payload,
                on_conflict="id"               
            )
            .execute()
        )
    
        character_id = result.data[0]["id"]
        
        supabase.table("player").update({
            "character_id": character_id
        }).eq("user_id", user.id).execute()
        
        return result
    
    def get_character_sprite_details(user):
        character_sprite = (
            supabase
            .table()
        )