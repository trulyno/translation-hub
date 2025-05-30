// Client-side Discord OAuth2 configuration for static deployment
export const discordConfig = {
	clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
	clientSecret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
	guildId: import.meta.env.VITE_DISCORD_GUILD_ID,
	adminUserIds: import.meta.env.VITE_ADMIN_USER_IDS?.split(',') || [],
	redirectUri:
		import.meta.env.VITE_REDIRECT_URI ||
		(typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''),
	scope: 'identify email guilds guilds.members.read',
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

/**
 * @param {string} code
 * @returns {Promise<any>}
 */
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

/**
 * @param {string} accessToken
 * @returns {Promise<DiscordUser>}
 */
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

/**
 * Check if user is member of the specified guild
 * @param {string} accessToken
 * @returns {Promise<GuildMember | null>}
 */
export async function checkGuildMembership(accessToken) {
	try {
		const response = await fetch(
			`https://discord.com/api/users/@me/guilds/${discordConfig.guildId}/member`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		);

		if (!response.ok) {
			return null;
		}

		return response.json();
	} catch (error) {
		console.error('Error checking guild membership:', error);
		return null;
	}
}

/**
 * Check if user has been a guild member for more than 1 month
 * @param {string} joinedAt
 * @returns {boolean}
 */
export function hasBeenMemberLongEnough(joinedAt) {
	if (!joinedAt) return false;

	const joinDate = new Date(joinedAt);
	const oneMonthAgo = new Date();
	oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

	return joinDate <= oneMonthAgo;
}

/**
 * Determine user role based on membership and admin status
 * @param {string} userId
 * @param {GuildMember | null} guildMember
 * @returns {string}
 */
export function determineUserRole(userId, guildMember) {
	// Check if user is admin
	if (discordConfig.adminUserIds.includes(userId)) {
		return 'admin';
	}

	// Check if user is guild member for more than 1 month
	if (guildMember && hasBeenMemberLongEnough(guildMember.joined_at)) {
		return 'contributor';
	}

	// Default role
	return 'guest';
}
