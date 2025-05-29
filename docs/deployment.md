# Deployment Guide

This document provides comprehensive instructions for deploying and configuring the Star Technology Translations Hub.

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
- `DISCORD_REDIRECT_URI`: OAuth2 redirect URI (e.g., `https://your-domain.github.io/auth/callback`)

## Discord OAuth2 Configuration

### Discord Application Setup

1. **Create Discord Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application"
   - Name your application "Star Technology Translations Hub"

2. **Configure OAuth2**
   - Navigate to OAuth2 → General
   - Add redirect URIs:
     - Development: `http://localhost:5173/auth/callback`
     - Production: `https://your-domain.github.io/translation-hub/auth/callback`
   - Set scopes: `identify`, `guilds.members.read`

3. **Bot Configuration** (if needed for server verification)
   - Navigate to Bot section
   - Create bot and copy token
   - Set appropriate permissions for server member verification

### Authentication Configuration

Create `src/lib/config/auth.js`:
```javascript
export const authConfig = {
  discord: {
    clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
    redirectUri: import.meta.env.VITE_DISCORD_REDIRECT_URI,
    scopes: ['identify', 'guilds.members.read']
  },
  serverId: 'YOUR_DISCORD_SERVER_ID'
};
```

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
VITE_DISCORD_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_BASE_URL=http://localhost:5173
VITE_ENVIRONMENT=development
```

### Production Environment

Environment variables are configured in GitHub repository secrets and injected during build:
```env
VITE_DISCORD_CLIENT_ID=${{ secrets.DISCORD_CLIENT_ID }}
VITE_DISCORD_REDIRECT_URI=https://your-domain.github.io/translation-hub/auth/callback
VITE_API_BASE_URL=https://your-domain.github.io/translation-hub
VITE_ENVIRONMENT=production
```

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
