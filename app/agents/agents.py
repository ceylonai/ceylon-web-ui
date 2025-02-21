from ceylon import Admin, Worker
from app.models.agent import Agent
from app.controllers.agent_controller import load_agents

admin = Admin("admin", 7446)

def initialize_workers():
    agents = load_agents()
    workers = []
    for agent in agents:
        worker = Worker(agent.id, agent.jobRole)

        setattr(worker, "id", agent.id) 
        worker.details().name = agent.name
        
        workers.append(worker)
    
    return workers

workers = initialize_workers()

__all__ = ['admin'] + [getattr(worker, "id", "unknown") for worker in workers]

for worker in workers:
    print(vars(worker)) 