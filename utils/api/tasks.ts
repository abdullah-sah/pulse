import type { TasksApiResponse } from '@/types/types';

export const fetchDailyTasks = async (): Promise<TasksApiResponse> => {
	const response = await fetch('/api/tasks');
	if (!response.ok) {
		throw new Error('Failed to fetch tasks');
	}
	const data = await response.json();
	return data;
};
