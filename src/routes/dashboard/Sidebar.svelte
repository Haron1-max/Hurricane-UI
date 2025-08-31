<script lang="ts">
	import { page } from '$app/state';

	let { sidebarOpen } = $props<{ sidebarOpen: boolean }>();

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

	function handleNavClick() {
		// Hide sidebar on mobile when navigating
		if (!isDesktop) {
			sidebarOpen.set(false);
		}
	}

	import { makeAuthenticatedRequest } from '../../utils';

	// User data state
	let user = $state<{
		full_name: string | null;
		email: string | null;
	}>({
		full_name: null,
		email: null
	});

	$effect(() => {
		async function fetchUser() {
			try {
				const userData = await makeAuthenticatedRequest();
				user = {
					full_name: userData.full_name,
					email: userData.email
				};
			} catch (error) {
				console.error('Failed to fetch user data:', error);
				// Fallback values on error
				user = {
					full_name: 'Hurricane User',
					email: 'user@hurricane.com'
				};
			}
		}
		fetchUser();
	});

	// Navigation items
	const menuItems = [
		{ name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
		{ name: 'Leads', href: '/dashboard/leads', icon: 'leads' },
		{ name: 'Replies', href: '/dashboard/replies', icon: 'replies' },
		{ name: 'Subreddits', href: '/dashboard/subreddits', icon: 'subreddits' },
		{ name: 'Keywords', href: '/dashboard/keywords', icon: 'keywords' }
	];

	const generalItems = [
		{ name: 'Settings', href: '/dashboard/settings', icon: 'settings' },
		{ name: 'Help', href: '/dashboard/help', icon: 'help' },
		{ name: 'Feedback', href: '/dashboard/feedback', icon: 'feedback' }
	];

	// Icon components
	const icons: Record<string, string> = {
		logo: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ff4500" viewBox="0 0 256 256"><path d="M158.32,45.36l9.41-35.3A8,8,0,0,0,158.32.18,195.87,195.87,0,0,0,99.67,25.27C60.63,50.37,40,85.89,40,128a88.11,88.11,0,0,0,57.68,82.64l-9.41,35.3a8,8,0,0,0,9.41,9.88,195.87,195.87,0,0,0,58.65-25.09C195.37,205.63,216,170.11,216,128A88.1,88.1,0,0,0,158.32,45.36ZM128,152a24,24,0,1,1,24-24A24,24,0,0,1,128,152Z"></path></svg>`,
		dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M120,56v48a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40h48A16,16,0,0,1,120,56Zm80-16H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm-96,96H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm96,0H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Z"></path></svg>`,
		leads: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M248,80a28,28,0,1,0-51.12,15.77l-26.79,33L146,73.4a28,28,0,1,0-36.06,0L85.91,128.74l-26.79-33a28,28,0,1,0-26.6,12L47,194.63A16,16,0,0,0,62.78,208H193.22A16,16,0,0,0,209,194.63l14.47-86.85A28,28,0,0,0,248,80ZM128,40a12,12,0,1,1-12,12A12,12,0,0,1,128,40ZM24,80A12,12,0,1,1,36,92,12,12,0,0,1,24,80ZM220,92a12,12,0,1,1,12-12A12,12,0,0,1,220,92Z"></path></svg>`,
		replies: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z"></path></svg>`,
		subreddits: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M248,104a32,32,0,0,0-52.94-24.19c-16.75-8.9-36.76-14.28-57.66-15.53l5.19-31.17,17.72,2.72a24,24,0,1,0,2.87-15.74l-26-4a8,8,0,0,0-9.11,6.59L121.2,64.16c-21.84.94-42.82,6.38-60.26,15.65a32,32,0,0,0-42.59,47.74A59,59,0,0,0,16,144c0,21.93,12,42.35,33.91,57.49C70.88,216,98.61,224,128,224s57.12-8,78.09-22.51C228,186.35,240,165.93,240,144a59,59,0,0,0-2.35-16.45A32.16,32.16,0,0,0,248,104ZM72,128a16,16,0,1,1,16,16A16,16,0,0,1,72,128Zm91.75,55.07a76.18,76.18,0,0,1-71.5,0,8,8,0,1,1,7.5-14.14,60.18,60.18,0,0,0,56.5,0,8,8,0,1,1,7.5,14.14ZM168,144a16,16,0,1,1,16-16A16,16,0,0,1,168,144Z"></path></svg>`,
		keywords: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M227.81,66.76l-.08.09L160,139.17v55.49A16,16,0,0,1,152.87,208l-32,21.34A16,16,0,0,1,96,216V139.17L28.27,66.85l-.08-.09A16,16,0,0,1,40,40H216a16,16,0,0,1,11.84,26.76Z"></path></svg>`,
		settings: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M216,130.16q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"></path></svg>`,
		help: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM96,128a32,32,0,1,1,32,32A32,32,0,0,1,96,128Zm88.28-67.6L155.79,88.9a47.84,47.84,0,0,0-55.58,0L71.72,60.4a87.83,87.83,0,0,1,112.56,0ZM71.72,195.6l28.49-28.5a47.84,47.84,0,0,0,55.58,0l28.49,28.5a87.83,87.83,0,0,1-112.56,0Z"></path></svg>`,
		feedback: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M232,64V192a16,16,0,0,1-16,16H83l-32.6,28.16-.09.07A15.89,15.89,0,0,1,40,240a16.05,16.05,0,0,1-6.79-1.52A15.84,15.84,0,0,1,24,224V64A16,16,0,0,1,40,48H216A16,16,0,0,1,232,64Z"></path></svg>`
	};
</script>

<aside class="sidebar" class:closed={!sidebarOpen}>
	<!-- Brand Section -->
	<div class="brand">
		<div class="logo">
			{@html icons.logo}
		</div>
		<span class="brand-name">Hurricane</span>
	</div>

	<!-- Navigation -->
	<nav class="navigation">
		<!-- Menu Section -->
		<div class="nav-section">
			<h3 class="section-title">MENU</h3>
			<ul class="nav-list">
				{#each menuItems as item}
					<li>
						<a
							href={item.href}
							class="nav-link"
							class:active={page.url.pathname === item.href}
							onclick={handleNavClick}
						>
							<span class="nav-icon">
								{@html icons[item.icon]}
							</span>
							<span class="nav-text">{item.name}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- General Section -->
		<div class="nav-section">
			<h3 class="section-title">GENERAL</h3>
			<ul class="nav-list">
				{#each generalItems as item}
					<li>
						<a
							href={item.href}
							class="nav-link"
							class:active={page.url.pathname === item.href}
							onclick={handleNavClick}
						>
							<span class="nav-icon">
								{@html icons[item.icon]}
							</span>
							<span class="nav-text">{item.name}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</nav>

	<!-- Profile Section -->
	<div class="profile-section">
		<h3 class="section-title">PROFILE</h3>
		<div class="profile-card">
			<div class="profile-info">
				{#if user.full_name}
					<div class="profile-name">{user.full_name}</div>
					<div class="profile-email">{user.email}</div>
				{:else}
					<span class="loader"></span>
				{/if}
			</div>
			<div class="profile-dropdown">
				<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
					<path d="M7 10l5 5 5-5z" />
				</svg>
			</div>
		</div>
	</div>
</aside>

<style>
	.sidebar {
		width: 32rem;
		height: 100vh;
		background: #ffffff;
		border-right: 0.1rem solid #e5e7eb;
		display: flex;
		flex-direction: column;
		padding: 2rem 0;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 100;
		overflow-y: auto;
		overflow-x: hidden;
		transition: transform 0.3s ease;
		background-image:
			radial-gradient(circle at 20% 80%, rgba(255, 220, 190, 0.3) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(255, 245, 238, 0.35) 0%, transparent 50%),
			radial-gradient(circle at 40% 40%, rgba(255, 210, 180, 0.15) 0%, transparent 50%);

		.brand {
			display: flex;
			align-items: center;
			gap: 1rem;
			padding: 0 2.5rem;
			margin-bottom: 3rem;

			.logo {
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.brand-name {
				font-size: 1.8rem;
				font-weight: 900;
				color: #222831;
				letter-spacing: -0.025em;
				color: rgb(255, 69, 0);
				text-transform: uppercase;
			}
		}

		.navigation {
			flex: 1;
			padding: 0 2rem;
			display: flex;
			flex-direction: column;
			gap: 3rem;

			.nav-section {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;

				.section-title {
					font-size: 1.5rem;
					font-weight: 600;
					color: #000;
					text-transform: uppercase;
					letter-spacing: 0.05em;
					margin: 0;
					padding: 0 1rem;
					margin-bottom: 1rem;
				}

				.nav-list {
					list-style: none;
					margin: 0;
					padding: 0;
					display: flex;
					flex-direction: column;
					gap: 0.5rem;

					.nav-link {
						display: flex;
						align-items: center;
						gap: 1.2rem;
						padding: 1rem 1rem;
						border-radius: 0.8rem;
						text-decoration: none;
						color: #393e46;
						font-size: 1.4rem;
						font-weight: 500;
						transition: all 0.2s ease;
						position: relative;

						&:hover {
							background: #f3f4f6;
							color: #222831;
						}

						&.active {
							background: rgba(255, 69, 0, 0.1);
							color: rgb(255, 69, 0);
							font-weight: 600;

							&::before {
								content: '';
								position: absolute;
								left: 0;
								top: 50%;
								transform: translateY(-50%);
								width: 0.4rem;
								height: 2.5rem;
								background: rgb(255, 69, 0);
								border-radius: 0 0.3rem 0.3rem 0;
							}

							.nav-icon {
								color: rgb(255, 69, 0);
							}
						}

						.nav-icon {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 2rem;
							height: 2rem;
							color: #57564f;
							transition: color 0.2s ease;
						}

						.nav-text {
							flex: 1;
							font-size: 1.5rem;
							font-weight: 500;
							text-transform: uppercase;
							color: #57564f;
						}
					}
				}
			}
		}

		.profile-section {
			padding: 0 2rem;
			margin-top: 2rem;

			.section-title {
				font-size: 1.6rem;
				font-weight: 700;
				color: #000;
				text-transform: uppercase;
				letter-spacing: 0.05em;
				margin: 0;
				padding: 0 1rem;
				margin-bottom: 1rem;
			}

			.profile-card {
				display: flex;
				align-items: center;
				gap: 1.5rem;
				padding: 1.8rem 1rem;
				border-radius: 1.2rem;
				background: #f9fafb;
				border: 0.1rem solid #e5e7eb;
				cursor: pointer;
				transition: all 0.2s ease;

				&:hover {
					background: #f3f4f6;
					border-color: #d1d5db;

					.profile-dropdown {
						transform: translateY(0.2rem);
					}
				}

				.profile-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					gap: 0.4rem;

					.profile-name {
						font-size: 1.5rem;
						font-weight: 600;
						text-transform: uppercase;
						color: #222831;
						line-height: 1.2;
					}

					.profile-email {
						font-size: 1.7rem;
						color: #393e46;
						line-height: 1.2;
					}

					.loader {
						width: 24rem;
						height: 6rem;
						display: block;
						position: relative;
						background-image:
							linear-gradient(100deg, transparent, rgba(38, 50, 56, 0.5) 50%, transparent 80%),
							linear-gradient(#f0f0f0 1.2rem, transparent 0),
							linear-gradient(#f0f0f0 1.2rem, transparent 0),
							linear-gradient(#f0f0f0 1.2rem, transparent 0);
						background-repeat: no-repeat;
						background-size:
							4.5rem 6rem,
							8rem 1.2rem,
							16rem 1.2rem,
							16rem 1.2rem;
						background-position:
							0% 0,
							7.2rem 0,
							7.2rem 2.4rem,
							7.2rem 4.8rem;
						box-sizing: border-box;
						animation: animloader 1s linear infinite;
						border-radius: 0.8rem;
					}

					.loader::after {
						content: '';
						box-sizing: border-box;
						width: 6rem;
						height: 6rem;
						border-radius: 0.5rem;
						background: #f8f9fa;
						position: absolute;
						top: 0;
						left: 0;
					}
				}

				@keyframes animloader {
					0% {
						background-position:
							0% 0,
							7.2rem 0,
							7.2rem 2.4rem,
							7.2rem 4.8rem;
					}
					100% {
						background-position:
							100% 0,
							7.2rem 0,
							7.2rem 2.4rem,
							7.2rem 4.8rem;
					}
				}

				.profile-dropdown {
					color: #393e46;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: transform 0.2s ease;
				}
			}
		}

		@media (max-width: 76.8rem) {
			transform: translateX(-100%);
			z-index: 1000;

			&:not(.closed) {
				transform: translateX(0);
			}
		}

		&.closed {
			transform: translateX(-100%);
		}
	}
</style>
