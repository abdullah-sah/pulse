import { NextResponse } from 'next/server';
import { fetchProjects, fetchTasks } from '@/app/actions/tasks';
import { MotionTask } from '@/types/motion.types';

export async function GET() {
	try {
		const { projects } = await fetchProjects();

		const tasks = await Promise.all(
			projects.map(async (project: { id: string }) => {
				const { tasks } = await fetchTasks(project.id);
				return tasks;
			})
		);
		const flattenedTasks: MotionTask[] = tasks.flat();

		return NextResponse.json(flattenedTasks);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
