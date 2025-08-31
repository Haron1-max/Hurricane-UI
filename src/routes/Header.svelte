<script lang="ts">
	let headerElement = $state<HTMLElement>();
	let lastScrollY = $state(0);
	let isVisible = $state(true);
	import { getAuthURL } from '../utils';

	$effect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Show header when at top of page
			if (currentScrollY < 50) {
				isVisible = true;
			}
			// Hide header when scrolling down, show when scrolling up
			else if (currentScrollY > lastScrollY && currentScrollY > 50) {
				isVisible = false;
			} else if (currentScrollY < lastScrollY) {
				isVisible = true;
			}

			lastScrollY = currentScrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function toggleMenu() {
		const menuOne = document.getElementById('menu-one');

		if (menuOne === null) return;

		if (menuOne.style.display === 'flex') {
			menuOne.style.display = 'none';
		} else {
			menuOne.style.display = 'flex';
		}
	}
</script>

<header bind:this={headerElement} class:hidden={!isVisible}>
	<div class="corner">
		<a href="/" class="logo">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				fill="#ff4500"
				viewBox="0 0 256 256"
				><path
					d="M158.32,45.36l9.41-35.3A8,8,0,0,0,158.32.18,195.87,195.87,0,0,0,99.67,25.27C60.63,50.37,40,85.89,40,128a88.11,88.11,0,0,0,57.68,82.64l-9.41,35.3a8,8,0,0,0,9.41,9.88,195.87,195.87,0,0,0,58.65-25.09C195.37,205.63,216,170.11,216,128A88.1,88.1,0,0,0,158.32,45.36ZM128,152a24,24,0,1,1,24-24A24,24,0,0,1,128,152Z"
				></path></svg
			>
			<h1>Hurricane</h1>
		</a>
	</div>

	<div class="corner">
		<nav>
			<a href="#how-it-works-section">How it works</a>
			<a href="#pricing-section">Pricing</a>
		</nav>
		<button onclick={getAuthURL}>Sign in</button>
		<button onclick={getAuthURL}>Start Free Trial</button>
	</div>

	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="32"
		height="32"
		fill="#000000"
		viewBox="0 0 256 256"
		onclick={toggleMenu}
		role="none"
		><path
			d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"
		></path></svg
	>
</header>

<style>
	header {
		min-height: 7dvh;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 2rem;
		position: fixed;
		top: 0vh;
		left: 0dvw;
		width: 100dvw;
		background-color: #ffffff;
		background-image:
			radial-gradient(circle at 20% 80%, rgba(255, 220, 190, 0.3) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(255, 245, 238, 0.35) 0%, transparent 50%),
			radial-gradient(circle at 40% 40%, rgba(255, 210, 180, 0.15) 0%, transparent 50%);
		transform: translateY(0);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 1000;

		&.hidden {
			transform: translateY(-200%);
		}

		& .corner {
			display: flex;
			align-items: center;
			gap: 1rem;

			a {
				text-decoration: none;
				display: flex;
				align-items: center;
				gap: 0.5rem;

				& h1 {
					color: #ff4500;
					font-size: 1.8rem;
					font-weight: 900;
					text-transform: uppercase;
				}
			}

			& nav {
				display: flex;
				align-items: center;
				gap: 2rem;

				& a {
					text-decoration: none;
					font-size: 1.3rem;
					font-weight: 600;
					color: #393e46;
					text-transform: uppercase;
				}
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
				min-width: 10rem;
				text-transform: uppercase;
			}
		}

		& svg:not(:first-child) {
			cursor: pointer;
			display: none;
		}

		@media (max-width: 76.8rem) {
			& nav {
				display: none;
			}

			& .corner {
				& nav {
					display: none;
				}

				& button {
					display: none;
				}
			}

			& svg:not(:first-child) {
				display: block;
			}
		}
	}
</style>
