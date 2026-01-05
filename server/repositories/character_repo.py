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
    
    def upsert_character(payload):
        user = request.session.user
        result = (
            supabase
            .table("character")
            .upsert(
                payload,
                on_conflict="id"               
            )
            .execute()
        )
        
        player_update = (
            supabase
            .table("player")
            .update({
                "character_id": character["id"]
                })
            .eq("user_id", user.id).execute())
        return result