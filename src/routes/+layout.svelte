<script lang="ts">
	import '../app.css';
	import Toast from './Toast.svelte';

	let { children } = $props();
</script>

<div class="app">
	<main>
		{@render children()}
	</main>
	<Toast />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: max-content;
		width: 100dvw;
	}

	main {
		width: 100dvw;
		min-height: max-content;
		display: flex;
		flex-direction: column;
	}
</style>
