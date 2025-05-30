import type { Session } from '@auth/core/types';

// Discord User Type Definition
declare global {
	interface DiscordUser {
		id: string;
		username: string;
		discriminator: string;
		avatar: string | null;
		email?: string;
		verified?: boolean;
		locale?: string;
		mfa_enabled?: boolean;
		premium_type?: number;
		public_flags?: number;
	}

	interface GuildMember {
		user?: DiscordUser;
		nick?: string;
		avatar?: string;
		roles: string[];
		joined_at: string;
		premium_since?: string;
		deaf: boolean;
		mute: boolean;
		pending?: boolean;
		permissions?: string;
	}
}

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
