from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import socketio
from core.supabase import supabase
from middleware.auth import auth_middleware
from core.events import register_events

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

# ---------------- LIFESPAN ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    await register_events(sio)
    yield

# ---------------- APP ----------------
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(auth_middleware)

# Mount the socketio Server after Middleware
app.mount("/", socketio.ASGIApp(sio, other_asgi_app=app))


# ---------------- ROUTES ----------------
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
        "count": len(res),
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "created_at": u.created_at,
                "last_sign_in_at": u.last_sign_in_at,
            }
            for u in res
        ],
    }