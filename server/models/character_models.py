from typing import Optional
from pydantic import BaseModel

class UpsertCharacterRequest(BaseModel):
    id: Optional[str] = None
    name: str
    character_sprite_set_id: int
