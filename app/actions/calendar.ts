import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { google } from 'googleapis';

export const getDailyTasks = async () => {
	const supabase = await createClient();

	try {
		// Get the user's session which contains the provider token
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession();
		if (sessionError) throw sessionError;

		if (!session?.provider_token) {
			throw new Error(
				'No provider token found - user may need to reauthenticate'
			);
		}

		// Create Google Calendar API client
		const calendar = google.calendar({
			version: 'v3',
			headers: {
				Authorization: `Bearer ${session.provider_token}`,
			},
		});

		// Get events for today
		const now = new Date();
		const endOfDay = new Date(now);
		endOfDay.setHours(23, 59, 59, 999);

		const response = await calendar.events.list({
			calendarId: 'primary',
			timeMin: now.toISOString(),
			timeMax: endOfDay.toISOString(),
			singleEvents: true,
			orderBy: 'startTime',
		});

		// Transform and return the events
		return (
			response.data.items?.map((event) => ({
				id: event.id,
				summary: event.summary,
				startTime: event.start?.dateTime || event.start?.date,
				endTime: event.end?.dateTime || event.end?.date,
				description: event.description,
				status: event.status,
				link: event.htmlLink,
			})) || []
		);
	} catch (error) {
		console.error('Error fetching calendar tasks:', error);
		throw error;
	}
};

export const refreshDailyTasksCache = async (client?: SupabaseClient) => {
	const supabase = client || (await createClient());
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error('User not found');
	}

	const today = new Date().toISOString().split('T')[0];

	await deleteCachedDailyTasks(supabase);

	const dailyTasks = await getDailyTasks();
	const mappedTasks = dailyTasks.map((task) => ({
		summary: task.summary,
		description: task.description,
		link: task.link,
		status: task.status,
		google_calendar_id: task.id,
		end_time: task.endTime,
		start_time: task.startTime,
		user_id: user.id,
		cached_at: today,
	}));

	const { data, error } = await supabase.from('task_cache').insert(mappedTasks);
	if (error) {
		throw new Error(`Failed to cache daily tasks: ${error.message}`);
	}
};

const deleteCachedDailyTasks = async (client?: SupabaseClient) => {
	const supabase = client || (await createClient());
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		throw new Error(`Failed to get user: ${userError?.message}`);
	}

	const today = new Date().toISOString().split('T')[0];
	const { error } = await supabase
		.from('task_cache')
		.delete()
		.eq('cached_at', today)
		.eq('user_id', user.id);
	if (error) {
		throw new Error(`Failed to delete cached daily tasks: ${error.message}`);
	}
};
