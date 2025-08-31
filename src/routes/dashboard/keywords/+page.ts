import { getKeywords } from '../../../utils';
import type { Keyword } from '$lib/types';

export const load = async ({ fetch }): Promise<{ keywords: Keyword[] }> => {
	const keywords = await getKeywords(fetch);
	return {
		keywords
	};
};
