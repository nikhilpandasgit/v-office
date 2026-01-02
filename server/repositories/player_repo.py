from core.supabase import supabase

class PlayerRepository:
    @staticmethod
    def get_active_player_by_user_id(user_id: str):
        response = (
            supabase
            .table("player")
            .select("*, character:character_id(*)")
            .eq("user_id", user_id)
            .eq("is_deleted", 0)
            .limit(1)
            .execute()
        )
        
        return response.data[0] if response.data else None