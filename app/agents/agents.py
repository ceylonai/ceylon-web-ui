from ceylon import Admin, Worker

# Initialize agents
admin = Admin("admin", 7446)
worker_1 = Worker("worker_1", "worker")
worker_2 = Worker("worker_2", "worker")
worker_3 = Worker("worker_3", "worker")

# Export all agents
__all__ = ['admin', 'worker_1', 'worker_2', 'worker_3']
