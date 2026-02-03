from fastapi import Request # type: ignore
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
        result = (
            supabase
            .table("character")
            .upsert(
                payload,
                on_conflict="id"               
            )
            .execute()
        )
        return result
        
    def update_player_character(character, user):
        player_update = (
            supabase
            .table("player")
            .update({
                "character_id": character['id']
                })
            .eq("user_id", user.id).execute())
        
        return player_update
    
    def get_character_sprite_details(user):
        character_sprite_set = (
            supabase
            .from_('player')
            .select(
                """
                *, character:character_id (
                   *, character_sprite_set:character_sprite_set_id (
                       *, character_animation:character_animation (*)
                    )
                )
                """
            )
            .eq("user_id", user.id)
            .eq("is_deleted", 0)
            .execute()
        )
        return character_sprite_set