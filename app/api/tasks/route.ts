import { NextResponse } from 'next/server';
import { fetchCalendarTasks } from '@/utils/google/google';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const accessToken = searchParams.get('access_token');

		if (!accessToken) {
			return NextResponse.json(
				{ error: 'Missing access token' },
				{ status: 400 }
			);
		}

		const tasks = await fetchCalendarTasks(accessToken);

		// Cache tasks in Supabase (optional)
		const supabase = await createClient();
		const tasksToInsert = tasks.map((task) => ({
			task_id: task.id,
			summary: task.summary || '',
			due_date: new Date().toISOString(),
			priority: 'medium',
			created_at: new Date().toISOString(),
		}));
		const { error } = await supabase.from('task_cache').insert(tasksToInsert);
		if (error) console.error('Supabase Insert Error:', error);

		return NextResponse.json({ success: true, tasks }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
