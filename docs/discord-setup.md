# Discord OAuth2 Setup Guide

This guide walks you through setting up Discord OAuth2 authentication for the Star Technology Translations Hub.

## Prerequisites

- A Discord account
- Access to the Discord Developer Portal
- Basic understanding of OAuth2 flow

## Step 1: Create Discord Application

1. **Visit the Discord Developer Portal**

   - Go to [https://discord.com/developers/applications](https://discord.com/developers/applications)
   - Sign in with your Discord account

2. **Create New Application**

   - Click "New Application" button
   - Enter application name: `Star Technology Translations Hub` (or your preferred name)
   - Accept Discord's terms and create the application

3. **Note Your Application ID**
   - From the "General Information" tab, copy your **Application ID** (this is your Client ID)
   - Save this for later use in environment configuration

## Step 2: Configure OAuth2 Settings

1. **Navigate to OAuth2 Tab**

   - In your Discord application, click on "OAuth2" in the left sidebar
   - Select "General" under OAuth2

2. **Add Redirect URIs**

   **For Development:**

   ```
   http://localhost:5173/auth/callback
   ```

   **For Production (GitHub Pages):**

   ```
   https://yourusername.github.io/translation-hub/auth/callback
   ```

   Replace `yourusername` with your actual GitHub username.

3. **Save Changes**
   - Click "Save Changes" to apply the redirect URI configuration

## Step 3: Configure OAuth2 Scopes (Optional)

For this application, we use the implicit grant flow which only requires:

- `identify` - Basic user information
- `email` - User's email address (if needed)

These scopes are configured in the client-side code, not in the Discord Developer Portal.

## Step 4: Security Considerations

### What's Safe to Expose

- **Application ID (Client ID)**: Safe to use in client-side code
- **Redirect URIs**: Public information, configured in Discord app settings

### What to Keep Secret

- **Client Secret**: Not needed for public OAuth apps using implicit grant flow
- **Bot Token**: Not applicable for OAuth2 user authentication

## Step 5: Environment Configuration

### Development Setup

1. **Create Environment File**

   ```bash
   cp .env.example .env
   ```

2. **Configure Environment Variables**
   ```env
   VITE_DISCORD_CLIENT_ID=your_application_id_here
   VITE_DISCORD_CLIENT_SECRET=your_client_secret_here
   VITE_REDIRECT_URI=http://localhost:5173/auth/callback
   VITE_APP_URL=http://localhost:5173
   VITE_DISCORD_GUILD_ID=your_guild_id_here
   VITE_ADMIN_USER_IDS=admin_user_id_1,admin_user_id_2
   ```

### Guild Configuration

To enable guild membership verification:

1. **Get Your Guild ID**

   - Open Discord in your browser or desktop app
   - Go to your server/guild
   - Right-click on the server name
   - Select "Copy Server ID" (requires Developer Mode enabled)
   - Paste this ID as `VITE_DISCORD_GUILD_ID`

2. **Configure Admin Users**

   - Get Discord User IDs of administrators
   - Right-click on user profiles → "Copy User ID"
   - Add comma-separated IDs to `VITE_ADMIN_USER_IDS`

3. **Enable Developer Mode** (if not already enabled)
   - Discord Settings → Advanced → Developer Mode → Enable

### Production Setup

For GitHub Pages deployment, credentials are managed through GitHub Secrets:

1. **Go to Repository Settings**

   - Navigate to your GitHub repository
   - Go to Settings → Secrets and variables → Actions

2. **Add Repository Secrets**

   Add the following secrets to your GitHub repository:

   - **Name**: `DISCORD_CLIENT_ID`
     - **Value**: Your Discord Application ID
   - **Name**: `DISCORD_CLIENT_SECRET`
     - **Value**: Your Discord Application Client Secret
   - **Name**: `DISCORD_GUILD_ID`
     - **Value**: Your Discord Server/Guild ID
   - **Name**: `ADMIN_USER_IDS`
     - **Value**: Comma-separated Discord User IDs for administrators
     - **Example**: `123456789012345678,987654321098765432`

### Role-Based Access Control

The application implements a three-tier role system:

#### 🔒 Guest Role

- **Access**: View page only (public translation browser)
- **Requirements**: No authentication required
- **Description**: Default role for unauthenticated users

#### 👥 Contributor Role

- **Access**: View, Edit, and Verify pages
- **Requirements**: Discord authentication + 1+ month guild membership
- **Description**: Guild members who have been part of the server for over 1 month

#### 👑 Admin Role

- **Access**: All pages including Management
- **Requirements**: Discord User ID listed in `ADMIN_USER_IDS` environment variable
- **Description**: Server administrators with full management capabilities

## Step 6: Testing the Setup

### Development Testing

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Test Authentication Flow**
   - Open `http://localhost:5173`
   - Click "Sign in with Discord"
   - Authorize the application
   - Verify redirect back to callback URL

### Production Testing

1. **Deploy to GitHub Pages**

   - Push changes to main branch
   - Wait for GitHub Actions to complete deployment

2. **Test Live Authentication**
   - Visit your GitHub Pages URL
   - Test the complete OAuth2 flow
   - Verify user information is displayed correctly

## Troubleshooting

### Common Issues

1. **Invalid Redirect URI Error**

   - Verify redirect URI in Discord app settings matches exactly
   - Check for trailing slashes or protocol differences (http vs https)

2. **Application Not Found**

   - Verify Discord Client ID is correct
   - Check environment variable is properly set

3. **CORS Errors**
   - Discord OAuth2 should work client-side
   - Ensure you're using the authorization code flow, not trying to exchange tokens client-side

### Debug Tips

- Check browser developer console for error messages
- Verify environment variables are loaded correctly
- Test redirect URI by manually visiting the Discord OAuth URL

## Next Steps

After completing Discord setup:

1. Follow the [GitHub Pages Setup Guide](github-pages-setup.md) for deployment
2. Review [Implementation Details](implementation.md) for technical information
3. Check [Deployment Guide](deployment.md) for production considerations

## Additional Resources

- [Discord OAuth2 Documentation](https://discord.com/developers/docs/topics/oauth2)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [OAuth2 Best Practices](https://tools.ietf.org/html/rfc6749)
