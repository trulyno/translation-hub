<script>
	import { user, userRole } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	let pendingTranslations = [];
	let filteredTranslations = [];
	let selectedTranslation = null;
	let verificationFeedback = '';
	let filterStatus = 'all';
	let searchTerm = '';

	// Check access
	$: if ($userRole !== 'contributor' && $userRole !== 'admin') {
		goto(base || '/');
	}

	// Dummy pending translations
	const dummyPendingTranslations = [
		{
			key: 'item.shield.name',
			category: 'items',
			baseText: 'Iron Shield',
			language: 'es',
			translation: 'Escudo de Hierro',
			status: 'pending',
			contributor: 'user123',
			submittedAt: Date.now() - 86400000, // 1 day ago
			feedback: null
		},
		{
			key: 'gui.menu.options',
			category: 'ui',
			baseText: 'Options',
			language: 'fr',
			translation: 'Options',
			status: 'pending',
			contributor: 'user456',
			submittedAt: Date.now() - 172800000, // 2 days ago
			feedback: null
		},
		{
			key: 'npc.merchant.greeting',
			category: 'dialogue',
			baseText: 'What can I help you with today?',
			language: 'de',
			translation: 'Womit kann ich Ihnen heute helfen?',
			status: 'pending',
			contributor: 'user789',
			submittedAt: Date.now() - 259200000, // 3 days ago
			feedback: null
		},
		{
			key: 'item.bow.name',
			category: 'items',
			baseText: 'Wooden Bow',
			language: 'es',
			translation: 'Arco de Madera',
			status: 'reviewed',
			contributor: 'user321',
			submittedAt: Date.now() - 345600000, // 4 days ago
			feedback: 'Good translation, approved!'
		}
	];

	const statusOptions = ['all', 'pending', 'reviewed', 'approved', 'rejected'];

	onMount(() => {
		pendingTranslations = dummyPendingTranslations;
		filteredTranslations = pendingTranslations;
	});

	function filterTranslations() {
		filteredTranslations = pendingTranslations.filter((translation) => {
			const matchesSearch =
				searchTerm === '' ||
				translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
				translation.baseText.toLowerCase().includes(searchTerm.toLowerCase()) ||
				translation.translation.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus = filterStatus === 'all' || translation.status === filterStatus;

			return matchesSearch && matchesStatus;
		});
	}

	$: {
		searchTerm, filterStatus;
		filterTranslations();
	}

	function selectTranslation(translation) {
		selectedTranslation = translation;
		verificationFeedback = translation.feedback || '';
	}

	function approveTranslation() {
		if (!selectedTranslation) return;

		selectedTranslation.status = 'approved';
		selectedTranslation.feedback = verificationFeedback || 'Approved';
		selectedTranslation.verifiedBy = $user.username;
		selectedTranslation.verifiedAt = Date.now();

		// Update the list
		pendingTranslations = [...pendingTranslations];

		showNotification('Translation approved!', 'success');
		clearSelection();
	}

	function rejectTranslation() {
		if (!selectedTranslation || !verificationFeedback.trim()) {
			showNotification('Please provide feedback when rejecting a translation.', 'error');
			return;
		}

		selectedTranslation.status = 'rejected';
		selectedTranslation.feedback = verificationFeedback;
		selectedTranslation.verifiedBy = $user.username;
		selectedTranslation.verifiedAt = Date.now();

		// Update the list
		pendingTranslations = [...pendingTranslations];

		showNotification('Translation rejected with feedback.', 'warning');
		clearSelection();
	}

	function clearSelection() {
		selectedTranslation = null;
		selectedLanguage = '';
		verificationFeedback = '';
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

	function getStatusColor(status) {
		switch (status) {
			case 'pending':
				return '#f59e0b';
			case 'approved':
				return '#10b981';
			case 'rejected':
				return '#ef4444';
			case 'reviewed':
				return '#3b82f6';
			default:
				return '#6b7280';
		}
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
</script>

<svelte:head>
	<title>Verify Translations - Translation Hub</title>
</svelte:head>

<main class="container">
	<header>
		<h1>✅ Verify Translations</h1>
		<p>Review and approve translation submissions - Contributors & Admins only</p>
		<a href={base || '/'} class="btn btn-secondary">← Back to Dashboard</a>
	</header>

	<div class="verification-layout">
		<!-- Translation List -->
		<div class="translation-list">
			<div class="filters">
				<input
					type="text"
					bind:value={searchTerm}
					placeholder="Search translations..."
					class="search-input"
				/>
				<select bind:value={filterStatus} class="status-filter">
					{#each statusOptions as status (status.id)}
						<option value={status}>
							{status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
						</option>
					{/each}
				</select>
			</div>

			<div class="translations">
				{#each filteredTranslations as translation (translation.id)}
					<div
						class="translation-item {selectedTranslation === translation ? 'selected' : ''}"
						on:click={() => selectTranslation(translation)}
					>
						<div class="translation-header">
							<div class="translation-key">{translation.key}</div>
							<span
								class="status-badge"
								style="background-color: {getStatusColor(translation.status)}"
							>
								{translation.status}
							</span>
						</div>

						<div class="translation-info">
							<div class="language-badge">{translation.language.toUpperCase()}</div>
							<div class="category-badge">{translation.category}</div>
						</div>

						<div class="translation-preview">
							<div class="base-text">{translation.baseText}</div>
							<div class="translated-text">→ {translation.translation}</div>
						</div>

						<div class="submission-info">
							<span class="contributor">by {translation.contributor}</span>
							<span class="timestamp">{formatTimeAgo(translation.submittedAt)}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Verification Panel -->
		<div class="verification-panel">
			{#if selectedTranslation}
				<div class="verification-header">
					<h3>Reviewing Translation</h3>
					<span
						class="current-status"
						style="background-color: {getStatusColor(selectedTranslation.status)}"
					>
						{selectedTranslation.status}
					</span>
				</div>

				<div class="translation-details">
					<div class="detail-row">
						<strong>Key:</strong>
						<span class="monospace">{selectedTranslation.key}</span>
					</div>
					<div class="detail-row">
						<strong>Category:</strong>
						{selectedTranslation.category}
					</div>
					<div class="detail-row">
						<strong>Language:</strong>
						{selectedTranslation.language.toUpperCase()}
					</div>
					<div class="detail-row">
						<strong>Contributor:</strong>
						{selectedTranslation.contributor}
					</div>
					<div class="detail-row">
						<strong>Submitted:</strong>
						{formatTimeAgo(selectedTranslation.submittedAt)}
					</div>
				</div>

				<div class="text-comparison">
					<div class="text-section">
						<label>Original Text:</label>
						<div class="text-display original">{selectedTranslation.baseText}</div>
					</div>

					<div class="text-section">
						<label>Proposed Translation:</label>
						<div class="text-display translation">{selectedTranslation.translation}</div>
					</div>
				</div>

				<div class="feedback-section">
					<label for="feedback">Verification Feedback:</label>
					<textarea
						id="feedback"
						bind:value={verificationFeedback}
						placeholder="Enter feedback for the contributor..."
						rows="4"
					></textarea>
				</div>

				{#if selectedTranslation.status === 'pending'}
					<div class="verification-actions">
						<button class="btn btn-success" on:click={approveTranslation}>
							✅ Approve Translation
						</button>
						<button class="btn btn-danger" on:click={rejectTranslation}>
							❌ Reject Translation
						</button>
						<button class="btn btn-secondary" on:click={clearSelection}> Cancel </button>
					</div>
				{:else}
					<div class="verification-result">
						<h4>Verification Result:</h4>
						<p><strong>Status:</strong> {selectedTranslation.status}</p>
						{#if selectedTranslation.feedback}
							<p><strong>Feedback:</strong> {selectedTranslation.feedback}</p>
						{/if}
						{#if selectedTranslation.verifiedBy}
							<p><strong>Verified by:</strong> {selectedTranslation.verifiedBy}</p>
						{/if}
					</div>
				{/if}
			{:else}
				<div class="no-selection">
					<h3>Select a translation to verify</h3>
					<p>Choose a translation from the list on the left to start the verification process.</p>
					<div class="verification-tips">
						<h4>Verification Guidelines:</h4>
						<ul>
							<li>Check for accuracy and context appropriateness</li>
							<li>Ensure proper grammar and spelling</li>
							<li>Verify cultural sensitivity</li>
							<li>Provide constructive feedback for improvements</li>
						</ul>
					</div>
				</div>
			{/if}
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

	.btn-secondary {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
	}

	.btn-success {
		background: #10b981;
		color: white;
	}

	.btn-success:hover {
		background: #059669;
	}

	.btn-danger {
		background: #ef4444;
		color: white;
	}

	.btn-danger:hover {
		background: #dc2626;
	}

	.verification-layout {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 2rem;
		height: calc(100vh - 300px);
		min-height: 600px;
	}

	.translation-list {
		background: white;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.filters {
		padding: 1rem;
		border-bottom: 1px solid #e5e7eb;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.search-input {
		flex: 1;
		min-width: 200px;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		font-size: 1rem;
	}

	.status-filter {
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		font-size: 1rem;
		min-width: 150px;
	}

	.search-input:focus,
	.status-filter:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.translations {
		height: calc(100% - 100px);
		overflow-y: auto;
	}

	.translation-item {
		padding: 1rem;
		border-bottom: 1px solid #f3f4f6;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.translation-item:hover {
		background: #f8f9fa;
	}

	.translation-item.selected {
		background: #eff6ff;
		border-left: 4px solid #667eea;
	}

	.translation-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.translation-key {
		font-family: monospace;
		font-weight: 600;
		color: #333;
		font-size: 0.9rem;
	}

	.status-badge {
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.translation-info {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.language-badge,
	.category-badge {
		background: #f1f3f4;
		color: #5f6368;
		padding: 0.125rem 0.5rem;
		border-radius: 0.75rem;
		font-size: 0.7rem;
		font-weight: 600;
	}

	.language-badge {
		background: #dbeafe;
		color: #1e40af;
	}

	.translation-preview {
		margin-bottom: 0.5rem;
	}

	.base-text {
		color: #374151;
		font-size: 0.9rem;
		margin-bottom: 0.25rem;
	}

	.translated-text {
		color: #667eea;
		font-size: 0.9rem;
		font-style: italic;
	}

	.submission-info {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		color: #6b7280;
	}

	.verification-panel {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		overflow-y: auto;
	}

	.verification-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.verification-header h3 {
		margin: 0;
		color: #333;
	}

	.current-status {
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.translation-details {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 0.5rem;
		margin-bottom: 2rem;
	}

	.detail-row {
		margin-bottom: 0.5rem;
		color: #333;
	}

	.detail-row:last-child {
		margin-bottom: 0;
	}

	.monospace {
		font-family: monospace;
		background: #e5e7eb;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	.text-comparison {
		margin-bottom: 2rem;
	}

	.text-section {
		margin-bottom: 1.5rem;
	}

	.text-section label {
		display: block;
		font-weight: 600;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.text-display {
		padding: 1rem;
		border-radius: 0.5rem;
		font-size: 1.1rem;
		line-height: 1.5;
	}

	.text-display.original {
		background: #f3f4f6;
		color: #374151;
	}

	.text-display.translation {
		background: #eff6ff;
		color: #1e40af;
		border: 2px solid #dbeafe;
	}

	.feedback-section {
		margin-bottom: 2rem;
	}

	.feedback-section label {
		display: block;
		font-weight: 600;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.feedback-section textarea {
		width: 100%;
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-family: inherit;
		resize: vertical;
	}

	.feedback-section textarea:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.verification-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.verification-result {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 0.5rem;
		border-left: 4px solid #667eea;
	}

	.verification-result h4 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.verification-result p {
		margin: 0.5rem 0;
		color: #374151;
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

	.verification-tips {
		text-align: left;
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 0.5rem;
		margin-top: 2rem;
	}

	.verification-tips h4 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.verification-tips ul {
		margin: 0;
		padding-left: 1.5rem;
		color: #374151;
	}

	.verification-tips li {
		margin-bottom: 0.5rem;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.verification-layout {
			grid-template-columns: 1fr;
			height: auto;
		}

		.translation-list {
			height: 400px;
		}

		.filters {
			flex-direction: column;
		}

		.verification-actions {
			flex-direction: column;
		}
	}
</style>
