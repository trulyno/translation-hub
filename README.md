# Star Technology Translations Hub

A web-based translation management system designed specifically for Minecraft modpack localization. The application facilitates collaborative translation efforts while maintaining quality control through verification processes and Discord-based user authentication.

## 📋 Documentation

- **[Functionality Specification](docs/functionality.md)** - Detailed feature descriptions and user workflows
- **[Technical Architecture](docs/architecture.md)** - System design and technology stack
- **[Development Plan](docs/development-plan.md)** - Project phases, sprints, and milestones
- **[Deployment Guide](docs/deployment.md)** - Configuration and deployment instructions

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/translation-hub.git
   cd translation-hub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

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

This project is currently in active development. See the [Development Plan](docs/development-plan.md) for detailed progress tracking and upcoming milestones.

### Current Phase: Foundation (Phase 1)

- ✅ Project setup and configuration
- 🔄 Discord OAuth2 integration
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
