<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { enhance } from '$lib/form';

	let queries: string[] = [];
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<form
		class="new"
		action="/filter"
		method="get"		
	>
		<input name="filterUri" aria-label="Add initial feed" placeholder="feed value" />		
	</form>
	<form
		class="new"
		action=""
		method="get"		
	>
		<input name="queryToAdd" aria-label="Add query" placeholder="add query" />		
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
