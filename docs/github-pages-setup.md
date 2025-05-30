# GitHub Pages Setup Guide

This guide provides complete instructions for deploying the Star Technology Translations Hub to GitHub Pages with secure Discord OAuth2 authentication.

## Prerequisites

- GitHub account
- Discord application set up (see [Discord Setup Guide](discord-setup.md))
- Repository with the translation hub code

## Overview

The application uses GitHub Actions for automated deployment to GitHub Pages with secure credential management through GitHub Secrets. No sensitive information is exposed in the repository.

## Step 1: Repository Configuration

### Enable GitHub Pages

1. **Navigate to Repository Settings**

   - Go to your GitHub repository
   - Click on "Settings" tab

2. **Configure Pages**

   - In the left sidebar, click "Pages"
   - Under "Source", select "GitHub Actions"
   - This enables custom GitHub Actions for deployment

3. **Optional: Custom Domain**
   - If you have a custom domain, enter it in the "Custom domain" field
   - Enable "Enforce HTTPS" (recommended)

## Step 2: Configure GitHub Secrets

### Add Discord Application Secrets

1. **Access Secrets Settings**

   - Go to repository Settings
   - Navigate to "Secrets and variables" → "Actions"

2. **Add Required Repository Secrets**
   
   Add the following secrets one by one:
   
   - **Name**: `DISCORD_CLIENT_ID`
     - **Value**: Your Discord Application ID (from Discord Developer Portal)
   
   - **Name**: `DISCORD_CLIENT_SECRET`
     - **Value**: Your Discord Application Client Secret
   
   - **Name**: `DISCORD_GUILD_ID`
     - **Value**: Your Discord Server/Guild ID (enable Developer Mode in Discord to copy)
   
   - **Name**: `ADMIN_USER_IDS`
     - **Value**: Comma-separated Discord User IDs for administrators
     - **Example**: `123456789012345678,987654321098765432`

### Role-Based Access Configuration

The application implements guild membership verification with three access levels:

#### User Roles
- **Guest**: Public access to view translations only
- **Contributor**: Guild members with 1+ month membership (can edit and verify)
- **Admin**: Users listed in `ADMIN_USER_IDS` (full management access)

#### Guild Membership Requirements
- **Guild ID**: Your Discord server ID for membership verification
- **Membership Duration**: Users must be guild members for 1+ months to become contributors
- **Admin Override**: Users in `ADMIN_USER_IDS` automatically get admin role regardless of guild membership

### Security Note

All sensitive credentials are stored securely in GitHub Secrets and injected only during the build process. No secrets are exposed in the repository or client-side code.

## Step 3: Update Discord Application Settings

### Add Production Redirect URI

