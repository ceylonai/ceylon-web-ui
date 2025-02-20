import asyncio
import dataclasses
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from ceylon import Worker, AgentDetail, on
from app.agents.agents import admin, workers
from app.controllers.agent_controller import router as agent_router

@dataclasses.dataclass
class HumanInput:
    content: str

class HumanAgent(Worker):

    def __init__(self, name, role):
        super().__init__(name, role)

    @on(HumanInput)
    async def on_human_input(self, data: HumanInput, agent: AgentDetail, time):
        print(f"Message {agent.name} - {data}")
        await self.broadcast_message({
            "username": self.details().name,
            "message": data.content
        })

human_interface = HumanAgent("human_interface", "human")

# Initialize FastAPI
app = FastAPI()

# Add CORS Middleware for FastAPI routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include agent router
app.include_router(agent_router)

# Initialize Socket.IO with allowed origins
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=[
    "http://localhost:3000"
])
socket_app = socketio.ASGIApp(sio, app)


# Store usernames and typing status
usernames = {}
users= []
typing_users = set()

# Socket.IO event handlers
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    users.append(sid)  # Correcting the list append
    await sio.emit("users_count", {"count": len(users)}) 


@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    if sid in users:
        users.remove(sid)  # Remove disconnected user
    if sid in usernames:
        username = usernames[sid]
        del usernames[sid]
        await sio.emit("user_left", {"username": username})

    await sio.emit("users_count", {"count": len(users)})  # Send updated count


@sio.event
async def set_username(sid, username):
    usernames[sid] = username
    await sio.emit("user_joined", {"username": username})
    print(f"{username} joined the chat")


@sio.event
async def message(sid, data):
    username = usernames.get(sid, "Unknown")
    print(f"Message from {username}: {data}")
    # Broadcast the message to all connected clients
    await sio.emit("response", {"username": username, "message": data, "timestamp": asyncio.get_event_loop().time()})
    await admin.broadcast_message(HumanInput(content=data))


@sio.event
async def typing(sid):
    if sid in usernames:
        typing_users.add(usernames[sid])
        await sio.emit("user_typing", {"username": usernames[sid]})


@sio.event
async def stopped_typing(sid):
    if sid in usernames:
        typing_users.discard(usernames[sid])
        await sio.emit("user_stopped_typing")


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(admin.start_agent(b"", workers + [human_interface]))


@admin.on_connect("*")
async def on_connect(topic, agent: AgentDetail):
    await asyncio.sleep(2)
    print(f"Agent connected: {agent.name}")
    print(f"Agent connected: {agent.id}")
    usernames[agent.id] = agent.name
    await sio.emit("user_joined", {"username": agent.name})
    # Broadcast the message to all connected clients
    await sio.emit("response", {"username": agent.name, "message": f"Agent {agent.name} connected"})

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(socket_app, host="0.0.0.0", port=8000)