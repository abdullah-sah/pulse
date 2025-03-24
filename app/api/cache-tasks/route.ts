import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { refreshDailyTasksCache } from '@/app/actions/tasks';

// TODO WIP: This is a route to cache the tasks for the use
export async function GET() {
	const supabase = await createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		return NextResponse.json({ error: error?.message }, { status: 401 });
	}

	const { success, data, error: refreshError } = await refreshDailyTasksCache();

	if (!success) {
		return NextResponse.json({ error: refreshError }, { status: 500 });
	}

	return NextResponse.json({ message: 'Tasks cached', data });
}
