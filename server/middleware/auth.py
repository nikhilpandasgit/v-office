from fastapi import Request
from fastapi.responses import JSONResponse
from core.supabase import supabase

EXCLUDED_PATHS={
    "/health",
    "/docs",
    "/openapi.json",
}

async def auth_middleware(request: Request, call_next):
    path = request.url.path


    if path in EXCLUDED_PATHS or request.method == "OPTIONS" or path.startswith("/socket.io"):
        return await call_next(request)
    
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return JSONResponse(
            status_code=401,
            content={"error": "Missing Authorization header"},
        )
        
    auth_header = auth_header.strip()
    
    if not auth_header.startswith("Bearer "):
        return JSONResponse(
            status_code=401,
            content={"error": "Missing Authorization header"},
        )
    
    token = auth_header.replace("Bearer ", "").strip()
    
    try:
        res = supabase.auth.get_user(token)
        user = res.user
    except Exception:
        user = None
    
    if not user:
        return JSONResponse(
            status_code=401,
            content={"error": "Invalid Token"},
        )
    
    request.state.user = user
    return await call_next(request)