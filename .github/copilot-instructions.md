# Back-2FA Project - AI Coding Instructions

## Project Overview
Express.js backend implementing time-based two-factor authentication (2FA) without external libraries like TOTP. Uses a custom time-window code generation algorithm.

## Architecture

### Core Components
- **Entry Point**: [index.js](../index.js) - Express server setup, MongoDB connection, route registration
- **Code Generator**: [generateCode.js](../generateCode.js) - Time-based verification code algorithm
- **2FA Middleware**: [middlewares/twofa.js](../middlewares/twofa.js) - Authentication enforcement
- **User Model**: [models/users.js](../models/users.js) - Mongoose schema with Joi validation
- **User Router**: [routers/users.js](../routers/users.js) - User registration endpoint

### Data Flow
1. **User Registration** (`POST /api/users`):
   - Client sends `{name, key}` → Joi validation → Save to MongoDB → Return key to client
2. **Protected Resource Access** (`GET /`):
   - Client sends `x-username` header + `{code}` body → Middleware validates code → Grant access

## Custom 2FA Algorithm
The code generation uses a 10-second time window:
```javascript
code = Math.floor(Date.now() / 10000) - user.key
```
- **NOT standard TOTP**: Uses simple subtraction, not HMAC-SHA1
- **Time Window**: 10 seconds (codes expire every 10s)
- **Key Storage**: User-provided numeric key stored in plain MongoDB (security concern)

## Development Patterns

### Request/Response Conventions
- **2FA Headers**: Use `x-username` header for user identification in protected routes
- **2FA Body**: Send `code` field in request body (numeric)
- **Validation**: Always use Joi schemas from model files before database operations
- **Error Responses**: Return `.details[0].message` for Joi validation errors

### Module Organization
- **Models**: Export both model (`User`) and validator (`validate`) as named exports
- **Routers**: Use Express Router, mount at `/api/{resource}` in main app
- **Middleware**: Export async functions directly (not wrapped in objects)

## Database Setup
- **Connection**: MongoDB at `mongodb://localhost:8088/back2fa` (non-standard port)
- **Schema**: Minimal user schema (name + key only)
- **No authentication**: MongoDB connection has no auth credentials

## Running the Application
```bash
# Start MongoDB on port 8088 (must be configured separately)
# Run server
node index.js
# Server listens on port 3000
```

## Security Notes (Current State)
- Keys are user-provided and stored unencrypted
- No password/hash authentication
- Code algorithm is simple and predictable
- No rate limiting on code attempts
- Comment in [routers/users.js](../routers/users.js#L14) indicates key generation needs improvement

## Testing Pattern
Protected routes require both `x-username` header AND `code` in body:
```javascript
// Example protected request
headers: { 'x-username': 'john' }
body: { code: <generateCode(userKey)> }
```

## Dependencies
- **express** (^4.18.2): Web framework
- **mongoose** (^7.6.3): MongoDB ODM
- **joi** (^17.11.0): Input validation (used in all POST routes)
