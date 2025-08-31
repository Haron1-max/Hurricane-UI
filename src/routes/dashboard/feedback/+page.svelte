<script lang="ts">
	import {
		getSidebarOpenState,
		setSidebarOpenState,
		getLoadingState,
		showToast
	} from '$lib/state.svelte';
	import { createFeedback } from '../../../utils';
	import Loader from '../../Loader.svelte';

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

	// Feedback form state
	let feedbackMessage = $state<string>('');
	let feedbackType = $state<string>('general'); // 'general', 'bug', 'feature'

	async function submitFeedback() {
		if (!feedbackMessage.trim()) {
			showToast('Please enter your feedback before submitting.', 'error');
			return;
		}

		await createFeedback(feedbackType, feedbackMessage);

		feedbackMessage = '';
		feedbackType = 'general';
	}
</script>

<section>
	<div class="feedback-header">
		<h1>Feedback</h1>
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
	<div class="feedback-content">
		<div class="feedback-content-header">
			<div class="header-content">
				<div class="header-icon">🌟</div>
				<h2>Help us make Hurricane even better!</h2>
				<p>
					Your feedback is invaluable to us. Share your thoughts, report bugs, or request new
					features - every suggestion helps us improve.
				</p>
			</div>
		</div>
		<div class="feedback-content-body">
			<div class="feedback-card">
				<div class="card-header">
					<div class="header-decoration">
						<div class="decoration-line"></div>
						<div class="decoration-dot"></div>
						<div class="decoration-line"></div>
					</div>
					<p>
						We'd love to hear from you! Your feedback helps us make Hurricane better for everyone.
					</p>
				</div>
				<div class="feedback-form">
					<div class="feedback-type-selector">
						<span class="selector-label">What type of feedback is this?</span>
						<div class="type-options">
							<label class="type-option">
								<input type="radio" name="feedbackType" value="general" bind:group={feedbackType} />
								<span class="option-content">
									<span class="option-icon">💭</span>
									<span class="option-text">General Feedback</span>
								</span>
							</label>
							<label class="type-option">
								<input type="radio" name="feedbackType" value="bug" bind:group={feedbackType} />
								<span class="option-content">
									<span class="option-icon">🐛</span>
									<span class="option-text">Bug Report</span>
								</span>
							</label>
							<label class="type-option">
								<input type="radio" name="feedbackType" value="feature" bind:group={feedbackType} />
								<span class="option-content">
									<span class="option-icon">✨</span>
									<span class="option-text">Feature Request</span>
								</span>
							</label>
						</div>
					</div>
					<div class="feedback-textarea">
						<label for="feedbackMessage">Your Feedback</label>
						<textarea
							id="feedbackMessage"
							bind:value={feedbackMessage}
							placeholder="Tell us what you think! Share your experience, report issues, or suggest improvements..."
							rows="8"
						></textarea>
						<div class="character-count">
							{feedbackMessage.length} characters
						</div>
					</div>
					{#if getLoadingState()}
						<Loader width="100%" />
					{:else}
						<button class="btn-submit" onclick={submitFeedback}>
							<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
								<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
							</svg>
							Send Feedback
						</button>
					{/if}
				</div>
			</div>

			<div class="feedback-tips">
				<div class="tips-header">
					<div class="tips-icon">💡</div>
					<h4>Tips for Great Feedback</h4>
					<p>Follow these guidelines to help us understand and act on your feedback quickly.</p>
				</div>
				<div class="tips-content">
					<div class="tip">
						<span class="tip-icon">🎯</span>
						<span class="tip-text">Be specific about what you're experiencing or requesting</span>
					</div>
					<div class="tip">
						<span class="tip-icon">📝</span>
						<span class="tip-text">Include steps to reproduce if reporting a bug</span>
					</div>
					<div class="tip">
						<span class="tip-icon">💡</span>
						<span class="tip-text">Explain how your suggestion would help you and others</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<svelte:head>
	<title>Feedback | Hurricane</title>
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

		& .feedback-header {
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

		& .feedback-content {
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

			& .feedback-content-header {
				display: flex;
				justify-content: center;
				margin-bottom: 1rem;

				@media (max-width: 76.8rem) {
					margin-bottom: 0.5rem;
				}

				& .header-content {
					text-align: center;
					max-width: 60rem;
					padding: 3rem;
					background: linear-gradient(135deg, rgba(255, 69, 0, 0.05), rgba(255, 140, 66, 0.05));
					border-radius: 2rem;
					border: 0.1rem solid rgba(255, 69, 0, 0.1);
					position: relative;
					overflow: hidden;

					@media (max-width: 120rem) {
						padding: 2.5rem;
						max-width: 50rem;
					}

					@media (max-width: 76.8rem) {
						padding: 2rem;
						max-width: 40rem;
						border-radius: 1.5rem;
					}

					@media (max-width: 48rem) {
						padding: 1.5rem;
						max-width: 100%;
						border-radius: 1rem;
					}

					&::before {
						content: '';
						position: absolute;
						top: -50%;
						left: -50%;
						width: 200%;
						height: 200%;
						background: radial-gradient(circle, rgba(255, 69, 0, 0.03) 0%, transparent 70%);
						animation: float 6s ease-in-out infinite;
					}

					& .header-icon {
						font-size: 4rem;
						margin-bottom: 1.5rem;
						animation: bounce 2s ease-in-out infinite;

						@media (max-width: 120rem) {
							font-size: 3.5rem;
						}

						@media (max-width: 76.8rem) {
							font-size: 3rem;
							margin-bottom: 1rem;
						}

						@media (max-width: 48rem) {
							font-size: 2.5rem;
							margin-bottom: 0.8rem;
						}
					}

					& h2 {
						font-size: 2.8rem;
						font-weight: 700;
						color: #222831;
						margin: 0 0 1.5rem 0;
						background: linear-gradient(135deg, #222831, #374151);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
						background-clip: text;

						@media (max-width: 120rem) {
							font-size: 2.5rem;
						}

						@media (max-width: 76.8rem) {
							font-size: 2.2rem;
							margin-bottom: 1rem;
						}

						@media (max-width: 48rem) {
							font-size: 1.8rem;
							margin-bottom: 0.8rem;
						}
					}

					& p {
						font-size: 2rem;
						color: #6b7280;
						font-weight: 500;
						margin: 0;
						line-height: 1.5;
						position: relative;
						z-index: 1;

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
			}

			& .feedback-content-body {
				display: flex;
				flex-direction: column;
				gap: 2rem;

				@media (max-width: 76.8rem) {
					gap: 1.5rem;
				}

				@media (max-width: 48rem) {
					gap: 1rem;
				}

				& .feedback-card {
					background: linear-gradient(135deg, #ffffff, #fafbfc);
					border: 0.1rem solid #e5e7eb;
					border-radius: 1.6rem;
					padding: 3rem;
					transition: all 0.3s ease;
					position: relative;
					overflow: hidden;

					@media (max-width: 120rem) {
						padding: 2.5rem;
					}

					@media (max-width: 76.8rem) {
						padding: 2rem;
						border-radius: 1.2rem;
					}

					@media (max-width: 48rem) {
						padding: 1.5rem;
						border-radius: 1rem;
					}

					&::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						height: 0.4rem;
						background: linear-gradient(90deg, rgb(255, 69, 0), #ff8c42, rgb(255, 69, 0));
						background-size: 200% 100%;
						animation: shimmer 3s ease-in-out infinite;
					}

					&:hover {
						box-shadow: 0 0.8rem 3.2rem rgba(0, 0, 0, 0.12);
						border-color: rgba(255, 69, 0, 0.3);
						transform: translateY(-0.2rem);
					}

					& .card-header {
						margin-bottom: 2.5rem;
						text-align: center;

						@media (max-width: 76.8rem) {
							margin-bottom: 2rem;
						}

						@media (max-width: 48rem) {
							margin-bottom: 1.5rem;
						}

						& .header-decoration {
							display: flex;
							align-items: center;
							justify-content: center;
							margin-bottom: 1.5rem;
							gap: 1rem;

							@media (max-width: 76.8rem) {
								margin-bottom: 1rem;
								gap: 0.8rem;
							}

							@media (max-width: 48rem) {
								margin-bottom: 0.8rem;
								gap: 0.6rem;
							}

							& .decoration-line {
								width: 4rem;
								height: 0.2rem;
								background: linear-gradient(90deg, transparent, rgba(255, 69, 0, 0.3), transparent);

								@media (max-width: 76.8rem) {
									width: 3rem;
								}

								@media (max-width: 48rem) {
									width: 2rem;
								}
							}

							& .decoration-dot {
								width: 0.8rem;
								height: 0.8rem;
								background: rgb(255, 69, 0);
								border-radius: 50%;
								animation: pulse 2s ease-in-out infinite;

								@media (max-width: 48rem) {
									width: 0.6rem;
									height: 0.6rem;
								}
							}
						}

						& p {
							font-size: 1.9rem;
							color: #6b7280;
							margin: 0;
							line-height: 1.6;
							font-weight: 500;

							@media (max-width: 120rem) {
								font-size: 1.8rem;
							}

							@media (max-width: 76.8rem) {
								font-size: 1.7rem;
							}

							@media (max-width: 48rem) {
								font-size: 1.6rem;
							}
						}
					}

					& .feedback-form {
						display: flex;
						flex-direction: column;
						gap: 2rem;

						@media (max-width: 76.8rem) {
							gap: 1.5rem;
						}

						@media (max-width: 48rem) {
							gap: 1rem;
						}

						& .feedback-type-selector {
							display: flex;
							flex-direction: column;
							gap: 1rem;

							@media (max-width: 76.8rem) {
								gap: 0.8rem;
							}

							@media (max-width: 48rem) {
								gap: 0.6rem;
							}

							& .selector-label {
								font-size: 1.8rem;
								font-weight: 600;
								color: #222831;

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

							& .type-options {
								display: flex;
								gap: 1rem;
								flex-wrap: wrap;

								@media (max-width: 76.8rem) {
									gap: 0.8rem;
								}

								@media (max-width: 48rem) {
									gap: 0.6rem;
									flex-direction: column;
								}

								& .type-option {
									flex: 1;
									min-width: 15rem;
									cursor: pointer;

									@media (max-width: 48rem) {
										min-width: auto;
									}

									& input[type='radio'] {
										display: none;
									}

									& .option-content {
										display: flex;
										align-items: center;
										gap: 1rem;
										padding: 1.5rem 2rem;
										border: 0.2rem solid #e2e8f0;
										border-radius: 1rem;
										background: linear-gradient(135deg, #ffffff, #f8fafc);
										transition: all 0.3s ease;
										text-align: center;
										justify-content: center;
										position: relative;
										overflow: hidden;

										@media (max-width: 120rem) {
											padding: 1.2rem 1.5rem;
											gap: 0.8rem;
										}

										@media (max-width: 76.8rem) {
											padding: 1rem 1.2rem;
											gap: 0.6rem;
											border-radius: 0.8rem;
										}

										@media (max-width: 48rem) {
											padding: 0.8rem 1rem;
											gap: 0.5rem;
											border-radius: 0.6rem;
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
												rgba(255, 255, 255, 0.4),
												transparent
											);
											transition: left 0.5s ease;
										}

										&:hover {
											border-color: #cbd5e1;
											background: linear-gradient(135deg, #f8fafc, #f1f5f9);
											transform: translateY(-0.2rem);
											box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.1);

											&::before {
												left: 100%;
											}
										}

										& .option-icon {
											font-size: 1.6rem;

											@media (max-width: 120rem) {
												font-size: 1.5rem;
											}

											@media (max-width: 76.8rem) {
												font-size: 1.4rem;
											}

											@media (max-width: 48rem) {
												font-size: 1.3rem;
											}
										}

										& .option-text {
											font-size: 1.7rem;
											font-weight: 500;
											color: #374151;

											@media (max-width: 120rem) {
												font-size: 1.6rem;
											}

											@media (max-width: 76.8rem) {
												font-size: 1.5rem;
											}

											@media (max-width: 48rem) {
												font-size: 1.4rem;
											}
										}
									}

									& input[type='radio']:checked + .option-content {
										border-color: rgb(255, 69, 0);
										background: rgba(255, 69, 0, 0.05);
										box-shadow: 0 0 0 0.3rem rgba(255, 69, 0, 0.1);

										& .option-text {
											color: rgb(255, 69, 0);
											font-weight: 600;
										}
									}
								}
							}
						}

						& .feedback-textarea {
							display: flex;
							flex-direction: column;
							gap: 0.8rem;
							position: relative;

							@media (max-width: 76.8rem) {
								gap: 0.6rem;
							}

							@media (max-width: 48rem) {
								gap: 0.5rem;
							}

							& label {
								font-size: 1.8rem;
								font-weight: 600;
								color: #222831;

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

							& textarea {
								width: 100%;
								padding: 2rem;
								border: 0.2rem solid #e2e8f0;
								border-radius: 1.2rem;
								font-size: 1.8rem;
								color: #374151;
								background: linear-gradient(135deg, #ffffff, #fafbfc);
								transition: all 0.3s ease;
								resize: vertical;
								min-height: 22rem;
								font-family: inherit;
								line-height: 1.7;
								position: relative;

								@media (max-width: 120rem) {
									padding: 1.8rem;
									font-size: 1.7rem;
									min-height: 20rem;
								}

								@media (max-width: 76.8rem) {
									padding: 1.5rem;
									font-size: 1.6rem;
									min-height: 18rem;
									border-radius: 1rem;
								}

								@media (max-width: 48rem) {
									padding: 1.2rem;
									font-size: 1.5rem;
									min-height: 16rem;
									border-radius: 0.8rem;
								}

								&:focus {
									outline: none;
									border-color: rgb(255, 69, 0);
									box-shadow:
										0 0 0 0.4rem rgba(255, 69, 0, 0.1),
										0 0.4rem 1.2rem rgba(0, 0, 0, 0.05);
									background: #ffffff;
									transform: translateY(-0.1rem);
								}

								&:hover {
									border-color: #cbd5e1;
									box-shadow: 0 0.2rem 8rem rgba(0, 0, 0, 0.05);
								}

								&::placeholder {
									color: #9ca3af;
									font-weight: 400;
									font-style: italic;
								}
							}

							& .character-count {
								position: absolute;
								bottom: 1rem;
								right: 1rem;
								font-size: 1.6rem;
								color: #9ca3af;
								background: rgba(255, 255, 255, 0.9);
								padding: 0.2rem 0.6rem;
								border-radius: 0.4rem;
								pointer-events: none;

								@media (max-width: 120rem) {
									font-size: 1.5rem;
									padding: 0.2rem 0.5rem;
								}

								@media (max-width: 76.8rem) {
									font-size: 1.4rem;
									padding: 0.1rem 0.4rem;
									border-radius: 0.3rem;
								}

								@media (max-width: 48rem) {
									font-size: 1.3rem;
									padding: 0.1rem 0.3rem;
									border-radius: 0.2rem;
								}
							}
						}

						& .btn-submit {
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 0.8rem;
							padding: 1.4rem 2.4rem;
							background: linear-gradient(135deg, #1e40af, #3b82f6);
							color: white;
							border: none;
							border-radius: 1rem;
							font-size: 1.8rem;
							font-weight: 600;
							cursor: pointer;
							transition: all 0.3s ease;
							position: relative;
							overflow: hidden;

							@media (max-width: 120rem) {
								padding: 1.2rem 2rem;
								font-size: 1.7rem;
							}

							@media (max-width: 76.8rem) {
								padding: 1rem 1.5rem;
								font-size: 1.6rem;
								border-radius: 0.8rem;
							}

							@media (max-width: 48rem) {
								padding: 0.8rem 1.2rem;
								font-size: 1.5rem;
								border-radius: 0.6rem;
							}

							&:disabled {
								background: #9ca3af;
								cursor: not-allowed;
								transform: none;
								box-shadow: none;

								&::before {
									display: none;
								}
							}

							&:not(:disabled)::before {
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

							&:not(:disabled):hover {
								background: linear-gradient(135deg, #1e3a8a, #2563eb);
								transform: translateY(-0.2rem);
								box-shadow: 0 0.6rem 1.6rem rgba(30, 64, 175, 0.4);

								&::before {
									left: 100%;
								}
							}

							&:not(:disabled):active {
								transform: translateY(0);
							}
						}
					}
				}

				& .feedback-tips {
					background: linear-gradient(135deg, #f8fafc, #f1f5f9);
					border: 0.1rem solid #e2e8f0;
					border-radius: 1.6rem;
					padding: 2.5rem;
					position: relative;
					overflow: hidden;

					@media (max-width: 120rem) {
						padding: 2rem;
					}

					@media (max-width: 76.8rem) {
						padding: 1.5rem;
						border-radius: 1.2rem;
					}

					@media (max-width: 48rem) {
						padding: 1.2rem;
						border-radius: 1rem;
					}

					&::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						height: 0.3rem;
						background: linear-gradient(90deg, #10b981, #34d399, #10b981);
						background-size: 200% 100%;
						animation: shimmer 4s ease-in-out infinite;
					}

					& .tips-header {
						margin-bottom: 2rem;
						text-align: center;

						@media (max-width: 76.8rem) {
							margin-bottom: 1.5rem;
						}

						@media (max-width: 48rem) {
							margin-bottom: 1rem;
						}

						& .tips-icon {
							font-size: 3rem;
							margin-bottom: 1rem;
							animation: wiggle 3s ease-in-out infinite;

							@media (max-width: 120rem) {
								font-size: 2.5rem;
							}

							@media (max-width: 76.8rem) {
								font-size: 2rem;
								margin-bottom: 0.8rem;
							}

							@media (max-width: 48rem) {
								font-size: 1.8rem;
								margin-bottom: 0.6rem;
							}
						}

						& h4 {
							font-size: 2.2rem;
							font-weight: 600;
							color: #222831;
							margin: 0 0 0.8rem 0;

							@media (max-width: 120rem) {
								font-size: 2rem;
							}

							@media (max-width: 76.8rem) {
								font-size: 1.8rem;
							}

							@media (max-width: 48rem) {
								font-size: 1.6rem;
							}
						}

						& p {
							font-size: 1.8rem;
							color: #6b7280;
							margin: 0;
							line-height: 1.5;

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

					& .tips-content {
						display: flex;
						flex-direction: column;
						gap: 1rem;

						@media (max-width: 76.8rem) {
							gap: 0.8rem;
						}

						@media (max-width: 48rem) {
							gap: 0.6rem;
						}

						& .tip {
							display: flex;
							align-items: center;
							gap: 1.2rem;
							padding: 1.5rem;
							background: linear-gradient(135deg, #ffffff, #fafbfc);
							border-radius: 1rem;
							border: 0.1rem solid #e2e8f0;
							transition: all 0.3s ease;
							position: relative;
							overflow: hidden;

							@media (max-width: 120rem) {
								padding: 1.3rem;
								gap: 1rem;
							}

							@media (max-width: 76.8rem) {
								padding: 1.2rem;
								gap: 0.8rem;
								border-radius: 0.8rem;
							}

							@media (max-width: 48rem) {
								padding: 1rem;
								gap: 0.6rem;
								border-radius: 0.6rem;
							}

							&::before {
								content: '';
								position: absolute;
								top: 0;
								left: 0;
								width: 0.4rem;
								height: 100%;
								background: linear-gradient(180deg, #10b981, #34d399);
								transform: scaleY(0);
								transition: transform 0.3s ease;
							}

							&:hover {
								transform: translateY(-0.2rem);
								box-shadow: 0 0.4rem 1.6rem rgba(0, 0, 0, 0.1);
								border-color: #d1d5db;

								&::before {
									transform: scaleY(1);
								}
							}

							& .tip-icon {
								font-size: 1.4rem;
								flex-shrink: 0;

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

							& .tip-text {
								font-size: 1.7rem;
								color: #6b7280;
								line-height: 1.5;

								@media (max-width: 120rem) {
									font-size: 1.6rem;
								}

								@media (max-width: 76.8rem) {
									font-size: 1.5rem;
								}

								@media (max-width: 48rem) {
									font-size: 1.4rem;
								}
							}
						}
					}
				}
			}
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0rem) rotate(0deg);
		}
		50% {
			transform: translateY(-1rem) rotate(180deg);
		}
	}

	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-1rem);
		}
		60% {
			transform: translateY(-0.5rem);
		}
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.2);
			opacity: 0.8;
		}
	}

	@keyframes wiggle {
		0%,
		7% {
			transform: rotateZ(0);
		}
		15% {
			transform: rotateZ(-15deg);
		}
		20% {
			transform: rotateZ(10deg);
		}
		25% {
			transform: rotateZ(-10deg);
		}
		30% {
			transform: rotateZ(6deg);
		}
		35% {
			transform: rotateZ(-4deg);
		}
		40%,
		100% {
			transform: rotateZ(0);
		}
	}
</style>
