<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	let translations = [];
	let filteredTranslations = [];
	let searchTerm = '';
	let selectedCategory = 'all';
	let selectedLanguage = 'all';

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
		},
		{
			key: 'npc.wizard.greeting',
			category: 'dialogue',
			baseText: 'Welcome, brave adventurer!',
			languages: {
				es: { text: '¡Bienvenido, valiente aventurero!', status: 'complete', verified: false },
				fr: { text: 'Bienvenue, brave aventurier!', status: 'complete', verified: true },
				de: { text: 'Willkommen, tapferer Abenteurer!', status: 'pending', verified: false }
			}
		}
	];

	const categories = ['all', 'items', 'ui', 'dialogue'];
	const languages = ['all', 'es', 'fr', 'de'];

	onMount(() => {
		translations = dummyTranslations;
		filteredTranslations = translations;
	});

	function filterTranslations() {
		filteredTranslations = translations.filter((translation) => {
			const matchesSearch =
				searchTerm === '' ||
				translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
				translation.baseText.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesCategory =
				selectedCategory === 'all' || translation.category === selectedCategory;

			const matchesLanguage =
				selectedLanguage === 'all' || Object.keys(translation.languages).includes(selectedLanguage);

			return matchesSearch && matchesCategory && matchesLanguage;
		});
	}

	$: {
		searchTerm, selectedCategory, selectedLanguage;
		filterTranslations();
	}

	function getStatusColor(status) {
		switch (status) {
			case 'complete':
				return '#10b981';
			case 'pending':
				return '#f59e0b';
			default:
				return '#6b7280';
		}
	}
</script>

<svelte:head>
	<title>View Translations - Translation Hub</title>
</svelte:head>

<main class="container">
	<header>
		<h1>📖 View Translations</h1>
		<p>Browse and search through all available translations</p>
		<a href={base || '/'} class="btn btn-secondary">← Back to Dashboard</a>
	</header>

	<div class="filters">
		<div class="filter-group">
			<label for="search">Search:</label>
			<input
				id="search"
				type="text"
				bind:value={searchTerm}
				placeholder="Search by key or text..."
			/>
		</div>

		<div class="filter-group">
			<label for="category">Category:</label>
			<select id="category" bind:value={selectedCategory}>
				{#each categories as category (category.id)}
					<option value={category}>{category === 'all' ? 'All Categories' : category}</option>
				{/each}
			</select>
		</div>

		<div class="filter-group">
			<label for="language">Language:</label>
			<select id="language" bind:value={selectedLanguage}>
				{#each languages as language (language.id)}
					<option value={language}>
						{language === 'all' ? 'All Languages' : language.toUpperCase()}
					</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="results-info">
		<p>
			Showing {filteredTranslations.length} translation{filteredTranslations.length === 1
				? ''
				: 's'}
		</p>
	</div>

	<div class="translations-grid">
		{#each filteredTranslations as translation (translation.id)}
			<div class="translation-card">
				<div class="translation-header">
					<h3>{translation.key}</h3>
					<span class="category-badge">{translation.category}</span>
				</div>

				<div class="base-text">
					<strong>Base:</strong>
					{translation.baseText}
				</div>

				<div class="languages">
					{#each Object.entries(translation.languages) as [lang, data] (lang.id)}
						<div class="language-item">
							<div class="language-header">
								<span class="language-code">{lang.toUpperCase()}</span>
								<div class="status-indicators">
									<span
										class="status-dot"
										style="background-color: {getStatusColor(data.status)}"
										title="Status: {data.status}"
									></span>
									{#if data.verified}
										<span class="verified-icon" title="Verified">✓</span>
									{/if}
								</div>
							</div>
							<div class="translation-text">{data.text}</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	{#if filteredTranslations.length === 0}
		<div class="no-results">
			<h3>No translations found</h3>
			<p>Try adjusting your search criteria or filters.</p>
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
		max-width: 1200px;
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

	.filters {
		background: white;
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.filter-group label {
		font-weight: 600;
		color: #333;
	}

	.filter-group input,
	.filter-group select {
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		font-size: 1rem;
	}

	.filter-group input:focus,
	.filter-group select:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.results-info {
		color: white;
		text-align: center;
		margin-bottom: 1rem;
		opacity: 0.9;
	}

	.translations-grid {
		display: grid;
		gap: 1.5rem;
	}

	.translation-card {
		background: white;
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.translation-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.translation-header h3 {
		margin: 0;
		color: #333;
		font-family: monospace;
		font-size: 1rem;
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
		margin-bottom: 1rem;
		color: #333;
	}

	.languages {
		display: grid;
		gap: 0.75rem;
	}

	.language-item {
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 0.75rem;
	}

	.language-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.language-code {
		font-weight: 600;
		color: #667eea;
		font-size: 0.9rem;
	}

	.status-indicators {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.verified-icon {
		color: #10b981;
		font-weight: bold;
		font-size: 0.9rem;
	}

	.translation-text {
		color: #374151;
		font-style: italic;
	}

	.no-results {
		text-align: center;
		color: white;
		padding: 3rem;
	}

	.no-results h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
	}

	.no-results p {
		opacity: 0.8;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		header h1 {
			font-size: 2rem;
		}

		.filters {
			grid-template-columns: 1fr;
		}

		.translation-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
