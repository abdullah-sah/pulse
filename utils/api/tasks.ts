import type { MotionTask } from '@/types/motion.types';

export const fetchDailyTasks = async (): Promise<MotionTask[]> => {
	try {
		const res = await fetch('/api/tasks');
		const data = await res.json();
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const refreshDailyTasks = async () => {
	const res = await fetch('/api/cache-tasks');
	const { data } = await res.json();
	return data;
};
