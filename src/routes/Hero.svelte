<script lang="ts">
	import { getAuthURL } from '../utils';
</script>

<section id="hero-section">
	<div class="offer">
		<h1>Find Leads on Reddit on <span>Autopilot</span></h1>
		<p>
			Hurricane scans Reddit 24/7 for relevant posts, delivering a real-time feed of opportunities
			to connect with potential clients.
		</p>
	</div>
	<button onclick={getAuthURL}>Start 14 Day Free Trial</button>
</section>

<style>
	section {
		width: 100%;
		min-height: 100dvh;
		background-image:
			radial-gradient(circle at 20% 80%, rgba(255, 220, 190, 0.3) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(255, 245, 238, 0.35) 0%, transparent 50%),
			radial-gradient(circle at 40% 40%, rgba(255, 210, 180, 0.15) 0%, transparent 50%);

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4rem;
		padding: 2rem;

		& .offer {
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

				& span {
					color: #ff4500;
				}
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

		& button {
			padding: 1rem 2rem;
			border: none;
			border-radius: 0.6rem;
			background-color: #ff4500;
			color: #ffffff;
			font-size: 1.6rem;
			font-weight: 600;
			cursor: pointer;
			transition: all 0.3s ease;
			min-height: 5rem;
			min-width: 10rem;
			text-transform: uppercase;

			@media (min-width: 144rem) {
				font-size: 1.8rem;
				min-height: 5.5rem;
				min-width: 12rem;
				padding: 1.2rem 2.5rem;
			}

			@media (min-width: 102.4rem) and (max-width: 143.9rem) {
				font-size: 1.7rem;
				min-height: 5.2rem;
				min-width: 11rem;
				padding: 1.1rem 2.2rem;
			}

			@media (min-width: 76.8rem) and (max-width: 102.3rem) {
				font-size: 1.5rem;
				min-height: 4.8rem;
				min-width: 9.5rem;
				padding: 1rem 2rem;
			}

			@media (min-width: 64rem) and (max-width: 76.7rem) {
				font-size: 1.4rem;
				min-height: 4.5rem;
				min-width: 9rem;
				padding: 0.9rem 1.8rem;
			}

			@media (min-width: 48rem) and (max-width: 63.9rem) {
				font-size: 1.4rem;
				min-height: 4.2rem;
				min-width: 8.5rem;
				padding: 0.8rem 1.6rem;
			}

			@media (max-width: 47.9rem) {
				font-size: 1.3rem;
				min-height: 4rem;
				min-width: 8rem;
				padding: 0.7rem 1.4rem;
			}
		}
	}
</style>
