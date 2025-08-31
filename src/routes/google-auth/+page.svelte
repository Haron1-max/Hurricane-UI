<script lang="ts">
	import { page } from '$app/state';
	import { finishAuth } from '../../utils';

	let authProcessed = $state(false);

	$effect(() => {
		const code = page.url.searchParams.get('code');
		if (code && !authProcessed) {
			authProcessed = true;
			finishAuth(code);
		}
	});
</script>

<svelte:head>
	<title>Hurricane | Google Auth Callback</title>
</svelte:head>

<section>
	<span class="loader"></span>
</section>

<style>
	section {
		width: 100%;
		height: 100dvh;
		display: flex;
		justify-content: center;
		align-items: center;

		& .loader {
			width: 4.8rem;
			height: 4.8rem;
			border: 0.5rem solid #fff;
			border-bottom-color: #ff4500;
			border-radius: 50%;
			display: inline-block;
			box-sizing: border-box;
			animation: rotation 0.5s linear infinite;
		}
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
