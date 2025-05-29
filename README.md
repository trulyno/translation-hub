# Star Technology Translations Hub

A web-based translation management system designed specifically for Minecraft modpack localization. The application facilitates collaborative translation efforts while maintaining quality control through verification processes and Discord-based user authentication.

## 🎯 Live Demo

**[View Live Demo](https://yourusername.github.io/translation-hub/)** - Replace `yourusername` with the actual GitHub username

The demo features a fully functional Discord OAuth2 authentication system optimized for GitHub Pages deployment.

## 📋 Documentation

### Core Documentation

- **[Functionality Specification](docs/functionality.md)** - Detailed feature descriptions and user workflows
- **[Technical Architecture](docs/architecture.md)** - System design and technology stack
- **[Implementation Details](docs/implementation.md)** - Current implementation status and technical details
- **[Development Plan](docs/development-plan.md)** - Project phases, sprints, and milestones
- **[Deployment Guide](docs/deployment.md)** - Configuration and deployment instructions

### Setup Guides

- **[Discord OAuth2 Setup](docs/discord-setup.md)** - Complete Discord application configuration guide
- **[GitHub Pages Setup](docs/github-pages-setup.md)** - Step-by-step deployment to GitHub Pages

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Discord application for OAuth2 authentication

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/translation-hub.git
   cd translation-hub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Discord OAuth2**

   - Create a Discord application at the [Discord Developer Portal](https://discord.com/developers/applications)
   - Copy your Application ID (Client ID)
   - Add redirect URI: `http://localhost:5173/auth/callback`
   - See the [Discord Setup Guide](docs/discord-setup.md) for detailed instructions

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Discord Client ID:

   ```env
   VITE_DISCORD_CLIENT_ID=your_discord_client_id
   VITE_REDIRECT_URI=http://localhost:5173/auth/callback
   VITE_APP_URL=http://localhost:5173
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

### GitHub Pages Deployment

For complete deployment instructions, see the [GitHub Pages Setup Guide](docs/github-pages-setup.md).

**Quick Setup:**

1. **Set up repository secrets**:

   - Go to repository Settings → Secrets and variables → Actions
   - Add secret: `DISCORD_CLIENT_ID` with your Discord app's Client ID

2. **Configure Discord application**:

   - Add production redirect URI: `https://yourusername.github.io/translation-hub/auth/callback`

3. **Deploy**:
   - Push to `main` branch
   - GitHub Actions will automatically build and deploy

## 🎯 Key Features

- **Discord OAuth2 Authentication** - Secure user verification through Discord server membership
- **Role-based Access Control** - Three user levels: Viewers, Contributors, and Admins
- **Minecraft Formatting Support** - Native support for Minecraft text formatting codes
- **Real-time Collaboration** - Live editing and verification workflows
- **Export System** - Multiple format support for modpack integration
- **Offline Capabilities** - Local draft storage and conflict resolution

## 🛠️ Technology Stack

- **Frontend**: SvelteKit with JavaScript
- **Deployment**: GitHub Pages (Static Site Generation)
- **Storage**: JSON-based data files
- **Authentication**: Discord OAuth2
- **Styling**: Modern CSS with responsive design

## 📊 Project Status

This project is currently in active development with a **working Discord OAuth2 authentication system** deployed on GitHub Pages. See the [Implementation Details](docs/implementation.md) for current features and [Development Plan](docs/development-plan.md) for detailed progress tracking.

### ✅ Completed Features

- Discord OAuth2 authentication integration
- GitHub Pages deployment with secure credential management
- Responsive user interface with Discord branding
- Session persistence and user profile display
- Automated CI/CD pipeline

### Current Phase: Foundation (Phase 1)

- ✅ Project setup and configuration
- ✅ Discord OAuth2 integration (Demo working)
- 🔄 Core data structures
- 📋 User interface foundation

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines and development plan for information on how to get involved.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request with a clear description

### Code Standards

- Follow JavaScript best practices
- Use ESLint and Prettier for code formatting
- Write tests for new functionality
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Future Enhancements

- Real-time collaboration features
- Machine translation integration
- Mobile application
- Advanced analytics and reporting

For detailed future plans, see the [Development Plan](docs/development-plan.md).
