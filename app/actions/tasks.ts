import { Tables } from '@/types/database.types';
import { MotionTask, MotionProject } from '@/types/motion.types';
import { MOTION_BASE_URL } from '@/utils/constants';
import { createClient } from '@/utils/supabase/server';

export const fetchProjects = async (): Promise<{
	projects: MotionProject[];
}> => {
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
			throw new Error(`Failed to fetch motion projects: ${response}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const fetchTasks = async (
	projectId: string
): Promise<{ tasks: MotionTask[] }> => {
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
		throw error;
	}
};

export const fetchTasksFromCache = async (): Promise<
	Tables<'motion_tasks_cache'>[]
> => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error('User not found');
	}

	const { data, error } = await supabase
		.from('motion_tasks_cache')
		.select('*')
		.eq('user_id', user.id)
		.order('cached_on', { ascending: false });

	if (error) {
		console.error(error);
		throw error;
	}
	return data;
};

export const isTodayTasksCached = async (): Promise<boolean> => {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error('User not found');
		}

		// Get today's date at start of day in UTC
		const today = new Date();
		today.setUTCHours(0, 0, 0, 0);

		const { data, error } = await supabase
			.from('motion_tasks_cache')
			.select('id')
			.eq('user_id', user.id)
			.gte('cached_on', today.toISOString())
			.limit(1);

		if (error) {
			console.error(error);
			return false;
		}

		return data.length > 0;
	} catch (error) {
		console.error(error);
		return false;
	}
};

//! We need this to work even for users who are using the same motion api key
export const createOrUpdateTaskCache = async (task: MotionTask) => {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error('User not found');
		}

		// First, check if this task already exists for this user specifically
		const { data: existingTask, error: selectError } = await supabase
			.from('motion_tasks_cache')
			.select('*')
			.eq('motion_task_id', task.id)
			.eq('user_id', user.id)
			.single();

		const taskData = {
			motion_task_id: task.id,
			name: task.name,
			description: task.description,
			duration: task.duration as number,
			due_date: task.dueDate,
			deadline_type: task.deadlineType,
			parent_recurring_task_id: task.parentRecurringTaskId,
			completed: task.completed,
			start_on: task.startOn,
			project_id: task.project?.id,
			status: task.status.name,
			priority: task.priority,
			scheduled_start: task.scheduledStart,
			scheduled_end: task.scheduledEnd,
			scheduling_issues: task.schedulingIssue,
			user_id: user.id,
			cached_on: new Date().toISOString(),
		};

		let result;
		if (existingTask) {
			// Update existing task
			const { data, error } = await supabase
				.from('motion_tasks_cache')
				.update(taskData)
				.eq('motion_task_id', task.id)
				.eq('user_id', user.id)
				.select();

			if (error) {
				console.error('Error updating task:', error);
				throw error;
			}
			result = data;
		} else {
			// Insert new task
			const { data, error } = await supabase
				.from('motion_tasks_cache')
				.insert(taskData)
				.select();

			if (error) {
				console.error('Error inserting task:', error);
				throw error;
			}
			result = data;
		}

		return result;
	} catch (error) {
		console.error('Error in createOrUpdateTaskCache:', error);
		throw error;
	}
};

export const refreshDailyTasksCache = async () => {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error('User not found');
		}

		const { projects } = await fetchProjects();
		const tasks = await Promise.all(
			projects.map(async (project: { id: string }) => {
				const { tasks } = await fetchTasks(project.id);
				return tasks;
			})
		);

		const flattenedTasks: MotionTask[] = tasks.flat();
		const result = await Promise.all(
			flattenedTasks.map(async (task) => {
				return await createOrUpdateTaskCache(task);
			})
		);

		return { success: true, data: result.flat() };
	} catch (error) {
		console.error(error);
		return { success: false, error: (error as Error).message };
	}
};
