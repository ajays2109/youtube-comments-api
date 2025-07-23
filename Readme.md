# YouTube Comments API

A ScyllaDB-powered, Node.js & TypeScript REST API for a YouTube-style comment system.  
Supports videos, comments, replies, and reactions (likes/dislikes).

## Features

- User registration
- Video listing
- Commenting on videos
- Replying to comments
- Like/dislike comments and replies
- Pagination and sorting (top/new)
- Request validation and error handling
- Logging with Winston

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** ScyllaDB
- **Validation:** Joi
- **Logging:** Winston

## Getting Started

### Prerequisites

- Node.js (v18+)
- ScyllaDB cluster (see `.env.development` for config)

### Installation

```sh
npm install
```

### Environment Variables

Copy `.env.development` and adjust values as needed:

```
NODE_ENV=development
PORT=3000
SCYLLADB_CONTACT_POINTS=...
SCYLLADB_USERNAME=...
SCYLLADB_PASSWORD=...
SCYLLADB_LOCAL_DATACENTER=...
SCYLLADB_PORT=9042
SCYLLADB_KEYSPACE=youtube_comments_app
```

### Database Setup

Run the schema file to create tables and insert sample values for videos:

```sh
cqlsh -f db-schema.cql
```

### Running the Server

```sh
npm run start
```

Server runs at [http://localhost:3000](http://localhost:3000).

### API Documentation

- Postman collection [Link](https://documenter.getpostman.com/view/23770252/2sB34mjJvc#intro).

### Workflow

1. Fetch available videos using the `video/list` API.
2. Create a new user using the `user/create` API (provide any username).
3. Add a comment to a video using the `comment/create` API (provide `userName`, `videoId`, and `content`).
4. React (like/dislike) to a comment using the `comment/react` API with any created username.
5. List all comments for a video using the `comment/list` API.
6. Create a reply to a comment using the `reply/create` API (provide `commentId`, `videoId`, `userName`, and `content`).
7. React to a reply using the `reply/react` API.
8. List all replies to a comment using the `reply/list` API.

## Scripts

- `npm run start` — Start development server
- `npm run build` — Compile TypeScript
- `npm run test` — Run tests with Jest

## Folder Highlights

- **Controllers:** Request handlers ([src/controllers/](src/controllers/))
- **Services:** Business logic ([src/services/](src/services/))
- **Routes:** API endpoints ([src/routes/](src/routes/))
- **Types:** TypeScript interfaces ([src/types/](src/types/))
- **Middlewares:** Express middlewares ([src/middlewares/](src/middlewares/))
- **Validators:** Request validators ([src/validators/](src/validators/))
- **utils:** Utility functions ([src/utils](src/utils/))

## Improvements

- Add authentication and authorization (e.g., JWT) for protected routes
- Implement rate limiting to prevent spam and abuse
- Add support for soft deletes and comment/reply editing history
- Improve error handling and return more descriptive error messages
- Add more comprehensive unit and integration tests
- Implement caching for frequently accessed endpoints
- Add Swagger/OpenAPI documentation endpoint
- Support for user profile updates and avatars
- Add Docker support for easier deployment
- Implement WebSocket or Server-Sent Events for real-time comment updates
- Add CI/CD pipeline for automated testing and deployment
- Improve logging and monitoring (e.g., with Prometheus/Grafana)

## License

ISC

---

**Author:** ajay-antony-naveen