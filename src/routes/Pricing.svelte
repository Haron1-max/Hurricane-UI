<script lang="ts">
	import { getAuthURL } from '../utils';

	let selectedPlan = $state<'monthly' | 'annual'>('monthly');

	const pricing = {
		monthly: {
			price: 29,
			period: '/mo (billed monthly)',
			total: '$29/month'
		},
		annual: {
			price: 19,
			period: '/mo (billed annually)',
			total: '$228/year (save 34%)'
		}
	} as const;

	function selectPlan(plan: 'monthly' | 'annual') {
		selectedPlan = plan;
	}

	function handleKeydown(event: KeyboardEvent, plan: 'monthly' | 'annual') {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectPlan(plan);
		}
	}
</script>

<section id="pricing-section">
	<div class="heading">
		<h1>Simple, Transparent Pricing</h1>
		<p>
			One plan that includes everything. Try all our features risk-free with your 14-day free trial.
		</p>
	</div>

	<div class="pricing-card">
		<h2>Select your plan</h2>

		<div class="plan-options">
			<div
				class="plan-option"
				class:selected={selectedPlan === 'monthly'}
				onclick={() => selectPlan('monthly')}
				onkeydown={(e) => handleKeydown(e, 'monthly')}
				role="button"
				tabindex="0"
				aria-pressed={selectedPlan === 'monthly'}
			>
				<input type="radio" id="monthly" name="plan" checked={selectedPlan === 'monthly'} />
				<label for="monthly">Monthly</label>
			</div>
			<div
				class="plan-option"
				class:selected={selectedPlan === 'annual'}
				onclick={() => selectPlan('annual')}
				onkeydown={(e) => handleKeydown(e, 'annual')}
				role="button"
				tabindex="0"
				aria-pressed={selectedPlan === 'annual'}
			>
				<input type="radio" id="annual" name="plan" checked={selectedPlan === 'annual'} />
				<label for="annual">Annual</label>
				<span class="badge">BEST VALUE ★</span>
			</div>
		</div>

		<div class="features">
			<h3>What you get</h3>
			<div class="feature-list">
				<div class="feature">
					<div class="checkmark">✓</div>
					<span>Unlimited subreddits</span>
				</div>
				<div class="feature">
					<div class="checkmark">✓</div>
					<span>Unlimited keywords</span>
				</div>
				<div class="feature">
					<div class="checkmark">✓</div>
					<span>Unlimited replies</span>
				</div>
				<div class="feature">
					<div class="checkmark">✓</div>
					<span>Unlimited email notifications</span>
				</div>
				<div class="feature">
					<div class="checkmark">✓</div>
					<span>24/7 support</span>
				</div>
			</div>
		</div>

		<div class="pricing">
			<div class="price">
				<span class="currency">$</span>
				<span class="amount">{pricing[selectedPlan].price}</span>
				<span class="period">{pricing[selectedPlan].period}</span>
			</div>
			<button class="upgrade-btn" onclick={getAuthURL}>Start Free Trial</button>
		</div>

		{#if selectedPlan === 'annual'}
			<div class="savings-note">
				<p>💰 You save $120/year with the annual plan!</p>
			</div>
		{/if}
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
		background-image: radial-gradient(circle at center, #fff991 0%, transparent 70%);

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

		& .pricing-card {
			background: rgba(255, 255, 255, 0.95);
			border-radius: 2rem;
			padding: 3rem;
			box-shadow:
				rgba(0, 0, 0, 0.1) 0rem 1rem 3rem,
				rgba(0, 0, 0, 0.05) 0rem 0.5rem 1rem;
			backdrop-filter: blur(1rem);
			border: 0.1rem solid rgba(255, 255, 255, 0.3);
			max-width: 50rem;
			width: 100%;

			& h2 {
				font-size: 2.4rem;
				font-weight: 700;
				color: #222831;
				margin-bottom: 2rem;
				text-align: center;
			}

			& .plan-options {
				display: flex;
				gap: 1rem;
				margin-bottom: 3rem;

				& .plan-option {
					flex: 1;
					position: relative;
					border: 0.2rem solid #e0e0e0;
					border-radius: 1rem;
					padding: 1.5rem;
					cursor: pointer;
					transition: all 0.3s ease;

					&.selected {
						border-color: #ff4500;
						background: rgba(255, 69, 0, 0.05);
					}

					& input[type='radio'] {
						position: absolute;
						opacity: 0;
						cursor: pointer;
					}

					& label {
						font-size: 1.6rem;
						font-weight: 600;
						color: #222831;
						cursor: pointer;
						display: block;
						text-align: center;
					}

					& .badge {
						position: absolute;
						top: -1rem;
						right: -1rem;
						background: #222831;
						color: white;
						font-size: 1.2rem;
						font-weight: 600;
						padding: 0.5rem 1rem;
						border-radius: 1rem;
						text-transform: uppercase;
						letter-spacing: 0.05rem;
					}
				}
			}

			& .features {
				margin-bottom: 3rem;

				& h3 {
					font-size: 2rem;
					font-weight: 700;
					color: #222831;
					margin-bottom: 1.5rem;
				}

				& .feature-list {
					display: flex;
					flex-direction: column;
					gap: 1.2rem;

					& .feature {
						display: flex;
						align-items: center;
						gap: 1rem;

						& .checkmark {
							width: 2.4rem;
							height: 2.4rem;
							background: #28a745;
							color: white;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							font-weight: bold;
							font-size: 1.4rem;
							flex-shrink: 0;
						}

						& span {
							font-size: 1.6rem;
							color: #222831;
							font-weight: 500;
						}
					}
				}
			}

			& .pricing {
				border-top: 0.1rem solid #e0e0e0;
				padding-top: 2rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 2rem;

				& .price {
					display: flex;
					align-items: baseline;
					gap: 0.5rem;

					& .currency {
						font-size: 2rem;
						font-weight: 600;
						color: #222831;
					}

					& .amount {
						font-size: 4rem;
						font-weight: 900;
						color: #222831;
					}

					& .period {
						font-size: 1.4rem;
						color: #666;
						font-weight: 500;
					}
				}

				& .upgrade-btn {
					background: #ff4500;
					color: white;
					border: none;
					border-radius: 1rem;
					padding: 1.2rem 2.4rem;
					font-size: 1.6rem;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.3s ease;
					text-transform: uppercase;
					letter-spacing: 0.05rem;
				}
			}

			& .savings-note {
				margin-top: 1.5rem;
				padding: 1rem;
				background: rgba(40, 167, 69, 0.1);
				border: 0.1rem solid rgba(40, 167, 69, 0.2);
				border-radius: 1rem;
				text-align: center;

				& p {
					font-size: 1.4rem;
					color: #28a745;
					font-weight: 600;
					margin: 0;
				}
			}

			/* Responsive Design */
			@media (max-width: 76.8rem) {
				padding: 2rem;
				max-width: 100%;

				& h2 {
					font-size: 2rem;
				}

				& .plan-options .plan-option label {
					font-size: 1.4rem;
				}

				& .features h3 {
					font-size: 1.8rem;
				}

				& .features .feature span {
					font-size: 1.4rem;
				}

				& .pricing {
					flex-direction: column;
					gap: 1.5rem;
					text-align: center;

					& .price .amount {
						font-size: 3.5rem;
					}

					& .upgrade-btn {
						width: 100%;
						padding: 1.5rem;
					}
				}
			}

			@media (max-width: 48rem) {
				padding: 1.5rem;

				& .plan-options {
					flex-direction: column;
				}

				& .features .feature {
					& .checkmark {
						width: 2rem;
						height: 2rem;
						font-size: 1.2rem;
					}

					& span {
						font-size: 1.3rem;
					}
				}
			}
		}
	}
</style>
