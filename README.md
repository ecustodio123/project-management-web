# Project Management Web

Frontend application for a fullstack **Project Management / Client Portal** system.

This project was built to practice **Fullstack Development**, **Frontend Architecture**, **Authentication Flows**, and **API Integration** using a real-world backend.

---

## Features

### Authentication

- User Login
- Persistent Session
- Protected Routes
- Logout Flow

### Projects

- View Projects
- Create Projects
- Project Details
- Activity Timeline

### Tasks

- View Tasks
- Create Tasks
- Task Details

### Comments

- Add Comments
- View Comments

### Files

- Upload Files
- Download Files from AWS S3

### Activity

- View Project Activity Timeline

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Material UI (MUI)

### State Management

- React Query (TanStack Query)

### Forms & Validation

- React Hook Form
- Zod

### Routing

- React Router

### API Communication

- Axios

### Deployment

- Cloudflare Pages

---

## Architecture

```txt
React Frontend
      ↓
NestJS Backend API
      ↓
PostgreSQL Database
      ↓
AWS S3 File Storage
```

---

## Live Demo

Application URL:

```txt
https://project-management-web.pages.dev
```

---

## Backend API

Swagger Documentation:

```txt
https://project-management-api-production-c67f.up.railway.app/api/docs
```

---

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=
```

Example:

```env
https://project-management-api-production-c67f.up.railway.app/
```

---

## Running Locally

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Application will run on:

```txt
http://localhost:5173
```

---

## Authentication Flow

```txt
Login
   ↓
JWT Token
   ↓
Stored in Local Storage
   ↓
GET /auth/me
   ↓
Global Auth State
   ↓
Protected Routes
```

---

## Future Improvements

- Real-time updates
- Task status management
- Better dashboard analytics

---

## Learning Goals

This project was built to strengthen knowledge in:

- Fullstack Development
- Frontend Architecture
- API Integration
- Authentication Flows
- React Query
- Cloud Deployments
- Real-world Application Development