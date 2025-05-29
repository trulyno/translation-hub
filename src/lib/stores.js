import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Create stores for authentication state
export const user = writable(null);
export const isAuthenticated = writable(false);
export const isLoading = writable(false);

// Storage keys
const USER_STORAGE_KEY = 'discord_user';
const TOKEN_STORAGE_KEY = 'discord_token';

// Initialize auth state from localStorage on client-side
if (browser) {
	const storedUser = localStorage.getItem(USER_STORAGE_KEY);
	const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

	if (storedUser && storedToken) {
		try {
			const userData = JSON.parse(storedUser);
			user.set(userData);
			isAuthenticated.set(true);
		} catch (e) {
			console.error('Error parsing stored user data:', e);
			clearAuth();
		}
	}
}

export function setAuth(userData, token) {
	if (browser) {
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
		localStorage.setItem(TOKEN_STORAGE_KEY, token);
	}
	user.set(userData);
	isAuthenticated.set(true);
}

export function clearAuth() {
	if (browser) {
		localStorage.removeItem(USER_STORAGE_KEY);
		localStorage.removeItem(TOKEN_STORAGE_KEY);
	}
	user.set(null);
	isAuthenticated.set(false);
}

export function getStoredToken() {
	if (browser) {
		return localStorage.getItem(TOKEN_STORAGE_KEY);
	}
	return null;
}

export function getAvatarUrl(user) {
	if (user.avatar) {
		return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
	}
	return `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
}
