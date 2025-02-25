from fastapi import APIRouter, HTTPException, status, Body
from app.models.agent import Agent, AgentCreate, AgentUpdate
import json
from pathlib import Path
from typing import List
import uuid

router = APIRouter(prefix="/api/agents", tags=["agents"])

AGENTS_FILE = Path("app/agents_data_example.json")

def load_agents() -> List[Agent]:
    if not AGENTS_FILE.exists():
        return []
    try:
        with open(AGENTS_FILE, "r") as f:
            data = json.load(f)
            return [Agent(**agent) for agent in data]
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_agents(agents: List[Agent]):
    with open(AGENTS_FILE, "w") as f:
        json.dump([agent.dict() for agent in agents], f, indent=2)

def validate_agent_data(data: dict):
    """Validates agent data to ensure no empty or null values."""
    for key, value in data.items():
        if value is None or (isinstance(value, str) and not value.strip()) or (isinstance(value, (list, dict)) and not value):
            raise HTTPException(status_code=400, detail=f"Field '{key}' cannot be empty or null.")

@router.post("/", response_model=Agent, status_code=status.HTTP_201_CREATED)
async def create_agent(agent: AgentCreate):
    """Create a new agent with strict validation to prevent empty/null values."""
    
    agent_dict = agent.dict()
    validate_agent_data(agent_dict)  # Validate required fields
    
    agents = load_agents()
    new_agent = Agent(
        id=str(uuid.uuid4()),  # Use UUID for unique ID
        **agent_dict
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
async def update_agent(agent_id: str, update_data: AgentUpdate = Body(...)):
    """Update an existing agent with strict validation to prevent empty/null updates."""
    
    agents = load_agents()
    update_dict = update_data.dict(exclude_unset=True)


    if not update_dict:
        raise HTTPException(status_code=400, detail="Update data cannot be empty.")

  
    if "id" in update_dict:
        del update_dict["id"]
        
    validate_agent_data(update_dict)  

    for idx, agent in enumerate(agents):
        if agent.id == agent_id:
            updated_agent = agent.copy(update=update_dict)
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
