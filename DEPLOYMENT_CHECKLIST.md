# Deployment Verification Checklist

Use this checklist to verify that the Translation Hub is properly deployed and configured.

## ✅ Pre-Deployment Setup

### Discord Application Configuration
- [ ] Discord application created at [Discord Developer Portal](https://discord.com/developers/applications)
- [ ] OAuth2 redirect URIs configured:
  - [ ] Development: `http://localhost:5173/auth/callback`
  - [ ] Production: `https://yourusername.github.io/translation-hub/auth/callback`
- [ ] Bot permissions configured for guild access
- [ ] Application ID (Client ID) copied
- [ ] Client Secret copied (if using server-side features)

### Guild Configuration
- [ ] Discord Developer Mode enabled
- [ ] Guild/Server ID copied
- [ ] Admin user Discord IDs identified and copied

### GitHub Repository Setup
- [ ] Repository created with translation-hub code
- [ ] GitHub Pages enabled with "GitHub Actions" source
- [ ] Repository secrets configured:
  - [ ] `DISCORD_CLIENT_ID`: Discord Application ID
  - [ ] `DISCORD_CLIENT_SECRET`: Discord Application Secret
  - [ ] `DISCORD_GUILD_ID`: Discord Server ID
  - [ ] `ADMIN_USER_IDS`: Comma-separated admin Discord User IDs

## ✅ Deployment Verification

### Build Process
- [ ] Push to main branch triggers GitHub Actions
- [ ] Build completes successfully without errors
- [ ] Environment variables properly injected during build
- [ ] Static files generated in build directory

### Live Site Testing
- [ ] GitHub Pages site accessible at `https://yourusername.github.io/translation-hub/`
- [ ] Application loads without JavaScript errors
- [ ] Discord branding and styling display correctly
- [ ] Navigation menu displays (limited for unauthenticated users)

## ✅ Authentication Flow Testing

### Guest Access (Unauthenticated)
- [ ] View page accessible without authentication
- [ ] Edit, Verify, Management pages redirect to home when accessed directly
- [ ] Sign-in button displays and is functional
- [ ] Role badge shows "Guest" status

### Discord Authentication
- [ ] "Sign in with Discord" redirects to Discord OAuth page
- [ ] Discord authorization page requests guild permissions
- [ ] User can authorize application
- [ ] Successful redirect to `/auth/callback`
- [ ] Callback page processes authentication without errors
- [ ] User redirected to main dashboard after authentication

### Role Assignment Verification
- [ ] User profile displays correctly (avatar, username, email, Discord ID)
- [ ] Role badge displays appropriate role:
  - [ ] "Guest" for non-guild members or recent members
  - [ ] "Contributor" for guild members with 1+ month membership
  - [ ] "Admin" for users listed in `ADMIN_USER_IDS`

## ✅ Role-Based Access Control Testing

### Contributor Testing (1+ Month Guild Member)
- [ ] Navigation shows: Dashboard, View, Edit, Verify
- [ ] Management page not accessible (redirects to home)
- [ ] Edit page loads with translation editing interface
- [ ] Verify page loads with translation verification workflow
- [ ] Can navigate between allowed pages without issues

### Admin Testing (User in ADMIN_USER_IDS)
- [ ] Navigation shows: Dashboard, View, Edit, Verify, Management
- [ ] All pages accessible without redirects
- [ ] Management page loads with user management interface
- [ ] Can view user details and guild membership information
- [ ] Contributor role revocation functionality works
- [ ] Full access to all application features

## ✅ Functionality Testing

### View Page (Public Access)
- [ ] Translation browser displays demo translations
- [ ] Search functionality works
- [ ] Filter by language/status works
- [ ] Translation status indicators display correctly
- [ ] Responsive design works on different screen sizes

### Edit Page (Contributors/Admins)
- [ ] Translation selection interface works
- [ ] Multi-language tabs display correctly
- [ ] Text editing areas functional
- [ ] Save functionality provides feedback
- [ ] Translation status updates appropriately

### Verify Page (Contributors/Admins)
- [ ] Pending translations list displays
- [ ] Translation review interface functional
- [ ] Approve/reject workflow works
- [ ] Feedback submission functional
- [ ] Verification history tracking works

### Management Page (Admins Only)
- [ ] User list displays with proper information
- [ ] User selection shows detailed information
- [ ] Guild membership status displays correctly
- [ ] Role revocation confirmation dialog works
- [ ] User management actions provide feedback

## ✅ Technical Verification

### Security
- [ ] No sensitive credentials exposed in client-side code
- [ ] Environment variables properly injected during build only
- [ ] GitHub Secrets not visible in repository or build logs
- [ ] Authentication tokens handled securely

### Performance
- [ ] Application loads quickly
- [ ] Navigation between pages is smooth
- [ ] No console errors in browser developer tools
- [ ] Responsive design works on mobile devices

### Session Management
- [ ] Authentication state persists across browser refresh
- [ ] Role information maintained across sessions
- [ ] Sign-out functionality clears authentication state
- [ ] Re-authentication works correctly after sign-out

## 🔧 Troubleshooting Common Issues

### Authentication Issues
- **Discord authorization fails**: Check redirect URI configuration
- **Callback errors**: Verify Discord application permissions include guilds
- **Role not assigned correctly**: Check guild ID and admin user ID configuration

### Access Control Issues
- **Wrong role assigned**: Verify guild membership duration and admin configuration
- **Page redirects unexpectedly**: Check user role and page access requirements
- **Navigation not updating**: Clear browser cache and localStorage

### Deployment Issues
- **Build fails**: Check GitHub Secrets configuration
- **Environment variables not loaded**: Verify secret names match workflow file
- **Site not accessible**: Check GitHub Pages configuration and DNS propagation

## 📊 Success Criteria

### Complete Deployment Success
- [ ] All authentication flows work correctly
- [ ] Role-based access control functions as designed
- [ ] All pages load and function properly
- [ ] Admin management features work correctly
- [ ] No security vulnerabilities or exposed credentials
- [ ] Performance meets expectations
- [ ] Documentation matches actual implementation

### Ready for Production Use
- [ ] Real Discord guild configured (not demo guild)
- [ ] Actual admin users configured
- [ ] Production domain configured (if using custom domain)
- [ ] Monitoring and logging configured (if required)
- [ ] Backup and recovery procedures documented
