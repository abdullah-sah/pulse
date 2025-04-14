import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { refreshDailyTasksCache } from '@/app/actions/tasks';

// TODO WIP: This is a route to cache the tasks for the use
export async function GET() {
	try {
		const supabase = await createClient();

		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error || !user) {
			return NextResponse.json({ error: error?.message }, { status: 401 });
		}

		// Check if user has configured a Motion API key
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

		try {
			const {
				success,
				data,
				error: refreshError,
			} = await refreshDailyTasksCache();

			if (!success) {
				// Check if this is an authentication error
				if (
					refreshError &&
					(refreshError.includes('Authentication failed') ||
						refreshError.includes('Invalid Motion API key') ||
						refreshError.includes('401') ||
						refreshError.includes('403'))
				) {
					return NextResponse.json(
						{ error: 'Invalid Motion API key' },
						{ status: 401 }
					);
				}

				return NextResponse.json({ error: refreshError }, { status: 500 });
			}

			return NextResponse.json({ message: 'Tasks cached', data });
		} catch (cacheError) {
			// Handle authentication errors specifically
			if (
				cacheError instanceof Error &&
				(cacheError.message.includes('Authentication failed') ||
					cacheError.message.includes('Invalid Motion API key') ||
					cacheError.message.includes('401') ||
					cacheError.message.includes('403'))
			) {
				return NextResponse.json(
					{ error: 'Invalid Motion API key' },
					{ status: 401 }
				);
			}

			throw cacheError; // Re-throw for the outer catch
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
}
