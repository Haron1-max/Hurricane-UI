<script lang="ts">
	import { getSidebarOpenState, setSidebarOpenState, getLoadingState } from '$lib/state.svelte';
	import { createContact } from '../../../utils';
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

	// Contact form state
	let contactName = $state<string>('');
	let contactEmail = $state<string>('');
	let contactSubject = $state<string>('');
	let contactMessage = $state<string>('');

	// FAQ state
	let openFaqIndex = $state<number | null>(null);

	// FAQ data
	const faqs = [
		{
			question: 'How does Hurricane find relevant leads?',
			answer:
				'Hurricane uses AI to scan Reddit posts in your specified subreddits and matches them against your keywords. It analyzes post content, engagement, and relevance to find the best leads for your business.'
		},
		{
			question: 'How often are leads updated?',
			answer:
				'Leads are updated in real-time as new posts are made on Reddit. You can also manually refresh to get the latest results.'
		},
		{
			question: 'Can I customize my keyword matching?',
			answer:
				'Yes! You can add, edit, or remove keywords at any time from the Keywords page. The more specific your keywords, the better your leads will be.'
		},
		{
			question: 'What subreddits should I target?',
			answer:
				'Focus on subreddits where your target audience actively discusses problems your product solves. Popular business subreddits include r/entrepreneur, r/smallbusiness, and industry-specific ones.'
		},
		{
			question: 'How do I generate replies to leads?',
			answer:
				'Click the "Generate Reply" button on any lead card. Our AI will create a personalized, helpful response that you can edit before sending.'
		},
		{
			question: 'Is my data secure?',
			answer:
				'Absolutely. We use industry-standard encryption and never share your data with third parties. Your Reddit credentials are never stored.'
		}
	];

	function toggleFaq(index: number) {
		openFaqIndex = openFaqIndex === index ? null : index;
	}

	async function submitContact() {
		await createContact(contactName, contactEmail, contactSubject, contactMessage);

		// Reset form
		contactName = '';
		contactEmail = '';
		contactSubject = '';
		contactMessage = '';
	}
</script>

