<script lang="ts">
	import { getSidebarOpenState, setSidebarOpenState } from '$lib/state.svelte';
	import { getLoadingState } from '$lib/state.svelte';
	import { updateSubreddits } from '../../../utils';
	import Loader from '../../Loader.svelte';

	let { data } = $props();

	// Track screen size for responsive behavior
	let isDesktop = $state(typeof window !== 'undefined' ? window.innerWidth > 768 : true);

	// Update screen size on resize
	$effect(() => {
		if (typeof window !== 'undefined') {
			const handleResize = () => {
				isDesktop = window.innerWidth > 768;
			};

			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		}
	});

	function toggleSidebar() {
		setSidebarOpenState(!getSidebarOpenState());
	}

	// Subreddits state
	let subreddit = $state<string>('');
	let subreddits = $state<string[]>([]);

	// Function to add a subreddit
	function addSubreddit(event: KeyboardEvent) {
		subreddit = subreddit.trim();

		// remove r/ incase it's there
		if (subreddit.startsWith('r/')) {
			subreddit = subreddit.slice(2);
		}

		if (event.key === 'Enter' && subreddit !== '') {
			if (!subreddits.includes(subreddit)) {
				subreddits.push(subreddit);
			}
			subreddit = '';
		}
	}

	// Function to remove a subreddit
	function removeSubreddit(event: MouseEvent) {
		const currentTarget = event.currentTarget as HTMLDivElement;
		const spanElement = currentTarget.querySelector('span');
		const subreddit = spanElement?.textContent;
		if (subreddit) {
			subreddits = subreddits.filter((s) => s !== subreddit);
		}
	}

	async function saveSubreddits() {
		const updatedSubreddits = await updateSubreddits(subreddits);
		subreddits = updatedSubreddits.map((sub) => sub.subreddit_name);
	}

	$effect(() => {
		subreddits = data.subreddits.map((sub) => sub.subreddit_name);
	});
</script>

