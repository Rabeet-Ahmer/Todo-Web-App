# Todo Web App

A full-stack todo application with Next.js frontend and FastAPI backend, integrated with Better Auth for authentication.

## Architecture

This application uses a hybrid authentication approach:
- **Better Auth** handles user registration, login, password hashing, and JWT token generation
- **FastAPI** validates JWT tokens and handles business logic (todos CRUD)
- Both connect to the same PostgreSQL database with shared JWT secret

## Environment Variables

### Frontend (.env.local)
```bash
# Better Auth Configuration
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="super-secret-key-123"

# Database (shared with Better Auth and FastAPI)
DATABASE_URL="postgresql://user:pass@localhost:5432/todoapp"

# FastAPI Backend
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXT_PUBLIC_AUTH_URL="http://localhost:3000"
```

### Backend (.env)
```bash
# JWT Configuration (MUST match Better Auth's secret)
JWT_SECRET_KEY="super-secret-key-123"

# Database (shared with Better Auth)
DATABASE_URL="postgresql://user:pass@localhost:5432/todoapp"

# CORS Configuration
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.13+
- PostgreSQL database

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install uv
uv pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Features

- User authentication with Better Auth
- Todo management with CRUD operations
- JWT token validation between stacks
- Real-time data synchronization
- Error handling with toast notifications
- Responsive UI with shadcn components

## Project Structure

```
Phase2/
├── frontend/           # Next.js 16 application
│   ├── app/            # App Router pages
│   ├── components/     # React components
│   ├── lib/            # Utilities and API client
│   ├── hooks/          # Custom React hooks
│   └── actions/        # Server Actions
└── backend/            # FastAPI application
    ├── app/
    │   ├── api/        # API routes (v1)
    │   ├── models/     # SQLModel database models
    │   ├── schemas/    # Pydantic schemas
    │   ├── services/   # Business logic
    │   └── core/       # Core utilities
```

## API Endpoints

- `POST /api/auth/` - Better Auth endpoints
- `GET /api/v1/todos` - Get user's todos
- `POST /api/v1/todos` - Create a new todo
- `PATCH /api/v1/todos/{id}` - Update a todo
- `DELETE /api/v1/todos/{id}` - Delete a todo
- `GET /health` - Health check endpoint

## Error Handling

The application includes comprehensive error handling:
- Custom exception classes for different error types
- Global exception handlers in FastAPI
- Toast notifications for API failures
- Session expiry handling with automatic redirects
- Error boundaries for React components