import type { UnreadEmailSummariesApiResponse } from '@/types/types';

export const fetchUnreadEmailSummaries =
	async (): Promise<UnreadEmailSummariesApiResponse> => {
		try {
			const response = await fetch('/api/emails');
			const data = await response.json();
			if (data.error) throw new Error(data.error);
			return data;
		} catch (error) {
			throw error;
		}
	};
