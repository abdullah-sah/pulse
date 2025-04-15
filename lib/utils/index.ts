// Re-export all utility functions from a central location

// Dev utilities
export { cn } from './utils';

// Text utilities
export { truncateText, cleanAndTruncateHtml } from './text';

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

