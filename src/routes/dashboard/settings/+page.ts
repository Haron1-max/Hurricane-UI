import { getUserWithSubscription } from '../../../utils';

export const load = async ({ fetch }) => {
	const userWithSubscription = await getUserWithSubscription(fetch);

	return {
		userWithSubscription
	};
};
