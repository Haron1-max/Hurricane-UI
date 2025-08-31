import { getDashboardMetrics, makeAuthenticatedRequest } from '../../utils';
import type { DashboardMetrics } from '../../lib/types';

export const load = async ({
	fetch
}): Promise<{
	metrics: DashboardMetrics;
}> => {
	const metrics = await getDashboardMetrics(undefined, fetch);

	return {
		metrics
	};
};
