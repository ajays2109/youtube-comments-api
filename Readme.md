# YouTube Comments API

A ScyllaDB-powered, Node.js & TypeScript REST API for a YouTube-style comment system.  
Supports videos, comments, replies, user management, and reactions (likes/dislikes).

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

Run the schema file to create tables:

```sh
cqlsh -f db-schema.cql
```

### Running the Server

```sh
npm run start
```

Server runs at [http://localhost:3000](http://localhost:3000).

### API Documentation

- Swagger/OpenAPI spec: [`src/docs/swagger.json`](src/docs/swagger.json)

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

## License

ISC

---

**Author:** ajay-antony-naveen