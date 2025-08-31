<script lang="ts">
	import { createSubreddits, createKeywords, createProject, scanLeads } from '../../utils';
	import { getLoadingState, setLoadingState, URL } from '$lib/state.svelte';
	import Loader from '../Loader.svelte';

	let generatingDescription = $state<boolean>(false);

	let projectName = $state<string>('');
	let projectUrl = $state<string>('');
	let projectDescription = $state<string>('');

	let subreddit = $state<string>('');
	let keyword = $state<string>('');

	let subreddits = $state<string[]>([]);
	let keywords = $state<string[]>([]);

	// Function to add a subreddit
	function addSubreddit(event: KeyboardEvent) {
		subreddit = subreddit.trim();

		// remove r/ incase it's there
		if (subreddit.startsWith('r/')) {
			subreddit = subreddit.slice(2);
		}

		if (event.key === 'Enter' && subreddit !== '') {
			if (!subreddits.includes(subreddit)) {
				subreddits.push(subreddit);
			}
			subreddit = '';
		}
	}

	// Function to remove a subreddit
	function removeSubreddit(event: MouseEvent) {
		const currentTarget = event.currentTarget as HTMLDivElement;
		const spanElement = currentTarget.querySelector('span');
		const subreddit = spanElement?.textContent;
		if (subreddit) {
			subreddits = subreddits.filter((s) => s !== subreddit);
		}
	}

	// Function to add a keyword
	function addKeyword(event: KeyboardEvent) {
		// Only trim leading and trailing spaces, preserve spaces between words
		const trimmedKeyword = keyword.trim();
		if (event.key === 'Enter' && trimmedKeyword !== '') {
			if (!keywords.includes(trimmedKeyword)) {
				keywords.push(trimmedKeyword);
			}
			keyword = '';
		}
	}

	// Function to remove a keyword
	function removeKeyword(event: MouseEvent) {
		const currentTarget = event.currentTarget as HTMLDivElement;
		const spanElement = currentTarget.querySelector('span');
		const keyword = spanElement?.textContent;
		if (keyword) {
			keywords = keywords.filter((k) => k !== keyword);
		}
	}

	async function submitSubredditsAndKeywords() {
		setLoadingState(true);

		try {
			// First, create subreddits and keywords
			const results = await Promise.allSettled([
				createSubreddits(subreddits),
				createKeywords(keywords),
				createProject(projectName, projectUrl, projectDescription)
			]);

			// Handle results
			const [subredditResult, keywordResult, projectResult] = results;

			if (subredditResult.status === 'fulfilled') {
				console.log('✅ Subreddits created successfully');
			} else {
				console.error('❌ Subreddits failed:', subredditResult.reason);
			}

			if (keywordResult.status === 'fulfilled') {
				console.log('✅ Keywords created successfully');
			} else {
				console.error('❌ Keywords failed:', keywordResult.reason);
			}

			if (projectResult.status === 'fulfilled') {
				console.log('✅ Project created successfully');
			} else {
				console.error('❌ Project failed:', projectResult.reason);
			}

			// Only proceed if at least one succeeded
			if (
				subredditResult.status === 'fulfilled' ||
				keywordResult.status === 'fulfilled' ||
				projectResult.status === 'fulfilled'
			) {
				// Now run scanLeads last
				try {
					console.log('🔄 Starting initial lead scan...');
					await scanLeads();
					console.log('✅ Initial lead scan completed');
				} catch (error) {
					console.error('❌ Initial lead scan failed:', error);
				}

				location.replace('/dashboard');
			}
		} catch (error) {
			console.error('❌ Setup failed:', error);
		} finally {
			setLoadingState(false);
		}
	}

	const generateDescription = async () => {
		if (!projectUrl.trim()) {
			alert('Please enter a website URL first');
			return;
		}

		generatingDescription = true;

		const url = `${URL}/api/user/description/generate`;

		try {
			const response = await fetch(url, {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				redirect: 'follow',
				referrerPolicy: 'no-referrer',
				body: JSON.stringify({ website_url: projectUrl })
			});

			if (response.ok) {
				const result = await response.json();
				if (result.success && result.data && result.data.description) {
					projectDescription = result.data.description;
				} else {
					alert('Failed to generate description. Please try again.');
				}
			} else {
				alert('Failed to generate description. Please try again.');
			}
		} catch (error) {
			console.error('Error generating description:', error);
			alert('Failed to generate description. Please try again.');
		} finally {
			generatingDescription = false;
		}
	};
