<script>
	import { user, isAuthenticated, userRole, updateUserRole } from '$lib/stores.js';
	import { onMount } from 'svelte';
    import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	let users = [];
	let filteredUsers = [];
	let searchTerm = '';
	let filterRole = 'all';
	let selectedUser = null;
	let showConfirmDialog = false;

	// Check access - only admins
	$: if ($userRole !== 'admin') {
		goto(base || '/');
	}

	// Dummy user data
	const dummyUsers = [
		{
			id: 'user123',
			discordId: '123456789012345678',
			username: 'translator_alex',
			email: 'alex@example.com',
			role: 'contributor',
			verificationStatus: 'approved',
			joinDate: Date.now() - 2592000000, // 30 days ago
			lastSeen: Date.now() - 86400000, // 1 day ago
			contributionsCount: 45,
			verificationsCount: 12,
			guildMemberSince: Date.now() - 5184000000 // 60 days ago
		},
		{
			id: 'user456',
			discordId: '234567890123456789',
			username: 'linguist_maria',
			email: 'maria@example.com',
			role: 'contributor',
			verificationStatus: 'approved',
			joinDate: Date.now() - 1296000000, // 15 days ago
			lastSeen: Date.now() - 172800000, // 2 days ago
			contributionsCount: 28,
			verificationsCount: 8,
			guildMemberSince: Date.now() - 7776000000 // 90 days ago
		},
		{
			id: 'user789',
			discordId: '345678901234567890',
			username: 'newbie_john',
			email: 'john@example.com',
			role: 'guest',
			verificationStatus: 'pending',
			joinDate: Date.now() - 432000000, // 5 days ago
			lastSeen: Date.now() - 3600000, // 1 hour ago
			contributionsCount: 3,
			verificationsCount: 0,
			guildMemberSince: Date.now() - 1296000000 // 15 days ago (less than 1 month)
		},
		{
			id: 'user321',
			discordId: '456789012345678901',
			username: 'expert_chen',
			email: 'chen@example.com',
			role: 'contributor',
			verificationStatus: 'approved',
			joinDate: Date.now() - 7776000000, // 90 days ago
			lastSeen: Date.now() - 3600000, // 1 hour ago
			contributionsCount: 156,
			verificationsCount: 89,
			guildMemberSince: Date.now() - 15552000000 // 180 days ago
		}
	];

	const roleOptions = ['all', 'guest', 'contributor', 'admin'];

	onMount(() => {
		users = dummyUsers;
		filteredUsers = users;
	});

	function filterUsers() {
		filteredUsers = users.filter(user => {
			const matchesSearch = searchTerm === '' || 
				user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.discordId.includes(searchTerm);
			
			const matchesRole = filterRole === 'all' || user.role === filterRole;

			return matchesSearch && matchesRole;
		});
	}

	$: {
		searchTerm, filterRole;
		filterUsers();
	}

	function selectUser(user) {
		selectedUser = user;
	}

	function revokeContributorRole(userId) {
		const user = users.find(u => u.id === userId);
		if (user && user.role === 'contributor') {
			user.role = 'guest';
			user.verificationStatus = 'revoked';
			
			// Update the list
			users = [...users];
			
			showNotification(`Contributor role revoked for ${user.username}`, 'warning');
			showConfirmDialog = false;
			selectedUser = null;
		}
	}

	function showRevokeDialog(user) {
		selectedUser = user;
		showConfirmDialog = true;
	}

	function cancelRevoke() {
		showConfirmDialog = false;
		selectedUser = null;
	}

	function showNotification(message, type = 'info') {
		const colors = {
			success: '#10b981',
			error: '#ef4444',
			warning: '#f59e0b',
			info: '#3b82f6'
		};

		const notification = document.createElement('div');
		notification.textContent = message;
		notification.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: ${colors[type]};
			color: white;
			padding: 1rem 2rem;
			border-radius: 0.5rem;
			z-index: 1000;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
		`;
		document.body.appendChild(notification);
		
		setTimeout(() => {
			notification.remove();
		}, 3000);
	}

	function getRoleColor(role) {
		switch (role) {
			case 'admin': return '#f59e0b';
			case 'contributor': return '#3b82f6';
			case 'guest': return '#6b7280';
			default: return '#6b7280';
		}
	}

	function getStatusColor(status) {
		switch (status) {
			case 'approved': return '#10b981';
			case 'pending': return '#f59e0b';
			case 'revoked': return '#ef4444';
			default: return '#6b7280';
		}
	}

	function formatDate(timestamp) {
		return new Date(timestamp).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatTimeAgo(timestamp) {
		const now = Date.now();
		const diff = now - timestamp;
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor(diff / (1000 * 60));

		if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
		if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
		if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
		return 'Just now';
	}

	function getDaysInGuild(timestamp) {
		const now = Date.now();
		const diff = now - timestamp;
		return Math.floor(diff / (1000 * 60 * 60 * 24));
	}
</script>

<svelte:head>
	<title>User Management - Translation Hub</title>
</svelte:head>

<main class="container">
	<header>
		<h1>⚙️ User Management</h1>
		<p>Manage authenticated users and permissions - Admins only</p>
		<a href={base || '/'} class="btn btn-secondary">← Back to Dashboard</a>
	</header>

	<div class="management-layout">
		<!-- Users List -->
		<div class="users-section">
			<div class="section-header">
				<h2>Authenticated Users ({filteredUsers.length})</h2>
			</div>

			<div class="filters">
				<input 
					type="text" 
					bind:value={searchTerm} 
					placeholder="Search users..."
					class="search-input"
				/>
				<select bind:value={filterRole} class="role-filter">
					{#each roleOptions as role}
						<option value={role}>
							{role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
						</option>
					{/each}
				</select>
			</div>

			<div class="users-list">
				{#each filteredUsers as user}
					<div 
						class="user-item {selectedUser === user ? 'selected' : ''}"
						on:click={() => selectUser(user)}
					>
						<div class="user-header">
							<div class="user-info">
								<span class="username">{user.username}</span>
								<span class="user-id">#{user.discordId.slice(-6)}</span>
							</div>
							<div class="user-badges">
								<span 
									class="role-badge" 
									style="background-color: {getRoleColor(user.role)}"
								>
									{user.role}
								</span>
								<span 
									class="status-badge" 
									style="background-color: {getStatusColor(user.verificationStatus)}"
								>
									{user.verificationStatus}
								</span>
							</div>
						</div>

						<div class="user-details">
							<div class="detail-item">
								<span class="label">Email:</span>
								<span class="value">{user.email}</span>
							</div>
							<div class="detail-item">
								<span class="label">Joined:</span>
								<span class="value">{formatDate(user.joinDate)}</span>
							</div>
							<div class="detail-item">
								<span class="label">Last seen:</span>
								<span class="value">{formatTimeAgo(user.lastSeen)}</span>
							</div>
						</div>

						<div class="user-stats">
							<div class="stat">
								<span class="stat-value">{user.contributionsCount}</span>
								<span class="stat-label">Contributions</span>
							</div>
							<div class="stat">
								<span class="stat-value">{user.verificationsCount}</span>
								<span class="stat-label">Verifications</span>
							</div>
							<div class="stat">
								<span class="stat-value">{getDaysInGuild(user.guildMemberSince)}</span>
								<span class="stat-label">Days in guild</span>
							</div>
						</div>

						{#if user.role === 'contributor'}
							<div class="user-actions">
								<button 
									class="btn btn-danger btn-small"
									on:click|stopPropagation={() => showRevokeDialog(user)}
								>
									Revoke Contributor
								</button>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- User Details Panel -->
		<div class="details-panel">
			{#if selectedUser}
				<div class="details-header">
					<h3>User Details</h3>
					<div class="user-avatar-placeholder">
						{selectedUser.username.charAt(0).toUpperCase()}
					</div>
				</div>

				<div class="details-content">
					<div class="detail-section">
						<h4>Basic Information</h4>
						<div class="detail-grid">
							<div class="detail-row">
								<strong>Username:</strong> {selectedUser.username}
							</div>
							<div class="detail-row">
								<strong>Discord ID:</strong> 
								<span class="monospace">{selectedUser.discordId}</span>
							</div>
							<div class="detail-row">
								<strong>Email:</strong> {selectedUser.email}
							</div>
							<div class="detail-row">
								<strong>Current Role:</strong> 
								<span 
									class="role-badge" 
									style="background-color: {getRoleColor(selectedUser.role)}"
								>
									{selectedUser.role}
								</span>
							</div>
							<div class="detail-row">
								<strong>Status:</strong> 
								<span 
									class="status-badge" 
									style="background-color: {getStatusColor(selectedUser.verificationStatus)}"
								>
									{selectedUser.verificationStatus}
								</span>
							</div>
						</div>
					</div>

					<div class="detail-section">
						<h4>Activity Information</h4>
						<div class="detail-grid">
							<div class="detail-row">
								<strong>Joined Hub:</strong> {formatDate(selectedUser.joinDate)}
							</div>
							<div class="detail-row">
								<strong>Last Seen:</strong> {formatTimeAgo(selectedUser.lastSeen)}
							</div>
							<div class="detail-row">
								<strong>Guild Member Since:</strong> {formatDate(selectedUser.guildMemberSince)}
							</div>
							<div class="detail-row">
								<strong>Days in Guild:</strong> {getDaysInGuild(selectedUser.guildMemberSince)} days
							</div>
						</div>
					</div>

					<div class="detail-section">
						<h4>Contribution Statistics</h4>
						<div class="stats-grid">
							<div class="stat-card">
								<div class="stat-number">{selectedUser.contributionsCount}</div>
								<div class="stat-title">Total Contributions</div>
							</div>
							<div class="stat-card">
								<div class="stat-number">{selectedUser.verificationsCount}</div>
								<div class="stat-title">Verifications Done</div>
							</div>
							<div class="stat-card">
								<div class="stat-number">{Math.round((selectedUser.verificationsCount / Math.max(selectedUser.contributionsCount, 1)) * 100)}%</div>
								<div class="stat-title">Verification Rate</div>
							</div>
						</div>
					</div>

					{#if selectedUser.role === 'contributor'}
						<div class="detail-section">
							<h4>Role Management</h4>
							<p>This user has contributor access. You can revoke their contributor role to downgrade them to guest status.</p>
							<button 
								class="btn btn-danger"
								on:click={() => showRevokeDialog(selectedUser)}
							>
								Revoke Contributor Role
							</button>
						</div>
					{:else if selectedUser.role === 'guest'}
						<div class="detail-section">
							<h4>Role Information</h4>
							<p>
								This user is currently a guest. 
								{#if getDaysInGuild(selectedUser.guildMemberSince) >= 30}
									They have been in the Discord server for {getDaysInGuild(selectedUser.guildMemberSince)} days 
									and are eligible for contributor status. Role will be automatically upgraded on next login.
								{:else}
									They need to be in the Discord server for at least 30 days to become a contributor. 
									Currently: {getDaysInGuild(selectedUser.guildMemberSince)} days.
								{/if}
							</p>
						</div>
					{/if}
				</div>
			{:else}
				<div class="no-selection">
					<h3>Select a user to view details</h3>
					<p>Choose a user from the list to view their detailed information and manage their permissions.</p>
					
					<div class="management-info">
						<h4>Management Actions:</h4>
						<ul>
							<li><strong>View Details:</strong> See comprehensive user information</li>
							<li><strong>Revoke Access:</strong> Downgrade contributors to guest status</li>
							<li><strong>Monitor Activity:</strong> Track user contributions and engagement</li>
						</ul>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Confirmation Dialog -->
	{#if showConfirmDialog && selectedUser}
		<div class="modal-overlay" on:click={cancelRevoke}>
			<div class="modal-content" on:click|stopPropagation>
				<h3>Confirm Role Revocation</h3>
				<p>
					Are you sure you want to revoke contributor access for 
					<strong>{selectedUser.username}</strong>?
				</p>
				<p class="warning-text">
					This will downgrade them to guest status and they will lose access to 
					editing and verification features.
				</p>
				
				<div class="modal-actions">
					<button 
						class="btn btn-danger"
						on:click={() => revokeContributorRole(selectedUser.id)}
					>
						Yes, Revoke Access
					</button>
					<button class="btn btn-secondary" on:click={cancelRevoke}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
		min-height: 100vh;
	}

	header {
		text-align: center;
		color: white;
		margin-bottom: 2rem;
	}

	header h1 {
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	header p {
		margin: 0 0 1rem 0;
		opacity: 0.9;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		text-decoration: none;
		display: inline-block;
	}

	.btn-small {
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
	}

	.btn-danger {
		background: #ef4444;
		color: white;
	}

	.btn-danger:hover {
		background: #dc2626;
	}

	.management-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		height: calc(100vh - 300px);
		min-height: 600px;
	}

	.users-section {
		background: white;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.section-header {
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		background: #f8f9fa;
	}

	.section-header h2 {
		margin: 0;
		color: #333;
		font-size: 1.25rem;
	}

	.filters {
		padding: 1rem;
		border-bottom: 1px solid #e5e7eb;
		display: flex;
		gap: 1rem;
	}

	.search-input {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		font-size: 1rem;
	}

	.role-filter {
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		font-size: 1rem;
		min-width: 150px;
	}

	.search-input:focus,
	.role-filter:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.users-list {
		height: calc(100% - 140px);
		overflow-y: auto;
	}

	.user-item {
		padding: 1.5rem;
		border-bottom: 1px solid #f3f4f6;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.user-item:hover {
		background: #f8f9fa;
	}

	.user-item.selected {
		background: #eff6ff;
		border-left: 4px solid #667eea;
	}

	.user-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.username {
		font-weight: 600;
		color: #333;
		font-size: 1.1rem;
	}

	.user-id {
		color: #6b7280;
		font-size: 0.9rem;
		font-family: monospace;
	}

	.user-badges {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.role-badge,
	.status-badge {
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.user-details {
		margin-bottom: 1rem;
	}

	.detail-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.25rem;
		font-size: 0.9rem;
	}

	.label {
		color: #6b7280;
		font-weight: 500;
	}

	.value {
		color: #374151;
	}

	.user-stats {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.stat {
		text-align: center;
		flex: 1;
	}

	.stat-value {
		display: block;
		font-weight: 700;
		color: #667eea;
		font-size: 1.1rem;
	}

	.stat-label {
		display: block;
		font-size: 0.8rem;
		color: #6b7280;
	}

	.user-actions {
		border-top: 1px solid #f3f4f6;
		padding-top: 1rem;
	}

	.details-panel {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		overflow-y: auto;
	}

	.details-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.details-header h3 {
		margin: 0;
		color: #333;
	}

	.user-avatar-placeholder {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: #667eea;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.detail-section {
		margin-bottom: 2rem;
	}

	.detail-section h4 {
		margin: 0 0 1rem 0;
		color: #333;
		font-size: 1.1rem;
	}

	.detail-grid {
		display: grid;
		gap: 0.75rem;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0;
		border-bottom: 1px solid #f3f4f6;
	}

	.detail-row:last-child {
		border-bottom: none;
	}

	.monospace {
		font-family: monospace;
		background: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
	}

	.stat-card {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 0.5rem;
		text-align: center;
	}

	.stat-number {
		font-size: 2rem;
		font-weight: 700;
		color: #667eea;
		margin-bottom: 0.5rem;
	}

	.stat-title {
		color: #6b7280;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.no-selection {
		text-align: center;
		color: #666;
		padding: 3rem 2rem;
	}

	.no-selection h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
	}

	.management-info {
		text-align: left;
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 0.5rem;
		margin-top: 2rem;
	}

	.management-info h4 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.management-info ul {
		margin: 0;
		padding-left: 1.5rem;
		color: #374151;
	}

	.management-info li {
		margin-bottom: 0.5rem;
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		max-width: 400px;
		width: 90%;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
	}

	.modal-content h3 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.modal-content p {
		margin: 0 0 1rem 0;
		color: #374151;
		line-height: 1.5;
	}

	.warning-text {
		color: #ef4444;
		font-weight: 500;
	}

	.modal-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 1.5rem;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.management-layout {
			grid-template-columns: 1fr;
			height: auto;
		}

		.users-section {
			height: 500px;
		}

		.filters {
			flex-direction: column;
		}

		.user-header {
			flex-direction: column;
			gap: 0.5rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
