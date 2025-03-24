import { NextResponse } from 'next/server';
import {
	fetchTasksFromCache,
	isTodayTasksCached,
	refreshDailyTasksCache,
} from '@/app/actions/tasks';

export async function GET() {
	try {
		// fetch from cache if there is entries for this user from today
		const hasCachedTasks = await isTodayTasksCached();
		if (hasCachedTasks) {
			const cache = await fetchTasksFromCache();
			return NextResponse.json(cache);
		}

		const { success, data, error } = await refreshDailyTasksCache();

		if (!success) {
			return NextResponse.json({ error }, { status: 500 });
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
