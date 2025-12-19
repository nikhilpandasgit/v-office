from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from core.supabase import supabase
from middleware.auth import auth_middleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(auth_middleware)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/admin/users")
async def list_users(request: Request):
    user = request.state.user
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    res = supabase.auth.admin.list_users()
    
    return {
        "count": len(res),  # Changed from len(res.users)
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "created_at": u.created_at,
                "last_sign_in_at": u.last_sign_in_at,
            }
            for u in res  # Changed from res.users
        ],
    }