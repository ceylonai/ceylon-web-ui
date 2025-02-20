from fastapi import APIRouter, status
from app.models.agent import Agent, AgentCreate
import json
import uuid
from pathlib import Path
from typing import List

router = APIRouter(prefix="/api/agents", tags=["agents"])

AGENTS_FILE = Path("app/agents_data.json")

def load_agents() -> List[Agent]:
    if not AGENTS_FILE.exists():
        return []
    with open(AGENTS_FILE, "r") as f:
        return [Agent(**agent) for agent in json.load(f)]

def save_agents(agents: List[Agent]):
    with open(AGENTS_FILE, "w") as f:
        json.dump([agent.dict() for agent in agents], f, indent=2)

@router.post("/", response_model=Agent, status_code=status.HTTP_201_CREATED)
async def create_agent(agent: AgentCreate):
    agents = load_agents()
    new_agent = Agent(
        id=f"worker_{len(agents) + 1}",
        **agent.dict()
    )
    agents.append(new_agent)
    save_agents(agents)
    return new_agent

@router.get("/", response_model=List[Agent])
async def get_agents():
    return load_agents()





