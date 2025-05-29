<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { setAuth, clearAuth } from '$lib/stores.js';
	import { exchangeCodeForToken, getDiscordUser } from '$lib/auth.js';

	let status = 'Processing...';
	let error = null;

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		const errorParam = urlParams.get('error');

		if (errorParam) {
			error = `Authentication error: ${errorParam}`;
			status = 'Error';
			return;
		}

		if (!code) {
			error = 'No authorization code received';
			status = 'Error';
			return;
		}

		try {
			status = 'Exchanging code for token...';
			const tokenData = await exchangeCodeForToken(code);

			// For demo purposes with static deployment, we'll simulate this
			// In production, this would be handled by a backend service
			console.log('Authorization code received:', code);

			// Simulate user data for demo (in production, use the token exchange)
			// const userData = {
			// 	id: 'demo_user_' + Date.now(),
			// 	username: 'Demo User',
			// 	discriminator: '0001',
			// 	avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
			// 	email: 'demo@example.com'
			// };
			const userData = await getDiscordUser(tokenData.access_token);

			status = 'Getting user information...';

			// Set auth state
			setAuth(userData, tokenData.access_token);

			status = 'Success! Redirecting...';

			// Redirect to home page
			setTimeout(() => {
				goto('/');
			}, 1000);
		} catch (err) {
			console.error('Authentication error:', err);
			error = 'Failed to authenticate with Discord';
			status = 'Error';
			clearAuth();
		}
	});
</script>

<svelte:head>
	<title>Discord Authentication - Translation Hub</title>
</svelte:head>

<main class="callback-container">
	<div class="callback-card">
		{#if error}
			<div class="error-state">
				<h2>❌ Authentication Failed</h2>
				<p>{error}</p>
				<a href="/" class="btn btn-primary">Return Home</a>
			</div>
		{:else}
			<div class="loading-state">
				<div class="spinner"></div>
				<h2>🔐 Authenticating...</h2>
				<p>{status}</p>
			</div>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
	}

	.callback-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.callback-card {
		background: white;
		border-radius: 1rem;
		padding: 3rem 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		text-align: center;
		max-width: 400px;
		width: 100%;
	}

	.loading-state h2,
	.error-state h2 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.loading-state p,
	.error-state p {
		color: #666;
		margin-bottom: 2rem;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #5865f2;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.btn {
		padding: 0.75rem 2rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		text-decoration: none;
		display: inline-block;
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
</style>
