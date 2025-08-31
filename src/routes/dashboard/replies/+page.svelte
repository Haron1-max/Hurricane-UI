<script lang="ts">
	import { getSidebarOpenState, setSidebarOpenState } from '$lib/state.svelte';
	import type { ReplyWithPostDetails } from '$lib/types';

	// Props from load function
	let { data }: { data: { replies: ReplyWithPostDetails[] } } = $props();

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
	<div class="replies-header">
		<h1>Replies</h1>
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
	<div class="replies-content">
		<div class="replies-content-header">
			<p>Your AI generated replies to your leads.</p>
		</div>
		<div class="replies-content-body">
			<div class="replies-grid">
				{#if data.replies && data.replies.length > 0}
					{#each data.replies as reply}
						<div class="reply-card">
							<div class="reply-original-lead">
								<h3 class="lead-title">{reply.post_title}</h3>
								<div class="lead-meta">
									<span class="lead-subreddit">r/{reply.post_subreddit}</span>
									<span class="lead-time">{formatTime(reply.post_created_time)}</span>
								</div>
							</div>

							<div class="reply-content">
								<h4 class="reply-label">Generated Reply:</h4>
								<p class="reply-text">{reply.reply_text}</p>
							</div>

							<div class="reply-footer">
								<div class="reply-status">
									<span class="generated-time">Generated {formatTime(reply.reply_created_at)}</span>
								</div>
								<div class="reply-actions">
									<button
										class="btn-view"
										onclick={() =>
											window.open(`https://reddit.com${reply.post_permalink}`, '_blank')}
									>
										<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
											<path
												d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
											/>
										</svg>
										View Original
									</button>
									<button class="btn-edit">
										<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
										</svg>
										Edit Reply
									</button>
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<div class="no-replies">
						<h3>No replies found</h3>
						<p>
							Your AI-generated replies will appear here once you start generating them from your
							leads.
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<svelte:head>
	<title>Replies | Hurricane</title>
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

		& .replies-header {
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

		& .replies-content {
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

			& .replies-content-header {
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

			& .replies-content-body {
				& .replies-grid {
					display: grid;
					gap: 2rem;

					@media (max-width: 120rem) {
						gap: 1.5rem;
					}

					@media (max-width: 76.8rem) {
						gap: 1rem;
					}

					& .reply-card {
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

						& .reply-original-lead {
							margin-bottom: 2rem;
							padding-bottom: 1.5rem;
							border-bottom: 0.1rem solid #f3f4f6;

							@media (max-width: 76.8rem) {
								margin-bottom: 1.5rem;
								padding-bottom: 1rem;
							}

							@media (max-width: 48rem) {
								margin-bottom: 1rem;
								padding-bottom: 0.8rem;
							}

							& .lead-title {
								font-size: 2rem;
								font-weight: 600;
								color: #222831;
								margin: 0 0 1rem 0;
								line-height: 1.4;

								@media (max-width: 120rem) {
									font-size: 1.8rem;
								}

								@media (max-width: 76.8rem) {
									font-size: 1.6rem;
									margin: 0 0 0.8rem 0;
								}

								@media (max-width: 48rem) {
									font-size: 1.5rem;
									margin: 0 0 0.6rem 0;
								}
							}

							& .lead-meta {
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
									font-size: 1.4rem;
									gap: 0.6rem;
								}

								& .lead-subreddit {
									color: rgb(255, 69, 0);
									font-weight: 500;
								}
							}
						}

						& .reply-content {
							margin-bottom: 2rem;

							@media (max-width: 76.8rem) {
								margin-bottom: 1.5rem;
							}

							@media (max-width: 48rem) {
								margin-bottom: 1rem;
							}

							& .reply-label {
								font-size: 1.8rem;
								font-weight: 600;
								color: #222831;
								margin: 0 0 1rem 0;

								@media (max-width: 120rem) {
									font-size: 1.7rem;
								}

								@media (max-width: 76.8rem) {
									font-size: 1.6rem;
									margin: 0 0 0.8rem 0;
								}

								@media (max-width: 48rem) {
									font-size: 1.5rem;
									margin: 0 0 0.6rem 0;
								}
							}

							& .reply-text {
								font-size: 1.8rem;
								color: #393e46;
								line-height: 1.6;
								margin: 0;
								background: #f9fafb;
								padding: 1.5rem;
								border-radius: 0.8rem;
								border-left: 0.4rem solid rgb(255, 69, 0);

								@media (max-width: 120rem) {
									font-size: 1.7rem;
									padding: 1.3rem;
								}

								@media (max-width: 76.8rem) {
									font-size: 1.6rem;
									padding: 1.2rem;
									line-height: 1.5;
								}

								@media (max-width: 48rem) {
									font-size: 1.5rem;
									padding: 1rem;
									border-radius: 0.6rem;
								}
							}
						}

						& .reply-footer {
							background: #f8fafc;
							border-radius: 1rem;
							padding: 1.8rem;
							margin-top: 2rem;
							border: 0.1rem solid #e2e8f0;

							@media (max-width: 120rem) {
								padding: 1.5rem;
								margin-top: 1.5rem;
							}

							@media (max-width: 76.8rem) {
								padding: 1.3rem;
								margin-top: 1.2rem;
								border-radius: 0.8rem;
							}

							@media (max-width: 48rem) {
								padding: 1rem;
								margin-top: 1rem;
							}

							& .reply-status {
								display: flex;
								align-items: center;
								gap: 1.2rem;
								margin-bottom: 1.5rem;

								@media (max-width: 76.8rem) {
									gap: 1rem;
									margin-bottom: 1.2rem;
									flex-direction: column;
									align-items: flex-start;
								}

								@media (max-width: 48rem) {
									gap: 0.8rem;
									margin-bottom: 1rem;
								}

								& .generated-time {
									font-size: 1.7rem;
									color: #64748b;
									font-weight: 500;
									display: flex;
									align-items: center;
									gap: 0.5rem;

									@media (max-width: 76.8rem) {
										font-size: 1.6rem;
										gap: 0.4rem;
									}

									@media (max-width: 48rem) {
										font-size: 1.5rem;
										gap: 0.3rem;
									}

									&::before {
										content: '🕒';
										font-size: 1.2rem;
									}
								}
							}

							& .reply-actions {
								display: flex;
								gap: 1.2rem;

								@media (max-width: 76.8rem) {
									gap: 1rem;
									flex-direction: column;
								}

								@media (max-width: 48rem) {
									gap: 0.8rem;
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

									&.btn-edit {
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
				}

				& .no-replies {
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
			}
		}
	}
</style>
