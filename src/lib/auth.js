// Client-side Discord OAuth2 configuration for static deployment
export const discordConfig = {
	clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
	clientSecret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
	redirectUri:
		import.meta.env.VITE_REDIRECT_URI ||
		(typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''),
	scope: 'identify email',
	responseType: 'code'
};

export function getDiscordAuthUrl() {
	const params = new URLSearchParams({
		client_id: discordConfig.clientId,
		redirect_uri: discordConfig.redirectUri,
		response_type: discordConfig.responseType,
		scope: discordConfig.scope
	});

	return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code) {
	// In a real static deployment, you'd need a serverless function or backend API
	// For demo purposes, we'll simulate the token exchange
	console.warn('Token exchange would happen on backend in production');

	// This would normally be done on your backend
	const response = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: discordConfig.clientId,
			client_secret: discordConfig.clientSecret,
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: discordConfig.redirectUri
		})
	});

	if (!response.ok) {
		throw new Error('Failed to exchange code for token');
	}

	return response.json();
}

export async function getDiscordUser(accessToken) {
	const response = await fetch('https://discord.com/api/users/@me', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		throw new Error('Failed to fetch user data');
	}

	return response.json();
}
