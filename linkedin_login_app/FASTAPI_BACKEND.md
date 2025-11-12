# FastAPI Backend Specification

This document outlines the requirements for the FastAPI backend that handles LinkedIn OAuth authentication and API requests.

## Overview

The FastAPI backend acts as a secure proxy between the frontend and LinkedIn's API, keeping the client secret secure and handling all OAuth token exchanges.

## Architecture

```
Frontend (app.js) → FastAPI Backend → LinkedIn API
                    ↓
                Environment Variables
                (.env file)
```

## Required Endpoints

### 1. POST /api/linkedin/token

**Purpose:** Exchange LinkedIn authorization code for access token

**Request Body:**
```json
{
  "code": "string",
  "redirect_uri": "string"
}
```

**Process:**
1. Receive authorization code and redirect_uri from frontend
2. Load LinkedIn client_id and client_secret from environment variables
3. Make POST request to `https://www.linkedin.com/oauth/v2/accessToken` with:
   - grant_type: "authorization_code"
   - code: (from request)
   - redirect_uri: (from request)
   - client_id: (from env)
   - client_secret: (from env)
4. Return the access token response

**Success Response (200):**
```json
{
  "access_token": "string",
  "expires_in": 5184000,
  "scope": "string"
}
```

**Error Responses:**
- 400: Missing code or redirect_uri
- 401: Invalid credentials
- 500: Server error

**LinkedIn API Endpoint:**
```
POST https://www.linkedin.com/oauth/v2/accessToken
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code={authorization_code}
&redirect_uri={redirect_uri}
&client_id={client_id}
&client_secret={client_secret}
```

### 2. GET /api/linkedin/profile

**Purpose:** Fetch user profile data from LinkedIn

**Headers:**
```
Authorization: Bearer {access_token}
```

**Process:**
1. Extract access token from Authorization header
2. Make GET request to `https://api.linkedin.com/v2/userinfo` with Bearer token
3. Return the profile data

**Success Response (200):**
```json
{
  "sub": "string",
  "name": "string",
  "given_name": "string",
  "family_name": "string",
  "picture": "string",
  "email": "string",
  "email_verified": boolean,
  "locale": "string"
}
```

**Error Responses:**
- 401: Missing or invalid token
- 403: Insufficient permissions
- 500: Server error

**LinkedIn API Endpoint:**
```
GET https://api.linkedin.com/v2/userinfo
Authorization: Bearer {access_token}
```

### 3. GET /health (Optional but Recommended)

**Purpose:** Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "configured": boolean
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# LinkedIn OAuth Credentials
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here

# Server Configuration
BACKEND_PORT=8000
CORS_ORIGINS=http://localhost:8000,http://127.0.0.1:8000

# Optional
DEBUG=True
LOG_LEVEL=INFO
```

## CORS Configuration

The backend must enable CORS for the frontend to access it:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Static File Serving (Optional)

For convenience, the FastAPI backend can also serve the frontend static files:

```python
from fastapi.staticfiles import StaticFiles

app.mount("/", StaticFiles(directory=".", html=True), name="static")
```

This allows accessing `index.html` at `http://localhost:8000/`

## Dependencies

Required Python packages:

```txt
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
httpx>=0.25.0
python-dotenv>=1.0.0
pydantic>=2.0.0
pydantic-settings>=2.0.0
```

## Project Structure

```
linkedin_login_app/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration management
│   ├── models.py            # Pydantic models
│   ├── services/
│   │   └── linkedin.py      # LinkedIn API service
│   ├── routers/
│   │   └── linkedin.py      # LinkedIn endpoints
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (not in git)
├── index.html
├── app.js
└── ...
```

## Implementation Checklist

When implementing the FastAPI backend, ensure:

- [ ] Environment variables are loaded from .env file
- [ ] CORS is properly configured for frontend access
- [ ] Client secret is never exposed to frontend
- [ ] Proper error handling for all endpoints
- [ ] Request/response validation using Pydantic models
- [ ] Bearer token validation in /profile endpoint
- [ ] Async HTTP requests using httpx
- [ ] Logging for debugging and monitoring
- [ ] Health check endpoint
- [ ] Static file serving (optional)

## Security Considerations

1. **Never expose client_secret**: Keep it in environment variables, never send to frontend
2. **Validate all inputs**: Use Pydantic models for request validation
3. **HTTPS in production**: Always use SSL/TLS in production
4. **CORS restrictions**: Only allow specific origins in production
5. **Token handling**: Never log or store access tokens unnecessarily
6. **Rate limiting**: Consider adding rate limiting for production
7. **Error messages**: Don't expose sensitive information in error messages

## Testing

### Manual Testing

1. **Test Token Exchange:**
```bash
curl -X POST http://localhost:8000/api/linkedin/token \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AQT...",
    "redirect_uri": "http://localhost:8000"
  }'
```

2. **Test Profile Fetch:**
```bash
curl -X GET http://localhost:8000/api/linkedin/profile \
  -H "Authorization: Bearer eyJ..."
```

3. **Test Health Check:**
```bash
curl http://localhost:8000/health
```

### FastAPI Interactive Docs

Access the auto-generated API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Running the Backend

```bash
# Navigate to backend directory
cd linkedin_login_app/backend

# Install dependencies
pip install -r requirements.txt

# Run with uvicorn
uvicorn main:app --reload --port 8000

# Or run with python
python -m uvicorn main:app --reload --port 8000
```

## Deployment

### Production Considerations

1. **Use production ASGI server**: Gunicorn with Uvicorn workers
2. **Set DEBUG=False**: Disable debug mode
3. **Use environment secrets**: Store credentials securely
4. **Enable HTTPS**: Use SSL/TLS certificates
5. **Add logging**: Implement proper logging
6. **Monitor performance**: Use APM tools
7. **Rate limiting**: Implement rate limiting

### Example Production Command

```bash
gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

## Error Handling Examples

The backend should handle these scenarios gracefully:

1. **Invalid authorization code**: Return 401 with clear message
2. **Expired access token**: Return 401 and let frontend re-authenticate
3. **Network errors to LinkedIn**: Return 503 with retry message
4. **Missing environment variables**: Fail fast on startup
5. **Invalid request format**: Return 422 with validation errors

## Logging

Implement logging for:
- Request/response for each endpoint
- LinkedIn API calls
- Errors and exceptions
- Token exchanges (without logging the actual tokens)

## Next Steps

To implement the FastAPI backend:

1. Create the `backend/` directory
2. Implement `main.py` with FastAPI app and endpoints
3. Create `config.py` for environment variable management
4. Implement LinkedIn API service in `services/linkedin.py`
5. Define Pydantic models in `models.py`
6. Add CORS middleware
7. Test all endpoints
8. Add error handling and logging
9. Deploy and test in production

## Additional Features (Optional)

Consider adding these features for a more robust implementation:

- **Token refresh**: Implement token refresh logic
- **Session management**: Store tokens in Redis or database
- **Caching**: Cache profile data to reduce API calls
- **Webhooks**: Handle LinkedIn webhooks for real-time updates
- **Multiple providers**: Support other OAuth providers (Google, GitHub, etc.)
- **Admin panel**: Add admin interface for monitoring

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [LinkedIn OAuth 2.0](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [HTTPX Documentation](https://www.python-httpx.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
