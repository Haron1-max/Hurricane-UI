import { setLoadingState, showToast, URL } from '$lib/state.svelte';
import { redirect } from '@sveltejs/kit';
import type {
	RedditPost,
	Subreddit,
	Keyword,
	Reply,
	DashboardMetrics,
	UserWithSubscription,
	ReplyWithPostDetails
} from './lib/types';

export const getAuthURL = async () => {
	const url = `${URL}/api/google/auth`;

	await fetch(url, {
		method: 'GET',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer'
	})
		.then(async (response) => {
			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.message);
			}

			return response.json();
		})
		.then((data: any) => {
			showToast('Authentication URL fetched successfully', 'success');
			location.replace(data.data.url);
		})
		.catch((error) => {
			showToast(
				error instanceof Error ? error.message : 'Failed to get authentication URL',
				'error'
			);
		})
		.finally(() => {
			showToast('Authentication operation completed', 'info');
		});
};

// finish auth
export const finishAuth = async (code: string) => {
	const url = `${URL}/api/google/auth/finish`;

	await fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify({ google_auth_code: code })
	})
		.then(async (response) => {
			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.message);
			}

			return response.json();
		})
		.then((data) => {
			showToast('Authentication successful', 'success');
			if (data.data.intent === 'login') {
				location.replace('/dashboard');
			} else {
				location.replace('/setup');
			}
		})
		.catch((error) => {
			console.log(error);
			showToast(error instanceof Error ? error.message : 'Failed to authenticate', 'error');
			setTimeout(() => {
				location.replace('/');
			}, 4000);
		})
		.finally(() => {
			showToast('Authentication completed', 'info');
		});
};

export const makeAuthenticatedRequest = async (fetchFn?: typeof fetch) => {
	const url = `${URL}/api/user/profile`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			credentials: 'include', // Include session cookie
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const errorData = await response.json();

			// Check if it's an auth error
			if (response.status === 401) {
				console.log('Auth required:', errorData.error);
				// When called from load function, throw redirect directly
				// When called from browser, redirect will work
				throw redirect(302, '/');
			}

			throw new Error(errorData.error);
		}

		const result = await response.json();
		showToast('Request successful', 'success');
		return result.data.user;
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Request failed', 'error');
		throw error;
	} finally {
		showToast('Request completed', 'info');
	}
};

export const createProject = async (
	projectName: string,
	websiteUrl: string,
	projectDescription: string
) => {
	const url = `${URL}/api/user/projects/create`;

	await fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify({
			project_name: projectName,
			website_url: websiteUrl,
			project_description: projectDescription
		})
	})
		.then(async (response) => {
			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.message);
			}

			return response.json();
		})
		.then((data) => {
			showToast('Project created successfully', 'success');
		})
		.catch((error) => {
			showToast(error instanceof Error ? error.message : 'Failed to create project', 'error');
		})
		.finally(() => {
			showToast('Project operation completed', 'info');
		});
};

export const createSubreddits = async (subreddits?: string[]) => {
	const url = `${URL}/api/user/subreddits/create`;

	await fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify({ subreddits: subreddits })
	})
		.then(async (response) => {
			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.message);
			}

			return response.json();
		})
		.then((data) => {
			showToast('Subreddits created successfully', 'success');
		})
		.catch((error) => {
			showToast(error instanceof Error ? error.message : 'Failed to create subreddits', 'error');
		})
		.finally(() => {
			showToast('Subreddits operation completed', 'info');
		});
};

export const createKeywords = async (keywords?: string[]) => {
	const url = `${URL}/api/user/keywords/create`;

	await fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify({ keywords: keywords })
	})
		.then(async (response) => {
			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.message);
			}

			return response.json();
		})
		.then((data) => {
			showToast('Keywords created successfully', 'success');
		})
		.catch((error) => {
			showToast(error instanceof Error ? error.message : 'Failed to create keywords', 'error');
		})
		.finally(() => {
			showToast('Keywords operation completed', 'info');
		});
};

export const scanLeads = async (fetchFn?: typeof fetch) => {
	const url = `${URL}/api/user/leads/scan`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer'
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message);
		}

		const data = await response.json();
		showToast('Leads scanned successfully', 'success');
		return data;
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to scan leads', 'error');
		throw error;
	} finally {
		showToast('Leads scanning complete', 'info');
	}
};

