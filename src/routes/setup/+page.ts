import { makeAuthenticatedRequest } from '../../utils';

export const load = async ({ fetch }) => {
	await makeAuthenticatedRequest(fetch);
};
