import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Create stores for authentication state
export const user = writable(/** @type {DiscordUser | null} */ (null));
export const isAuthenticated = writable(false);
export const isLoading = writable(false);
export const userRole = writable(/** @type {string} */ ('guest')); // guest, contributor, admin
export const guildMember = writable(/** @type {GuildMember | null} */ (null));

// Storage keys
const USER_STORAGE_KEY = 'discord_user';
const TOKEN_STORAGE_KEY = 'discord_token';
const ROLE_STORAGE_KEY = 'user_role';
const GUILD_MEMBER_STORAGE_KEY = 'guild_member';

// Initialize auth state from localStorage on client-side
if (browser) {
	const storedUser = localStorage.getItem(USER_STORAGE_KEY);
	const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
	const storedRole = localStorage.getItem(ROLE_STORAGE_KEY);
	const storedGuildMember = localStorage.getItem(GUILD_MEMBER_STORAGE_KEY);

	if (storedUser && storedToken) {
		try {
			const userData = JSON.parse(storedUser);
			user.set(userData);
			isAuthenticated.set(true);

			if (storedRole) {
				userRole.set(storedRole);
			}

			if (storedGuildMember) {
				guildMember.set(JSON.parse(storedGuildMember));
			}
		} catch (e) {
			console.error('Error parsing stored user data:', e);
			clearAuth();
		}
	}
}

/**
 * @param {DiscordUser} userData
 * @param {string} token
 * @param {string} role
 * @param {GuildMember | null} guildMemberData
 */
export function setAuth(userData, token, role = 'guest', guildMemberData = null) {
	if (browser) {
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
		localStorage.setItem(TOKEN_STORAGE_KEY, token);
		localStorage.setItem(ROLE_STORAGE_KEY, role);
		if (guildMemberData) {
			localStorage.setItem(GUILD_MEMBER_STORAGE_KEY, JSON.stringify(guildMemberData));
		}
	}
	user.set(userData);
	isAuthenticated.set(true);
	userRole.set(role);
	if (guildMemberData) {
		guildMember.set(guildMemberData);
	}
}

export function clearAuth() {
	if (browser) {
		localStorage.removeItem(USER_STORAGE_KEY);
		localStorage.removeItem(TOKEN_STORAGE_KEY);
		localStorage.removeItem(ROLE_STORAGE_KEY);
		localStorage.removeItem(GUILD_MEMBER_STORAGE_KEY);
	}
	user.set(null);
	isAuthenticated.set(false);
	userRole.set('guest');
	guildMember.set(null);
}

/**
 * @param {string} newRole
 */
export function updateUserRole(newRole) {
	if (browser) {
		localStorage.setItem(ROLE_STORAGE_KEY, newRole);
	}
	userRole.set(newRole);
}

export function getStoredToken() {
	if (browser) {
		return localStorage.getItem(TOKEN_STORAGE_KEY);
	}
	return null;
}

/**
 * @param {DiscordUser} user
 * @returns {string}
 */
export function getAvatarUrl(user) {
	if (user.avatar) {
		return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
	}
	return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`;
}
