// User table interface based on database schema
export interface User {
	id: number;
	email: string;
	password_hash: string | null;
	full_name: string;
	user_role: 'user' | 'admin' | 'moderator';
	created_at: string; // ISO timestamp
	updated_at: string; // ISO timestamp
	deleted_at: string | null; // ISO timestamp
}

// Subreddit table interface based on database schema
export interface Subreddit {
	id: number;
	user_id: number;
	subreddit_name: string;
	created_at: string; // ISO timestamp
	updated_at: string; // ISO timestamp
	deleted_at: string | null; // ISO timestamp
}

// Keyword table interface based on database schema
export interface Keyword {
	id: number;
	user_id: number;
	keyword_name: string;
	created_at: string; // ISO timestamp
	updated_at: string; // ISO timestamp
	deleted_at: string | null; // ISO timestamp
}

// RedditPost table interface based on database schema
export interface RedditPost {
	id: string; // VARCHAR(50) PRIMARY KEY
	user_id: number;
	reddit_post_name: string;
	title: string;
	author: string;
	subreddit: string;
	reddit_post_url: string;
	permalink: string;
	score: number;
	num_comments: number;
	created_utc: string; // DECIMAL(15,3) as string
	created_time: string; // ISO timestamp
	self_text: string | null;
	keyword_matches: number;
	accuracy_score: string; // DECIMAL(5,2) as string
	quality_score: string; // DECIMAL(5,2) as string
	matched_words: string[]; // TEXT[]
	created_at: string; // ISO timestamp
	updated_at: string; // ISO timestamp
	deleted_at: string | null; // ISO timestamp
}

// Reply table interface based on database schema
export interface Reply {
	id: number; // SERIAL PRIMARY KEY
	user_id: number;
	reddit_post_id: string; // References reddit_post(id)
	reply_text: string;
	created_at: string; // ISO timestamp
	updated_at: string; // ISO timestamp
	deleted_at: string | null; // ISO timestamp
}

// Project table interface based on database schema
export interface Project {
	id: number; // SERIAL PRIMARY KEY
	user_id: number;
	project_name: string;
	website_url: string | null;
	project_description: string | null;
	created_at: string; // ISO timestamp
	updated_at: string; // ISO timestamp
	deleted_at: string | null; // ISO timestamp
}

// Subscription table interface based on database schema
export interface Subscription {
	id: number;
	user_id: number;
	subscription_status: 'trial' | 'active' | 'cancelled' | 'expired';
	trial_start_date: string; // ISO timestamp
	trial_end_date: string; // ISO timestamp
	subscription_start_date: string | null; // ISO timestamp
	subscription_end_date: string | null; // ISO timestamp
	dodo_customer_id: string | null;
	dodo_subscription_id: string | null;
	last_payment_date: string | null; // ISO timestamp
	next_billing_date: string | null; // ISO timestamp
	monthly_searches_used: number;
	monthly_search_limit: number; // -1 = unlimited
	cancelled_at: string | null; // ISO timestamp
	cancellation_reason: string | null;
	created_at: string; // ISO timestamp
	updated_at: string; // ISO timestamp
}

// User with subscription joined data - based on GetUserWithSubscriptionRow
export interface UserWithSubscription {
	id: number;
	email: string;
	password_hash: string | null;
	full_name: string;
	user_role: string;
	user_created_at: string; // ISO timestamp
	user_updated_at: string; // ISO timestamp
	subscription_id: number | null;
	subscription_status: {
		subscription_status: 'trial' | 'active' | 'cancelled' | 'expired';
		valid: boolean;
	} | null;
	trial_start_date: string | null; // ISO timestamp
	trial_end_date: string | null; // ISO timestamp
	subscription_start_date: string | null; // ISO timestamp
	subscription_end_date: string | null; // ISO timestamp
	monthly_searches_used: number | null;
	monthly_search_limit: number | null; // -1 = unlimited
	cancelled_at: string | null; // ISO timestamp
	cancellation_reason: string | null;
	subscription_created_at: string | null; // ISO timestamp
	subscription_updated_at: string | null; // ISO timestamp
}

// Session table interface based on database schema
export interface Session {
	id: string; // VARCHAR(255) PRIMARY KEY - session ID from cookie
	user_id: number;
	created_at: string; // ISO timestamp
	expires_at: string; // ISO timestamp
	last_activity: string; // ISO timestamp
	ip_address: string | null;
	user_agent: string | null;
	session_data: any | null; // JSONB - session-specific data
	is_active: boolean;
}

// UserSchedule table interface based on database schema
export interface UserSchedule {
	id: number;
	user_id: number;
	last_run: string | null; // ISO timestamp
	next_run: string | null; // ISO timestamp
	is_active: boolean;
	processing: boolean;
	created_at: string; // ISO timestamp
	updated_at: string; // ISO timestamp
}

// Reply with post details interface based on GetUserRepliesWithPostDetailsRow
export interface ReplyWithPostDetails {
	reply_id: number;
	reply_user_id: number;
	reddit_post_id: string;
	reply_text: string;
	reply_created_at: string; // ISO timestamp
	reply_updated_at: string; // ISO timestamp
	post_id: string;
	post_title: string;
	post_author: string;
	post_subreddit: string;
	post_url: string;
	post_permalink: string;
	post_score: number;
	post_num_comments: number;
	post_created_time: string; // ISO timestamp
	post_self_text: string | null;
	post_quality_score: string | null; // DECIMAL as string
}

// Dashboard Metrics interfaces
export interface DashboardMetrics {
	leads_count: number;
	replies_count: number;
	subreddits_count: number;
	keywords_count: number;
	leads_growth: number;
	replies_growth: number;
	subreddits_growth: number;
	keywords_growth: number;
	period: string;
	period_days: number;
	message?: string;
}

export interface DailyMetric {
	date: string; // YYYY-MM-DD format
	count: number;
}

export interface TopPerformer {
	name: string;
	count: number;
	avg_accuracy: number;
	avg_quality: number;
}

export interface DashboardMetricsResponse {
	success: boolean;
	data: DashboardMetrics;
	message?: string;
}

export interface DashboardMetricsAdvanced {
	// Basic counts
	leads_count: number;
	replies_count: number;
	subreddits_count: number;
	keywords_count: number;

	// Growth percentages
	leads_growth: number;
	replies_growth: number;
	subreddits_growth: number;
	keywords_growth: number;

	// Daily breakdowns for charts
	leads_by_day: DailyMetric[];
	replies_by_day: DailyMetric[];

	// Top performers
	top_subreddits: TopPerformer[];
	top_keywords: TopPerformer[];

	// Period info
	period: string;
	period_days: number;
}
