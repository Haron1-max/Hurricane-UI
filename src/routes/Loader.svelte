<script lang="ts">
	let { width = '0rem' } = $props<{ width?: string }>();
</script>

<span class="loader" style="width: {width}"></span>

<style>
	.loader {
		/* width: 100%; */
		height: 0.48rem;
		display: inline-block;
		position: relative;
		background: rgba(255, 255, 255, 0.15);
		overflow: hidden;
	}
	.loader::after {
		content: '';
		width: 19.2rem;
		height: 0.48rem;
		background-color: #ff4500;
		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
		animation: animloader 2s linear infinite;
	}

	@keyframes animloader {
		0% {
			left: 0;
			transform: translateX(-100%);
		}
		100% {
			left: 100%;
			transform: translateX(0%);
		}
	}
</style>
