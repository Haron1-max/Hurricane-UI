<!-- In your Toast.svelte -->
<script lang="ts">
	import { getCurrentToast, getIsShowingToast } from '$lib/state.svelte';

	let currentToast = $derived(getCurrentToast());
	let isShowing = $derived(getIsShowingToast());
</script>

{#if currentToast}
	<div class="toast-container">
		<div class="toast toast-{currentToast.type}" class:visible={isShowing} role="alert">
			<div class="toast-icon">
				{#if currentToast.type === 'success'}
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
							fill="currentColor"
						/>
					</svg>
				{:else if currentToast.type === 'error'}
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
							fill="currentColor"
						/>
					</svg>
				{:else if currentToast.type === 'warning'}
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor" />
					</svg>
				{:else}
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
							fill="currentColor"
						/>
					</svg>
				{/if}
			</div>
			<span class="toast-message">{currentToast.message}</span>
			<button
				class="close-btn"
				onclick={() => {
					if (typeof window !== 'undefined' && (window as any).showToast) {
						(window as any).showToast('', 'success', 0);
					}
				}}
				aria-label="Close notification"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
						fill="currentColor"
					/>
				</svg>
			</button>
		</div>
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		top: 2rem;
		right: 2rem;
		z-index: 9999;
	}

	.toast {
		display: flex;
		align-items: center;
		gap: 1.2rem;
		padding: 1.2rem 1.6rem;
		border-radius: 0.8rem;
		color: white;
		min-width: 32rem;
		max-width: 40rem;
		box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.15);
		border: 0.2rem solid;
		font-size: 1.4rem;
		font-weight: 500;
		transform: translateX(100%);
		opacity: 0;
		transition: all 0.3s ease;
	}

	.toast.visible {
		transform: translateX(0);
		opacity: 1;
	}

	.toast-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.toast-success .toast-icon {
		background: #dcfce7;
		color: #16a34a;
	}

	.toast-message {
		flex: 1;
		line-height: 1.4;
	}

	.close-btn {
		background: none;
		border: none;
		color: currentColor;
		cursor: pointer;
		padding: 0.4rem;
		border-radius: 0.4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s ease;
		flex-shrink: 0;
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	/* Success styles */
	.toast-success {
		background: #f0fdf4;
		border-color: #22c55e;
		color: #15803d;
	}

	/* Error styles */
	.toast-error {
		background: linear-gradient(135deg, #fef2f2, #fee2e2);
		border-left-color: #ef4444;
		color: #991b1b;
	}

	/* Warning styles */
	.toast-warning {
		background: linear-gradient(135deg, #fffbeb, #fef3c7);
		border-left-color: #f59e0b;
		color: #92400e;
	}

	/* Info styles */
	.toast-info {
		background: linear-gradient(135deg, #eff6ff, #dbeafe);
		border-left-color: #3b82f6;
		color: #1e40af;
	}

	@media (max-width: 76.8rem) {
		.toast-container {
			top: 1rem;
			right: 1rem;
			left: 1rem;
		}

		.toast {
			min-width: auto;
			max-width: none;
		}
	}
</style>
