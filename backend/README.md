# Competitive Coding Duels Backend

This is the backend for a real-time competitive coding duels platform ("HackerRank meets Chess").

## Features
- Real-time matchmaking and duels via Socket.io
- ELO-based matchmaking using Redis
- Secure code execution via Docker-based judge microservice
- MongoDB for users, problems, and matches
- JWT authentication

## Getting Started
1. Copy `.env.example` to `.env` and fill in your secrets.
2. Run `npm install` to install dependencies.
3. Start the server with `npm run dev`.

## Folder Structure
- `src/` - Main source code
- `docker/` - Docker judge microservice
- `tests/` - Automated tests

## License
MIT
