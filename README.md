# Absolute-Beginner Mongoose CRUD Challenge

## Difficulty

**Absolute beginner — approximately 2 out of 10.**

This challenge focuses only on four Mongoose model methods. The schema,
database connection, Express server, routes, error handling, and request data
have already been prepared for you.

## What CRUD means

| Letter | Action | Mongoose method | HTTP method |
| --- | --- | --- | --- |
| C | Create a document | `Task.create()` | POST |
| R | Read documents | `Task.find()` | GET |
| U | Update a document | `Task.findByIdAndUpdate()` | PATCH |
| D | Delete a document | `Task.findByIdAndDelete()` | DELETE |

Think of the `Task` model as the employee who carries your instructions to
MongoDB. Each method tells that employee which database job to perform.

## Before starting

You should know only these JavaScript ideas:

- Variables created with `const`
- Objects such as `{ title: "Study" }`
- Functions
- `async` and `await` at a basic level

You do not need to build schemas, controllers, middleware, or route files for
this challenge.

## Setup

1. Make sure your local MongoDB service is running.
2. Rename `.env.example` to `.env`.
3. Open the project folder in VS Code.
4. Run:

```bash
npm install
npm run dev
```

5. You should see:

```text
Connected to MongoDB
Server running at http://localhost:5000
```

## Your job

Open `server.js` and search for `TODO`. Complete the challenges in order.

### Challenge 1 — Create

Complete `POST /tasks` using `Task.create()`.

Test in Postman:

```http
POST http://localhost:5000/tasks
Content-Type: application/json
```

```json
{
  "title": "Practice Mongoose"
}
```

Expected shape:

```json
{
  "title": "Practice Mongoose",
  "isComplete": false,
  "_id": "a-mongodb-id-will-appear-here"
}
```

### Challenge 2 — Read

Complete `GET /tasks` using `Task.find()`.

```http
GET http://localhost:5000/tasks
```

Expected result: an array of task documents.

### Challenge 3 — Update

Copy a task's `_id` from the GET response and place it in the URL.

```http
PATCH http://localhost:5000/tasks/PASTE_ID_HERE
Content-Type: application/json
```

```json
{
  "isComplete": true
}
```

Use `Task.findByIdAndUpdate()` and return the changed document.

### Challenge 4 — Delete

```http
DELETE http://localhost:5000/tasks/PASTE_ID_HERE
```

Use `Task.findByIdAndDelete()` and return the deleted document.

## Rules

1. Complete only one route at a time.
2. Test that route in Postman before moving forward.
3. Do not change the `Task` schema yet.
4. Use `await` with every Mongoose database operation.
5. If stuck, read only the matching section in `HINTS.md`.

## Completion checklist

- [ ] POST creates a task in MongoDB.
- [ ] GET returns an array of tasks.
- [ ] PATCH changes `isComplete` to `true`.
- [ ] DELETE removes a task.
- [ ] GET no longer returns the deleted task.

## After you finish

Your first follow-up challenge is to add `GET /tasks/:taskId` using
`Task.findById()`. Do that only after all four main operations work.
