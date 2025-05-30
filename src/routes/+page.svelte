<script>
	import { user, isAuthenticated, userRole, clearAuth, getAvatarUrl } from '$lib/stores.js';
	import { getDiscordAuthUrl } from '$lib/auth.js';
	import Navigation from '$lib/components/Navigation.svelte';

	function handleSignIn() {
		window.location.href = getDiscordAuthUrl();
	}

	function handleSignOut() {
		clearAuth();
	}

	// Check if user has access to a specific page
	/**
	 * @param {string} requiredRole
	 * @returns {boolean}
	 */
	function hasAccess(requiredRole) {
		const currentRole = $userRole;
		
		if (requiredRole === 'guest') return true;
		if (requiredRole === 'contributor') return currentRole === 'contributor' || currentRole === 'admin';
		if (requiredRole === 'admin') return currentRole === 'admin';
		
		return false;
	}
</script>

<svelte:head>
	<title>Translation Hub - Central Dashboard</title>
	<meta name="description" content="Central dashboard for the Translation Hub" />
</svelte:head>

<main class="container">
	<header>
		<h1>🌐 Translation Hub</h1>
		<p class="subtitle">Discord OAuth2 Authentication Demo</p>
	</header>

	<div class="auth-section">
		{#if $isAuthenticated && $user}
			<!-- User is authenticated -->
			<div class="user-card">
				<div class="user-avatar">
					<img src={getAvatarUrl($user)} alt="{$user.username}'s avatar" />
				</div>
				<div class="user-info">
					<h2>Welcome back, {$user.username}! 👋</h2>
					<p class="user-email">{$user.email || 'No email provided'}</p>
					<p class="user-role">Role: <span class="role-badge role-{$userRole}">{$userRole}</span></p>
				</div>
			</div>

			<!-- Central Navigation Menu -->
			<div class="menu-grid">
				<a href="/view" class="menu-card">
					<div class="menu-icon">👁️</div>
					<h3>View Translations</h3>
					<p>Browse and search through all translations</p>
					<span class="access-level">Everyone</span>
				</a>

				{#if hasAccess('contributor')}
					<a href="/edit" class="menu-card">
						<div class="menu-icon">✏️</div>
						<h3>Edit Translations</h3>
						<p>Create and modify translations</p>
						<span class="access-level">Contributors & Admins</span>
					</a>

					<a href="/verify" class="menu-card">
						<div class="menu-icon">✅</div>
						<h3>Verify Translations</h3>
						<p>Review and approve translations</p>
						<span class="access-level">Contributors & Admins</span>
					</a>
				{/if}

				{#if hasAccess('admin')}
					<a href="/management" class="menu-card">
						<div class="menu-icon">⚙️</div>
						<h3>User Management</h3>
						<p>Manage users and permissions</p>
						<span class="access-level">Admins Only</span>
					</a>
				{/if}
			</div>

			<div class="actions">
				<button class="btn btn-secondary" on:click={handleSignOut}> Sign Out </button>
			</div>
		{:else}
			<!-- User is not authenticated -->
			<div class="login-card">
				<h2>Please sign in to continue</h2>
				<p>Connect with your Discord account to access the Translation Hub</p>

				<button class="btn btn-primary" on:click={handleSignIn}>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
						/>
					</svg>
					Sign in with Discord
				</button>
			</div>
		{/if}
	</div>

	<div class="info-section">
		<h3>About Translation Hub</h3>
		<p>
			A role-based translation management system with Discord OAuth2 integration. 
			Your access level is determined by your Discord server membership duration.
		</p>

		<div class="features">
			<h4>Role System:</h4>
			<ul>
				<li>🎭 <strong>Guest:</strong> Can view translations (default for new users)</li>
				<li>👤 <strong>Contributor:</strong> Discord members for 1+ months (can edit and verify)</li>
				<li>⚡ <strong>Admin:</strong> Server administrators (full access)</li>
			</ul>
		</div>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	header {
		text-align: center;
		color: white;
		margin-bottom: 2rem;
	}

	header h1 {
		font-size: 3rem;
		margin: 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.subtitle {
		font-size: 1.2rem;
		margin: 0.5rem 0;
		opacity: 0.9;
	}

	.auth-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	.user-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		gap: 2rem;
		max-width: 500px;
		width: 100%;
	}

	.user-avatar img {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 4px solid #667eea;
	}

	.user-info h2 {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 1.5rem;
	}

	.user-email {
		color: #666;
		margin: 0.25rem 0;
	}

	.user-role {
		color: #666;
		margin: 0.25rem 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.role-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.role-guest {
		background: #f3f4f6;
		color: #374151;
	}

	.role-contributor {
		background: #dbeafe;
		color: #1e40af;
	}

	.role-admin {
		background: #fef3c7;
		color: #d97706;
	}

	.menu-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		width: 100%;
		max-width: 900px;
		margin: 2rem 0;
	}

	.menu-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		text-decoration: none;
		color: inherit;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		position: relative;
	}

	.menu-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	.menu-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.menu-card h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 1.25rem;
	}

	.menu-card p {
		color: #666;
		margin: 0 0 1rem 0;
		line-height: 1.4;
		flex-grow: 1;
	}

	.access-level {
		background: #f1f3f4;
		color: #5f6368;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.login-card {
		background: white;
		border-radius: 1rem;
		padding: 3rem 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		text-align: center;
		max-width: 400px;
		width: 100%;
	}

	.login-card h2 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.login-card p {
		color: #666;
		margin-bottom: 2rem;
		line-height: 1.5;
	}

	.btn {
		padding: 0.75rem 2rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
	}

	.btn-primary {
		background: #5865f2;
		color: white;
	}

	.btn-primary:hover {
		background: #4752c4;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(88, 101, 242, 0.4);
	}

	.btn-secondary {
		background: #f1f3f4;
		color: #333;
	}

	.btn-secondary:hover {
		background: #e8eaed;
		transform: translateY(-2px);
	}

	.actions {
		display: flex;
		gap: 1rem;
	}

	.info-section {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		padding: 2rem;
		color: white;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.info-section h3 {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
	}

	.info-section p {
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.features h4 {
		margin: 0 0 0.5rem 0;
		color: #fff;
	}

	.features ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.features li {
		padding: 0.25rem 0;
		color: rgba(255, 255, 255, 0.9);
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		header h1 {
			font-size: 2rem;
		}

		.user-card {
			flex-direction: column;
			text-align: center;
			padding: 1.5rem;
		}

		.login-card {
			padding: 2rem 1.5rem;
		}
	}
</style>
