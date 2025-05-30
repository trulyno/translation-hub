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

   Edit `.env` and configure the required variables:

   ```env
   VITE_DISCORD_CLIENT_ID=your_discord_client_id
   VITE_DISCORD_CLIENT_SECRET=your_discord_client_secret
   VITE_REDIRECT_URI=http://localhost:5173/auth/callback
   VITE_APP_URL=http://localhost:5173
   VITE_DISCORD_GUILD_ID=your_guild_id
   VITE_ADMIN_USER_IDS=admin_user_id_1,admin_user_id_2
   ```

   See the [Discord Setup Guide](docs/discord-setup.md) for detailed configuration instructions.

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
   - Add the following secrets:
     - `DISCORD_CLIENT_ID`: Your Discord Application ID
     - `DISCORD_CLIENT_SECRET`: Your Discord Application Secret
     - `DISCORD_GUILD_ID`: Your Discord Server ID
     - `ADMIN_USER_IDS`: Comma-separated Discord User IDs for administrators

2. **Configure Discord application**:

   - Add production redirect URI: `https://yourusername.github.io/translation-hub/auth/callback`
   - Enable guild permissions for membership verification

3. **Deploy**:
   - Push to `main` branch
   - GitHub Actions will automatically build and deploy

## 🎯 Key Features

### Authentication & Access Control

- **Discord OAuth2 Integration** - Complete authentication flow with guild membership verification
- **Guild Membership Verification** - Automatic role assignment based on Discord server membership duration
- **Three-Tier Role System**:
  - **Guest**: Public access to view translations
  - **Contributor**: Guild members with 1+ month membership (edit and verify access)
  - **Admin**: Environment-configured users with full management capabilities

### Translation Management

- **Multi-page Interface** - Role-based navigation with dedicated pages for different functions
- **Translation Browser** - Search, filter, and view translations with status indicators
- **Editing Interface** - Multi-language editing with tab navigation and save functionality
- **Verification Workflow** - Approve/reject pending translations with feedback system
- **User Management** - Admin interface for viewing users and managing contributor roles

### Technical Features

- **Static Site Deployment** - Optimized for GitHub Pages with secure credential management
- **Responsive Design** - Modern UI with Discord branding and smooth animations
- **Session Persistence** - Maintains authentication state across browser sessions
- **Real-time Access Control** - Dynamic UI adaptation based on user permissions

## 🛠️ Technology Stack

- **Frontend**: SvelteKit with JavaScript
- **Deployment**: GitHub Pages (Static Site Generation)
- **Storage**: JSON-based data files
- **Authentication**: Discord OAuth2
- **Styling**: Modern CSS with responsive design

## 📊 Project Status

This project features a **fully functional Discord guild membership verification system** with comprehensive role-based access control deployed on GitHub Pages. See the [Implementation Details](docs/implementation.md) for complete feature documentation.

### ✅ Completed Features

#### Core System

- Discord OAuth2 authentication with guild integration
- Guild membership verification (1+ month requirement for contributor role)
- Three-tier role-based access control (Guest/Contributor/Admin)
- Environment-based admin user configuration
- Session persistence and automated role assignment

#### User Interface

- Central dashboard with role-based navigation
- Public translation browser (View page)
- Translation editing interface with multi-language support (Edit page)
- Translation verification workflow (Verify page)
- User management system with role revocation (Management page)
- Responsive design with Discord branding and smooth animations

#### Technical Implementation

- GitHub Pages deployment with secure credential management
- Static site generation optimized for CDN distribution
- Automated CI/CD pipeline with environment variable injection
- Real-time access control and page protection

### Current Status: Role-Based System Complete

- ✅ Discord OAuth2 integration with guild verification
- ✅ Complete role-based access control system
- ✅ All demo pages implemented and functional
- ✅ User management and admin controls
- ✅ Production-ready deployment configuration

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
