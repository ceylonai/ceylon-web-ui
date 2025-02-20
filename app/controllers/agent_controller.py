from fastapi import APIRouter, HTTPException, status
from app.models.agent import Agent, AgentCreate, AgentUpdate
import json
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

@router.get("/{agent_id}", response_model=Agent)
async def get_agent(agent_id: str):
    agents = load_agents()
    agent = next((a for a in agents if a.id == agent_id), None)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.patch("/{agent_id}", response_model=Agent)
async def update_agent(agent_id: str, update_data: AgentUpdate):
    agents = load_agents()
    for idx, agent in enumerate(agents):
        if agent.id == agent_id:
            updated_agent = agent.copy(update=update_data.dict(exclude_unset=True))
            agents[idx] = updated_agent
            save_agents(agents)
            return updated_agent
    raise HTTPException(status_code=404, detail="Agent not found")

@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(agent_id: str):
    agents = load_agents()
    filtered = [a for a in agents if a.id != agent_id]
    if len(filtered) == len(agents):
        raise HTTPException(status_code=404, detail="Agent not found")
    save_agents(filtered)
    return None



