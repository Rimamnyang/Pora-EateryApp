# The Online Eatery — Backend API

RESTful API for a food ordering and management system, built with Node.js, Express, and MongoDB.

## Tech Stack
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT authentication (jsonwebtoken)
- bcryptjs for password hashing
- express-validator for input validation
- helmet, cors, morgan for security/logging

## Folder Structure
```
src/
  config/       MongoDB connection
  controllers/  Request handlers / business logic
  middleware/   Auth guard, admin guard, error handler, validation
  models/       Mongoose schemas (User, Menu, Order)
  routes/       Express route definitions
  utils/        Token generation, admin seed script
  validators/   express-validator rule sets
server.js       App entry point
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in real values:
   ```
   cp .env.example .env
   ```
   - `MONGO_URI`: your MongoDB Atlas connection string
   - `JWT_SECRET`: any long random string
   - `CLIENT_ORIGIN`: your frontend URL (e.g. http://localhost:5173 locally)

3. Run in development (auto-restarts on file changes):
   ```
   npm run dev
   ```

4. Create your first admin account (signup only ever creates customers):
   ```
   npm run seed:admin
   ```
   This uses `ADMIN_SEED_NAME`, `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD` from your `.env`.

The server starts on `http://localhost:5000` by default. Visit `/` for a health check.

## Environment Variables

| Variable | Description |
|---|---|
| PORT | Port the server listens on |
| NODE_ENV | development / production |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret used to sign JWTs |
| JWT_EXPIRES_IN | Token lifetime, e.g. "7d" |
| CLIENT_ORIGIN | Allowed CORS origin(s), comma-separated |
| ADMIN_SEED_* | Used only by `npm run seed:admin` |

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/signup | Public | Register a new customer |
| POST | /api/auth/login | Public | Log in, returns JWT |
| GET | /api/users/profile | Private | Get own profile |
| PUT | /api/users/profile | Private | Update own profile |
| GET | /api/menu | Public | List menu items (supports ?search, ?category, ?minPrice, ?maxPrice) |
| GET | /api/menu/:id | Public | Get one menu item |
| POST | /api/menu | Admin | Create menu item |
| PUT | /api/menu/:id | Admin | Update menu item |
| DELETE | /api/menu/:id | Admin | Delete menu item |
| POST | /api/orders | Private | Place an order |
| GET | /api/orders/my-orders | Private | Own order history |
| GET | /api/orders | Admin | All orders |
| GET | /api/orders/:id | Private/Admin | Single order (owner or admin) |
| PATCH | /api/orders/:id/status | Admin | Update order status |

All protected routes require `Authorization: Bearer <token>` header.

## Error Response Shape
```json
{ "success": false, "message": "..." }
```

## Testing
Import the endpoints above into Postman. For each route, test:
- A valid request (expect 200/201)
- Missing required fields (expect 400)
- No token on a private/admin route (expect 401)
- Non-admin token on an admin route (expect 403)
- Invalid ID (expect 404)
