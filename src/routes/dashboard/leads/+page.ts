import type { PageLoad } from './$types';
import { getLeads } from '../../../utils';
import type { RedditPost } from '../../../lib/types';

export const load: PageLoad = async ({ fetch, params }): Promise<{ leads: RedditPost[] }> => {
	const leads = await getLeads(fetch);
	return { leads };
};
