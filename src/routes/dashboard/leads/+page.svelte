<script lang="ts">
	import { getSidebarOpenState, setSidebarOpenState } from '$lib/state.svelte';
	import { generateReply } from '../../../utils';
	import Loader from '../../Loader.svelte';
	import { getLoadingState } from '$lib/state.svelte';
	import type { Reply } from '$lib/types';

	// Props from load function
	let { data } = $props();

	let generatedReply = $state<Reply | null>(null);

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

	// Generate AI reply for a specific post
	async function handleGenerateReply(postId: string) {
		try {
			const result = await generateReply(postId);
			generatedReply = result;
		} catch (error) {
			console.error('Failed to generate reply:', error);
			alert('Failed to generate reply');
		}
	}

	// Copy reply to clipboard
	async function copyReplyToClipboard(reply: string) {
		try {
			await navigator.clipboard.writeText(reply);
			// You could add a toast notification here
			console.log('Reply copied to clipboard!');
		} catch (error) {
			console.error('Failed to copy reply:', error);
		}
	}

	// Helper function to format time
	function formatTime(createdTime: string): string {
		// Parse the ISO timestamp (which should be in UTC)
		const date = new Date(createdTime);
		const now = new Date();

		// Get UTC timestamps to avoid timezone issues
		const utcDate = Date.UTC(
			date.getUTCFullYear(),
			date.getUTCMonth(),
			date.getUTCDate(),
			date.getUTCHours(),
			date.getUTCMinutes(),
			date.getUTCSeconds()
		);
		const utcNow = Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			now.getUTCHours(),
			now.getUTCMinutes(),
			now.getUTCSeconds()
		);

		const diffInMs = utcNow - utcDate;

		// Handle invalid dates
		if (isNaN(diffInMs) || diffInMs < 0) {
			return 'Unknown time';
		}

		const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInMinutes < 1) return 'Just now';
		if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
		if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
		if (diffInDays === 1) return '1 day ago';
		if (diffInDays < 7) return `${diffInDays} days ago`;

		const diffInWeeks = Math.floor(diffInDays / 7);
		if (diffInWeeks === 1) return '1 week ago';
		if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

		const diffInMonths = Math.floor(diffInDays / 30);
		if (diffInMonths === 1) return '1 month ago';
		if (diffInMonths < 12) return `${diffInMonths} months ago`;

		const diffInYears = Math.floor(diffInDays / 365);
		if (diffInYears === 1) return '1 year ago';
		return `${diffInYears} years ago`;
	}
</script>

