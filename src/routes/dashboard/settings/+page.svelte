<script lang="ts">
	import {
		getSidebarOpenState,
		setSidebarOpenState,
		showToast,
		getLoadingState
	} from '$lib/state.svelte';
	import { updateUser, updateUserPassword, logoutUser, deleteUser } from '../../../utils';
	import Loader from '../../Loader.svelte';

	let { data } = $props();

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

	// User profile state - initialize from data
	let fullName = $state<string>(data.userWithSubscription?.full_name || '');
	let email = $state<string>(data.userWithSubscription?.email || '');
	let currentPassword = $state<string>('');
	let newPassword = $state<string>('');
	let confirmPassword = $state<string>('');

	// Format member since date
	function formatMemberSince(dateString: string | null) {
		if (!dateString) return 'Unknown';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Get plan name based on subscription status
	function getPlanName(statusObj: { subscription_status: string; valid: boolean } | null) {
		if (!statusObj) return 'No Plan';

		switch (statusObj.subscription_status) {
			case 'trial':
				return 'Pro Trial';
			case 'active':
				return 'Pro Plan';
			case 'cancelled':
				return 'Cancelled Plan';
			case 'expired':
				return 'Expired Plan';
			default:
				return 'No Plan';
		}
	}

	function getPlanStatusColor(statusObj: { subscription_status: string; valid: boolean } | null) {
		if (!statusObj) return '#6b7280';

		switch (statusObj.subscription_status) {
			case 'trial':
				return '#f59e0b';
			case 'active':
				return '#10b981';
			case 'cancelled':
				return '#ef4444';
			case 'expired':
				return '#ef4444';
			default:
				return '#6b7280';
		}
	}

	function getPlanStatusText(statusObj: { subscription_status: string; valid: boolean } | null) {
		if (!statusObj) return 'Unknown';

		switch (statusObj.subscription_status) {
			case 'trial':
				return 'Trial';
			case 'active':
				return 'Active';
			case 'cancelled':
				return 'Cancelled';
			case 'expired':
				return 'Expired';
			default:
				return 'Unknown';
		}
	}

	async function updateProfile() {
		if (
			fullName === data.userWithSubscription?.full_name &&
			email === data.userWithSubscription?.email
		) {
			showToast('No changes to update', 'warning');
			return;
		}

		if (fullName === '') {
			showToast('Full name is required', 'error');
			return;
		}
		if (email === '') {
			showToast('Email is required', 'error');
			return;
		}

		const updatedUser = await updateUser(fullName, email);
		fullName = updatedUser.full_name;
		email = updatedUser.email;
	}

	async function updatePassword() {
		if (newPassword === '') {
			showToast('New password is required', 'error');
			return;
		}
		if (confirmPassword === '') {
			showToast('Confirm password is required', 'error');
			return;
		}
		if (newPassword !== confirmPassword) {
			showToast('New passwords do not match', 'error');
			return;
		}

		await updateUserPassword(currentPassword, newPassword, confirmPassword);

		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
	}
</script>

<section>
	<div class="settings-header">
		<h1>Settings</h1>
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
	<div class="settings-content">
		<div class="settings-content-header">
			<p>Manage your account settings and preferences.</p>
		</div>
		<div class="settings-content-body">
			<!-- Account Information Card -->
			<div class="settings-card">
				<div class="card-header">
					<h3>Account Information</h3>
					<p>Your basic account details and subscription information.</p>
				</div>
				<div class="account-info">
					<div class="info-item">
						<span class="info-label">Member Since</span>
						<span>{formatMemberSince(data.userWithSubscription?.user_created_at || null)}</span>
					</div>
					<div class="info-item">
						<span class="info-label">Subscription Plan</span>
						<div class="plan-status">
							<span class="plan-name"
								>{getPlanName(data.userWithSubscription?.subscription_status || null)}</span
							>
							<span
								class="status-badge"
								style="background-color: {getPlanStatusColor(
									data.userWithSubscription?.subscription_status || null
								)}"
							>
								{getPlanStatusText(data.userWithSubscription?.subscription_status || null)}
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Profile Settings Card -->
			<div class="settings-card">
				<div class="card-header">
					<h3>Profile Settings</h3>
					<p>Update your personal information.</p>
				</div>
				<div class="form-group">
					<label for="fullName">Full Name</label>
					<input
						type="text"
						id="fullName"
						bind:value={fullName}
						placeholder="Enter your full name"
					/>
				</div>
				<div class="form-group">
					<label for="email">Email Address</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						placeholder="Enter your email address"
					/>
				</div>
				{#if getLoadingState()}
					<Loader width="100%" />
				{:else}
					<button class="btn-save" onclick={updateProfile}>
						<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
						</svg>
						Save Changes
					</button>
				{/if}
			</div>

			<!-- Password Settings Card -->
			<div class="settings-card">
				<div class="card-header">
					<h3>Password Settings</h3>
					<p>Update your account password.</p>
				</div>
				{#if data.userWithSubscription?.password_hash}
					<div class="form-group">
						<label for="currentPassword">Current Password</label>
						<input
							type="password"
							id="currentPassword"
							bind:value={currentPassword}
							placeholder="Enter your current password"
							autocomplete="new-password"
						/>
					</div>
				{/if}
				<div class="form-group">
					<label for="newPassword">New Password</label>
					<input
						type="password"
						id="newPassword"
						bind:value={newPassword}
						placeholder="Enter your new password"
						autocomplete="new-password"
					/>
				</div>
				<div class="form-group">
					<label for="confirmPassword">Confirm New Password</label>
					<input
						type="password"
						id="confirmPassword"
						bind:value={confirmPassword}
						placeholder="Confirm your new password"
						autocomplete="new-password"
					/>
				</div>
				{#if getLoadingState()}
					<Loader width="100%" />
				{:else}
					<button class="btn-save" onclick={updatePassword}>
						<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
							/>
						</svg>
						Update Password
					</button>
				{/if}
			</div>

			<!-- Danger Zone Card -->
			<div class="settings-card danger-zone">
				<div class="card-header">
					<h3>Danger Zone</h3>
					<p>Irreversible and destructive actions.</p>
				</div>
				<div class="danger-actions">
					{#if getLoadingState()}
						<Loader width="100%" />
					{:else}
						<button class="btn-logout" onclick={logoutUser}>
							<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
								/>
							</svg>
							Logout
						</button>
					{/if}
					<button class="btn-delete" onclick={deleteUser}>
						<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
							/>
						</svg>
						Delete Account
					</button>
				</div>
			</div>
		</div>
	</div>
</section>

<svelte:head>
	<title>Settings | Hurricane</title>
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

		& .settings-header {
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

		& .settings-content {
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

			& .settings-content-header {
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

			& .settings-content-body {
				display: flex;
				flex-direction: column;
				gap: 2rem;

				@media (max-width: 76.8rem) {
					gap: 1.5rem;
				}

				@media (max-width: 48rem) {
					gap: 1rem;
				}

				& .settings-card {
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

					&.danger-zone {
						border: 0.2rem solid #fecaca;
						background: linear-gradient(135deg, #fef2f2, #fecaca);
						position: relative;
						overflow: hidden;

						&::before {
							content: '⚠️';
							position: absolute;
							top: 1rem;
							right: 1rem;
							font-size: 2rem;
							opacity: 0.3;
							z-index: 1;
						}

						&:hover {
							border-color: #f87171;
							background: linear-gradient(135deg, #fecaca, #fca5a5);
							transform: translateY(-0.2rem);
							box-shadow: 0 0.8rem 2.5rem rgba(239, 68, 68, 0.15);
						}
					}

					& .card-header {
						margin-bottom: 2rem;

						@media (max-width: 76.8rem) {
							margin-bottom: 1.5rem;
						}

						@media (max-width: 48rem) {
							margin-bottom: 1rem;
						}

						& h3 {
							font-size: 2.2rem;
							font-weight: 600;
							color: #222831;
							margin: 0 0 0.5rem 0;

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

					& .account-info {
						display: flex;
						flex-direction: column;
						gap: 1.5rem;

						@media (max-width: 76.8rem) {
							gap: 1.2rem;
						}

						@media (max-width: 48rem) {
							gap: 1rem;
						}

						& .info-item {
							display: flex;
							justify-content: space-between;
							align-items: center;
							padding: 2rem;
							background: linear-gradient(135deg, #f8fafc, #f1f5f9);
							border-radius: 1rem;
							border: 0.1rem solid #e2e8f0;
							transition: all 0.2s ease;
							position: relative;
							overflow: hidden;

							@media (max-width: 120rem) {
								padding: 1.8rem;
							}

							@media (max-width: 76.8rem) {
								padding: 1.5rem;
								border-radius: 0.8rem;
							}

							@media (max-width: 48rem) {
								padding: 1.2rem;
								flex-direction: column;
								align-items: flex-start;
								gap: 0.8rem;
							}

							&::before {
								content: '';
								position: absolute;
								top: 0;
								left: 0;
								width: 0.4rem;
								height: 100%;
								background: linear-gradient(180deg, rgb(255, 69, 0), #ff8c42);
							}

							&:hover {
								background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
								transform: translateY(-0.2rem);
								box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.1);
							}

							& .info-label {
								font-size: 1.8rem;
								font-weight: 600;
								color: #222831;
								display: flex;
								align-items: center;
								gap: 0.8rem;

								@media (max-width: 120rem) {
									font-size: 1.7rem;
								}

								@media (max-width: 76.8rem) {
									font-size: 1.6rem;
								}

								@media (max-width: 48rem) {
									font-size: 1.5rem;
								}

								&::before {
									content: '📅';
									font-size: 1.2rem;
								}
							}

							& span {
								font-size: 1.8rem;
								color: #374151;
								font-weight: 500;

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

							& .plan-status {
								display: flex;
								align-items: center;
								gap: 1.2rem;

								@media (max-width: 76.8rem) {
									gap: 1rem;
								}

								@media (max-width: 48rem) {
									gap: 0.8rem;
									flex-direction: column;
									align-items: flex-start;
								}

								& .plan-name {
									font-weight: 600;
									color: #222831;
									font-size: 1.9rem;

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

								& .status-badge {
									padding: 0.6rem 1.2rem;
									border-radius: 2rem;
									font-size: 1.1rem;
									font-weight: 700;
									color: white;
									text-transform: uppercase;
									letter-spacing: 0.05em;
									box-shadow: 0 0.2rem 8rem rgba(0, 0, 0, 0.15);
									position: relative;
									overflow: hidden;

									@media (max-width: 120rem) {
										padding: 0.5rem 1rem;
										font-size: 1rem;
									}

									@media (max-width: 76.8rem) {
										padding: 0.4rem 0.8rem;
										font-size: 0.9rem;
									}

									@media (max-width: 48rem) {
										padding: 0.3rem 0.6rem;
										font-size: 0.8rem;
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
								}
							}

							&:nth-child(2) .info-label::before {
								content: '💎';
							}
						}
					}

					& .form-group {
						margin-bottom: 2rem;
						position: relative;

						@media (max-width: 76.8rem) {
							margin-bottom: 1.5rem;
						}

						@media (max-width: 48rem) {
							margin-bottom: 1rem;
						}

						& label {
							display: block;
							font-size: 1.8rem;
							font-weight: 600;
							color: #222831;
							margin-bottom: 1rem;
							display: flex;
							align-items: center;
							gap: 0.8rem;

							@media (max-width: 120rem) {
								font-size: 1.7rem;
							}

							@media (max-width: 76.8rem) {
								font-size: 1.6rem;
								margin-bottom: 0.8rem;
							}

							@media (max-width: 48rem) {
								font-size: 1.5rem;
								margin-bottom: 0.6rem;
							}

							&::before {
								content: '👤';
								font-size: 1.2rem;
							}
						}

						& input {
							width: 100%;
							padding: 1.4rem 1.8rem;
							border: 0.2rem solid #e2e8f0;
							border-radius: 1rem;
							font-size: 1.8rem;
							color: #374151;
							background: linear-gradient(135deg, #ffffff, #f8fafc);
							transition: all 0.3s ease;
							position: relative;

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
								transform: translateY(-0.1rem);
								box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.05);
							}

							&::placeholder {
								color: #9ca3af;
								font-weight: 400;
							}
						}

						&:nth-child(2) label::before {
							content: '📧';
						}

						&:nth-child(3) label::before {
							content: '🔒';
						}

						&:nth-child(4) label::before {
							content: '🔑';
						}

						&:nth-child(5) label::before {
							content: '✅';
						}
					}

					& .btn-save {
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 1rem;
						padding: 1.4rem 2.4rem;
						background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
						color: white;
						border: none;
						border-radius: 1.2rem;
						font-size: 1.8rem;
						font-weight: 700;
						cursor: pointer;
						transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
						position: relative;
						overflow: hidden;
						text-transform: uppercase;
						letter-spacing: 0.05em;
						box-shadow: 0 0.4rem 1.2rem rgba(30, 64, 175, 0.3);

						@media (max-width: 120rem) {
							padding: 1.3rem 2.2rem;
							font-size: 1.7rem;
						}

						@media (max-width: 76.8rem) {
							padding: 1.2rem 2rem;
							font-size: 1.6rem;
							border-radius: 1rem;
							width: 100%;
						}

						@media (max-width: 48rem) {
							padding: 1.1rem 1.8rem;
							font-size: 1.5rem;
							border-radius: 0.8rem;
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
								rgba(255, 255, 255, 0.3),
								transparent
							);
							transition: left 0.6s ease;
						}

						&:hover {
							background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
							transform: translateY(-0.3rem);
							box-shadow: 0 0.8rem 2.5rem rgba(30, 64, 175, 0.4);

							&::before {
								left: 100%;
							}
						}

						&:active {
							transform: translateY(-0.1rem);
							box-shadow: 0 0.4rem 1.5rem rgba(30, 64, 175, 0.3);
						}
					}

					& .danger-actions {
						display: flex;
						flex-direction: row;
						gap: 1.5rem;

						@media (max-width: 76.8rem) {
							gap: 1.2rem;
						}

						@media (max-width: 48rem) {
							flex-direction: column;
							gap: 1rem;
						}

						& .btn-logout {
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 0.8rem;
							padding: 1.2rem 1.8rem;
							background: linear-gradient(135deg, #ef4444, #dc2626);
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
								padding: 1rem 1.5rem;
								font-size: 1.7rem;
							}

							@media (max-width: 76.8rem) {
								padding: 0.8rem 1.2rem;
								font-size: 1.6rem;
								border-radius: 0.8rem;
							}

							@media (max-width: 48rem) {
								padding: 0.7rem 1rem;
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
								background: linear-gradient(135deg, #dc2626, #b91c1c);
								transform: translateY(-0.2rem);
								box-shadow: 0 0.6rem 1.6rem rgba(239, 68, 68, 0.4);

								&::before {
									left: 100%;
								}
							}

							&:active {
								transform: translateY(0);
							}
						}

						& .btn-delete {
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 0.8rem;
							padding: 1.2rem 1.8rem;
							background: linear-gradient(135deg, #991b1b, #7f1d1d);
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
								padding: 1rem 1.5rem;
								font-size: 1.7rem;
							}

							@media (max-width: 76.8rem) {
								padding: 0.8rem 1.2rem;
								font-size: 1.6rem;
								border-radius: 0.8rem;
							}

							@media (max-width: 48rem) {
								padding: 0.7rem 1rem;
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
								background: linear-gradient(135deg, #7f1d1d, #450a0a);
								transform: translateY(-0.2rem);
								box-shadow: 0 0.6rem 1.6rem rgba(153, 27, 27, 0.4);

								&::before {
									left: 100%;
								}
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

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
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
</style>