<section>
	<div class="help-header">
		<h1>Help & Support</h1>
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
	<div class="help-content">
		<div class="help-content-header">
			<div class="header-content">
				<div class="header-icon">🎯</div>
				<h2>We're here to help you succeed!</h2>
				<p>
					Get the most out of Hurricane with our comprehensive help resources. From quick start
					guides to detailed FAQs, we've got everything you need.
				</p>
			</div>
		</div>
		<div class="help-content-body">
			<!-- Quick Start Guide -->
			<div class="help-card">
				<div class="card-header">
					<div class="header-decoration">
						<div class="decoration-line"></div>
						<div class="decoration-dot"></div>
						<div class="decoration-line"></div>
					</div>
					<h3>🚀 Quick Start Guide</h3>
					<p>Get up and running with Hurricane in minutes.</p>
				</div>
				<div class="quick-start-steps">
					<div class="step">
						<div class="step-number">1</div>
						<div class="step-content">
							<h4>Add Subreddits</h4>
							<p>Go to Subreddits page and add communities where your target audience hangs out.</p>
						</div>
					</div>
					<div class="step">
						<div class="step-number">2</div>
						<div class="step-content">
							<h4>Set Keywords</h4>
							<p>Add keywords that people use when they need your product or service.</p>
						</div>
					</div>
					<div class="step">
						<div class="step-number">3</div>
						<div class="step-content">
							<h4>Find Leads</h4>
							<p>Check your Leads page to see relevant Reddit posts that match your criteria.</p>
						</div>
					</div>
					<div class="step">
						<div class="step-number">4</div>
						<div class="step-content">
							<h4>Generate Replies</h4>
							<p>Use AI to create personalized responses and engage with potential customers.</p>
						</div>
					</div>
				</div>
			</div>

			<!-- FAQ Section -->
			<div class="help-card">
				<div class="card-header">
					<div class="header-decoration">
						<div class="decoration-line"></div>
						<div class="decoration-dot"></div>
						<div class="decoration-line"></div>
					</div>
					<h3>❓ Frequently Asked Questions</h3>
					<p>Find answers to common questions about Hurricane.</p>
				</div>
				<div class="faq-list">
					{#each faqs as faq, index}
						<div class="faq-item" class:open={openFaqIndex === index}>
							<button class="faq-question" onclick={() => toggleFaq(index)}>
								<span>{faq.question}</span>
								<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
									<path d="M7 10l5 5 5-5z" />
								</svg>
							</button>
							<div class="faq-answer">
								<p>{faq.answer}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Contact Form -->
			<div class="help-card">
				<div class="card-header">
					<div class="header-decoration">
						<div class="decoration-line"></div>
						<div class="decoration-dot"></div>
						<div class="decoration-line"></div>
					</div>
					<h3>📧 Contact Us</h3>
					<p>Can't find what you're looking for? Send us a message and we'll help you out.</p>
				</div>
				<div class="contact-form">
					<div class="form-row">
						<div class="form-group">
							<label for="contactName">Name</label>
							<input
								type="text"
								id="contactName"
								bind:value={contactName}
								placeholder="Your full name"
							/>
						</div>
						<div class="form-group">
							<label for="contactEmail">Email</label>
							<input
								type="email"
								id="contactEmail"
								bind:value={contactEmail}
								placeholder="your.email@example.com"
							/>
						</div>
					</div>
					<div class="form-group">
						<label for="contactSubject">Subject</label>
						<input
							type="text"
							id="contactSubject"
							bind:value={contactSubject}
							placeholder="What's this about?"
						/>
					</div>
					<div class="form-group">
						<label for="contactMessage">Message</label>
						<textarea
							id="contactMessage"
							bind:value={contactMessage}
							placeholder="Tell us how we can help you..."
							rows="5"
						></textarea>
					</div>
					{#if getLoadingState()}
						<Loader width="100%" />
					{:else}
						<button class="btn-send" onclick={submitContact}>
							<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
								<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
							</svg>
							Send Message
						</button>
					{/if}
				</div>
			</div>

			<!-- Resources -->
			<div class="help-card">
				<div class="card-header">
					<div class="header-decoration">
						<div class="decoration-line"></div>
						<div class="decoration-dot"></div>
						<div class="decoration-line"></div>
					</div>
					<h3>📚 Additional Resources</h3>
					<p>Learn more about getting the most out of Hurricane.</p>
				</div>
				<div class="resources-grid">
					<div class="resource-item">
						<div class="resource-icon">📖</div>
						<h4>User Guide</h4>
						<p>Complete guide to all Hurricane features and best practices.</p>
						<button class="btn-resource">Read Guide</button>
					</div>
					<div class="resource-item">
						<div class="resource-icon">🎥</div>
						<h4>Video Tutorials</h4>
						<p>Step-by-step video tutorials for common tasks.</p>
						<button class="btn-resource">Watch Videos</button>
					</div>
					<div class="resource-item">
						<div class="resource-icon">💡</div>
						<h4>Tips & Tricks</h4>
						<p>Pro tips to maximize your lead generation success.</p>
						<button class="btn-resource">Learn More</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<svelte:head>
	<title>Help | Hurricane</title>
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

		& .help-header {
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

		& .help-content {
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

			& .help-content-header {
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

			& .help-content-body {
				display: flex;
				flex-direction: column;
				gap: 2rem;

				@media (max-width: 76.8rem) {
					gap: 1.5rem;
				}

				@media (max-width: 48rem) {
					gap: 1rem;
				}

				& .help-card {
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

						& h3 {
							font-size: 1.8rem;
							font-weight: 600;
							color: #222831;
							margin: 0 0 0.5rem 0;

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

						& p {
							font-size: 1.8rem;
							color: #6b7280;
							margin: 0;

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

					& .quick-start-steps {
						display: flex;
						flex-direction: column;
						gap: 1.5rem;

						@media (max-width: 76.8rem) {
							gap: 1.2rem;
						}

						@media (max-width: 48rem) {
							gap: 1rem;
						}

						& .step {
							display: flex;
							align-items: flex-start;
							gap: 1.5rem;
							padding: 2rem;
							background: linear-gradient(135deg, #f8fafc, #f1f5f9);
							border-radius: 1.2rem;
							border: 0.1rem solid #e2e8f0;
							transition: all 0.3s ease;
							position: relative;
							overflow: hidden;

							@media (max-width: 120rem) {
								padding: 1.8rem;
								gap: 1.2rem;
							}

							@media (max-width: 76.8rem) {
								padding: 1.5rem;
								gap: 1rem;
								border-radius: 1rem;
							}

							@media (max-width: 48rem) {
								padding: 1.2rem;
								gap: 0.8rem;
								flex-direction: column;
								align-items: center;
								text-align: center;
							}

							&::before {
								content: '';
								position: absolute;
								top: 0;
								left: 0;
								width: 0.4rem;
								height: 100%;
								background: linear-gradient(180deg, rgb(255, 69, 0), #ff8c42);
								transform: scaleY(0);
								transition: transform 0.3s ease;
							}

							&:hover {
								background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
								transform: translateY(-0.3rem);
								box-shadow: 0 0.6rem 2rem rgba(0, 0, 0, 0.1);

								&::before {
									transform: scaleY(1);
								}
							}

							& .step-number {
								width: 3.5rem;
								height: 3.5rem;
								background: linear-gradient(135deg, rgb(255, 69, 0), #ff8c42);
								color: white;
								border-radius: 50%;
								display: flex;
								align-items: center;
								justify-content: center;
								font-size: 1.6rem;
								font-weight: 700;
								flex-shrink: 0;
								box-shadow: 0 0.4rem 1.2rem rgba(255, 69, 0, 0.3);
								transition: all 0.3s ease;

								@media (max-width: 120rem) {
									width: 3rem;
									height: 3rem;
									font-size: 1.4rem;
								}

								@media (max-width: 76.8rem) {
									width: 2.8rem;
									height: 2.8rem;
									font-size: 1.3rem;
								}

								@media (max-width: 48rem) {
									width: 2.5rem;
									height: 2.5rem;
									font-size: 1.2rem;
								}
							}

							&:hover .step-number {
								transform: scale(1.1);
								box-shadow: 0 0.6rem 1.6rem rgba(255, 69, 0, 0.4);
							}

							& .step-content {
								& h4 {
									font-size: 2rem;
									font-weight: 600;
									color: #222831;
									margin: 0 0 0.8rem 0;

									@media (max-width: 120rem) {
										font-size: 1.8rem;
									}

									@media (max-width: 76.8rem) {
										font-size: 1.6rem;
									}

									@media (max-width: 48rem) {
										font-size: 1.5rem;
									}
								}

								& p {
									font-size: 1.8rem;
									color: #6b7280;
									margin: 0;
									line-height: 1.6;

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
						}
					}

					& .faq-list {
						display: flex;
						flex-direction: column;
						gap: 1rem;

						@media (max-width: 76.8rem) {
							gap: 0.8rem;
						}

						@media (max-width: 48rem) {
							gap: 0.6rem;
						}

						& .faq-item {
							border: 0.1rem solid #e5e7eb;
							border-radius: 1rem;
							overflow: hidden;
							transition: all 0.3s ease;

							@media (max-width: 76.8rem) {
								border-radius: 0.8rem;
							}

							@media (max-width: 48rem) {
								border-radius: 0.6rem;
							}

							&.open {
								border-color: rgb(255, 69, 0);
								box-shadow: 0 0.4rem 1.6rem rgba(255, 69, 0, 0.1);
							}

							& .faq-question {
								width: 100%;
								padding: 1.8rem;
								background: linear-gradient(135deg, #f9fafb, #f3f4f6);
								border: none;
								display: flex;
								align-items: center;
								justify-content: space-between;
								cursor: pointer;
								transition: all 0.3s ease;
								font-size: 1.8rem;
								font-weight: 500;
								color: #374151;
								text-align: left;

								@media (max-width: 120rem) {
									padding: 1.5rem;
									font-size: 1.7rem;
								}

								@media (max-width: 76.8rem) {
									padding: 1.2rem;
									font-size: 1.6rem;
								}

								@media (max-width: 48rem) {
									padding: 1rem;
									font-size: 1.5rem;
								}

								&:hover {
									background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
								}

								& svg {
									transition: transform 0.3s ease;
									color: rgb(255, 69, 0);
								}
							}

							&.open .faq-question svg {
								transform: rotate(180deg);
							}

							& .faq-answer {
								max-height: 0;
								overflow: hidden;
								transition: max-height 0.3s ease;

								& p {
									padding: 1.8rem;
									margin: 0;
									font-size: 1.8rem;
									color: #6b7280;
									line-height: 1.6;
									background: #ffffff;

									@media (max-width: 120rem) {
										padding: 1.5rem;
										font-size: 1.7rem;
									}

									@media (max-width: 76.8rem) {
										padding: 1.2rem;
										font-size: 1.6rem;
									}

									@media (max-width: 48rem) {
										padding: 1rem;
										font-size: 1.5rem;
									}
								}
							}

							&.open .faq-answer {
								max-height: 20rem;
							}
						}
					}

					& .contact-form {
						display: flex;
						flex-direction: column;
						gap: 1.5rem;

						@media (max-width: 76.8rem) {
							gap: 1.2rem;
						}

						@media (max-width: 48rem) {
							gap: 1rem;
						}

						& .form-row {
							display: grid;
							grid-template-columns: 1fr 1fr;
							gap: 1.5rem;

							@media (max-width: 76.8rem) {
								gap: 1.2rem;
							}

							@media (max-width: 48rem) {
								grid-template-columns: 1fr;
								gap: 1rem;
							}
						}

						& .form-group {
							display: flex;
							flex-direction: column;
							gap: 0.8rem;

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

							& input,
							& textarea {
								padding: 1.4rem 1.8rem;
								border: 0.2rem solid #e2e8f0;
								border-radius: 1rem;
								font-size: 1.8rem;
								color: #374151;
								background: linear-gradient(135deg, #ffffff, #fafbfc);
								transition: all 0.3s ease;
								resize: vertical;

								@media (max-width: 120rem) {
									padding: 1.2rem 1.5rem;
									font-size: 1.7rem;
								}

								@media (max-width: 76.8rem) {
									padding: 1rem 1.2rem;
									font-size: 1.6rem;
									border-radius: 0.8rem;
								}

								@media (max-width: 48rem) {
									padding: 0.8rem 1rem;
									font-size: 1.5rem;
									border-radius: 0.6rem;
								}

								&:focus {
									outline: none;
									border-color: rgb(255, 69, 0);
									box-shadow: 0 0 0 0.4rem rgba(255, 69, 0, 0.1);
									background: #ffffff;
									transform: translateY(-0.1rem);
								}

								&:hover {
									border-color: #cbd5e1;
									box-shadow: 0 0.2rem 8rem rgba(0, 0, 0, 0.05);
								}

								&::placeholder {
									color: #9ca3af;
									font-style: italic;
								}
							}
						}

						& .btn-send {
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

							&:hover {
								background: linear-gradient(135deg, #1e3a8a, #2563eb);
								transform: translateY(-0.2rem);
								box-shadow: 0 0.6rem 1.6rem rgba(30, 64, 175, 0.4);

								&::before {
									left: 100%;
								}
							}

							&:active {
								transform: translateY(0);
							}
						}
					}

					& .resources-grid {
						display: grid;
						grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
						gap: 1.5rem;

						@media (max-width: 120rem) {
							grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
							gap: 1.2rem;
						}

						@media (max-width: 76.8rem) {
							grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
							gap: 1rem;
						}

						@media (max-width: 48rem) {
							grid-template-columns: 1fr;
							gap: 1rem;
						}

						& .resource-item {
							padding: 2.5rem;
							background: linear-gradient(135deg, #f8fafc, #f1f5f9);
							border-radius: 1.2rem;
							border: 0.1rem solid #e2e8f0;
							text-align: center;
							transition: all 0.3s ease;
							position: relative;
							overflow: hidden;

							@media (max-width: 120rem) {
								padding: 2rem;
							}

							@media (max-width: 76.8rem) {
								padding: 1.5rem;
								border-radius: 1rem;
							}

							@media (max-width: 48rem) {
								padding: 1.2rem;
								border-radius: 0.8rem;
							}

							&::before {
								content: '';
								position: absolute;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
								background: linear-gradient(
									135deg,
									rgba(255, 69, 0, 0.05),
									rgba(255, 140, 66, 0.05)
								);
								opacity: 0;
								transition: opacity 0.3s ease;
							}

							&:hover {
								background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
								transform: translateY(-0.3rem);
								box-shadow: 0 0.8rem 2.5rem rgba(0, 0, 0, 0.1);

								&::before {
									opacity: 1;
								}
							}

							& .resource-icon {
								font-size: 3.5rem;
								margin-bottom: 1.5rem;
								transition: transform 0.3s ease;

								@media (max-width: 120rem) {
									font-size: 3rem;
								}

								@media (max-width: 76.8rem) {
									font-size: 2.5rem;
									margin-bottom: 1rem;
								}

								@media (max-width: 48rem) {
									font-size: 2rem;
									margin-bottom: 0.8rem;
								}
							}

							&:hover .resource-icon {
								transform: scale(1.1);
							}

							& h4 {
								font-size: 2rem;
								font-weight: 600;
								color: #222831;
								margin: 0 0 1rem 0;

								@media (max-width: 120rem) {
									font-size: 1.8rem;
								}

								@media (max-width: 76.8rem) {
									font-size: 1.6rem;
								}

								@media (max-width: 48rem) {
									font-size: 1.5rem;
								}
							}

							& p {
								font-size: 1.8rem;
								color: #6b7280;
								margin: 0 0 1.5rem 0;
								line-height: 1.6;

								@media (max-width: 120rem) {
									font-size: 1.7rem;
								}

								@media (max-width: 76.8rem) {
									font-size: 1.6rem;
									margin-bottom: 1rem;
								}

								@media (max-width: 48rem) {
									font-size: 1.5rem;
									margin-bottom: 0.8rem;
								}
							}

							& .btn-resource {
								padding: 1rem 2rem;
								background: linear-gradient(135deg, #ffffff, #f8fafc);
								color: #374151;
								border: 0.1rem solid #d1d5db;
								border-radius: 0.8rem;
								font-size: 1.8rem;
								font-weight: 500;
								cursor: pointer;
								transition: all 0.3s ease;
								position: relative;
								overflow: hidden;

								@media (max-width: 120rem) {
									padding: 0.8rem 1.5rem;
									font-size: 1.7rem;
								}

								@media (max-width: 76.8rem) {
									padding: 0.7rem 1.2rem;
									font-size: 1.6rem;
									border-radius: 0.6rem;
								}

								@media (max-width: 48rem) {
									padding: 0.6rem 1rem;
									font-size: 1.5rem;
									border-radius: 0.5rem;
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
									background: linear-gradient(135deg, #f8fafc, #f1f5f9);
									border-color: #9ca3af;
									transform: translateY(-0.1rem);
									box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.1);

									&::before {
										left: 100%;
									}
								}
							}
						}
					}
				}
			}
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
</style>
