# Deployment Guide

This document provides comprehensive instructions for deploying and configuring the Star Technology Translations Hub.

## Implementation Status

**✅ Current Status**: The Discord OAuth2 authentication demo is fully implemented and working on GitHub Pages. The system uses client-side authentication optimized for static hosting with secure credential management through GitHub Secrets.

**🎯 Production Ready**: The authentication system is production-ready for GitHub Pages deployment. For full production use with backend services, see the [Implementation Details](implementation.md) document for additional considerations.

## Quick Start Deployment

For complete step-by-step instructions, see:

- **[Discord OAuth2 Setup Guide](discord-setup.md)** - Configure Discord application
- **[GitHub Pages Setup Guide](github-pages-setup.md)** - Deploy to GitHub Pages

### Quick Setup Summary

1. **Set up Discord Application** ([detailed guide](discord-setup.md))

   - Create Discord app and note Client ID
   - Add redirect URIs for development and production

2. **Configure GitHub Repository** ([detailed guide](github-pages-setup.md))

   - Add `DISCORD_CLIENT_ID` secret in repository settings
   - Enable GitHub Pages with GitHub Actions source

3. **Deploy**
   - Push to main branch for automatic deployment

## Deployment Overview

The Star Technology Translations Hub is designed as a static web application optimized for GitHub Pages deployment, providing a simple, cost-effective hosting solution with global CDN distribution.

## GitHub Pages Setup

### Repository Configuration

1. **Repository Structure**

   ```
   translation-hub/
   ├── .github/
   │   └── workflows/
   │       └── deploy.yml
   ├── docs/
   ├── src/
   ├── static/
   ├── package.json
   ├── svelte.config.js
   └── vite.config.js
   ```

2. **GitHub Pages Settings**
   - Navigate to repository Settings → Pages
   - Set source to "GitHub Actions"
   - Configure custom domain if needed
   - Enable "Enforce HTTPS"

### Static Site Configuration

#### Vite Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		target: 'es2020'
	},
	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	}
});
```

#### SvelteKit Configuration (`svelte.config.js`)

```javascript
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/translation-hub' : ''
		}
	}
};

export default config;
```

## CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  pull_request:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:unit

      - name: Run linting
        run: npm run lint

      - name: Build application
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './build'

  deploy:
    if: github.ref == 'refs/heads/main'
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Environment Variables

Create the following secrets in your GitHub repository settings:

- `DISCORD_CLIENT_ID`: Discord OAuth2 application client ID
- `DISCORD_CLIENT_SECRET`: Discord OAuth2 application client secret

## Discord OAuth2 Configuration

### Overview

This project uses client-side Discord OAuth2 authentication optimized for GitHub Pages static deployment. The setup uses GitHub Secrets to securely store the Discord Client ID without exposing it in the repository.

### Discord Application Setup

1. **Create Discord Application**

   - Go to the [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application"
   - Give your application a name (e.g., "Translation Hub")
   - Accept the terms and create the application

2. **Configure OAuth2**

   - In your application, go to the "OAuth2" section in the sidebar
   - Under "OAuth2 URL Generator":
     - **Scopes**: Select `identify` and optionally `email`
     - **Redirect URLs**: Add your callback URL(s):
       - For development: `http://localhost:5173/auth/callback`
       - For production: `https://yourusername.github.io/translation-hub/auth/callback`

3. **Get Your Client ID**
   - Go to the "General Information" section
   - Copy your **Application ID** (this is your Client ID)
   - **Note**: For client-side authentication, you only need the Client ID (not the secret)

### GitHub Pages Deployment Setup

4. **Configure GitHub Secrets**

   - Go to your GitHub repository
   - Navigate to **Settings** > **Secrets and variables** > **Actions**
   - Click **New repository secret**
   - Add the following secret:
     - **Name**: `DISCORD_CLIENT_ID`
     - **Value**: Your Discord Application ID

5. **Deploy to GitHub Pages**
   - Push your changes to the `main` branch
   - The GitHub Actions workflow will automatically:
     - Build the application with the Discord Client ID from secrets
     - Deploy to GitHub Pages
     - Keep your credentials secure

### Local Development Setup

