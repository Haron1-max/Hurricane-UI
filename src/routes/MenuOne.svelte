<div id="menu-one">
	<nav>
		<a href="#how-it-works-section">How it works</a>
		<a href="#pricing-section">Pricing</a>
	</nav>
	<div class="corner">
		<button>Sign in</button>
		<button>Start Free Trial</button>
	</div>
</div>

<style>
	#menu-one {
		position: fixed;
		top: 10dvh;
		left: 5dvw;
		width: 90dvw;
		height: max-content;
		padding: 2rem;
		background-color: #ffffff;
		z-index: 1000;
		display: none;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		box-shadow:
			rgba(0, 0, 0, 0.16) 0rem 0.1rem 0.4rem,
			rgb(51, 51, 51) 0rem 0rem 0rem 0.3rem;
		border-radius: 1rem;

		& .corner {
			display: flex;
			align-items: center;
			gap: 1rem;
			flex-direction: column;
			width: 100%;

			& button:first-child {
				border: 0.1rem solid #ff4500;
				background-color: #ffffff;
				color: #ff4500;
			}

			& button {
				color: #222831;
				padding: 0.5rem 2rem;
				border: none;
				border-radius: 0.6rem;
				background-color: #ff4500;
				color: #ffffff;
				font-size: 1.3rem;
				font-weight: 600;
				cursor: pointer;
				transition: all 0.3s ease;
				min-height: 4rem;
				width: 100%;
				text-transform: uppercase;
			}
		}

		& nav {
			display: flex;
			align-items: center;
			gap: 2rem;
			width: 100%;

			& a {
				text-decoration: none;
				font-size: 1.3rem;
				font-weight: 600;
				color: #393e46;
				text-transform: uppercase;
			}
		}
	}
</style>