export const getLeads = async (fetchFn?: typeof fetch) => {
	const url = `${URL}/api/user/leads/get`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer'
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message);
		}

		const data = await response.json();
		showToast('Leads fetched successfully', 'success');
		return data.data.leads as RedditPost[];
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to fetch leads', 'error');
		throw error;
	} finally {
		showToast('Leads operation completed', 'info');
	}
};

export const getReplies = async (fetchFn?: typeof fetch) => {
	const url = `${URL}/api/user/replies/get`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer'
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message);
		}

		const data = await response.json();
		showToast('Replies fetched successfully', 'success');
		return data.data.replies as Reply[];
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to fetch replies', 'error');
		throw error;
	} finally {
		showToast('Replies operation completed', 'info');
	}
};

export const getSubreddits = async (fetchFn?: typeof fetch) => {
	const url = `${URL}/api/user/subreddits/get`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer'
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message);
		}

		const data = await response.json();
		showToast('Subreddits fetched successfully', 'success');
		return data.data.subreddits as Subreddit[];
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to fetch subreddits', 'error');
		throw error;
	} finally {
		showToast('Subreddits operation completed', 'info');
	}
};

export const getKeywords = async (fetchFn?: typeof fetch) => {
	const url = `${URL}/api/user/keywords/get`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer'
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message);
		}

		const data = await response.json();
		showToast('Keywords fetched successfully', 'success');
		return data.data.keywords as Keyword[];
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to fetch keywords', 'error');
		throw error;
	} finally {
		showToast('Keywords operation completed', 'info');
	}
};

export const getDashboardMetrics = async (period?: string, fetchFn?: typeof fetch) => {
	const baseUrl = `${URL}/api/dashboard/metrics`;
	const url = period ? `${baseUrl}?period=${encodeURIComponent(period)}` : baseUrl;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer'
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message || 'Failed to fetch dashboard metrics');
		}

		const data = await response.json();
		showToast('Dashboard metrics fetched successfully', 'success');
		return data.data as DashboardMetrics;
	} catch (error) {
		showToast(
			error instanceof Error ? error.message : 'Failed to fetch dashboard metrics',
			'error'
		);
		throw error;
	} finally {
		showToast('Dashboard metrics operation completed', 'info');
	}
};

export const generateReply = async (postId: string, fetchFn?: typeof fetch): Promise<Reply> => {
	setLoadingState(true);

	const url = `${URL}/api/user/reply/generate`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({ post_id: postId })
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message || 'Failed to generate reply');
		}

		const data = await response.json();
		showToast('Reply generated successfully', 'success');
		return data.data;
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to generate reply', 'error');
		throw error;
	} finally {
		setLoadingState(false);
		showToast('Reply generation completed', 'info');
	}
};

export const updateSubreddits = async (
	subreddits?: string[],
	fetchFn?: typeof fetch
): Promise<Subreddit[]> => {
	setLoadingState(true);

	const url = `${URL}/api/user/subreddits/update`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({ subreddits: subreddits })
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message || 'Failed to update subreddits');
		}

		const data = await response.json();
		showToast('Subreddits updated successfully', 'success');
		return data.data;
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to update subreddits', 'error');
		throw error;
	} finally {
		setLoadingState(false);
		showToast('Subreddits operation completed', 'info');
	}
};

export const updateKeywords = async (
	keywords?: string[],
	fetchFn?: typeof fetch
): Promise<Keyword[]> => {
	setLoadingState(true);

	const url = `${URL}/api/user/keywords/update`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({ keywords: keywords })
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message || 'Failed to update keywords');
		}

		const data = await response.json();
		showToast('Keywords updated successfully', 'success');
		return data.data;
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to update keywords', 'error');
		throw error;
	} finally {
		setLoadingState(false);
		showToast('Keywords operation completed', 'info');
	}
};

export const getUserWithSubscription = async (
	fetchFn?: typeof fetch
): Promise<UserWithSubscription> => {
	setLoadingState(true);

	const url = `${URL}/api/user/subscription/get`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer'
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message || 'Failed to get user with subscription');
		}

		const data = await response.json();
		showToast('User with subscription fetched successfully', 'success');
		return data.data.user.User;
	} catch (error) {
		showToast(
			error instanceof Error ? error.message : 'Failed to get user with subscription',
			'error'
		);
		throw error;
	} finally {
		setLoadingState(false);
		showToast('User operation completed', 'info');
	}
};