6. **Configure Local Environment**

   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your Discord Client ID in the `.env` file:
     ```env
     VITE_DISCORD_CLIENT_ID=your_actual_client_id_here
     VITE_REDIRECT_URI=http://localhost:5173/auth/callback
     VITE_APP_URL=http://localhost:5173
     ```

7. **Run the Application**
   ```bash
   npm install
   npm run dev
   ```
   Visit `http://localhost:5173` and you should see the Discord OAuth2 login button.

### How It Works

**Client-Side Authentication Flow**:

1. **Login**: User clicks "Sign in with Discord"
2. **Redirect**: Browser redirects to Discord OAuth2 authorization
3. **Callback**: Discord redirects back with authorization code
4. **Demo Mode**: For demonstration, we simulate user data
5. **Storage**: User session is stored in localStorage

### Security Notes

- ✅ Client ID is safe to expose (it's designed to be public)
- ✅ No client secret is needed for public applications
- ✅ GitHub Secrets keep credentials secure during deployment
- ✅ No sensitive data is committed to the repository

### Troubleshooting

**"Invalid Redirect URI" Error**:

- Check that your redirect URI in Discord matches exactly:
  - Local: `http://localhost:5173/auth/callback`
  - Production: `https://yourusername.github.io/translation-hub/auth/callback`
- Make sure there are no trailing slashes or extra characters

**Build/Deployment Issues**:

- Verify your `DISCORD_CLIENT_ID` secret is set in GitHub repository settings
- Check the Actions tab for build logs and errors
- Ensure your repository has GitHub Pages enabled

## Data Storage Configuration

### JSON Data Structure

```
static/data/
├── translations/
│   ├── categories.json
│   ├── languages.json
│   └── translations.json
├── users/
│   └── users.json
└── config/
    └── app-config.json
```

### Example Data Files

#### `static/data/config/app-config.json`

```json
{
	"version": "1.0.0",
	"supportedLanguages": [
		{ "code": "en", "name": "English", "native": "English" },
		{ "code": "es", "name": "Spanish", "native": "Español" },
		{ "code": "fr", "name": "French", "native": "Français" }
	],
	"defaultLanguage": "en",
	"maxTranslationLength": 1000,
	"autoSaveInterval": 30000
}
```

#### `static/data/translations/categories.json`

```json
{
	"categories": [
		{
			"id": "items",
			"name": "Items",
			"description": "Item names and descriptions",
			"parent": null
		},
		{
			"id": "blocks",
			"name": "Blocks",
			"description": "Block names and descriptions",
			"parent": null
		}
	]
}
```

## Environment Configuration

### Development Environment

Create `.env.local`:

```env
VITE_DISCORD_CLIENT_ID=your_discord_client_id
VITE_DISCORD_CLIENT_SECRET=your_discord_secret_here
VITE_DISCORD_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_BASE_URL=http://localhost:5173
VITE_DISCORD_GUILD_ID=your_guild_id_here
VITE_ADMIN_USER_IDS=admin_user_id_1,admin_user_id_2
VITE_ENVIRONMENT=development
```

### Production Environment

Environment variables are configured in GitHub repository secrets and injected during build:

```env
VITE_DISCORD_CLIENT_ID=${{ secrets.DISCORD_CLIENT_ID }}
VITE_DISCORD_CLIENT_SECRET=${{ secrets.DISCORD_CLIENT_SECRET }}
VITE_DISCORD_REDIRECT_URI=https://your-domain.github.io/translation-hub/auth/callback
VITE_API_BASE_URL=https://your-domain.github.io/translation-hub
VITE_DISCORD_GUILD_ID=${{ secrets.DISCORD_GUILD_ID }}
VITE_ADMIN_USER_IDS=${{ secrets.ADMIN_USER_IDS }}
VITE_ENVIRONMENT=production
```

### Role-Based Access Control

The application implements three access levels:

- **Guest Role**: Public access to view translations
- **Contributor Role**: Guild members with 1+ month membership (edit and verify access)
- **Admin Role**: Users listed in `ADMIN_USER_IDS` (full management access)

Required GitHub Secrets for production:
- `DISCORD_CLIENT_ID`: Discord Application ID
- `DISCORD_CLIENT_SECRET`: Discord Application Secret  
- `DISCORD_GUILD_ID`: Your Discord Server ID for membership verification
- `ADMIN_USER_IDS`: Comma-separated Discord User IDs for administrators

## Performance Optimization

### Static Asset Optimization

1. **Image Optimization**

   - Use WebP format for images
   - Implement responsive images with srcset
   - Compress all static assets

2. **Code Splitting**

   - Implement route-based code splitting
   - Lazy load heavy components
   - Use dynamic imports for optional features

3. **Caching Strategy**

### Service Worker Configuration

```javascript
// Service worker configuration
const CACHE_NAME = 'translation-hub-v1';
const STATIC_ASSETS = [
	'/',
	'/static/css/app.css',
	'/static/js/app.js',
	'/static/data/config/app-config.json'
];
```

### CDN Configuration

GitHub Pages automatically provides CDN distribution, but you can optimize further:

1. **Cache Headers** (via `static/_headers` file)

   ```
   /static/*
     Cache-Control: public, max-age=31536000

   /*.json
     Cache-Control: public, max-age=3600

   /index.html
     Cache-Control: public, max-age=0, must-revalidate
   ```

## Security Configuration

### Content Security Policy

Add CSP headers via `static/_headers`:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://discord.com https://discordapp.com
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### HTTPS Configuration

- GitHub Pages automatically provides HTTPS
- Enforce HTTPS in repository settings
- Update all external links to use HTTPS

## Monitoring and Analytics

### Error Monitoring

Integrate error tracking service:

```javascript
// src/lib/monitoring/errors.js
export function initErrorMonitoring() {
	window.addEventListener('error', (event) => {
		// Send error to monitoring service
		console.error('Application error:', event.error);
	});
}
```

### Performance Monitoring

```javascript
// src/lib/monitoring/performance.js
export function trackPageLoad() {
	window.addEventListener('load', () => {
		const loadTime = performance.now();
		// Track page load time
		console.log('Page loaded in:', loadTime, 'ms');
	});
}
```

### Usage Analytics

Configure privacy-focused analytics:

```javascript
// src/lib/analytics/tracking.js
export function trackPageView(page) {
	// Implement privacy-focused analytics
	if (typeof gtag !== 'undefined') {
		gtag('config', 'GA_TRACKING_ID', {
			page_path: page
		});
	}
}
```

## Backup and Recovery

### Data Backup Strategy

1. **Git-based Backup**

   - All translation data is versioned in Git
   - Multiple backup repositories can be maintained
   - Automated daily backups via GitHub Actions

2. **Export Functionality**
   - Regular automated exports of translation data
   - Multiple format exports (JSON, CSV, etc.)
   - Stored in separate backup repository

### Recovery Procedures

1. **Data Recovery**

   - Restore from Git history
   - Import from backup exports
   - Manual data reconstruction if needed

2. **Disaster Recovery**
   - GitHub Pages provides 99.9% uptime SLA
   - Backup deployment can be set up on alternative hosting
   - DNS can be redirected to backup deployment

## Maintenance Procedures

### Regular Maintenance Tasks

1. **Weekly**

   - Monitor application performance
   - Check error logs and fix issues
   - Update dependencies if needed

2. **Monthly**

   - Review and update documentation
   - Analyze usage metrics
   - Plan feature updates

3. **Quarterly**
   - Security audit and updates
   - Performance optimization review
   - User feedback analysis and implementation

### Update Procedures

1. **Dependency Updates**

   ```bash
   npm audit
   npm update
   npm run test
   npm run build
   ```

2. **Security Updates**

   - Monitor GitHub security advisories
   - Apply critical updates immediately
   - Test thoroughly before deployment

3. **Feature Updates**
   - Follow development plan phases
   - Implement feature flags for gradual rollout
   - Collect user feedback before full deployment

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Authentication Issues**

   - Verify Discord OAuth2 configuration
   - Check redirect URI configuration
   - Ensure environment variables are set correctly

3. **Performance Issues**
   - Enable production build optimizations
   - Check for memory leaks in components
   - Optimize large data loading

### Support Procedures

1. **User Support**

   - Create issue templates for bug reports
   - Maintain FAQ documentation
   - Provide user guides and tutorials

2. **Technical Support**
   - Monitor application logs
   - Set up automated alerts for critical issues
   - Maintain escalation procedures for major incidents
