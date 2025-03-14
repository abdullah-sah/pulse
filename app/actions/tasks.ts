import { MOTION_BASE_URL } from '@/utils/constants';

export const fetchProjects = async () => {
	// TODO: needs to be updated so that workspaceId is fetched from the user
	try {
		const queryParams = new URLSearchParams({
			workspaceId: 'ujTIYIqg-dfqKYrz8KQZJ',
		});

		const response = await fetch(`${MOTION_BASE_URL}/projects?${queryParams}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': process.env.MOTION_API_KEY as string,
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch motion tasks: ${response}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return { error: (error as Error).message };
	}
};

export const fetchTasks = async (projectId: string) => {
	try {
		const queryParams = new URLSearchParams({
			projectId,
			status: 'todo',
		});

		const response = await fetch(`${MOTION_BASE_URL}/tasks?${queryParams}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': process.env.MOTION_API_KEY as string,
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch motion tasks: ${response}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return { error: (error as Error).message };
	}
};
