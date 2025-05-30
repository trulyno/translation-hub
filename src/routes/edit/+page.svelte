<script>
	import { user, isAuthenticated, userRole } from '$lib/stores.js';
	import { onMount } from 'svelte';
    import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	let translations = [];
	let selectedTranslation = null;
	let editingLanguage = 'es';
	let editText = '';
	let searchTerm = '';
	let filteredTranslations = [];

	// Check access
	$: if ($userRole !== 'contributor' && $userRole !== 'admin') {
		goto(base || '/');
	}

	// Dummy translation data
	const dummyTranslations = [
		{
			key: 'item.sword.name',
			category: 'items',
			baseText: 'Iron Sword',
			languages: {
				es: { text: 'Espada de Hierro', status: 'complete', verified: true },
				fr: { text: 'Épée de Fer', status: 'complete', verified: false },
				de: { text: 'Eisenschwert', status: 'pending', verified: false }
			}
		},
		{
			key: 'item.potion.name',
			category: 'items',
			baseText: 'Health Potion',
			languages: {
				es: { text: 'Poción de Salud', status: 'complete', verified: true },
				fr: { text: 'Potion de Santé', status: 'complete', verified: true },
				de: { text: 'Heiltrank', status: 'complete', verified: false }
			}
		},
		{
			key: 'gui.menu.start',
			category: 'ui',
			baseText: 'Start Game',
			languages: {
				es: { text: 'Iniciar Juego', status: 'complete', verified: true },
				fr: { text: 'Commencer le Jeu', status: 'pending', verified: false },
				de: { text: 'Spiel Starten', status: 'complete', verified: true }
			}
		}
	];

	const languages = ['es', 'fr', 'de'];

	onMount(() => {
		translations = dummyTranslations;
		filteredTranslations = translations;
	});

	function filterTranslations() {
		filteredTranslations = translations.filter(translation => {
			return searchTerm === '' || 
				translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
				translation.baseText.toLowerCase().includes(searchTerm.toLowerCase());
		});
	}

	$: {
		searchTerm;
		filterTranslations();
	}

	function selectTranslation(translation) {
		selectedTranslation = translation;
		if (translation.languages[editingLanguage]) {
			editText = translation.languages[editingLanguage].text;
		} else {
			editText = '';
		}
	}

	function changeLanguage(lang) {
		editingLanguage = lang;
		if (selectedTranslation && selectedTranslation.languages[lang]) {
			editText = selectedTranslation.languages[lang].text;
		} else {
			editText = '';
		}
	}

	function saveTranslation() {
		if (!selectedTranslation) return;

		// Update the translation
		if (!selectedTranslation.languages[editingLanguage]) {
			selectedTranslation.languages[editingLanguage] = {};
		}
		
		selectedTranslation.languages[editingLanguage].text = editText;
		selectedTranslation.languages[editingLanguage].status = 'complete';
		selectedTranslation.languages[editingLanguage].verified = false;

		// Trigger reactivity
		translations = [...translations];
		
		showNotification('Translation saved successfully!');
	}

	function showNotification(message) {
		// Simple notification system
		const notification = document.createElement('div');
		notification.textContent = message;
		notification.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: #10b981;
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
			case 'complete': return '#10b981';
			case 'pending': return '#f59e0b';
			default: return '#6b7280';
		}
	}
</script>

<svelte:head>
	<title>Edit Translations - Translation Hub</title>
</svelte:head>