export const updateUser = async (
	fullName: string,
	email: string,
	fetchFn?: typeof fetch
): Promise<UserWithSubscription> => {
	setLoadingState(true);

	const url = `${URL}/api/user/update`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({ full_name: fullName, email: email })
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message || 'Failed to update user');
		}

		const data = await response.json();
		showToast('User updated successfully', 'success');
		return data.data.user.User;
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to update user', 'error');
		throw error;
	} finally {
		setLoadingState(false);
		showToast('User operation completed', 'info');
	}
};

export const updateUserPassword = async (
	currentPassword: string,
	newPassword: string,
	confirmPassword: string,
	fetchFn?: typeof fetch
): Promise<UserWithSubscription> => {
	setLoadingState(true);

	const url = `${URL}/api/user/update/password`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({
				current_password: currentPassword,
				new_password: newPassword,
				confirm_password: confirmPassword
			})
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message || 'Failed to update user password');
		}

		const data = await response.json();
		showToast('User password updated successfully', 'success');
		return data.data.user.User;
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to update user password', 'error');
		throw error;
	} finally {
		setLoadingState(false);
		showToast('User password operation completed', 'info');
	}
};

export const logoutUser = async () => {
	setLoadingState(true);

	const url = `${URL}/api/user/logout`;

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
			referrerPolicy: 'no-referrer'
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message || 'Failed to logout user');
		}

		showToast('User logged out successfully', 'success');
		setTimeout(() => {
			location.replace('/');
		}, 4000);
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to logout user', 'error');
		throw error;
	} finally {
		setLoadingState(false);
		showToast('User logout operation completed', 'info');
	}
};

export const deleteUser = async () => {
	setLoadingState(true);

	const url = `${URL}/api/user/delete`;

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
			referrerPolicy: 'no-referrer'
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message || 'Failed to delete user');
		}

		showToast('User deleted successfully', 'success');
		setTimeout(() => {
			location.replace('/');
		}, 4000);
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to delete user', 'error');
		throw error;
	} finally {
		setLoadingState(false);
		showToast('User delete operation completed', 'info');
	}
};

export const createContact = async (
	senderName: string,
	senderEmail: string,
	messageSubject: string,
	messageText: string
) => {
	setLoadingState(true);

	const url = `${URL}/api/user/contact/create`;

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
			body: JSON.stringify({
				sender_name: senderName,
				sender_email: senderEmail,
				message_subject: messageSubject,
				message_text: messageText
			})
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message || 'Failed to create contact');
		}

		showToast(`Thank you for your message! We'll get back to you soon.`, 'success');
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to send message', 'error');
		throw error;
	} finally {
		setLoadingState(false);
		showToast('Message send operation completed', 'info');
	}
};

export const createFeedback = async (feedbackType: string, feedbackMessage: string) => {
	setLoadingState(true);

	const url = `${URL}/api/user/feedback/create`;

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
			body: JSON.stringify({
				feedback_type: feedbackType,
				feedback_message: feedbackMessage
			})
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message || 'Failed to create feedback');
		}

		showToast(`Thank you for your feedback! We'll get back to you soon.`, 'success');
	} catch (error) {
		showToast(error instanceof Error ? error.message : 'Failed to send feedback', 'error');
		throw error;
	} finally {
		setLoadingState(false);
		showToast('Feedback send operation completed', 'info');
	}
};

export const getUserRepliesWithPostDetails = async (
	fetchFn?: typeof fetch
): Promise<ReplyWithPostDetails[]> => {
	setLoadingState(true);

	const url = `${URL}/api/user/replies/get/with/post/details`;

	const fetchFunction = fetchFn ?? fetch;

	try {
		const response = await fetchFunction(url, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer'
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.message || 'Failed to get user replies with post details');
		}

		const data = await response.json();
		showToast('User replies with post details fetched successfully', 'success');
		return data.data.replies as ReplyWithPostDetails[];
	} catch (error) {
		showToast(
			error instanceof Error ? error.message : 'Failed to get user replies with post details',
			'error'
		);
		throw error;
	} finally {
		setLoadingState(false);
		showToast('User replies with post details operation completed', 'info');
	}
};
