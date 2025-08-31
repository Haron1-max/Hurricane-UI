import { getSubreddits } from '../../../utils';
import type { Subreddit } from '$lib/types';

export const load = async ({ fetch }): Promise<{ subreddits: Subreddit[] }> => {
	const subreddits = await getSubreddits(fetch);
	return {
		subreddits
	};
};
