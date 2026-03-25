# PrimeTrade Backend Internship Assignment – Project Walkthrough

Prepared by: Shashank Namdeo (Backend Developer Candidate)

---

# Project Overview

This project is a scalable backend system built using FastAPI with JWT authentication and role-based access control, along with a simple React frontend to demonstrate API functionality.

The system allows users to securely register, log in, and manage trading objectives (tasks) through a protected dashboard, while administrators have elevated access to manage users and monitor system activity.

The goal of this project is to demonstrate clean API design, secure authentication, modular backend architecture, and frontend integration following production-level best practices.

---

# Tech Stack

**Backend:**
- FastAPI
- PostgreSQL / SQLite
- SQLAlchemy
- JWT Authentication
- Passlib (bcrypt)
- Pydantic
- Pytest

**Frontend:**
- React (Vite)
- Axios
- Context API
- Modern CSS (Tailwind)

**Tools:**
- GitHub
- Swagger
- Postman
- Logging
- Virtual Environment

---

# System Architecture

The project follows a modular and scalable architecture:

```
backend/
├── app/
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic validation schemas
│   ├── routes/       # API endpoints
│   ├── services/     # Business logic
│   ├── core/         # Security, config, DB setup
│   └── utils/        # Dependencies and helpers
├── tests/            # Pytest suite
├── logs/             # Application logs
└── main.py           # Entry point
```

```
frontend/
├── src/
│   ├── pages/        # Main route components
│   ├── components/   # Reusable UI elements
│   ├── api/          # Axios client and API calls
│   └── context/      # Auth state management
```

---

# Core Features Implemented

## 1. Robust Backend API (FastAPI)

### Scalable Architecture
The backend follows a layered architecture to ensure clean and maintainable code, separating concerns between data modeling, validation, and delivery.

## 2. JWT Authentication
Secure authentication system with:
- User registration and login.
- Password hashing using `bcrypt`.
- JWT token generation and verification middleware.
- Protected routes using dependency injection.

## 3. Role-Based Access Control (RBAC)
Two roles are implemented:
- **User**: Manage own tasks (Create, Read, Update, Delete).
- **Admin**: Elevated access to view all users and monitor system activity.
Ownership validation ensures data isolation between users.

> [!NOTE] 
> **Bootstrapping Logic**: To facilitate testing, the very first user who registers on a clean database is automatically granted the `admin` role. All subsequent registrations default to the `user` role.

## 4. Task CRUD System
Complete CRUD operations for trading objectives with status tracking (`pending`, `in_progress`, `completed`).

## 5. Error Handling
Standardized JSON responses for all error states (Auth, Validation, DB), improving API reliability.

---

# Premium Frontend UI (React + Vite)

The frontend is built to provide a premium user experience while demonstrating full API integration.
- **Modern Aesthetics**: Dark theme with glassmorphism, custom scrollbars, and smooth transitions.
- **Authentication Flow**: Real-time feedback during login/registration.
- **Interactive Dashboard**: Full task management with responsive design.

---

# Proof of Work

## Automated Testing
Integration tests verify user registration, login, and task CRUD operations.

```powershell
cd backend
.\venv\Scripts\pytest.exe
```

## API Documentation
Swagger documentation is available at: `http://localhost:8000/docs`

---

# Scalability & Future Improvements

- **Redis Caching**: To improve performance for frequent read operations.
- **Dockerization**: For consistent deployment and environment parity.
- **Microservices**: Decoupling services for independent scaling.
- **Rate Limiting**: Protecting the API from brute-force and DDoS attacks.

---

# Conclusion
This project demonstrates secure authentication, role-based access, and a scalable design that is production-ready.

**Prepared by Shashank Namdeo**
