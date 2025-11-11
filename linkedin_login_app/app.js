// LinkedIn OAuth Configuration
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_PROFILE_URL = 'https://api.linkedin.com/v2/userinfo';

// FastAPI Backend URL
const API_BASE_URL = 'http://localhost:8000';

// State management
let accessToken = null;

// DOM Elements
const elements = {
    configPanel: document.getElementById('configPanel'),
    loginSection: document.getElementById('loginSection'),
    profileSection: document.getElementById('profileSection'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    errorMessage: document.getElementById('errorMessage'),
    rawDataSection: document.getElementById('rawDataSection'),
    loginBtn: document.getElementById('loginBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    clientId: document.getElementById('clientId'),
    redirectUri: document.getElementById('redirectUri')
};

// Initialize app
function init() {
    // Load saved credentials
    loadCredentials();

    // Check if we're returning from LinkedIn OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
        showError(`OAuth Error: ${error} - ${urlParams.get('error_description')}`);
        return;
    }

    if (code) {
        handleOAuthCallback(code);
    }

    // Event listeners
    elements.loginBtn.addEventListener('click', initiateLogin);
    elements.logoutBtn.addEventListener('click', logout);

    // Save credentials on change
    elements.clientId.addEventListener('change', saveCredentials);
    elements.redirectUri.addEventListener('change', saveCredentials);
}

// Save credentials to localStorage
function saveCredentials() {
    localStorage.setItem('linkedin_client_id', elements.clientId.value);
    localStorage.setItem('linkedin_redirect_uri', elements.redirectUri.value);
}

// Load credentials from localStorage
function loadCredentials() {
    const savedClientId = localStorage.getItem('linkedin_client_id');
    const savedRedirectUri = localStorage.getItem('linkedin_redirect_uri');

    if (savedClientId) elements.clientId.value = savedClientId;
    if (savedRedirectUri) elements.redirectUri.value = savedRedirectUri;
}

// Generate random state for CSRF protection
function generateState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Initiate LinkedIn OAuth flow
function initiateLogin() {
    const clientId = elements.clientId.value.trim();
    const redirectUri = elements.redirectUri.value.trim();

    if (!clientId) {
        showError('Please enter your LinkedIn Client ID');
        return;
    }

    // Save credentials
    saveCredentials();

    // Generate and save state
    const state = generateState();
    sessionStorage.setItem('oauth_state', state);

    // Build authorization URL
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        state: state,
        scope: 'openid profile email'
    });

    // Redirect to LinkedIn
    window.location.href = `${LINKEDIN_AUTH_URL}?${params.toString()}`;
}

// Handle OAuth callback
async function handleOAuthCallback(code) {
    // Verify state
    const urlParams = new URLSearchParams(window.location.search);
    const returnedState = urlParams.get('state');
    const savedState = sessionStorage.getItem('oauth_state');

    if (returnedState !== savedState) {
        showError('Invalid state parameter. Possible CSRF attack.');
        return;
    }

    showLoading(true);

    try {
        // Exchange code for token
        accessToken = await exchangeCodeForToken(code);

        // Fetch user profile
        const profile = await fetchUserProfile(accessToken);

        // Display profile
        displayProfile(profile);

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);

    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Exchange authorization code for access token
async function exchangeCodeForToken(code) {
    const clientId = elements.clientId.value.trim();
    const redirectUri = elements.redirectUri.value.trim();

    // Note: Token exchange must be done server-side to keep client_secret secure
    // This calls the FastAPI backend which handles the secure token exchange

    try {
        const response = await fetch(`${API_BASE_URL}/api/linkedin/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                redirect_uri: redirectUri
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to exchange code for token. Make sure the FastAPI server is running.');
        }

        const data = await response.json();
        return data.access_token;

    } catch (error) {
        throw new Error(`Token exchange failed: ${error.message}. Please ensure the FastAPI backend is running on port 8000.`);
    }
}

// Fetch user profile from LinkedIn via FastAPI backend
async function fetchUserProfile(token) {
    try {
        // Call FastAPI backend to fetch profile
        const response = await fetch(`${API_BASE_URL}/api/linkedin/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to fetch profile');
        }

        const profile = await response.json();
        return profile;

    } catch (error) {
        throw new Error(`Profile fetch failed: ${error.message}`);
    }
}

// Display user profile
function displayProfile(profile) {
    // Hide login, show profile
    elements.configPanel.classList.add('hidden');
    elements.loginSection.classList.add('hidden');
    elements.profileSection.classList.remove('hidden');
    elements.rawDataSection.classList.remove('hidden');

    // Display profile picture
    if (profile.picture) {
        elements.profilePicture.src = profile.picture;
    } else {
        elements.profilePicture.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&size=128&background=0D8ABC&color=fff`;
    }

    // Display name
    document.getElementById('profileName').textContent = profile.name || 'Unknown';

    // Display headline/title
    if (profile.email) {
        document.getElementById('profileHeadline').textContent = profile.email;
    }

    // Display profile details
    const detailsContainer = document.getElementById('profileDetails');
    detailsContainer.innerHTML = '';

    const fields = [
        { label: 'Full Name', value: profile.name },
        { label: 'Given Name', value: profile.given_name },
        { label: 'Family Name', value: profile.family_name },
        { label: 'Email', value: profile.email },
        { label: 'Email Verified', value: profile.email_verified ? 'Yes' : 'No' },
        { label: 'Locale', value: profile.locale },
        { label: 'Sub (User ID)', value: profile.sub }
    ];

    fields.forEach(field => {
        if (field.value) {
            const div = document.createElement('div');
            div.className = 'flex justify-between py-2 border-b border-gray-100';
            div.innerHTML = `
                <span class="font-semibold text-gray-700">${field.label}:</span>
                <span class="text-gray-600">${field.value}</span>
            `;
            detailsContainer.appendChild(div);
        }
    });

    // Display raw data
    document.getElementById('rawData').textContent = JSON.stringify(profile, null, 2);
}

// Logout
function logout() {
    accessToken = null;
    sessionStorage.clear();

    elements.configPanel.classList.remove('hidden');
    elements.loginSection.classList.remove('hidden');
    elements.profileSection.classList.add('hidden');
    elements.rawDataSection.classList.add('hidden');
    elements.errorMessage.classList.add('hidden');
}

// Show loading state
function showLoading(show) {
    if (show) {
        elements.loginSection.classList.add('hidden');
        elements.loadingSpinner.classList.remove('hidden');
    } else {
        elements.loadingSpinner.classList.add('hidden');
    }
}

// Show error message
function showError(message) {
    elements.errorMessage.classList.remove('hidden');
    document.getElementById('errorText').textContent = message;

    // Auto-hide after 10 seconds
    setTimeout(() => {
        elements.errorMessage.classList.add('hidden');
    }, 10000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
