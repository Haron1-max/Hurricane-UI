<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSidebarOpenState, setSidebarOpenState } from '$lib/state.svelte';
	import { URL } from '$lib/state.svelte';
	import type { DashboardMetrics } from '../../lib/types';

	// Get data from load function
	let { data } = $props<{
		data: {
			metrics: DashboardMetrics;
		};
	}>();

	// Track screen size for responsive behavior
	let isDesktop = $state(typeof window !== 'undefined' ? window.innerWidth > 768 : true);

	// Period selection state
	let selectedPeriod = $state('30 days');
	let isLoading = $state(false);

	// Create a reactive state for current metrics that we can update
	let currentMetrics = $state(data.metrics);

	// Available periods
	const periods = [
		{ label: 'Last 24 hours', value: '1 day' },
		{ label: 'Last 7 days', value: '7 days' },
		{ label: 'Last 30 days', value: '30 days' },
		{ label: 'Last 90 days', value: '90 days' },
		{ label: 'Last 6 months', value: '6 months' },
		{ label: 'Last year', value: '1 year' }
	];

	// Reactive metrics data using real data from load function
	let metrics = $derived([
		{
			title: 'LEADS',
			value: (currentMetrics?.leads_count || 0).toString(),
			trend: formatTrend(currentMetrics?.leads_growth || 0),
			trendUp: (currentMetrics?.leads_growth || 0) >= 0,
			timeframe: currentMetrics?.period?.toUpperCase() || 'TOTAL',
			icon: 'leads',
			href: '/dashboard/leads',
			primary: true
		},
		{
			title: 'REPLIES',
			value: (currentMetrics?.replies_count || 0).toString(),
			trend: formatTrend(currentMetrics?.replies_growth || 0),
			trendUp: (currentMetrics?.replies_growth || 0) >= 0,
			timeframe: currentMetrics?.period?.toUpperCase() || 'TOTAL',
			icon: 'replies',
			href: '/dashboard/replies',
			primary: true
		},
		{
			title: 'SUBREDDITS',
			value: (currentMetrics?.subreddits_count || 0).toString(),
			trend: formatTrend(currentMetrics?.subreddits_growth || 0),
			trendUp: (currentMetrics?.subreddits_growth || 0) >= 0,
			timeframe: currentMetrics?.period?.toUpperCase() || 'TOTAL',
			icon: 'subreddits',
			href: '/dashboard/subreddits',
			primary: false
		},
		{
			title: 'KEYWORDS',
			value: (currentMetrics?.keywords_count || 0).toString(),
			trend: formatTrend(currentMetrics?.keywords_growth || 0),
			trendUp: (currentMetrics?.keywords_growth || 0) >= 0,
			timeframe: currentMetrics?.period?.toUpperCase() || 'TOTAL',
			icon: 'keywords',
			href: '/dashboard/keywords',
			primary: false
		}
	]);

	// Helper function to format trend values
	function formatTrend(value: number): string {
		if (value === 0) return '0%';
		const sign = value > 0 ? '+' : '';
		return `${sign}${value.toFixed(1)}%`;
	}

	// Icon components (reusing from sidebar)
	const icons: Record<string, string> = {
		leads: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M248,80a28,28,0,1,0-51.12,15.77l-26.79,33L146,73.4a28,28,0,1,0-36.06,0L85.91,128.74l-26.79-33a28,28,0,1,0-26.6,12L47,194.63A16,16,0,0,0,62.78,208H193.22A16,16,0,0,1,209,194.63l14.47-86.85A28,28,0,0,0,248,80ZM128,40a12,12,0,1,1-12,12A12,12,0,0,1,128,40ZM24,80A12,12,0,1,1,36,92,12,12,0,0,1,24,80ZM220,92a12,12,0,1,1,12-12A12,12,0,0,1,220,92Z"></path></svg>`,
		replies: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z"></path></svg>`,
		subreddits: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M248,104a32,32,0,0,0-52.94-24.19c-16.75-8.9-36.76-14.28-57.66-15.53l5.19-31.17,17.72,2.72a24,24,0,1,0,2.87-15.74l-26-4a8,8,0,0,0-9.11,6.59L121.2,64.16c-21.84.94-42.82,6.38-60.26,15.65a32,32,0,0,0-42.59,47.74A59,59,0,0,0,16,144c0,21.93,12,42.35,33.91,57.49C70.88,216,98.61,224,128,224s57.12-8,78.09-22.51C228,186.35,240,165.93,240,144a59,59,0,0,0-2.35-16.45A32.16,32.16,0,0,0,248,104ZM72,128a16,16,0,1,1,16,16A16,16,0,0,1,72,128Zm91.75,55.07a76.18,76.18,0,0,1-71.5,0,8,8,0,1,1,7.5-14.14,60.18,60.18,0,0,0,56.5,0,8,8,0,1,1,7.5,14.14ZM168,144a16,16,0,1,1,16-16A16,16,0,0,1,168,144Z"></path></svg>`,
		keywords: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M227.81,66.76l-.08.09L160,139.17v55.49A16,16,0,0,1,152.87,208l-32,21.34A16,16,0,0,1,96,216V139.17L28.27,66.85l-.08-.09A16,16,0,0,1,40,40H216a16,16,0,0,1,11.84,26.76Z"></path></svg>`
	};

	function handleCardClick(href: string) {
		// Hide sidebar on mobile when navigating
		if (!isDesktop) {
			setSidebarOpenState(false);
		}
		goto(href);
	}

	function toggleSidebar() {
		setSidebarOpenState(!getSidebarOpenState());
	}

	// Handle period selection
	async function handlePeriodChange(newPeriod: string) {
		console.log('🎯 handlePeriodChange called with:', newPeriod);
		console.log('🎯 Current selectedPeriod:', selectedPeriod);

		console.log('🔄 Processing period change to:', newPeriod);
		console.log('🔄 Setting isLoading to true');
		isLoading = true;
		console.log('🔄 Setting selectedPeriod to:', newPeriod);
		selectedPeriod = newPeriod;
		console.log('🔄 selectedPeriod is now:', selectedPeriod);

		try {
			console.log('🌐 Getting URL from store...');
			const baseUrl = URL;
			console.log('🌐 Base URL:', baseUrl);

			const url = `${baseUrl}/api/dashboard/metrics?period=${encodeURIComponent(newPeriod)}`;
			console.log('📡 Calling API:', url);

			// Fetch new metrics for the selected period using the correct URL
			console.log('📡 Starting fetch request...');
			const response = await fetch(url, {
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			console.log('📊 Response status:', response.status);
			console.log('📊 Response ok:', response.ok);

			if (response.ok) {
				console.log('📊 Parsing JSON response...');
				const result = await response.json();
				console.log('✅ API response:', result);
				console.log('✅ Response data:', result.data);

				// Update the current metrics with new data
				console.log('📈 Updating currentMetrics...');
				currentMetrics = result.data;
				console.log('📈 Updated metrics:', currentMetrics);
			} else {
				console.log('📊 Response not ok, getting error text...');
				const errorText = await response.text();
				console.error('❌ Failed to fetch metrics for period:', newPeriod);
				console.error('❌ Error response:', errorText);
			}
		} catch (error) {
			console.error('💥 Error fetching metrics:', error);
			if (error instanceof Error) {
				console.error('💥 Error details:', error.message);
				console.error('💥 Error stack:', error.stack);
			}
		} finally {
			console.log('🏁 Setting isLoading to false');
			isLoading = false;
			console.log('🏁 Period change complete');
		}
	}

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

	$effect(() => {});
</script>

<section>
	<div class="page-header">
		<div class="header-content">
			<h1>Dashboard</h1>
			<p>Welcome back! Here's an overview of your Reddit lead generation performance.</p>
		</div>
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

	<div class="period-selector">
		<select
			id="period-select"
			bind:value={selectedPeriod}
			onchange={() => {
				console.log('🎯 SELECT CHANGED!');
				handlePeriodChange(selectedPeriod);
			}}
			disabled={isLoading}
			class:loading={isLoading}
		>
			{#each periods as period}
				<option value={period.value}>{period.label}</option>
			{/each}
		</select>
		{#if isLoading}
			<div class="loading-spinner"></div>
		{/if}
	</div>

	<div class="metrics-grid">
		{#each metrics as metric}
			<div
				class="metric-card"
				class:primary={metric.primary}
				onclick={() => handleCardClick(metric.href)}
				role="button"
				tabindex="0"
				onkeydown={(e) => e.key === 'Enter' && handleCardClick(metric.href)}
			>
				<div class="card-header">
					<div class="icon-container">
						{@html icons[metric.icon]}
					</div>
					<div
						class="trend-indicator"
						class:positive={metric.trendUp}
						class:negative={!metric.trendUp}
					>
						<span class="trend-arrow">{metric.trendUp ? '▲' : '▼'}</span>
						<span class="trend-value">{metric.trend}</span>
					</div>
				</div>

				<div class="card-content">
					<h3 class="metric-title">
						{metric.title}
						<span class="timeframe">({metric.timeframe})</span>
					</h3>
					<div class="metric-value">{metric.value}</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<svelte:head>
	<title>Dashboard | Hurricane</title>
</svelte:head>

<style>
	section {
		width: 100%;
		min-height: inherit;
		height: max-content;
		display: flex;
		flex-direction: column;
		gap: 3rem;

		& .page-header {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 2rem;
			margin-bottom: 1rem;

			& .header-content {
				flex: 1;

				& h1 {
					font-size: 2.4rem;
					font-weight: 700;
					color: #222831;
					margin: 0 0 0.8rem 0;
					line-height: 1.2;
				}

				& p {
					font-size: 1.8rem;
					color: #6b7280;
					font-weight: 500;
					margin: 0;
					line-height: 1.5;
				}
			}

			.hamburger-icon {
				cursor: pointer;
				transition: all 0.3s ease;
				padding: 0.1rem;
				border-radius: 0.5rem;

				@media (max-width: 76.8rem) {
					padding: 0.2rem;
					border-radius: 0.8rem;
					transform: scale(1.8);
				}

				@media (max-width: 48rem) {
					padding: 0.3rem;
					border-radius: 1rem;
					transform: scale(2.2);
				}

				&:hover {
					background: rgba(255, 69, 0, 0.1);
					transform: scale(1.05);

					@media (max-width: 76.8rem) {
						transform: scale(2);
					}

					@media (max-width: 48rem) {
						transform: scale(2.4);
					}
				}

				&:focus {
					outline: none;
					background: rgba(255, 69, 0, 0.15);
				}

				&.rotated {
					transform: rotate(90deg);

					@media (max-width: 76.8rem) {
						transform: rotate(90deg) scale(1.8);
					}

					@media (max-width: 48rem) {
						transform: rotate(90deg) scale(2.2);
					}
				}
			}
		}

		& .period-selector {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			position: relative;
			margin-bottom: 2rem;
			width: 100%;

			& select {
				padding: 1.2rem 2rem;
				border: 0.2rem solid #e5e7eb;
				border-radius: 1.2rem;
				background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
				font-size: 1.6rem;
				font-weight: 600;
				color: #374151;
				cursor: pointer;
				transition: all 0.3s ease;
				width: 100%;
				box-shadow: 0 0.4rem 0.6rem rgba(0, 0, 0, 0.05);
				appearance: none;
				background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
				background-position: right 1.5rem center;
				background-repeat: no-repeat;
				background-size: 1.5rem;
				padding-right: 4rem;

				&:hover {
					border-color: #ff4500;
					background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
					transform: translateY(-0.2rem);
					box-shadow: 0 0.8rem 1.5rem rgba(255, 69, 0, 0.15);
				}

				&:focus {
					outline: none;
					border-color: #ff4500;
					background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
					box-shadow:
						0 0 0 0.4rem rgba(255, 69, 0, 0.1),
						0 0.8rem 1.5rem rgba(255, 69, 0, 0.15);
				}

				&:disabled {
					opacity: 0.6;
					cursor: not-allowed;
					transform: none;
				}

				&.loading {
					opacity: 0.7;
				}

				& option {
					font-size: 1.4rem;
					font-weight: 500;
					padding: 0.8rem;
				}
			}

			& .loading-spinner {
				width: 2.4rem;
				height: 2.4rem;
				border: 0.3rem solid #e5e7eb;
				border-top: 0.3rem solid #ff4500;
				border-radius: 50%;
				animation: spin 1s linear infinite;
				position: absolute;
				right: 1.5rem;
				top: 50%;
				transform: translateY(-50%);
			}

			@media (max-width: 76.8rem) {
				margin-bottom: 1.5rem;

				& select {
					padding: 1rem 1.8rem;
					font-size: 1.5rem;
					padding-right: 3.5rem;
				}

				& .loading-spinner {
					width: 2rem;
					height: 2rem;
					right: 1.2rem;
				}
			}

			@media (max-width: 48rem) {
				margin-bottom: 1rem;

				& select {
					padding: 1rem 1.5rem;
					font-size: 1.4rem;
					padding-right: 3.5rem;
				}

				& .loading-spinner {
					width: 1.8rem;
					height: 1.8rem;
					right: 1rem;
				}
			}
		}

		& .metrics-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: auto auto;
			gap: 2rem;
			margin-bottom: 2rem;

			& .metric-card {
				background-color: #ffffff;
				box-shadow:
					rgba(0, 0, 0, 0.02) 0rem 0.1rem 0.3rem 0rem,
					rgba(27, 31, 35, 0.15) 0rem 0rem 0rem 0.1rem;
				border-radius: 1.2rem;
				padding: 2.4rem;
				cursor: pointer;
				transition: all 0.2s ease;
				border: 0.1rem solid #e5e7eb;

				&:hover {
					box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.15);
					transform: translateY(-0.2rem);
					border-color: rgba(255, 69, 0, 0.2);
				}

				&:focus {
					outline: none;
					border-color: rgb(255, 69, 0);
				}

				&.primary {
					grid-column: span 1;
					grid-row: 1;
					min-height: 24rem;
					padding: 3rem;
					background-color: rgba(255, 69, 0, 0.05);
					border: none;
				}

				&:not(.primary) {
					grid-column: span 1;
					grid-row: 2;
					min-height: 18rem;
					padding: 2.4rem;
					background-color: #ffffff;
					border: 0.1rem solid #e5e7eb;
				}

				& .card-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 2rem;

					& .icon-container {
						color: #393e46;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					& .trend-indicator {
						display: flex;
						align-items: center;
						gap: 0.4rem;
						font-size: 1.2rem;
						font-weight: 600;
						padding: 0.4rem 0.8rem;
						border-radius: 0.6rem;

						&.positive {
							background: rgba(34, 197, 94, 0.1);
							color: #16a34a;
						}

						&.negative {
							background: rgba(239, 68, 68, 0.1);
							color: #dc2626;
						}

						& .trend-arrow {
							font-size: 1rem;
						}

						& .trend-value {
							font-size: 1.1rem;
						}
					}
				}

				& .card-content {
					& .metric-title {
						font-size: 1.4rem;
						font-weight: 600;
						color: #393e46;
						text-transform: uppercase;
						letter-spacing: 0.05em;
						margin: 0 0 1rem 0;
						display: flex;
						flex-direction: column;
						gap: 0.4rem;

						& .timeframe {
							font-size: 1rem;
							font-weight: 400;
							color: #6b7280;
							text-transform: none;
							letter-spacing: normal;
						}
					}

					& .metric-value {
						font-size: 3.2rem;
						font-weight: 700;
						color: #222831;
						line-height: 1;
						margin: 0;
					}
				}

				&.primary .card-content {
					& .metric-title {
						font-size: 1.6rem;
						margin-bottom: 1.5rem;
					}

					& .metric-value {
						font-size: 4.8rem;
					}
				}
			}
		}

		@media (max-width: 102.4rem) {
			& .metrics-grid {
				gap: 1.5rem;

				& .metric-card {
					&.primary {
						padding: 2.5rem;
						min-height: 22rem;
					}

					&:not(.primary) {
						padding: 2rem;
						min-height: 16rem;
					}

					&.primary .card-content .metric-value {
						font-size: 4.2rem;
					}
				}
			}
		}

		@media (max-width: 76.8rem) {
			padding: 1.5rem;
			gap: 2rem;

			& .page-header {
				& .header-content {
					& h1 {
						font-size: 2rem;
					}

					& p {
						font-size: 1.4rem;
					}
				}

				svg {
					width: 2.8rem;
					height: 2.8rem;
				}
			}

			& .metrics-grid {
				grid-template-columns: 1fr;
				gap: 1.5rem;

				& .metric-card {
					&.primary,
					&:not(.primary) {
						grid-column: span 1;
						grid-row: auto;
						min-height: 18rem;
						padding: 2rem;
					}

					&.primary .card-content {
						& .metric-title {
							font-size: 1.4rem;
							margin-bottom: 1rem;
						}

						& .metric-value {
							font-size: 3.6rem;
						}
					}

					& .card-content .metric-value {
						font-size: 3rem;
					}
				}
			}
		}

		@media (max-width: 48rem) {
			padding: 1rem;
			gap: 1.5rem;

			& .page-header {
				& .header-content {
					& h1 {
						font-size: 1.8rem;
					}

					& p {
						font-size: 1.3rem;
					}
				}

				svg {
					width: 2.4rem;
					height: 2.4rem;
				}
			}

			& .metrics-grid {
				gap: 1rem;

				& .metric-card {
					padding: 1.5rem;

					&.primary .card-content {
						& .metric-title {
							font-size: 1.2rem;
						}

						& .metric-value {
							font-size: 3rem;
						}
					}

					& .card-content {
						& .metric-title {
							font-size: 1.2rem;
						}

						& .metric-value {
							font-size: 2.6rem;
						}
					}

					& .card-header {
						margin-bottom: 1.5rem;

						& .trend-indicator {
							font-size: 1rem;
							padding: 0.3rem 0.6rem;

							& .trend-value {
								font-size: 1rem;
							}
						}
					}
				}
			}
		}

		@media (max-width: 37.5rem) {
			padding: 0.8rem;
			gap: 1rem;

			& .page-header {
				& .header-content {
					& h1 {
						font-size: 1.6rem;
					}

					& p {
						font-size: 1.2rem;
					}
				}

				svg {
					width: 2rem;
					height: 2rem;
				}
			}

			& .metrics-grid {
				gap: 0.8rem;

				& .metric-card {
					padding: 1.2rem;
					border-radius: 1rem;

					&.primary .card-content {
						& .metric-title {
							font-size: 1.1rem;
						}

						& .metric-value {
							font-size: 2.6rem;
						}
					}

					& .card-content {
						& .metric-title {
							font-size: 1.1rem;
						}

						& .metric-value {
							font-size: 2.2rem;
						}
					}

					& .card-header {
						margin-bottom: 1rem;

						& .trend-indicator {
							font-size: 0.9rem;
							padding: 0.2rem 0.5rem;

							& .trend-value {
								font-size: 0.9rem;
							}
						}
					}
				}
			}
		}
	}

	@keyframes spin {
		0% {
			transform: translateY(-50%) rotate(0deg);
		}
		100% {
			transform: translateY(-50%) rotate(360deg);
		}
	}
</style>
