from pydantic import BaseModel
from typing import Optional

class AgentBase(BaseModel):
    name: str
    unitId: str
    jobRole: str
    instructions: str
    profileIcon: Optional[str] = None

class AgentCreate(AgentBase):
    pass

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    unitId: Optional[str] = None
    jobRole: Optional[str] = None
    instructions: Optional[str] = None
    profileIcon: Optional[str] = None

class Agent(AgentBase):
    id: str  # Ensuring the Agent model includes 'id' 