# LinkedIn Login App

A simple, clean implementation of LinkedIn OAuth authentication using HTML, JavaScript, and Tailwind CSS.

## Features

- LinkedIn OAuth 2.0 authentication flow
- Display user profile information (name, email, photo, etc.)
- Beautiful UI with Tailwind CSS
- Secure token exchange via backend proxy
- Client-side state management
- CSRF protection with state parameter

## Prerequisites

- Node.js (v14 or higher)
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
   - For local development: `http://localhost:3000`
   - For production: Your production URL
3. Under "OAuth 2.0 scopes", request these permissions:
   - `openid`
   - `profile`
   - `email`
4. Copy your **Client ID** and **Client Secret**

### 3. Install Dependencies

```bash
cd linkedin_login_app
npm install
```

### 4. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your LinkedIn credentials:
```env
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

## Running the App

### Start the Backend Proxy Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### Access the App

1. Open your browser and go to: `http://localhost:3000`
2. Enter your LinkedIn Client ID in the configuration panel
3. Make sure the Redirect URI matches what you configured in LinkedIn (default: `http://localhost:3000`)
4. Click "Connect with LinkedIn"
5. Authorize the app on LinkedIn
6. You'll be redirected back with your profile information displayed

## Project Structure

```
linkedin_login_app/
├── index.html          # Main HTML file with Tailwind CSS
├── app.js             # Client-side JavaScript (OAuth flow & UI)
├── proxy.js           # Backend proxy server (secure token exchange)
├── package.json       # Node.js dependencies
├── .env.example       # Environment variables template
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## How It Works

### OAuth Flow

1. **Authorization Request**: User clicks login, app redirects to LinkedIn authorization page
2. **Authorization Grant**: User approves, LinkedIn redirects back with authorization code
3. **Token Exchange**: Backend proxy exchanges code for access token (keeps client_secret secure)
4. **API Request**: App uses access token to fetch user profile from LinkedIn API
5. **Display Data**: User profile information is displayed

### Security Features

- **CSRF Protection**: State parameter validation
- **Secure Secrets**: Client secret kept on backend, never exposed to browser
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

## Customization

### Styling

The app uses Tailwind CSS via CDN. To customize:
- Edit the HTML classes in `index.html`
- Add custom CSS in a `<style>` tag or separate file

### Additional Data

To fetch more LinkedIn profile data:
1. Update the OAuth scopes in the LinkedIn app settings
2. Modify the `scope` parameter in `app.js`
3. Call additional LinkedIn API endpoints in the `fetchUserProfile` function

## Deployment

### Backend Deployment (Heroku, Railway, etc.)

1. Set environment variables in your hosting platform
2. Deploy the `proxy.js` server
3. Update the redirect URI in LinkedIn app settings
4. Update the redirect URI in the frontend configuration

### Frontend Deployment

1. Update the backend URL in `app.js` (line with `fetch('http://localhost:3000/...`)
2. Deploy to any static hosting (Netlify, Vercel, GitHub Pages, etc.)

## Troubleshooting

### "Failed to exchange code for token"

- Make sure the proxy server is running (`npm start`)
- Verify your `.env` file has correct credentials
- Check that redirect URI matches exactly in LinkedIn app settings

### "Invalid redirect_uri"

- The redirect URI must match exactly what's configured in LinkedIn
- Include protocol (http/https) and port number
- No trailing slashes

### "insufficient_scope" Error

- Make sure you've added the required scopes in LinkedIn app settings
- Request: `openid`, `profile`, `email`

### CORS Errors

- The proxy server includes CORS headers
- Make sure you're accessing via `localhost:3000`, not opening the HTML file directly

## Resources

- [LinkedIn OAuth Documentation](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [LinkedIn API Reference](https://learn.microsoft.com/en-us/linkedin/shared/references/v2/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT

## Notes

- This is a demo application for learning purposes
- For production use, implement additional security measures
- Always use HTTPS in production
- Consider implementing token refresh logic for long-lived sessions
- Add proper error handling and logging
