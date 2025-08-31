<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import { getSidebarOpenState, setSidebarOpenState } from '$lib/state.svelte';

	let { children } = $props();
	let sidebarOpen = $derived(getSidebarOpenState());

	// Svelte 5 effect to handle responsive sidebar behavior
	$effect(() => {
		if (typeof window !== 'undefined') {
			const handleResize = () => {
				if (window.innerWidth <= 768) {
					setSidebarOpenState(false);
				} else {
					setSidebarOpenState(true);
				}
			};

			// Initial check
			handleResize();

			// Add resize listener
			window.addEventListener('resize', handleResize);

			// Cleanup
			return () => window.removeEventListener('resize', handleResize);
		}
	});
</script>

<div class="dashboard-layout">
	<Sidebar {sidebarOpen} />
	{#if sidebarOpen}
		<div
			class="sidebar-backdrop"
			onclick={() => setSidebarOpenState(false)}
			onkeydown={(e) => e.key === 'Enter' && setSidebarOpenState(false)}
			role="button"
			tabindex="0"
		></div>
	{/if}
	<main class="main-content" class:sidebar-closed={!sidebarOpen}>
		{@render children()}
	</main>
</div>

<style>
	.dashboard-layout {
		display: flex;
		width: 100vw;
		min-height: 100vh;
		height: max-content;
		background: #f8fafc;
		background-image:
			radial-gradient(circle at 20% 80%, rgba(255, 220, 190, 0.3) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(255, 245, 238, 0.35) 0%, transparent 50%),
			radial-gradient(circle at 40% 40%, rgba(255, 210, 180, 0.15) 0%, transparent 50%);

		.sidebar-backdrop {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.5);
			z-index: 50;
			opacity: 0;
			animation: fadeIn 0.3s ease forwards;

			@media (min-width: 76.9rem) {
				display: none;
			}
		}

		@keyframes fadeIn {
			to {
				opacity: 1;
			}
		}

		.main-content {
			flex: 1;
			margin-left: 32rem;
			padding: 3rem;
			overflow-y: auto;
			min-height: 100vh;
			height: max-content;
			transition: margin-left 0.3s ease;

			&.sidebar-closed {
				margin-left: 0;
			}

			@media (max-width: 76.8rem) {
				margin-left: 0;
				padding: 2rem;
			}
		}
	}
</style>
