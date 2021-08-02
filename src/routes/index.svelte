<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	let queries: string[] = [];
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<form class="new" action="/filter" method="get">
		<input name="feedUri" aria-label="Add initial feed" placeholder="feed value" />
		<input name="q" aria-label="Add query regexp" placeholder="add query" />
		<input type="submit" value="Get feed">
	</form>
	
	{#each queries as query}
		<span>{query}</span>
	{/each}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	.new {
		margin: 0 0 0.5rem 0;
	}
</style>
