import { getUserRepliesWithPostDetails } from '../../../utils';
import type { ReplyWithPostDetails } from '$lib/types';

export const load = async ({ fetch }): Promise<{ replies: ReplyWithPostDetails[] }> => {
	const replies = await getUserRepliesWithPostDetails(fetch);
	return {
		replies
	};
};
