from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import socketio
from middleware.auth import auth_middleware
from core.events import register_events
from api.player import router as player_router

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=["http://localhost:5173"]
)

sio_app = socketio.ASGIApp(sio)

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
app.mount("/socket.io", sio_app)


# ---------------- ROUTES ----------------
@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(player_router)