<section>
	<div class="subreddits-header">
		<h1>Subreddits</h1>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="32"
			height="32"
			fill="#000000"
			viewBox="0 0 256 256"
			onclick={toggleSidebar}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Enter' && toggleSidebar()}
			class="hamburger-icon"
			class:rotated={!getSidebarOpenState() && isDesktop}
			><path
				d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"
			></path></svg
		>
	</div>
	<div class="subreddits-content">
		<div class="subreddits-content-header">
			<p>Manage your subreddits to find relevant leads.</p>
		</div>
		<div class="subreddits-content-body">
			<div class="subreddits-card">
				<div class="card-heading">
					<p>Enter the names of subreddits, without the "r/". Press Enter to add each one.</p>
				</div>
				<div class="subreddit-list">
					{#each subreddits as subredditItem}
						<div class="subreddit-item" onclick={(e) => removeSubreddit(e)} role="none">
							<span>{subredditItem}</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="13"
								height="13"
								fill="#393e46"
								viewBox="0 0 256 256"
								><path
									d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
								></path></svg
							>
						</div>
					{/each}
					<input
						type="text"
						placeholder="Add a subreddit"
						bind:value={subreddit}
						onkeydown={(e) => addSubreddit(e)}
					/>
				</div>
				<div class="card-actions">
					{#if getLoadingState()}
						<Loader width="100%" />
					{:else}
						<button
							type="button"
							class="save-button"
							onclick={saveSubreddits}
							disabled={subreddits.length === 0}
						>
							Update Subreddits
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<svelte:head>
	<title>Subreddits | Hurricane</title>
</svelte:head>

<style>
	section {
		width: 100%;
		min-height: 100dvh;
		height: max-content;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 3rem;

		& .subreddits-header {
			display: flex;
			align-items: center;
			justify-content: space-between;

			@media (max-width: 48rem) {
				gap: 1rem;
			}

			& h1 {
				font-size: 2.4rem;
				font-weight: 700;
				color: #222831;
				margin: 0;

				@media (max-width: 120rem) {
					font-size: 2.2rem;
				}

				@media (max-width: 76.8rem) {
					font-size: 2rem;
				}

				@media (max-width: 48rem) {
					font-size: 1.8rem;
				}
			}

			.hamburger-icon {
				cursor: pointer;
				transition: all 0.3s ease;
				padding: 0.1rem;
				border-radius: 0.5rem;

				&:hover {
					background: rgba(255, 69, 0, 0.1);
					transform: scale(1.05);
				}

				&:focus {
					outline: none;
					background: rgba(255, 69, 0, 0.15);
				}

				&.rotated {
					transform: rotate(90deg);
				}
			}
		}

		& .subreddits-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 2rem;

			@media (max-width: 76.8rem) {
				gap: 1.5rem;
			}

			@media (max-width: 48rem) {
				gap: 1rem;
			}

			& .subreddits-content-header {
				& p {
					font-size: 2rem;
					color: #6b7280;
					font-weight: 500;
					margin: 0;
					line-height: 1.5;

					@media (max-width: 120rem) {
						font-size: 1.9rem;
					}

					@media (max-width: 76.8rem) {
						font-size: 1.8rem;
					}

					@media (max-width: 48rem) {
						font-size: 1.7rem;
					}
				}
			}

			& .subreddits-content-body {
				& .subreddits-card {
					background: #ffffff;
					border: 0.1rem solid #e5e7eb;
					border-radius: 1.2rem;
					padding: 2.4rem;
					transition: all 0.2s ease;

					@media (max-width: 120rem) {
						padding: 2rem;
					}

					@media (max-width: 76.8rem) {
						padding: 1.5rem;
						border-radius: 1rem;
					}

					@media (max-width: 48rem) {
						padding: 1.2rem;
					}

					&:hover {
						box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.1);
						border-color: rgba(255, 69, 0, 0.2);
					}

					& .card-heading {
						display: flex;
						flex-direction: column;
						gap: 0.5rem;
						margin-bottom: 2rem;

						@media (max-width: 76.8rem) {
							margin-bottom: 1.5rem;
						}

						@media (max-width: 48rem) {
							margin-bottom: 1rem;
						}

						& p {
							font-size: 1.8rem;
							color: #6b7280;
							margin: 0;
							line-height: 1.5;
							font-weight: 500;

							@media (max-width: 120rem) {
								font-size: 1.7rem;
							}

							@media (max-width: 76.8rem) {
								font-size: 1.6rem;
							}

							@media (max-width: 48rem) {
								font-size: 1.5rem;
							}
						}
					}

					& .subreddit-list {
						display: flex;
						align-items: center;
						flex-flow: row wrap;
						gap: 1rem;
						border: 0.1rem solid #e5e7eb;
						padding: 1.5rem;
						border-radius: 0.8rem;
						min-height: max-content;
						background: #f9fafb;

						@media (max-width: 120rem) {
							padding: 1.3rem;
							gap: 0.8rem;
						}

						@media (max-width: 76.8rem) {
							padding: 1.2rem;
							gap: 0.6rem;
							border-radius: 0.6rem;
						}

						@media (max-width: 48rem) {
							padding: 1rem;
							gap: 0.5rem;
						}

						& .subreddit-item {
							background: linear-gradient(135deg, #ffffff, #f8fafc);
							padding: 0.8rem 1.2rem;
							display: flex;
							align-items: center;
							gap: 0.8rem;
							border-radius: 0.6rem;
							border: 0.1rem solid #e2e8f0;
							box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.05);
							transition: all 0.2s ease;
							cursor: pointer;

							@media (max-width: 120rem) {
								padding: 0.7rem 1rem;
								gap: 0.6rem;
							}

							@media (max-width: 76.8rem) {
								padding: 0.6rem 0.8rem;
								gap: 0.5rem;
								border-radius: 0.5rem;
							}

							@media (max-width: 48rem) {
								padding: 0.5rem 0.7rem;
								gap: 0.4rem;
							}

							&:hover {
								background: linear-gradient(135deg, #f8fafc, #f1f5f9);
								border-color: #cbd5e1;
								box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.1);
								transform: translateY(-0.1rem);
							}

							& span {
								font-size: 1.4rem;
								font-weight: 500;
								color: #374151;

								@media (max-width: 120rem) {
									font-size: 1.3rem;
								}

								@media (max-width: 76.8rem) {
									font-size: 1.2rem;
								}

								@media (max-width: 48rem) {
									font-size: 1.1rem;
								}
							}

							& svg {
								cursor: pointer;
								transition: all 0.2s ease;

								&:hover {
									transform: scale(1.1);
									fill: rgb(255, 69, 0);
								}
							}
						}

						& input {
							padding: 0.8rem 1.2rem;
							border: 0.1rem solid #d1d5db;
							border-radius: 0.6rem;
							outline: none;
							font-size: 1.4rem;
							font-weight: 500;
							color: #374151;
							background: #ffffff;
							transition: all 0.2s ease;
							min-width: 20rem;

							@media (max-width: 120rem) {
								padding: 0.7rem 1rem;
								font-size: 1.3rem;
								min-width: 18rem;
							}

							@media (max-width: 76.8rem) {
								padding: 0.6rem 0.8rem;
								font-size: 1.2rem;
								min-width: 15rem;
								border-radius: 0.5rem;
							}

							@media (max-width: 48rem) {
								padding: 0.5rem 0.7rem;
								font-size: 1.1rem;
								min-width: 12rem;
								width: 100%;
							}

							&:focus {
								border-color: rgb(255, 69, 0);
								box-shadow: 0 0 0 0.3rem rgba(255, 69, 0, 0.1);
							}

							&::placeholder {
								color: #9ca3af;
							}
						}
					}
				}

				.card-actions {
					display: flex;
					justify-content: flex-end;
					padding: 2rem 0 0 0;
					border-top: 0.1rem solid #e5e7eb;
					margin-top: 2rem;

					.save-button {
						background: linear-gradient(135deg, rgb(255, 69, 0), rgba(255, 69, 0, 0.9));
						color: white;
						border: none;
						padding: 1.2rem 2.4rem;
						border-radius: 0.8rem;
						font-size: 1.5rem;
						font-weight: 600;
						cursor: pointer;
						transition: all 0.3s ease;
						position: relative;
						overflow: hidden;
						text-transform: uppercase;
						letter-spacing: 0.05em;

						@media (max-width: 120rem) {
							padding: 1.1rem 2.2rem;
							font-size: 1.4rem;
						}

						@media (max-width: 76.8rem) {
							padding: 1rem 2rem;
							font-size: 1.3rem;
							border-radius: 0.7rem;
						}

						@media (max-width: 48rem) {
							padding: 0.9rem 1.8rem;
							font-size: 1.2rem;
							width: 100%;
						}

						&:hover:not(:disabled) {
							transform: translateY(-0.2rem);
							box-shadow: 0 0.8rem 2.5rem rgba(255, 69, 0, 0.3);
							background: linear-gradient(135deg, rgba(255, 69, 0, 0.9), rgb(255, 69, 0));
						}

						&:active:not(:disabled) {
							transform: translateY(0);
							box-shadow: 0 0.4rem 1.5rem rgba(255, 69, 0, 0.2);
						}

						&:disabled {
							background: #e5e7eb;
							color: #9ca3af;
							cursor: not-allowed;
							transform: none;
							box-shadow: none;
						}

						&::before {
							content: '';
							position: absolute;
							top: 0;
							left: -100%;
							width: 100%;
							height: 100%;
							background: linear-gradient(
								90deg,
								transparent,
								rgba(255, 255, 255, 0.2),
								transparent
							);
							transition: left 0.5s;
						}

						&:hover:not(:disabled)::before {
							left: 100%;
						}
					}
				}
			}
		}
	}
</style>
