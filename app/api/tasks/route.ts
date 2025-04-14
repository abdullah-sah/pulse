import { NextResponse } from 'next/server';
import {
	fetchTasksFromCache,
	isTodayTasksCached,
	refreshDailyTasksCache,
} from '@/app/actions/tasks';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
	try {
		// Check if user has a Motion API key
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(
				{ error: 'User not authenticated' },
				{ status: 401 }
			);
		}

		const { data: profile, error: profileError } = await supabase
			.from('user_profiles')
			.select('motion_api_key')
			.eq('id', user.id)
			.single();

		if (profileError || !profile || !profile.motion_api_key) {
			return NextResponse.json(
				{ error: 'Motion API key not configured' },
				{ status: 400 }
			);
		}

		// fetch from cache if there are entries for this user from today
		const hasCachedTasks = await isTodayTasksCached();
		if (hasCachedTasks) {
			const cache = await fetchTasksFromCache();
			return NextResponse.json(cache);
		}

		try {
			const { success, data, error } = await refreshDailyTasksCache();

			if (!success) {
				// Check if this is an authentication error
				if (
					error &&
					(error.includes('Authentication failed') ||
						error.includes('Invalid Motion API key') ||
						error.includes('401') ||
						error.includes('403'))
				) {
					return NextResponse.json(
						{ error: 'Invalid Motion API key' },
						{ status: 401 }
					);
				}

				return NextResponse.json({ error }, { status: 500 });
			}

			return NextResponse.json(data);
		} catch (refreshError) {
			// Handle authentication errors specifically
			if (
				refreshError instanceof Error &&
				(refreshError.message.includes('Authentication failed') ||
					refreshError.message.includes('Invalid Motion API key') ||
					refreshError.message.includes('401') ||
					refreshError.message.includes('403'))
			) {
				return NextResponse.json(
					{ error: 'Invalid Motion API key' },
					{ status: 401 }
				);
			}

			throw refreshError; // Re-throw for the outer catch
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
}
