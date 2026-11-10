# api-tareas

REST API for a to-do list, built with Node.js and Express for a school assignment (Actividad 3, Desarrollo Full Stack). Tasks are stored in JSON files and the routes are protected with JWT.

The frontend is the Task Terminal app from my Actividad 2, adapted to consume this API instead of localStorage.

## Requirements

- Node.js 18+

## Setup

```bash
npm install
npm start        # http://localhost:3000
npm run dev      # same, but with --inspect for debugging
```

## How to use

First register a user and login to get a token:

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Sebastian","email":"sebastian@test.com","contrasena":"secreto123"}'

curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sebastian@test.com","contrasena":"secreto123"}'
```

Then send the token on every request: `Authorization: Bearer <token>`.

Test user: `sebastian@test.com` / `secreto123`

## Endpoints

| Method | Route           | Description                        | Auth |
|--------|-----------------|------------------------------------|------|
| POST   | /register       | Create a user (bcrypt hash)        | No   |
| POST   | /login          | Returns a JWT (expires in 1h)     | No   |
| GET    | /tareas         | List all tasks                     | Yes  |
| POST   | /tareas         | Create a task (titulo + descripcion) | Yes |
| PUT    | /tareas/:id     | Update a task                      | Yes  |
| DELETE | /tareas/:id     | Delete a task                      | Yes  |

Validation errors return 400, unknown routes 404, bad/expired token 401, unexpected errors 500.

## Structure

```
server/
  src/                  # code only
    server.js           # entry point (npm start)
    app.js              # express app + middleware
    config/             # port, jwt secret, file paths
    modules/
      tareas/           # routes / controller / service (fs)
      usuarios/         # register / login (bcrypt + jwt)
    middleware/         # auth, validation, 404, error handler
  data/                 # "database": tareas.json, usuarios.json
client/                 # Task Terminal frontend
```