1. **Open Discord Developer Portal**

   - Go to [https://discord.com/developers/applications](https://discord.com/developers/applications)
   - Select your application

2. **Configure OAuth2 Redirect**
   - Navigate to OAuth2 → General
   - Add redirect URI: `https://yourusername.github.io/translation-hub/auth/callback`
   - Replace `yourusername` with your actual GitHub username
   - Click "Save Changes"

### Example Redirect URIs

For a user named `johndoe` with repository `translation-hub`:

```
https://johndoe.github.io/translation-hub/auth/callback
```

## Step 4: Deployment Process

### Automatic Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically:

1. **Builds the Application**

   - Installs dependencies
   - Injects environment variables from secrets
   - Builds static site optimized for production

2. **Deploys to GitHub Pages**
   - Uploads build artifacts
   - Configures GitHub Pages
   - Makes site available at your GitHub Pages URL

### Manual Deployment

To trigger deployment manually:

1. **Push to Main Branch**

   ```bash
   git push origin main
   ```

2. **Monitor Deployment**
   - Go to repository "Actions" tab
   - Watch the deployment workflow progress
   - Deployment typically takes 2-5 minutes

## Step 5: Verify Deployment

### Check Deployment Status

1. **Actions Tab**

   - Go to your repository's "Actions" tab
   - Verify the latest workflow run completed successfully
   - Green checkmark indicates successful deployment

2. **Pages Status**
   - Go to repository Settings → Pages
   - Check deployment status and URL

### Test Authentication Flow

1. **Visit Your Site**

   - Open `https://yourusername.github.io/translation-hub/`
   - Replace `yourusername` with your GitHub username

2. **Test Role-Based Access**
   
   **Guest Testing:**
   - Without signing in, verify only View page is accessible
   - Try accessing `/edit`, `/verify`, `/management` - should redirect to home
   
   **Authentication Testing:**
   - Click "Sign in with Discord"
   - Authorize the application with guild permissions
   - Verify successful redirect and user info display
   
   **Role Verification:**
   - Check role badge display (Guest/Contributor/Admin)
   - Verify navigation menu shows appropriate options for your role
   - Test page access based on your guild membership and admin status

## Step 6: Environment Configuration

### Production Environment Variables

The GitHub Actions workflow automatically creates a `.env` file during build with:

```env
VITE_DISCORD_CLIENT_ID=${DISCORD_CLIENT_ID}
VITE_DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}
VITE_REDIRECT_URI=https://yourusername.github.io/translation-hub/auth/callback
VITE_APP_URL=https://yourusername.github.io/translation-hub
VITE_DISCORD_GUILD_ID=${DISCORD_GUILD_ID}
VITE_ADMIN_USER_IDS=${ADMIN_USER_IDS}
```

These are injected from:

- **GitHub Secrets**: 
  - `DISCORD_CLIENT_ID` - Discord Application ID
  - `DISCORD_CLIENT_SECRET` - Discord Application Secret
  - `DISCORD_GUILD_ID` - Your Discord Server ID
  - `ADMIN_USER_IDS` - Comma-separated admin user IDs
- **Repository Context**: Username and repository name
- **GitHub Pages URL**: Automatically constructed

### Role-Based Access Verification

After deployment, test the role system:

1. **Guest Access**: Visit the site without authentication
   - Should only have access to the View page
   - Sign-in prompt should be visible

2. **Contributor Access**: Sign in as a guild member with 1+ month membership
   - Should have access to View, Edit, and Verify pages
   - Management page should be restricted

3. **Admin Access**: Sign in as a user listed in `ADMIN_USER_IDS`
   - Should have access to all pages including Management
   - Can revoke contributor roles and manage users

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**

   ```bash
   # Check Actions logs for specific error
   # Common issues:
   # - Missing GitHub Secret
   # - Syntax errors in code
   # - Missing dependencies
   ```

2. **OAuth Errors in Production**

   - Verify Discord redirect URI matches exactly
   - Check GitHub Secret is set correctly
   - Ensure GitHub Pages is enabled

3. **404 Errors**
   - Verify GitHub Pages is configured correctly
   - Check if deployment completed successfully
   - Wait a few minutes for DNS propagation

### Debug Steps

1. **Check GitHub Actions Logs**

   - Go to Actions tab
   - Click on failed workflow
   - Expand log sections to see detailed errors

2. **Verify Secrets**

   - Go to Settings → Secrets and variables → Actions
   - Ensure `DISCORD_CLIENT_ID` secret exists
   - Secret values are hidden but names are visible

3. **Test Locally First**
   ```bash
   npm run build
   npm run preview
   ```

## Maintenance

### Updating the Application

1. **Make Changes**

   - Edit code in your local environment
   - Test changes locally

2. **Deploy Updates**

   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push origin main
   ```

3. **Monitor Deployment**
   - Check Actions tab for deployment status
   - Test changes on live site

### Rotating Credentials

If you need to update the Discord Client ID:

1. **Update GitHub Secret**

   - Go to Settings → Secrets and variables → Actions
   - Click on `DISCORD_CLIENT_ID`
   - Update value and save

2. **Redeploy**
   - Push any change to trigger new deployment
   - Or manually trigger workflow if available

## Performance and Optimization

### GitHub Pages Benefits

- **Global CDN**: Fast loading worldwide
- **HTTPS by Default**: Secure connections
- **Custom Domains**: Professional URLs supported
- **Version Control**: Git-based deployment history

### Optimization Features

- **Static Site Generation**: Pre-built pages for fast loading
- **Asset Optimization**: Minified CSS and JavaScript
- **Caching**: Optimal cache headers for static assets

## Next Steps

After successful deployment:

1. **Share Your Demo**: Your app is live at `https://yourusername.github.io/translation-hub/`
2. **Monitor Usage**: Check GitHub Pages analytics if available
3. **Plan Enhancements**: See [Development Plan](development-plan.md) for next features
4. **Production Considerations**: Review [Implementation Details](implementation.md) for scaling

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SvelteKit Static Deployment](https://kit.svelte.dev/docs/adapter-static)
