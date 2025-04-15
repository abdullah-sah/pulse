// Re-export all utility functions from a central location

// Text utilities
export { cn, truncateText, cleanAndTruncateHtml } from './text';

// Navigation utilities
export { encodedRedirect } from './navigation';

// API-related exports
export {
	fetchDailyTasks,
	fetchUnreadEmailSummaries,
	refreshDailyTasks,
	validateMotionApiKey,
} from './api';

// User profile utilities
export {
	ensureUserProfileExists,
	getUserMotionApiKey,
	updateUserMotionApiKey,
} from './supabase/user-profile';

// Constant exports
export { MOTION_BASE_URL, GOOGLE_AUTH_SCOPES } from './constants';
