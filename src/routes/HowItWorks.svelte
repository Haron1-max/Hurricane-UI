<section id="how-it-works-section">
	<div class="heading">
		<h1>How it works</h1>
		<p>Effortless Reddit Leads in 4 Simple Steps.</p>
	</div>
	<div class="steps">
		<div class="step">
			<div class="step-number">1</div>
			<div class="step-content">
				<h3>Target Your Audience</h3>
				<p>
					Tell us who you're looking for. Provide the specific keywords and subreddits where your
					ideal customers are asking questions and discussing their problems.
				</p>
			</div>
		</div>

		<div class="step">
			<div class="step-number">2</div>
			<div class="step-content">
				<h3>We Find the Perfect Opportunities 24/7</h3>
				<p>
					Our AI scans your target subreddits around the clock. It filters out the noise to identify
					high-quality, recent conversations where you can genuinely contribute.
				</p>
			</div>
		</div>

		<div class="step">
			<div class="step-number">3</div>
			<div class="step-content">
				<h3>AI Drafts a Value-First Reply</h3>
				<p>
					Our AI analyzes the context of each post to generate a helpful, relevant reply. The
					primary goal is to solve the user's problem, then naturally introduce your product as the
					solution.
				</p>
			</div>
		</div>

		<div class="step">
			<div class="step-number">4</div>
			<div class="step-content">
				<h3>Build Your Reputation and Generate Leads</h3>
				<p>
					Your authentic replies are posted, establishing you as a helpful authority in your niche.
					This starts organic conversations and turns warm prospects into leads, all on autopilot.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		width: 100%;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4rem;
		padding: 2rem;
		background-image:
			radial-gradient(circle at 20% 80%, rgba(255, 182, 153, 0.3) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(255, 244, 214, 0.5) 0%, transparent 50%),
			radial-gradient(circle at 40% 40%, rgba(255, 182, 153, 0.1) 0%, transparent 50%);

		& .heading {
			width: 50%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 2rem;
			text-align: center;

			& h1 {
				font-size: 5rem;
				font-weight: 900;
				color: #222831;
			}

			& p {
				font-size: 2.4rem;
				color: #222831;
				text-align: center;
				font-weight: 500;
			}

			@media (min-width: 144rem) {
				width: 45%;
				gap: 2.5rem;

				& h1 {
					font-size: 5.5rem;
					line-height: 1.1;
				}

				& p {
					font-size: 2.6rem;
					line-height: 1.4;
				}
			}

			@media (min-width: 102.4rem) and (max-width: 143.9rem) {
				width: 48%;
				gap: 2.2rem;

				& h1 {
					font-size: 5.2rem;
					line-height: 1.1;
				}

				& p {
					font-size: 2.5rem;
					line-height: 1.4;
				}
			}

			@media (min-width: 76.8rem) and (max-width: 102.3rem) {
				width: 70%;
				gap: 2rem;

				& h1 {
					font-size: 4.2rem;
					line-height: 1.2;
				}

				& p {
					font-size: 2.2rem;
					line-height: 1.4;
				}
			}

			@media (min-width: 64rem) and (max-width: 76.7rem) {
				width: 80%;
				gap: 1.8rem;

				& h1 {
					font-size: 3.8rem;
					line-height: 1.2;
				}

				& p {
					font-size: 2rem;
					line-height: 1.4;
				}
			}

			@media (min-width: 48rem) and (max-width: 63.9rem) {
				width: 90%;
				gap: 1.5rem;

				& h1 {
					font-size: 3.2rem;
					line-height: 1.2;
				}

				& p {
					font-size: 1.8rem;
					line-height: 1.4;
				}
			}

			@media (max-width: 47.9rem) {
				width: 95%;
				gap: 1.2rem;

				& h1 {
					font-size: 2.8rem;
					line-height: 1.1;
				}

				& p {
					font-size: 1.6rem;
					line-height: 1.3;
				}
			}
		}

		& .steps {
			width: 100%;
			max-width: 80rem;
			display: flex;
			flex-direction: column;
			gap: 0;
			position: relative;

			& .step {
				display: flex;
				align-items: flex-start;
				gap: 3rem;
				padding: 2rem 0;
				position: relative;

				&:not(:last-child)::after {
					content: '';
					position: absolute;
					left: 2.4rem;
					top: 6rem;
					bottom: -2rem;
					width: 0.2rem;
					background: linear-gradient(to bottom, #ff4500, rgba(255, 69, 0, 0.3));
				}

				& .step-number {
					width: 4.8rem;
					height: 4.8rem;
					border-radius: 50%;
					background: linear-gradient(135deg, #ff4500, #ff6b35);
					color: white;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 2rem;
					font-weight: 900;
					flex-shrink: 0;
					box-shadow:
						rgba(255, 69, 0, 0.3) 0rem 0.4rem 1.2rem,
						rgba(255, 69, 0, 0.1) 0rem 0.2rem 0.4rem;
					position: relative;
					z-index: 2;
				}

				& .step-content {
					flex: 1;
					padding-top: 0.5rem;

					& h3 {
						font-size: 2.2rem;
						font-weight: 700;
						color: #222831;
						margin-bottom: 1rem;
						line-height: 1.3;
					}

					& p {
						font-size: 1.7rem;
						color: #393e46;
						line-height: 1.6;
						font-weight: 400;
					}
				}
			}

			@media (min-width: 144rem) {
				max-width: 90rem;

				& .step {
					gap: 4rem;
					padding: 2.5rem 0;

					& .step-number {
						width: 5.5rem;
						height: 5.5rem;
						font-size: 2.2rem;
					}

					&:not(:last-child)::after {
						left: 2.75rem;
						top: 7rem;
					}

					& .step-content h3 {
						font-size: 2.6rem;
						margin-bottom: 1.2rem;
					}

					& .step-content p {
						font-size: 2rem;
					}
				}
			}

			@media (min-width: 102.4rem) and (max-width: 143.9rem) {
				max-width: 85rem;

				& .step {
					gap: 3.5rem;

					& .step-number {
						width: 5.2rem;
						height: 5.2rem;
						font-size: 2.1rem;
					}

					&:not(:last-child)::after {
						left: 2.6rem;
						top: 6.5rem;
					}

					& .step-content h3 {
						font-size: 2.4rem;
					}

					& .step-content p {
						font-size: 1.8rem;
					}
				}
			}

			@media (min-width: 76.8rem) and (max-width: 102.3rem) {
				max-width: 75rem;

				& .step {
					gap: 2.5rem;

					& .step-number {
						width: 4.5rem;
						height: 4.5rem;
						font-size: 1.9rem;
					}

					&:not(:last-child)::after {
						left: 2.25rem;
						top: 5.5rem;
					}

					& .step-content h3 {
						font-size: 2.1rem;
					}

					& .step-content p {
						font-size: 1.6rem;
					}
				}
			}

			@media (min-width: 64rem) and (max-width: 76.7rem) {
				max-width: 95%;

				& .step {
					gap: 2rem;

					& .step-number {
						width: 4.2rem;
						height: 4.2rem;
						font-size: 1.8rem;
					}

					&:not(:last-child)::after {
						left: 2.1rem;
						top: 5.2rem;
					}

					& .step-content h3 {
						font-size: 1.9rem;
					}

					& .step-content p {
						font-size: 1.5rem;
					}
				}
			}

			@media (min-width: 48rem) and (max-width: 63.9rem) {
				max-width: 100%;

				& .step {
					gap: 1.5rem;
					padding: 1.5rem 0;

					& .step-number {
						width: 3.8rem;
						height: 3.8rem;
						font-size: 1.6rem;
					}

					&:not(:last-child)::after {
						left: 1.9rem;
						top: 4.8rem;
					}

					& .step-content h3 {
						font-size: 1.7rem;
					}

					& .step-content p {
						font-size: 1.4rem;
						line-height: 1.5;
					}
				}
			}

			@media (max-width: 47.9rem) {
				max-width: 100%;

				& .step {
					gap: 1.2rem;
					padding: 1.2rem 0;

					& .step-number {
						width: 3.5rem;
						height: 3.5rem;
						font-size: 1.5rem;
					}

					&:not(:last-child)::after {
						left: 1.75rem;
						top: 4.5rem;
					}

					& .step-content h3 {
						font-size: 1.6rem;
						margin-bottom: 0.8rem;
					}

					& .step-content p {
						font-size: 1.3rem;
						line-height: 1.4;
					}
				}
			}
		}
	}
</style>