</script>

<svelte:head>
	<title>Hurricane | Subreddits and Keywords Setup</title>
</svelte:head>

<section>
	<div class="page-heading">
		<h1>Let's Set Up Your First Project</h1>
		<p>Tell our AI where to look. The more specific you are, the better your leads will be.</p>
	</div>
	<div class="project">
		<div class="card-heading">
			<h4>Project Details</h4>
			<p>Tell us about your project so our AI can create better, more contextual replies.</p>
		</div>
		<div class="project-form">
			<div class="form-group">
				<label for="project-name">Project Name</label>
				<input
					id="project-name"
					type="text"
					placeholder="e.g., SaaS Launch Campaign"
					bind:value={projectName}
				/>
			</div>
			<div class="form-group">
				<label for="project-url">Website URL</label>
				<input
					id="project-url"
					type="url"
					placeholder="https://yourwebsite.com"
					bind:value={projectUrl}
				/>
			</div>
			<div class="form-group">
				<label for="project-description">Project Description</label>
				<textarea
					id="project-description"
					placeholder="Describe your project, what problem it solves, and who it's for..."
					bind:value={projectDescription}
					rows="4"
				></textarea>
				{#if generatingDescription}
					<Loader width="100%" />
				{:else}
					<div class="generate-description" role="none" onclick={generateDescription}>
						Generate Description with AI
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="subreddits">
		<div class="card-heading">
			<h4>Subreddits</h4>
			<p>Enter the names of subreddits, without the "r/". Press Enter to add each one.</p>
		</div>
		<div class="subreddit-list">
			{#each subreddits as subreddit}
				<div class="subreddit-item" onclick={(e) => removeSubreddit(e)} role="none">
					<span>{subreddit}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="13"
						height="13"
						fill="#393e46"
						viewBox="0 0 256 256"
						><path
							d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
						></path></svg
					>
				</div>
			{/each}
			<input
				type="text"
				placeholder="Add a subreddit"
				bind:value={subreddit}
				onkeydown={(e) => addSubreddit(e)}
			/>
		</div>
	</div>

	<div class="keywords">
		<div class="card-heading">
			<h4>Keywords</h4>
			<p>
				Enter words or phrases people use when they need a product like yours. Press Enter to add
				each one.
			</p>
		</div>
		<div class="keyword-list">
			{#each keywords as keyword}
				<div class="keyword-item" onclick={(e) => removeKeyword(e)} role="none">
					<span>{keyword}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="13"
						height="13"
						fill="#393e46"
						viewBox="0 0 256 256"
						><path
							d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
						></path></svg
					>
				</div>
			{/each}
			<input
				type="text"
				placeholder="Add a keyword"
				bind:value={keyword}
				onkeydown={(e) => addKeyword(e)}
			/>
		</div>
	</div>

	{#if getLoadingState()}
		<Loader width="60rem" />
	{:else}
		<button onclick={submitSubredditsAndKeywords}> Start scanning 🚀 </button>
	{/if}
</section>

<style>
	section {
		width: 100%;
		height: max-content;
		min-height: 100dvh;
		background-image:
			radial-gradient(circle at 20% 80%, rgba(255, 160, 146, 0.25) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(255, 244, 228, 0.3) 0%, transparent 50%),
			radial-gradient(circle at 40% 40%, rgba(255, 160, 146, 0.15) 0%, transparent 50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		gap: 4rem;

		& .page-heading {
			width: 60rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;

			& h1 {
				font-size: 2rem;
				font-weight: 900;
				color: #222831;
			}

			& p {
				font-size: 1.5rem;
				color: #393e46;
				font-weight: 500;
			}
		}

		& .project {
			width: 60rem;
			height: max-content;
			padding: 2rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			background-color: #ffffff;
			box-shadow:
				rgba(255, 255, 255, 0.2) 0rem 0rem 0rem 0.1rem inset,
				rgba(0, 0, 0, 0.9) 0rem 0rem 0rem 0.1rem;
			border-radius: 0.6rem;

			.card-heading {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;

				& h4 {
					font-size: 1.3rem;
					font-weight: 500;
					color: #222831;
					text-transform: uppercase;
				}

				& p {
					font-size: 1.5rem;
					font-weight: 500;
					color: #393e46;
				}
			}

			& .project-form {
				display: flex;
				flex-direction: column;
				gap: 2rem;
				width: 100%;

				& .form-group {
					display: flex;
					flex-direction: column;
					gap: 0.5rem;

					& label {
						font-size: 1.4rem;
						font-weight: 500;
						color: #222831;
					}

					& input,
					& textarea {
						padding: 1rem;
						border: 0.1rem solid rgb(0, 0, 0, 0.1);
						border-radius: 0.4rem;
						font-size: 1.4rem;
						font-weight: 500;
						color: #393e46;
						background-color: #ffffff;
						resize: vertical;

						&:focus {
							outline: none;
							border-color: #ff4500;
							box-shadow: 0 0 0 0.2rem rgba(255, 69, 0, 0.1);
						}

						&::placeholder {
							color: #999;
							font-weight: 400;
						}
					}

					& textarea {
						min-height: 10rem;
						font-family: inherit;
					}

					& div.generate-description {
						font-size: 1.4rem;
						font-weight: 500;
						color: #393e46;
						width: max-content;
						padding: 0.5rem 1rem;
						cursor: pointer;
						background-color: #9112bc;
						border: none;
						color: #ffffff;
						display: flex;
						align-items: center;
						gap: 0.5rem;
						font-weight: 500;
						border-radius: 0.3rem;
					}
				}
			}
		}

		& .subreddits {
			width: 60rem;
			height: max-content;
			padding: 2rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			background-color: #ffffff;
			box-shadow:
				rgba(255, 255, 255, 0.2) 0rem 0rem 0rem 0.1rem inset,
				rgba(0, 0, 0, 0.9) 0rem 0rem 0rem 0.1rem;
			border-radius: 0.6rem;

			.card-heading {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;

				& h4 {
					font-size: 1.3rem;
					font-weight: 500;
					color: #222831;
					text-transform: uppercase;
				}

				& p {
					font-size: 1.5rem;
					font-weight: 500;
					color: #393e46;
				}
			}

			& .subreddit-list {
				display: flex;
				align-items: center;
				flex-flow: row wrap;
				gap: 1rem;
				border: 0.1rem solid rgb(0, 0, 0, 0.1);
				padding: 1rem;
				border-radius: inherit;
				min-height: max-content;

				& .subreddit-item {
					background-color: #e9e9e9;
					padding: 0.5rem 1rem;
					display: flex;
					align-items: center;
					gap: 1rem;
					border-radius: inherit;

					& span {
						font-size: 1.5rem;
						font-weight: 500;
						color: #393e46;
					}

					& svg {
						cursor: pointer;
					}
				}

				& input {
					padding: 0.5rem;
					border: none;
					outline: none;
					font-size: 1.5rem;
					font-weight: 500;
					color: #393e46;
				}
			}
		}

		& .keywords {
			width: 60rem;
			height: max-content;
			padding: 2rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			background-color: #ffffff;
			box-shadow:
				rgba(255, 255, 255, 0.2) 0rem 0rem 0rem 0.1rem inset,
				rgba(0, 0, 0, 0.9) 0rem 0rem 0rem 0.1rem;
			border-radius: 0.6rem;

			.card-heading {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;

				& h4 {
					font-size: 1.3rem;
					font-weight: 500;
					color: #222831;
					text-transform: uppercase;
				}

				& p {
					font-size: 1.5rem;
					font-weight: 500;
					color: #393e46;
				}
			}

			& .keyword-list {
				display: flex;
				align-items: center;
				flex-flow: row wrap;
				gap: 1rem;
				border: 0.1rem solid rgb(0, 0, 0, 0.1);
				padding: 1rem;
				border-radius: inherit;
				min-height: max-content;

				& .keyword-item {
					background-color: #e9e9e9;
					padding: 0.5rem 1rem;
					display: flex;
					align-items: center;
					gap: 1rem;
					border-radius: inherit;

					& span {
						font-size: 1.5rem;
						font-weight: 500;
						color: #393e46;
					}

					& svg {
						cursor: pointer;
					}
				}

				& input {
					padding: 0.5rem;
					border: none;
					outline: none;
					font-size: 1.5rem;
					font-weight: 500;
					color: #393e46;
				}
			}
		}

		& button {
			background-color: #ff4500;
			color: #ffffff;
			padding: 1rem 2rem;
			border: none;
			border-radius: 0.6rem;
			width: 60rem;
			height: 5rem;
			font-size: 1.5rem;
			font-weight: 600;
			cursor: pointer;
			transition: all 0.3s ease;
			text-transform: uppercase;
		}

		@media (min-width: 144rem) {
			padding: 3rem;
			gap: 5rem;

			& .page-heading {
				width: 70rem;

				& h1 {
					font-size: 2.4rem;
				}

				& p {
					font-size: 1.7rem;
				}
			}

			& .project,
			& .subreddits,
			& .keywords {
				width: 70rem;
				padding: 2.5rem;

				.card-heading {
					& h4 {
						font-size: 1.5rem;
					}

					& p {
						font-size: 1.7rem;
					}
				}

				& .project-form {
					gap: 1.8rem;

					& .form-group {
						& label {
							font-size: 1.6rem;
						}

						& input,
						& textarea {
							font-size: 1.6rem;
							padding: 1.2rem;
						}

						& textarea {
							min-height: 12rem;
						}
					}
				}

				& .subreddit-list,
				& .keyword-list {
					& .subreddit-item,
					& .keyword-item {
						padding: 0.7rem 1.2rem;

						& span {
							font-size: 1.7rem;
						}
					}

					& input {
						font-size: 1.7rem;
						padding: 0.7rem;
					}
				}
			}

			& button {
				width: 70rem;
				height: 5.5rem;
				font-size: 1.7rem;
			}
		}

		@media (min-width: 102.4rem) and (max-width: 143.9rem) {
			padding: 2.5rem;
			gap: 4.5rem;

			& .page-heading {
				width: 65rem;

				& h1 {
					font-size: 2.2rem;
				}

				& p {
					font-size: 1.6rem;
				}
			}

			& .subreddits,
			& .keywords,
			& .project {
				width: 65rem;
				padding: 2.2rem;

				.card-heading {
					& h4 {
						font-size: 1.4rem;
					}

					& p {
						font-size: 1.6rem;
					}
				}

				& .subreddit-list,
				& .keyword-list {
					& .subreddit-item,
					& .keyword-item {
						padding: 0.6rem 1.1rem;

						& span {
							font-size: 1.6rem;
						}
					}

					& input {
						font-size: 1.6rem;
						padding: 0.6rem;
					}
				}
			}

			& button {
				width: 65rem;
				height: 5.2rem;
				font-size: 1.6rem;
			}
		}

		@media (min-width: 76.8rem) and (max-width: 102.3rem) {
			padding: 2rem;
			gap: 3.5rem;

			& .page-heading {
				width: 90%;
				max-width: 55rem;

				& h1 {
					font-size: 2rem;
				}

				& p {
					font-size: 1.4rem;
				}
			}

			& .subreddits,
			& .keywords,
			& .project {
				width: 90%;
				max-width: 55rem;
				padding: 2rem;

				.card-heading {
					& h4 {
						font-size: 1.3rem;
					}

					& p {
						font-size: 1.4rem;
					}
				}

				& .subreddit-list,
				& .keyword-list {
					& .subreddit-item,
					& .keyword-item {
						padding: 0.5rem 1rem;

						& span {
							font-size: 1.4rem;
						}
					}

					& input {
						font-size: 1.4rem;
						padding: 0.5rem;
					}
				}
			}

			& button {
				width: 90%;
				max-width: 55rem;
				height: 4.8rem;
				font-size: 1.4rem;
			}
		}

		@media (min-width: 64rem) and (max-width: 76.7rem) {
			padding: 1.5rem;
			gap: 3rem;

			& .page-heading {
				width: 95%;

				& h1 {
					font-size: 1.8rem;
				}

				& p {
					font-size: 1.3rem;
				}
			}

			& .subreddits,
			& .keywords,
			& .project {
				width: 95%;
				padding: 1.5rem;

				.card-heading {
					& h4 {
						font-size: 1.2rem;
					}

					& p {
						font-size: 1.3rem;
					}
				}

				& .subreddit-list,
				& .keyword-list {
					& .subreddit-item,
					& .keyword-item {
						padding: 0.4rem 0.8rem;

						& span {
							font-size: 1.3rem;
						}

						& svg {
							width: 1.2rem;
							height: 1.2rem;
						}
					}

					& input {
						font-size: 1.3rem;
						padding: 0.4rem;
					}
				}
			}

			& button {
				width: 95%;
				height: 4.5rem;
				font-size: 1.3rem;
			}
		}

		@media (min-width: 48rem) and (max-width: 63.9rem) {
			padding: 1.2rem;
			gap: 2.5rem;

			& .page-heading {
				width: 100%;

				& h1 {
					font-size: 1.6rem;
				}

				& p {
					font-size: 1.2rem;
				}
			}

			& .subreddits,
			& .keywords,
			& .project {
				width: 100%;
				padding: 1.2rem;

				.card-heading {
					& h4 {
						font-size: 1.1rem;
					}

					& p {
						font-size: 1.2rem;
					}
				}

				& .subreddit-list,
				& .keyword-list {
					& .subreddit-item,
					& .keyword-item {
						padding: 0.3rem 0.7rem;

						& span {
							font-size: 1.2rem;
						}

						& svg {
							width: 1.1rem;
							height: 1.1rem;
						}
					}

					& input {
						font-size: 1.2rem;
						padding: 0.3rem;
						flex: 1;
						min-width: 12rem;
					}
				}
			}

			& button {
				width: 100%;
				height: 4.2rem;
				font-size: 1.2rem;
			}
		}

		@media (max-width: 47.9rem) {
			padding: 1rem;
			gap: 2rem;

			& .page-heading {
				width: 100%;

				& h1 {
					font-size: 1.4rem;
				}

				& p {
					font-size: 1.1rem;
				}
			}

			& .subreddits,
			& .keywords,
			& .project {
				width: 100%;
				padding: 1rem;

				.card-heading {
					& h4 {
						font-size: 1rem;
					}

					& p {
						font-size: 1.1rem;
					}
				}

				& .subreddit-list,
				& .keyword-list {
					& .subreddit-item,
					& .keyword-item {
						padding: 0.3rem 0.6rem;

						& span {
							font-size: 1.1rem;
						}

						& svg {
							width: 1rem;
							height: 1rem;
						}
					}

					& input {
						font-size: 1.1rem;
						padding: 0.3rem;
						flex: 1;
						min-width: 10rem;
					}
				}
			}

			& button {
				width: 100%;
				height: 4rem;
				font-size: 1.1rem;
			}
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
