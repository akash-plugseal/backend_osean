# To-Do Backend Server

## Features
- User authentication (register, login, logout) with JWT
- To-Do management (add, fetch, delete)
- Batch sync for offline/online support

## Tech Stack
- Node.js, Express, MongoDB, Mongoose
- JWT for authentication
- bcrypt for password hashing

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with:
   ```env
   MONGO_URI=mongodb://localhost:27017/todoapp
   JWT_SECRET=supersecretkey
   PORT=4000
   ```
3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` `{ email, password }`
- `POST /api/auth/login` `{ email, password }` → `{ token }`
- `POST /api/auth/logout` (client deletes token)

### Todos (require `Authorization: Bearer <token>`)
- `GET /api/todos/` → list todos
- `POST /api/todos/` `{ title, description }` → add todo
- `DELETE /api/todos/:id` → delete todo
- `POST /api/todos/batch` `{ todos: [{ title, description }, ...] }` → batch sync

## Notes
- Batch sync deduplicates todos by title+description per user.
- Logout is handled client-side by deleting the JWT token. 