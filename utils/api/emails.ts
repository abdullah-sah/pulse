import type { UnreadEmailSummariesApiResponse } from '@/types/types';

export const fetchUnreadEmailSummaries =
	async (): Promise<UnreadEmailSummariesApiResponse> => {
		const response = await fetch('/api/emails');
		const data = await response.json();
		return data;
	};
