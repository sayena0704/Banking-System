# Auth Bank Service

This is a Koa-based authentication service for a banking system. It handles user registration with OTP verification, login, token management, and logout.

## Features

- Register new user (email & password)
- OTP generation and verification
- Login with JWT access/refresh tokens
- Refresh token endpoint
- Logout (invalidate refresh token)
- Resend OTP

## Getting Started

### Requirements

- Node.js 18+ (or newer)
- npm
- Prisma-compatible database (e.g. PostgreSQL, MySQL)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in a `.env` file (see `.env.example` if available). Ensure database URL is set.
3. Run Prisma migrations and generate client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
4. Start the server:
   ```bash
   npm run dev          # development
   npm run build && npm start  # production
   ```

The service listens on port defined in `config/config.ts` (default `3001`).

## API Endpoints

### Register

```
POST /auth/register
```

Body:
```json
{
  "email": "user@example.com",
  "password": "StrongPass1!"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Registration initiated. OTP sent for verification",
  "data": { "userId": "...", "email": "user@example.com", "role": "USER" }
}
```

> OTP is logged to the server console. Use it in the next request.

### Verify OTP

```
POST /auth/verify-otp
```

Body:
```json
{ "email": "user@example.com", "otp": "123456" }
```

Response (200):
```json
{ "message": "OTP verified successfully" }
```

### Login

```
POST /auth/login
```

Body:
```json
{ "email": "user@example.com", "password": "StrongPass1!" }
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "accessToken": "...", "refreshToken": "...", "user": { ... } }
}
```

### Token Refresh

```
POST /auth/refresh
```

Body:
```json
{ "refreshToken": "..." }
```

### Logout

```
POST /auth/logout
```

Body:
```json
{ "refreshToken": "..." }
```

### Resend OTP

```
POST /auth/resend-otp
```

Body:
```json
{ "email": "user@example.com" }
```

## Notes

- Passwords must be 8–64 characters, include uppercase, digit, and special character.
- You can inspect the OTP in the server logs for development.
- Database operations use Prisma ORM (`src/db/prisma.ts`).

Keep this README handy for quick reference.