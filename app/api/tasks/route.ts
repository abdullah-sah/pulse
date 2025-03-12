import { NextResponse } from 'next/server';
import { getDailyTasks } from '@/app/actions/calendar';

export async function GET() {
	try {
		const tasks = await getDailyTasks();
		return NextResponse.json(tasks);
	} catch (error) {
		console.error('Error fetching tasks:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch tasks' },
			{ status: 500 }
		);
	}
}
