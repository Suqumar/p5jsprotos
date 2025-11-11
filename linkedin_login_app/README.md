# LinkedIn Login App

A simple, clean implementation of LinkedIn OAuth authentication using HTML, JavaScript, Tailwind CSS, and FastAPI backend.

## Features

- LinkedIn OAuth 2.0 authentication flow
- Display user profile information (name, email, photo, etc.)
- Beautiful UI with Tailwind CSS
- Secure token exchange via FastAPI backend
- Client-side state management
- CSRF protection with state parameter

## Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │────────▶│   FastAPI   │────────▶│  LinkedIn   │
│  (Frontend) │         │  (Backend)  │         │     API     │
└─────────────┘         └─────────────┘         └─────────────┘
```

The frontend handles the OAuth flow and UI, while the FastAPI backend securely manages token exchange and API requests to LinkedIn.

## Prerequisites

- Python 3.8+ (for FastAPI backend)
- A LinkedIn Developer App

## Setup Instructions

### 1. Create a LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click "Create app"
3. Fill in the required information:
   - App name: Your app name
   - LinkedIn Page: Select or create a page
   - App logo: Upload a logo (optional)
4. Click "Create app"

### 2. Configure OAuth Settings

1. In your LinkedIn app dashboard, go to the "Auth" tab
2. Under "OAuth 2.0 settings", add your redirect URLs:
   - For local development: `http://localhost:8000`
   - For production: Your production URL
3. Under "OAuth 2.0 scopes", request these permissions:
   - `openid`
   - `profile`
   - `email`
4. Copy your **Client ID** and **Client Secret**

### 3. Set Up FastAPI Backend

The FastAPI backend will be generated separately. It will handle:
- Token exchange with LinkedIn (keeping client_secret secure)
- Fetching user profile data from LinkedIn API
- CORS configuration for frontend access

**Backend Endpoints:**
- `POST /api/linkedin/token` - Exchange authorization code for access token
- `GET /api/linkedin/profile` - Fetch user profile from LinkedIn

See `FASTAPI_BACKEND.md` for implementation details (to be generated).

### 4. Running the App

**Step 1: Start the FastAPI Backend**
```bash
# Instructions will be provided when FastAPI code is generated
# Default: uvicorn main:app --reload --port 8000
```

**Step 2: Access the Frontend**
```bash
# Open in browser:
http://localhost:8000
```

**Step 3: Configure and Login**
1. Enter your LinkedIn Client ID in the configuration panel
2. Make sure the Redirect URI matches (default: `http://localhost:8000`)
3. Click "Connect with LinkedIn"
4. Authorize the app on LinkedIn
5. You'll be redirected back with your profile information displayed

## Project Structure

```
linkedin_login_app/
├── index.html          # Main HTML file with Tailwind CSS
├── app.js             # Client-side JavaScript (OAuth flow & UI)
├── backend/           # FastAPI backend (to be generated)
│   ├── main.py        # FastAPI application
│   ├── config.py      # Configuration management
│   └── requirements.txt
├── .env.example       # Environment variables template
├── .gitignore        # Git ignore rules
├── README.md         # This file
└── FASTAPI_BACKEND.md # FastAPI backend documentation
```

## How It Works

### OAuth Flow

1. **Authorization Request**: User clicks login, frontend redirects to LinkedIn authorization page
2. **Authorization Grant**: User approves, LinkedIn redirects back with authorization code
3. **Token Exchange**: Frontend sends code to FastAPI backend, which exchanges it for access token
4. **Profile Fetch**: Frontend requests profile data, FastAPI backend fetches from LinkedIn API
5. **Display Data**: User profile information is displayed in the frontend

### Security Features

- **CSRF Protection**: State parameter validation
- **Secure Secrets**: Client secret kept on backend, never exposed to browser
- **Backend Proxy**: All LinkedIn API calls go through FastAPI backend
- **HTTPS Ready**: Works with SSL/TLS in production
- **Scope Limitation**: Only requests necessary permissions

## Data Retrieved from LinkedIn

The app displays the following user information from LinkedIn's OpenID Connect endpoint:

- **Name** (full name)
- **Given Name** (first name)
- **Family Name** (last name)
- **Email** (verified email address)
- **Profile Picture**
- **Locale** (language preference)
- **Sub** (LinkedIn user ID)

## API Endpoints (FastAPI Backend)

### POST /api/linkedin/token

Exchange authorization code for access token.

**Request:**
```json
{
  "code": "AQT...",
  "redirect_uri": "http://localhost:8000"
}
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "expires_in": 5184000,
  "scope": "openid profile email"
}
```

### GET /api/linkedin/profile

Fetch user profile from LinkedIn API.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "sub": "abc123",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "picture": "https://...",
  "email": "john@example.com",
  "email_verified": true,
  "locale": "en-US"
}
```

## Environment Variables

The FastAPI backend will use these environment variables:

```env
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
BACKEND_PORT=8000
CORS_ORIGINS=http://localhost:8000
```

## Customization

### Styling

The app uses Tailwind CSS via CDN. To customize:
- Edit the HTML classes in `index.html`
- Add custom CSS in a `<style>` tag or separate file

### Additional Data

To fetch more LinkedIn profile data:
1. Update the OAuth scopes in the LinkedIn app settings
2. Modify the `scope` parameter in `app.js`
3. Add additional API endpoints in the FastAPI backend

## Deployment

### Backend Deployment (Heroku, Railway, Render, etc.)

1. Set environment variables in your hosting platform
2. Deploy the FastAPI application
3. Update `API_BASE_URL` in `app.js` to point to your backend URL
4. Update the redirect URI in LinkedIn app settings

### Frontend Deployment

1. Update `API_BASE_URL` in `app.js` to point to your production backend
2. Deploy to any static hosting (Netlify, Vercel, GitHub Pages, etc.) or serve via FastAPI

## Troubleshooting

### "Failed to exchange code for token"

- Make sure the FastAPI server is running on port 8000
- Verify your environment variables have correct LinkedIn credentials
- Check that redirect URI matches exactly in LinkedIn app settings

### "Invalid redirect_uri"

- The redirect URI must match exactly what's configured in LinkedIn
- Include protocol (http/https) and port number
- No trailing slashes

### "insufficient_scope" Error

- Make sure you've added the required scopes in LinkedIn app settings
- Request: `openid`, `profile`, `email`

### CORS Errors

- The FastAPI backend must include proper CORS configuration
- Make sure you're accessing via the configured origin

### Connection Refused / Cannot Connect to Backend

- Verify FastAPI is running: `http://localhost:8000/docs`
- Check firewall settings
- Ensure port 8000 is not being used by another application

## Resources

- [LinkedIn OAuth Documentation](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [LinkedIn API Reference](https://learn.microsoft.com/en-us/linkedin/shared/references/v2/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT

## Notes

- This is a demo application for learning purposes
- For production use, implement additional security measures:
  - Rate limiting
  - Request validation
  - Proper error handling
  - Logging and monitoring
- Always use HTTPS in production
- Consider implementing token refresh logic for long-lived sessions
- Store tokens securely (consider Redis or database for production)
