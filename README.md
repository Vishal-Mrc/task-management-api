# Task Management API

A cloud-native REST API built with Node.js, Express and Google Cloud Firestore.

## Architecture

Client
↓
Google Cloud Run
↓
Node.js + Express
↓
Cloud Firestore

## Technologies

- Node.js
- Express
- Docker
- Google Cloud Run
- Google Artifact Registry
- Google Cloud Firestore
- GitHub Actions
- Terraform

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

## Local Development

```bash
npm install
npm start