import { dev } from '$app/environment';

// Loading state
let loading = $state(false);

export function getLoadingState() {
	return loading;
}

export function setLoadingState(value: boolean) {
	loading = value;
}

// Environment-based URL configuration
const getBaseURL = (): string => {
	if (dev) {
		// Development environment
		return 'http://localhost:8080';
	} else {
		// Production environment
		return 'http://api.hurricane.softwrhq.com'; // Replace with your actual production URL
	}
};

// Global URL state
export const URL = $state(getBaseURL());

// Sidebar state management
let sidebarOpen = $state(true);

export function getSidebarOpenState() {
	return sidebarOpen;
}

export function setSidebarOpenState(value: boolean) {
	sidebarOpen = value;
}

// Toasts logic
// In your state.svelte.ts
interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	isVisible: boolean;
}

let toasts = $state<Toast[]>([]);
let isProcessingQueue = $state(false);

export function addToast(message: string, type: 'success' | 'error' | 'info' | 'warning') {
	const toast: Toast = {
		id: crypto.randomUUID(),
		message,
		type,
		isVisible: false
	};

	toasts.push(toast);

	// Start processing queue if not already processing
	if (!isProcessingQueue) {
		processToastQueue();
	}
}

async function processToastQueue() {
	if (toasts.length === 0) {
		isProcessingQueue = false;
		return;
	}

	isProcessingQueue = true;
	const currentToast = toasts[0];

	// Small delay to ensure DOM is ready, then show the toast
	await new Promise((resolve) => setTimeout(resolve, 10));
	currentToast.isVisible = true;

	// Wait 3 seconds
	await new Promise((resolve) => setTimeout(resolve, 3000));

	// Hide the toast
	currentToast.isVisible = false;

	// Wait for hide animation (300ms)
	await new Promise((resolve) => setTimeout(resolve, 300));

	// Remove the toast and process next
	toasts.shift();
	processToastQueue();
}

export function getCurrentToast() {
	return toasts.length > 0 ? toasts[0] : null;
}

export function getIsShowingToast() {
	const currentToast = getCurrentToast();
	return currentToast ? currentToast.isVisible : false;
}

// Global showToast function for compatibility
export function showToast(
	message: string,
	type: 'success' | 'error' | 'info' | 'warning' = 'success',
	duration = 3000
) {
	if (message) {
		addToast(message, type);
	} else {
		// Clear current toast
		if (toasts.length > 0) {
			toasts.shift();
			processToastQueue();
		}
	}
}

// Expose showToast globally
if (typeof window !== 'undefined') {
	(window as any).showToast = showToast;
}
