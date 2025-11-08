/**
 * LinkedIn OAuth Proxy Server
 *
 * This server handles the secure token exchange for LinkedIn OAuth.
 * It keeps the client_secret secure on the server side.
 *
 * Setup:
 * 1. npm install express cors dotenv
 * 2. Create a .env file with your LinkedIn credentials
 * 3. Run: node proxy.js
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// LinkedIn OAuth endpoints
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';

// Token exchange endpoint
app.post('/auth/linkedin/token', async (req, res) => {
    const { code, redirect_uri } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
    }

    try {
        // Exchange code for access token
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirect_uri,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET
        });

        const response = await fetch(LINKEDIN_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('LinkedIn token exchange error:', error);
            return res.status(response.status).json({
                error: 'Token exchange failed',
                details: error
            });
        }

        const tokenData = await response.json();
        res.json(tokenData);

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        configured: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET)
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`LinkedIn OAuth Proxy Server running on http://localhost:${PORT}`);
    console.log(`\nConfiguration status:`);
    console.log(`- Client ID: ${process.env.LINKEDIN_CLIENT_ID ? '✓ Set' : '✗ Missing'}`);
    console.log(`- Client Secret: ${process.env.LINKEDIN_CLIENT_SECRET ? '✓ Set' : '✗ Missing'}`);

    if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
        console.log(`\n⚠️  Warning: LinkedIn credentials not configured`);
        console.log(`Please create a .env file with:`);
        console.log(`LINKEDIN_CLIENT_ID=your_client_id`);
        console.log(`LINKEDIN_CLIENT_SECRET=your_client_secret`);
    }
});
