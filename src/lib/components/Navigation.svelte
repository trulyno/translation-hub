<script>
	import { user, isAuthenticated, userRole, clearAuth, getAvatarUrl } from '$lib/stores.js';
	import { getDiscordAuthUrl } from '$lib/auth.js';

	function handleSignIn() {
		window.location.href = getDiscordAuthUrl();
	}

	function handleSignOut() {
		clearAuth();
	}

	// Check if user has access to a specific page
	function hasAccess(requiredRole) {
		const currentRole = $userRole;

		if (requiredRole === 'guest') return true;
		if (requiredRole === 'contributor')
			return currentRole === 'contributor' || currentRole === 'admin';
		if (requiredRole === 'admin') return currentRole === 'admin';

		return false;
	}

	function getRoleBadgeColor(role) {
		switch (role) {
			case 'admin':
				return '#dc3545';
			case 'contributor':
				return '#28a745';
			default:
				return '#6c757d';
		}
	}
</script>

<nav class="navbar">
	<div class="nav-brand">
		<a href={base || '/'}>🌐 Translation Hub</a>
	</div>

	<div class="nav-links">
		<a href={base || '/'} class="nav-link">Home</a>
		<a href="/view" class="nav-link">View Translations</a>

		{#if hasAccess('contributor')}
			<a href="/edit" class="nav-link">Edit Translations</a>
			<a href="/verify" class="nav-link">Verify Translations</a>
		{/if}

		{#if hasAccess('admin')}
			<a href="/management" class="nav-link">Management</a>
		{/if}
	</div>

	<div class="nav-auth">
		{#if $isAuthenticated && $user}
			<div class="user-info">
				<img src={getAvatarUrl($user)} alt="Avatar" class="user-avatar" />
				<div class="user-details">
					<span class="username">{$user.username}</span>
					<span class="role-badge" style="background-color: {getRoleBadgeColor($userRole)}">
						{$userRole}
					</span>
				</div>
				<button class="btn btn-secondary" on:click={handleSignOut}>Sign Out</button>
			</div>
		{:else}
			<button class="btn btn-primary" on:click={handleSignIn}>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z"
					/>
				</svg>
				Sign in with Discord
			</button>
		{/if}
	</div>
</nav>

<style>
	.navbar {
		background: white;
		border-bottom: 1px solid #e0e0e0;
		padding: 1rem 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.nav-brand a {
		font-size: 1.5rem;
		font-weight: bold;
		color: #5865f2;
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.nav-link {
		color: #333;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.nav-link:hover {
		color: #5865f2;
	}

	.nav-auth {
		display: flex;
		align-items: center;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid #5865f2;
	}

	.user-details {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
	}

	.username {
		font-weight: 600;
		color: #333;
		font-size: 0.9rem;
	}

	.role-badge {
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.125rem 0.5rem;
		border-radius: 1rem;
		text-transform: uppercase;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 0.9rem;
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
		transform: translateY(-1px);
	}

	.btn-secondary {
		background: #f1f3f4;
		color: #333;
	}

	.btn-secondary:hover {
		background: #e8eaed;
	}

	@media (max-width: 768px) {
		.navbar {
			padding: 1rem;
			flex-wrap: wrap;
		}

		.nav-links {
			order: 3;
			width: 100%;
			margin-top: 1rem;
			justify-content: center;
		}

		.user-details {
			display: none;
		}
	}
</style>
