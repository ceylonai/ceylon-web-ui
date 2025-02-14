# Ceylon Web UI Chat Application - Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [Backend Components](#backend-components)
5. [Frontend Components](#frontend-components)
6. [Agent System](#agent-system)
7. [WebSocket Communication](#websocket-communication)
8. [API Reference](#api-reference)
9. [Development Guide](#development-guide)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

## System Overview

The Ceylon Web UI Chat Application is a real-time communication platform that enables interaction between human users and AI agents. The system is built using:

- **Backend**: FastAPI, Ceylon, Python-SocketIO
- **Frontend**: Next.js, TailwindCSS, Socket.IO-client
- **Agent System**: Ceylon Agent Framework
- **Communication**: WebSocket Protocol

### Key Features
- Real-time bidirectional communication
- Multiple AI agent support
- User presence tracking
- Message history
- Typing indicators
- Responsive UI
- Custom agent creation
- Event-driven architecture

## Architecture

### System Components
```
ceylon-web-ui/
├── app/
│   ├── agents/
│   │   ├── __init__.py
│   │   └── agents.py
│   ├── sockets/
│   │   ├── __init__.py
│   │   └── handlers.py
│   └── main.py
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── app/
│   │   └── styles/
│   └── package.json
└── requirements.txt
```

## Installation & Setup

### Detailed Prerequisites
- Python 3.10+ (required for Ceylon compatibility)
- Node.js 18+ (required for Next.js features)
- npm or yarn
- Git
- Virtual environment tool (venv)

### Step-by-Step Installation

1. **Clone and Setup Environment**
```bash
git clone <repository-url>
cd ceylon-web-ui
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Frontend Dependencies**
```bash
cd client
npm install
```

3. **Environment Configuration**
Create `.env` files for both frontend and backend:

Backend (.env):
```env
PORT=8000
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000
```

Frontend (client/.env.local):
```env
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Quick Start
The application can be started with a single command that launches both backend and frontend servers simultaneously:

1. Navigate to the client directory:
```bash
cd client
```

2. Run the combined start command:
```bash
npm run start
```

This command will:
- Start the FastAPI backend server on http://localhost:8000
- Start the Next.js frontend development server on http://localhost:3000
- Run both servers concurrently in the same terminal window
- Enable hot-reloading for both frontend and backend

The `start` script uses `concurrently` to run multiple commands:
```json
{
  "scripts": {
    "start:backend": "cd.. && uvicorn app.main:socket_app --reload --port 8000",
    "start": "concurrently \"npm run dev \" \"npm run start:backend\" "
  }
}
```

> Note: Make sure you have installed all dependencies and your Python virtual environment is activated before running the start command.

## Backend Components

### FastAPI Application Structure

#### Main Application (main.py)
- FastAPI instance configuration
- CORS middleware setup
- Socket.IO server initialization
- Agent system integration
- Event handlers

#### Socket Handlers (sockets/handlers.py)
- Connection management
- Message broadcasting
- User tracking
- Error handling

### Agent System

#### Base Agent Configuration (agents/agents.py)
```python
from ceylon import Admin, Worker

admin = Admin("admin", 7446)
worker_1 = Worker("worker_1", "worker")
```

#### Custom Agent Creation
```python
class CustomAgent(Worker):
    def __init__(self, name, role):
        super().__init__(name, role)

    @on(dict)
    async def on_message(self, data, sender, time):
        # Custom message handling logic
        pass
```

## Frontend Components

### Core Components

#### ChatArea Component
The main chat interface handling:
- Message display
- Input handling
- WebSocket connections
- User status
- Typing indicators

#### WebSocket Integration
```typescript
const socket = io("http://localhost:8000", {
    transports: ["websocket"],
    reconnectionAttempts: 5
});
```

### State Management
- Message history
- User connections
- Typing status
- Connection state

## Agent System

### Agent Types
1. **Admin Agent**: System controller
2. **Worker Agents**: Task processors
3. **Human Interface Agent**: User communication bridge

### Creating Custom Agents

1. Create agent file (app/agents/custom_agent.py):
```python
from ceylon import Worker

class CustomAgent(Worker):
    def __init__(self, name):
        super().__init__(name, "custom")

    async def process_message(self, message):
        # Add processing logic
        return processed_result
```

2. Register agent:
```python
@app.on_event("startup")
async def startup_event():
    custom_agent = CustomAgent("custom_agent")
    await admin.start_agent(b"", [custom_agent])
```

## WebSocket Communication

### Message Format
```typescript
interface Message {
    username: string;
    message: string;
    timestamp: number;
}
```

### Events
1. **Connection Events**
   - connect
   - disconnect
   - reconnect

2. **Message Events**
   - message
   - response
   - typing
   - stopped_typing

3. **User Events**
   - user_joined
   - user_left
   - users_count

## API Reference

### WebSocket Events

#### Client to Server
```typescript
// Send message
socket.emit('message', messageContent);

// Set username
socket.emit('set_username', username);

// Typing indicators
socket.emit('typing');
socket.emit('stopped_typing');
```

#### Server to Client
```typescript
// Receive message
socket.on('response', (data: Message) => {});

// User status
socket.on('user_joined', (data: {username: string}) => {});
socket.on('users_count', (data: {count: number}) => {});
```

## Development Guide

### Adding New Features

1. **New Agent Type**
```python
class SpecializedAgent(Worker):
    def __init__(self, name):
        super().__init__(name, "specialized")
        
    @on(dict)
    async def on_message(self, data, sender, time):
        # Specialized processing
        result = await self.process_data(data)
        await self.broadcast_message(result)
```

2. **New UI Components**
```typescript
const CustomComponent: React.FC = () => {
    // Component logic
    return (
        <div>
            {/* Component structure */}
        </div>
    );
};
```

## Deployment

### Production Setup

1. **Backend Deployment**
```bash
uvicorn app.main:socket_app --host 0.0.0.0 --port 8000 --workers 4
```

2. **Frontend Build**
```bash
cd client
npm run build
npm run start
```

### Docker Deployment
```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:socket_app", "--host", "0.0.0.0", "--port", "8000"]
```

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check CORS settings
   - Verify port availability
   - Check firewall settings

2. **Agent Connection Issues**
   - Verify agent registration
   - Check Ceylon configuration
   - Monitor agent logs

3. **Message Delivery Problems**
   - Check WebSocket connection
   - Verify message format
   - Check error handlers

### Debugging Tools

1. **Backend Logging**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

2. **Frontend Debug Mode**
```typescript
const socket = io("http://localhost:8000", {
    debug: true,
    transports: ["websocket"]
});
```

## Security Considerations

1. **Input Validation**
2. **Rate Limiting**
3. **Authentication**
4. **Message Encryption**
5. **CORS Configuration**

## Performance Optimization

1. **Message Batching**
2. **Connection Pooling**
3. **Caching Strategies**
4. **Load Balancing**

## Maintenance

### Regular Tasks
1. Update dependencies
2. Monitor system logs
3. Backup data
4. Performance monitoring
5. Security updates

### Monitoring
1. WebSocket connections
2. Agent status
3. System resources
4. Error rates

## Support and Resources

- GitHub Repository: [https://github.com/ceylonai/ceylon-web-ui.git]

