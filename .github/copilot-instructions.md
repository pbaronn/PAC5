# AI Coding Agent Instructions - PAC Sistema de Gestão

## Project Overview
University extension project for managing a youth football training program (Tricolor Mirins). The system handles student registration, game scheduling, team lineup management, categories, and medical records for sports safety.

**Stack:** React (Vite) frontend + Node.js/Express backend + MongoDB Atlas
**Project Type:** Monorepo with `/backend` and `/frontend` folders

## Architecture & Data Flow

### Backend Structure (Node.js/Express + MongoDB)
- **Entry Point:** `backend/server.js` - Express server with CORS configured for `localhost:3000` and `localhost:5173`
- **Database:** MongoDB Atlas connection via `config/database.js` (requires `MONGODB_URL` env var)
- **Authentication:** JWT-based auth with Bearer tokens stored in localStorage
- **Models:** Mongoose schemas with rich validation (`Student`, `Game`, `Category`, `User`)
- **Routes:** RESTful API under `/api/*` with middleware auth protection
- **Port:** 3001 (configurable via `PORT` env var)

### Frontend Structure (React + Vite)
- **Entry Point:** `frontend/src/main.jsx` → `App.jsx`
- **Routing:** Custom page-based navigation via `onNavigate` prop pattern (no React Router)
- **State Management:** Local component state + localStorage for auth tokens
- **API Service:** Centralized in `services/api.js` with helper functions per domain
- **Dev Server:** Port 3000 (Vite configured in `vite.config.js`)

### Key Data Relationships
```
Student.categories[] → Category.nome (string reference, not ObjectId)
Game.categoria → Category.nome (validated on save)
Game.escalacao[].aluno → Student._id (ObjectId reference)
Game validates escalacao students belong to Game.categoria
```

## Critical Development Patterns

### 1. API Service Layer (`frontend/src/services/api.js`)
**Always use existing service functions, never fetch directly:**
```javascript
// ✅ Correct
import { studentService, gameService, categoryService } from '../../services/api';
const students = await studentService.getAll({ category: 'Sub-15' });

// ❌ Wrong - bypasses auth token handling
fetch('http://localhost:3001/api/students')
```

All services auto-inject `Authorization: Bearer <token>` from localStorage.

### 2. Navigation Pattern (No React Router)
Pages receive `onNavigate` prop for routing:
```javascript
// Navigate to page with optional data
onNavigate('visualizar', studentData); // View student
onNavigate('edita', studentData);      // Edit student  
onNavigate('visualizar-jogo', { gameData }); // View game
```

**App.jsx switch statement** maps page keys to components. When adding pages:
1. Add case to `renderCurrentPage()` switch
2. Define state for page data (`selectedStudent`, `selectedGame`, etc.)
3. Pass state to component via props

### 3. Form Data Conventions
**Backend expects specific field names** (not camelCase variants):
- Games: `time1`, `time2`, `dataJogo`, `horario`, `local`, `cidade`, `uf`, `cep`
- Students: `nomeAluno`, `dataNascimento`, `cpfResponsavel`, `categories[]`
- Never use: `homeTeam`, `awayTeam`, `date`, `time` (these are wrong field names)

### 4. Category System (Critical!)
- Categories stored as **string names** (`"Sub-15"`, `"Sub-17"`), NOT ObjectIds
- `Student.categories` is an **array of strings** (multiple categories allowed)
- `Student.category` exists for legacy compatibility (single string)
- `Game.categoria` is a **single string** that must match an active category
- Pre-save hooks validate category existence and active status

### 5. Escalação (Team Lineup) Pattern
When creating/editing games:
```javascript
// 1. Load categories dropdown
const response = await categoryService.getAll({ ativo: true });

// 2. On category selection, load students
const students = await gameService.getStudentsByCategory(categoria);

// 3. Build escalacao array for submission
const escalacao = selectedStudents.map(s => s._id); // Just IDs
// OR with positions:
const escalacao = selectedStudents.map(s => ({ aluno: s._id, posicao: s.posicao }));
```

Backend validates all students in escalacao belong to the game's categoria.

### 6. Authentication Flow
```javascript
// Login stores token + user data
const response = await authService.login({ username, password });
// Sets: localStorage.token, localStorage.user

// App.jsx checks on mount
const isAuth = authService.isAuthenticated(); // Checks token existence
await authService.validateToken(); // Validates with backend

// Logout clears everything
authService.logout(); // Removes token + user from localStorage
```

## Environment Setup

### Backend `.env` Requirements
```bash
MONGODB_URL=mongodb+srv://...  # Required for database
JWT_SECRET=your-secret-key     # Required for auth
PORT=3001                       # Optional (defaults to 3001)
NODE_ENV=development            # Optional (for error verbosity)
```