<main class="container">
	<header>
		<h1>✏️ Edit Translations</h1>
		<p>Create and modify translations - Contributors & Admins only</p>
		<a href={base || '/'} class="btn btn-secondary">← Back to Dashboard</a>
	</header>

	<div class="editor-layout">
		<!-- Translation List -->
		<div class="translation-list">
			<div class="search-box">
				<input 
					type="text" 
					bind:value={searchTerm} 
					placeholder="Search translations..."
				/>
			</div>

			<div class="translations">
				{#each filteredTranslations as translation}
					<div 
						class="translation-item {selectedTranslation === translation ? 'selected' : ''}"
						on:click={() => selectTranslation(translation)}
					>
						<div class="translation-key">{translation.key}</div>
						<div class="translation-base">{translation.baseText}</div>
						<div class="translation-languages">
							{#each languages as lang}
								{#if translation.languages[lang]}
									<span 
										class="status-dot" 
										style="background-color: {getStatusColor(translation.languages[lang].status)}"
										title="{lang.toUpperCase()}: {translation.languages[lang].status}"
									></span>
								{:else}
									<span class="status-dot missing" title="{lang.toUpperCase()}: missing"></span>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Editor Panel -->
		<div class="editor-panel">
			{#if selectedTranslation}
				<div class="editor-header">
					<h3>{selectedTranslation.key}</h3>
					<span class="category-badge">{selectedTranslation.category}</span>
				</div>

				<div class="base-text">
					<strong>Base Text:</strong> {selectedTranslation.baseText}
				</div>

				<!-- Language Selector -->
				<div class="language-selector">
					<label>Editing Language:</label>
					<div class="language-tabs">
						{#each languages as lang}
							<button 
								class="language-tab {editingLanguage === lang ? 'active' : ''}"
								on:click={() => changeLanguage(lang)}
							>
								{lang.toUpperCase()}
								{#if selectedTranslation.languages[lang]}
									{#if selectedTranslation.languages[lang].verified}
										<span class="verified">✓</span>
									{:else}
										<span class="status-indicator" style="background-color: {getStatusColor(selectedTranslation.languages[lang].status)}"></span>
									{/if}
								{:else}
									<span class="missing-indicator">○</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>

				<!-- Editor -->
				<div class="editor">
					<label for="translation-text">Translation for {editingLanguage.toUpperCase()}:</label>
					<textarea 
						id="translation-text"
						bind:value={editText}
						placeholder="Enter translation..."
						rows="4"
					></textarea>
					
					<div class="editor-actions">
						<button class="btn btn-primary" on:click={saveTranslation}>
							Save Translation
						</button>
						<button class="btn btn-secondary" on:click={() => editText = ''}>
							Clear
						</button>
					</div>
				</div>

				<!-- Current Translations -->
				<div class="current-translations">
					<h4>Current Translations:</h4>
					{#each Object.entries(selectedTranslation.languages) as [lang, data]}
						<div class="current-translation">
							<div class="current-header">
								<span class="current-lang">{lang.toUpperCase()}</span>
								<div class="current-status">
									<span 
										class="status-dot" 
										style="background-color: {getStatusColor(data.status)}"
									></span>
									{#if data.verified}
										<span class="verified-icon">✓</span>
									{/if}
								</div>
							</div>
							<div class="current-text">{data.text}</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="no-selection">
					<h3>Select a translation to edit</h3>
					<p>Choose a translation from the list on the left to start editing.</p>
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

	.btn-primary {
		background: #667eea;
		color: white;
	}

	.btn-primary:hover {
		background: #5a67d8;
		transform: translateY(-2px);
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

	.editor-layout {
		display: grid;
		grid-template-columns: 1fr 2fr;
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

	.search-box {
		padding: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.search-box input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		font-size: 1rem;
	}

	.search-box input:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.translations {
		height: calc(100% - 80px);
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

	.translation-key {
		font-family: monospace;
		font-weight: 600;
		color: #333;
		margin-bottom: 0.25rem;
	}

	.translation-base {
		color: #666;
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}

	.translation-languages {
		display: flex;
		gap: 0.25rem;
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.status-dot.missing {
		background: #d1d5db;
	}

	.editor-panel {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		overflow-y: auto;
	}

	.editor-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.editor-header h3 {
		margin: 0;
		color: #333;
		font-family: monospace;
	}

	.category-badge {
		background: #f1f3f4;
		color: #5f6368;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.base-text {
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		color: #333;
	}

	.language-selector {
		margin-bottom: 1.5rem;
	}

	.language-selector label {
		display: block;
		font-weight: 600;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.language-tabs {
		display: flex;
		gap: 0.25rem;
	}

	.language-tab {
		padding: 0.5rem 1rem;
		border: 1px solid #ddd;
		background: white;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-weight: 600;
	}

	.language-tab:hover {
		background: #f8f9fa;
	}

	.language-tab.active {
		background: #667eea;
		color: white;
		border-color: #667eea;
	}

	.status-indicator {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	.verified {
		color: #10b981;
	}

	.missing-indicator {
		color: #d1d5db;
	}

	.editor {
		margin-bottom: 2rem;
	}

	.editor label {
		display: block;
		font-weight: 600;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.editor textarea {
		width: 100%;
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-family: inherit;
		resize: vertical;
		margin-bottom: 1rem;
	}

	.editor textarea:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.editor-actions {
		display: flex;
		gap: 1rem;
	}

	.current-translations {
		border-top: 1px solid #e5e7eb;
		padding-top: 1.5rem;
	}

	.current-translations h4 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.current-translation {
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.current-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.current-lang {
		font-weight: 600;
		color: #667eea;
		font-size: 0.9rem;
	}

	.current-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.verified-icon {
		color: #10b981;
		font-weight: bold;
	}

	.current-text {
		color: #374151;
		font-style: italic;
	}

	.no-selection {
		text-align: center;
		color: #666;
		padding: 3rem;
	}

	.no-selection h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.editor-layout {
			grid-template-columns: 1fr;
			height: auto;
		}

		.translation-list {
			height: 300px;
		}
	}
</style>
