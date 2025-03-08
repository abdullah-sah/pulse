'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Tables } from '@/types/database.types';
import { google } from 'googleapis';
import { SupabaseClient } from '@supabase/supabase-js';

export const signUpAction = async (formData: FormData) => {
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();
	const supabase = await createClient();
	const origin = (await headers()).get('origin');

	if (!email || !password) {
		return encodedRedirect(
			'error',
			'/sign-up',
			'Email and password are required'
		);
	}

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${origin}/auth/callback`,
		},
	});

	if (error) {
		console.error(error.code + ' ' + error.message);
		return encodedRedirect('error', '/sign-up', error.message);
	} else {
		return encodedRedirect(
			'success',
			'/sign-up',
			'Thanks for signing up! Please check your email for a verification link.'
		);
	}
};

export const signInAction = async (formData: FormData) => {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return encodedRedirect('error', '/sign-in', error.message);
	}

	return redirect('/protected');
};

export const forgotPasswordAction = async (formData: FormData) => {
	const email = formData.get('email')?.toString();
	const supabase = await createClient();
	const origin = (await headers()).get('origin');
	const callbackUrl = formData.get('callbackUrl')?.toString();

	if (!email) {
		return encodedRedirect('error', '/forgot-password', 'Email is required');
	}

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
	});

	if (error) {
		console.error(error.message);
		return encodedRedirect(
			'error',
			'/forgot-password',
			'Could not reset password'
		);
	}

	if (callbackUrl) {
		return redirect(callbackUrl);
	}

	return encodedRedirect(
		'success',
		'/forgot-password',
		'Check your email for a link to reset your password.'
	);
};

export const resetPasswordAction = async (formData: FormData) => {
	const supabase = await createClient();

	const password = formData.get('password') as string;
	const confirmPassword = formData.get('confirmPassword') as string;

	if (!password || !confirmPassword) {
		encodedRedirect(
			'error',
			'/protected/reset-password',
			'Password and confirm password are required'
		);
	}

	if (password !== confirmPassword) {
		encodedRedirect(
			'error',
			'/protected/reset-password',
			'Passwords do not match'
		);
	}

	const { error } = await supabase.auth.updateUser({
		password: password,
	});

	if (error) {
		encodedRedirect(
			'error',
			'/protected/reset-password',
			'Password update failed'
		);
	}

	encodedRedirect('success', '/protected/reset-password', 'Password updated');
};

export const signOutAction = async () => {
	const supabase = await createClient();
	await supabase.auth.signOut();
	return redirect('/sign-in');
};

export const fetchPulseLogs = async () => {
	const supabase = await createClient();
	const { data, error } = await supabase.from('pulse_logs').select();
	console.log('data', data);
	if (error) {
		throw new Error(`Failed to fetch pulse logs: ${error.message}`);
	}
	return data;
};

export const writePulseLog = async (deviceName: string) => {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from('pulse_logs')
		.insert({ device: deviceName });
	if (error) {
		throw new Error(`Failed to write pulse log: ${error.message}`);
	}
	console.log('heres the db response from the insert query', data);
	return data;
};

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
