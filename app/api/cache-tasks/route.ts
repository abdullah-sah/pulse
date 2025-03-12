import { NextResponse } from 'next/server';
import { refreshDailyTasksCache } from '@/app/actions/calendar';
import { createClient } from '@/utils/supabase/server';

// TODO WIP: This is a route to cache the tasks for the use
export async function POST(req: Request) {
	const authHeader = req.headers.get('Authorization')?.split(' ')[1];
	if (!authHeader) {
		return NextResponse.json(
			{ error: 'Missing authorization header' },
			{ status: 401 }
		);
	}

	const supabase = await createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		return NextResponse.json({ error: error?.message }, { status: 401 });
	}

	await refreshDailyTasksCache(supabase);

	return NextResponse.json({ message: 'Tasks cached', error: null });
}