### Running the Project
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start    # Production mode
npm run dev  # Development with nodemon

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev  # Vite dev server on localhost:3000
```

### Seeding Database
```bash
cd backend
npm run seed  # Populates initial data via seeds/seedData.js
```

## Component Patterns

### Page Components Structure
All pages receive standard props:
```javascript
const MyPage = ({ onLogout, onNavigate, studentData, gameData }) => {
  // studentData/gameData passed from App.jsx state
  // Always include Header with logout + navigation
  return (
    <div className="page-container">
      <Header onLogout={onLogout} />
      <Sidebar onNavigate={onNavigate} />
      <main>{/* page content */}</main>
    </div>
  );
};
```

### Common Sidebar Components
- `GamesSidebar` - Game management menu
- `CategoriesSidebar` - Category management menu
- `TreinosSidebar` - Training session menu
- `ConfiguracoesSidebar` - Settings menu

Each has active state highlighting for current page.

## Validation & Error Handling

### Backend Validation (express-validator)
Routes use validation arrays:
```javascript
const gameValidation = [
  body('time1').trim().notEmpty().isLength({ max: 100 }),
  body('uf').isLength({ min: 2, max: 2 }).isAlpha(),
  // ... see routes/gameRoutes.js for complete patterns
];
```

Controllers check `validationResult(req)` before processing.

### Frontend Error Display
```javascript
try {
  await gameService.create(gameData);
  // Success: navigate away
  onNavigate('jogos-menu');
} catch (error) {
  // Display error.message to user (already formatted by apiRequest helper)
  setError(error.message);
}
```

## Database Schema Highlights

### Student Model
- `nomeAluno`, `dataNascimento`, `genero`, `cpf` (unique), `rg`, `telefone`
- Address: `rua`, `bairro`, `cidade`, `cep`
- Guardian: `nomeResponsavel`, `cpfResponsavel`, `telefoneResponsavel`, `grauParentesco`
- Medical: `possuiAlergias`, `detalhesAlergias`, `tipoSanguineo`, etc.
- `contatosEmergencia[]` - array of `{nome, telefone}` objects
- `categories[]` - array of category name strings

### Game Model
- Match: `time1`, `time2`, `dataJogo`, `horario`, `local`, `cidade`, `uf`, `cep`
- Config: `tipo` (enum), `categoria` (validated), `juiz`
- `escalacao[]` - array of `{aluno: ObjectId, posicao: string}`
- `status` - enum: `'agendado'`, `'em_andamento'`, `'finalizado'`, `'cancelado'`
- `resultado: {golsTime1, golsTime2}` - only for finalized games
- Virtual fields: `isFinished`, `isFuture` (computed from dataJogo)

### Category Model
- `nome` (unique), `descricao`, `idadeMinima`, `idadeMaxima`, `ativo` (boolean)
- Has indexes and methods for student counting

## Common Tasks Guide

### Adding a New Page
1. Create component in `frontend/src/pages/NewPage/`
2. Import in `App.jsx`
3. Add case in `renderCurrentPage()` switch
4. Update relevant sidebar to include navigation link

### Adding a New API Endpoint
1. Define controller function in `controllers/`
2. Add validation rules (if needed)
3. Register route in `routes/` with `authMiddleware`
4. Add service function in `frontend/src/services/api.js`
5. Import and use in component

### Modifying Model Schema
1. Update Mongoose schema in `backend/models/`
2. Update validation rules in `backend/routes/`
3. Update API service types in `frontend/src/services/api.js`
4. Update form components to handle new fields
5. Consider running seed script to test

## Project-Specific Terminology
- **Aluno** = Student/Player
- **Escalação** = Team lineup/roster for a game
- **Categoria** = Age-based category (e.g., "Sub-15" = Under 15)
- **Treino** = Training session
- **Jogo** = Game/Match
- **Anamnese** = Medical history questionnaire

## Known Gotchas
1. **Frontend runs on TWO ports:** Vite dev (3000) OR preview (5173) - CORS allows both
2. **Categories are strings, not ObjectIds** - don't try to populate them
3. **Custom navigation** - App.jsx manages routing, no React Router installed
4. **No TypeScript** - runtime errors won't be caught until execution
5. **Date handling** - MongoDB stores UTC, frontend may need timezone conversion
6. **CPF uniqueness** - Student model enforces unique CPF with pre-save hook

## Testing Strategy
Currently no automated tests. Manual testing workflow:
1. Seed database: `npm run seed`
2. Start backend: `npm run dev`
3. Start frontend: `npm run dev`
4. Test auth flow: login → token stored → protected routes work
5. Test CRUD: create → read → update → delete for each entity
6. Test relationships: create category → add students → create game → add escalação

## Current Limitations
- Single-user sessions (no real-time collaboration)
- No file upload handling for documents yet
- No email sending for password recovery (planned)
- No export to PDF yet (listed in requirements)
- Training attendance tracking incomplete
- Statistics/dashboard views not implemented