<section>
	<div class="leads-header">
		<h1>Leads</h1>
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
	<div class="leads-content">
		<div class="leads-content-header">
			<p>A real-time feed of your latest leads from Reddit.</p>
		</div>
		<div class="leads-content-body">
			<div class="leads-grid">
				{#if data.leads && data.leads.length > 0}
					{#each data.leads as lead}
						<div class="lead-card">
							<div class="lead-content">
								<h3 class="lead-title">{lead.title}</h3>
								<p class="lead-body">{lead.self_text || 'No content available'}</p>
							</div>

							<div class="lead-meta">
								<div class="lead-info">
									<span class="lead-author">u/{lead.author}</span>
									<span class="lead-subreddit">r/{lead.subreddit}</span>
									<span class="lead-time">{formatTime(lead.created_time)}</span>
								</div>
								<div class="lead-engagement">
									<span class="upvotes">▲ {lead.score} upvotes</span>
									<span class="comments">💬 {lead.num_comments} comments</span>
								</div>
							</div>

							<div class="lead-actions">
								<button
									class="btn-view"
									onclick={() => window.open(lead.reddit_post_url, '_blank')}
								>
									<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
										<path
											d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
										/>
									</svg>
									View on Reddit
								</button>
								{#if getLoadingState()}
									<Loader width="50%" />
								{:else}
									<button class="btn-reply" onclick={() => handleGenerateReply(lead.id)}>
										<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
											<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
										</svg>
										<span>Generate Reply</span>
									</button>
								{/if}
							</div>

							{#if generatedReply && lead.id === generatedReply.reddit_post_id}
								<div class="generated-reply">
									<h4>Generated Reply:</h4>
									<p>{generatedReply.reply_text}</p>
									<button
										class="btn-copy"
										onclick={() => copyReplyToClipboard(generatedReply?.reply_text ?? '')}
									>
										<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
											<path
												d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
											/>
										</svg>
										Copy to Clipboard
									</button>
								</div>
							{/if}
						</div>
					{/each}
				{:else}
					<div class="no-leads">
						<h3>No leads found</h3>
						<p>Your leads will appear here once they're discovered by the scheduler.</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<svelte:head>
	<title>Leads | Hurricane</title>
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

		& .leads-header {
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

			& .hamburger-icon {
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

		& .leads-content {
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

			& .leads-content-header {
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

			& .leads-content-body {
				& .leads-grid {
					display: grid;
					gap: 2rem;

					@media (max-width: 120rem) {
						gap: 1.5rem;
					}

					@media (max-width: 76.8rem) {
						gap: 1rem;
					}

					& .lead-card {
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

						& .lead-content {
							margin-bottom: 2rem;

							@media (max-width: 76.8rem) {
								margin-bottom: 1.5rem;
							}

							@media (max-width: 48rem) {
								margin-bottom: 1rem;
							}

							& .lead-title {
								font-size: 2.2rem;
								font-weight: 600;
								color: #222831;
								margin: 0 0 1rem 0;
								line-height: 1.4;

								@media (max-width: 120rem) {
									font-size: 2rem;
								}

								@media (max-width: 76.8rem) {
									font-size: 1.8rem;
									margin: 0 0 0.8rem 0;
								}

								@media (max-width: 48rem) {
									font-size: 1.6rem;
									margin: 0 0 0.6rem 0;
								}
							}

							& .lead-body {
								font-size: 1.8rem;
								color: #393e46;
								line-height: 1.6;
								margin: 0;

								@media (max-width: 120rem) {
									font-size: 1.7rem;
								}

								@media (max-width: 76.8rem) {
									font-size: 1.6rem;
									line-height: 1.5;
								}

								@media (max-width: 48rem) {
									font-size: 1.5rem;
								}
							}
						}

						& .lead-meta {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-bottom: 2rem;
							padding-bottom: 1.5rem;
							border-bottom: 0.1rem solid #f3f4f6;

							@media (max-width: 76.8rem) {
								margin-bottom: 1.5rem;
								padding-bottom: 1rem;
								flex-direction: column;
								align-items: flex-start;
								gap: 1rem;
							}

							@media (max-width: 48rem) {
								margin-bottom: 1rem;
								padding-bottom: 0.8rem;
								gap: 0.8rem;
							}

							& .lead-info {
								display: flex;
								gap: 1rem;
								font-size: 1.6rem;
								color: #6b7280;

								@media (max-width: 76.8rem) {
									font-size: 1.5rem;
									gap: 0.8rem;
									flex-wrap: wrap;
								}

								@media (max-width: 48rem) {
									font-size: 1.1rem;
									gap: 0.6rem;
								}

								& .lead-author {
									font-weight: 500;
									color: #374151;
								}

								& .lead-subreddit {
									color: rgb(255, 69, 0);
									font-weight: 500;
								}
							}

							& .lead-engagement {
								display: flex;
								gap: 1.5rem;
								font-size: 1.7rem;
								color: #6b7280;

								@media (max-width: 76.8rem) {
									font-size: 1.6rem;
									gap: 1rem;
								}

								@media (max-width: 48rem) {
									font-size: 1.5rem;
									gap: 0.8rem;
								}

								& .upvotes {
									display: flex;
									align-items: center;
									gap: 0.4rem;
								}

								& .comments {
									display: flex;
									align-items: center;
									gap: 0.4rem;
								}
							}
						}

						& .lead-actions {
							display: flex;
							gap: 1rem;
							align-items: center;

							@media (max-width: 76.8rem) {
								gap: 0.8rem;
								flex-direction: column;
							}

							@media (max-width: 48rem) {
								gap: 0.6rem;
							}

							& button {
								flex: 1;
								display: flex;
								align-items: center;
								justify-content: center;
								gap: 0.8rem;
								padding: 1.2rem 1.8rem;
								border-radius: 1rem;
								font-size: 1.8rem;
								font-weight: 600;
								cursor: pointer;
								transition: all 0.3s ease;
								border: none;
								position: relative;
								overflow: hidden;

								@media (max-width: 120rem) {
									padding: 1rem 1.5rem;
									font-size: 1.7rem;
								}

								@media (max-width: 76.8rem) {
									padding: 1.2rem 1.5rem;
									font-size: 1.6rem;
									gap: 0.6rem;
								}

								@media (max-width: 48rem) {
									padding: 1rem 1.2rem;
									font-size: 1.5rem;
									gap: 0.5rem;
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
									transition: left 0.5s ease;
								}

								&:hover::before {
									left: 100%;
								}

								&.btn-view {
									background: linear-gradient(135deg, #1e40af, #3b82f6);
									color: white;
									box-shadow: 0 0.4rem 1.2rem rgba(30, 64, 175, 0.3);

									&:hover {
										background: linear-gradient(135deg, #1e3a8a, #2563eb);
										box-shadow: 0 0.6rem 1.6rem rgba(30, 64, 175, 0.4);
										transform: translateY(-0.2rem);
									}

									&:active {
										transform: translateY(0);
									}
								}

								&.btn-reply {
									background: linear-gradient(135deg, #ffffff, #f8fafc);
									color: #374151;
									border: 0.2rem solid #e2e8f0;
									box-shadow: 0 0.2rem 8rem rgba(0, 0, 0, 0.05);

									&:hover {
										background: linear-gradient(135deg, #f8fafc, #f1f5f9);
										border-color: #cbd5e1;
										box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.1);
										transform: translateY(-0.2rem);
									}

									&:active {
										transform: translateY(0);
									}
								}
							}
						}
					}
				}

				& .no-leads {
					text-align: center;
					padding: 4rem 2rem;
					background: #f8fafc;
					border: 0.2rem dashed #cbd5e1;
					border-radius: 1.2rem;
					color: #64748b;

					@media (max-width: 76.8rem) {
						padding: 3rem 1.5rem;
					}

					@media (max-width: 48rem) {
						padding: 2rem 1rem;
					}

					& h3 {
						font-size: 2.4rem;
						font-weight: 600;
						margin: 0 0 1rem 0;
						color: #475569;

						@media (max-width: 76.8rem) {
							font-size: 2.2rem;
						}

						@media (max-width: 48rem) {
							font-size: 2rem;
						}
					}

					& p {
						font-size: 1.8rem;
						margin: 0;
						line-height: 1.5;

						@media (max-width: 76.8rem) {
							font-size: 1.7rem;
						}

						@media (max-width: 48rem) {
							font-size: 1.6rem;
						}
					}
				}

				& .generated-reply {
					margin-top: 1.5rem;
					padding: 1.5rem;
					background: #f8fafc;
					border: 0.1rem solid #e2e8f0;
					border-radius: 0.8rem;

					@media (max-width: 76.8rem) {
						margin-top: 1rem;
						padding: 1rem;
					}

					@media (max-width: 48rem) {
						margin-top: 0.8rem;
						padding: 0.8rem;
					}

					& h4 {
						font-size: 1.8rem;
						font-weight: 600;
						color: #374151;
						margin: 0 0 1rem 0;

						@media (max-width: 76.8rem) {
							font-size: 1.7rem;
						}

						@media (max-width: 48rem) {
							font-size: 1.6rem;
						}
					}

					& p {
						font-size: 1.6rem;
						color: #4b5563;
						line-height: 1.6;
						margin: 0 0 1.5rem 0;

						@media (max-width: 76.8rem) {
							font-size: 1.5rem;
						}

						@media (max-width: 48rem) {
							font-size: 1.4rem;
						}
					}

					& .btn-copy {
						display: flex;
						align-items: center;
						gap: 0.6rem;
						padding: 0.8rem 1.2rem;
						background: linear-gradient(135deg, #10b981, #059669);
						color: white;
						border: none;
						border-radius: 0.6rem;
						font-size: 1.4rem;
						font-weight: 600;
						cursor: pointer;
						transition: all 0.3s ease;

						@media (max-width: 76.8rem) {
							padding: 0.7rem 1rem;
							font-size: 1.3rem;
						}

						@media (max-width: 48rem) {
							padding: 0.6rem 0.8rem;
							font-size: 1.2rem;
						}

						&:hover {
							background: linear-gradient(135deg, #059669, #047857);
							transform: translateY(-0.1rem);
						}

						&:active {
							transform: translateY(0);
						}
					}
				}
			}
		}
	}
</style>
