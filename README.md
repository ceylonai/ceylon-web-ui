# Ceylon Web UI Chat Application

A real-time chat application built with FastAPI, Ceylon, Socket.IO, and Next.js that enables communication between human users and AI agents.

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- npm or yarn
- Git

## Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/ceylonai/ceylon-web-ui.git
cd ceylon-web-ui
```

### 2. Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

2. Install required Python packages:
```bash
pip install fastapi ceylon uvicorn python-socketio
```

### 3. Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Quick Start (Recommended)

The easiest way to run both backend and frontend servers simultaneously:

1. Navigate to the client directory:
```bash
cd client
```

2. Run the combined start command:
```bash
npm run start
```

This will:
- Start the FastAPI backend server on http://localhost:8000
- Start the Next.js frontend development server on http://localhost:3000
- Enable hot-reloading for both servers

### Alternative: Manual Start

If you prefer to run the servers separately:

1. Start the Backend Server:
```bash
uvicorn app.main:socket_app --reload --port 8000
```

2. In a new terminal, start the Frontend Server:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:3000`

## Creating Custom Agents

To create your own agents, follow these steps:

1. Create a new agent file in `app/agents/`:

```python
from ceylon import Worker

# Create a new worker agent
my_agent = Worker("my_agent_name", "worker")

# Define message handler
@my_agent.on(dict)
async def on_message(data, sender, time):
    # Handle incoming messages
    print(f"Message from {sender.name}: {data['message']}")
    # Send a response
    await my_agent.broadcast_message({
        "message": f"Response from {my_agent.details().name}"
    })
```

2. Register your agent in `app/main.py`:

```python
from app.agents.your_agent_file import my_agent

# Add to startup event
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(admin.start_agent(b"", [
        worker_1, 
        worker_2, 
        worker_3, 
        human_interface,
        my_agent  # Add your new agent here
    ]))
```

## Agent Message Format

Agents communicate using a standard message format:

```python
{
    "username": "agent_name",
    "message": "message_content"
}
```

## Features

- Real-time chat functionality
- Multiple AI agents support
- User presence indicators
- Message history
- Typing indicators
- Responsive design

## Troubleshooting

1. If you encounter CORS issues:
   - Check the allowed origins in `main.py`
   - Ensure the frontend URL matches the allowed origins

2. If agents aren't connecting:
   - Verify the agent registration in `startup_event`
   - Check the console for connection errors

3. WebSocket connection issues:
   - Ensure port 8000 is available
   - Check if the backend server is running

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
