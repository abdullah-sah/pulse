'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { google } from 'googleapis';
import { SupabaseClient } from '@supabase/supabase-js';
import type { GeminiResponse } from '@/types/gemini.types';

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

export const getUnreadGmailMessages = async () => {
	const supabase = await createClient();

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

	const gmail = google.gmail({
		version: 'v1',
		headers: {
			Authorization: `Bearer ${session.provider_token}`,
		},
	});

	// fetch unread messages from the last 7 days
	const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
	const formattedDate = sevenDaysAgo
		.toISOString()
		.split('T')[0]
		.replace(/-/g, '/');

	const response = await gmail.users.messages.list({
		userId: 'me',
		q: `is:unread after:${formattedDate}`,
	});

	const messages = response.data.messages;

	const messagesWithDetails = await Promise.all(
		messages?.map(async (message) => {
			const { data } = await gmail.users.messages.get({
				userId: 'me',
				id: message.id || '',
				format: 'full',
			});

			// Get subject from headers
			const subject =
				data.payload?.headers?.find(
					(header) => header.name?.toLowerCase() === 'subject'
				)?.value || 'No Subject';

			// Get sender from headers
			const from =
				data.payload?.headers?.find(
					(header) => header.name?.toLowerCase() === 'from'
				)?.value || 'Unknown Sender';

			// Get message body
			let body = '';

			// Helper function to find text content in message parts
			const findTextContent = (part: any): string => {
				if (part.mimeType === 'text/plain') {
					return Buffer.from(part.body?.data || '', 'base64').toString('utf-8');
				}
				if (part.parts) {
					for (const subPart of part.parts) {
						const text = findTextContent(subPart);
						if (text) return text;
					}
				}
				return '';
			};

			if (data.payload?.body?.data) {
				// If the message body is directly in the payload
				body = Buffer.from(data.payload.body.data, 'base64').toString('utf-8');
			} else if (data.payload?.parts) {
				// If the message body is in parts
				body = findTextContent(data.payload);
			}

			return {
				id: data.id,
				threadId: data.threadId,
				subject,
				from,
				body: body.substring(0, 200) + (body.length > 200 ? '...' : ''), // Truncate long messages
				snippet: data.snippet,
				date: new Date(parseInt(data.internalDate || '0')).toISOString(),
				unread: data.labelIds?.includes('UNREAD') || false,
			};
		}) || []
	);

	return messagesWithDetails;
};

export const getUnreadEmailSummaries = async () => {
	const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
	const API_URL =
		'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

	try {
		// Get unread messages first
		const unreadMessages = await getUnreadGmailMessages();

		// Create a formatted list of emails for the prompt
		const emailList = unreadMessages
			.map(
				(email) =>
					`Subject: ${email.subject}\n` +
					`From: ${email.from}\n` +
					`Snippet: ${email.snippet}\n` +
					`Date: ${email.date}\n\n`
			)
			.join('');

		const prompt =
			`Here is a list of unread emails:\n\n${emailList}\n` +
			`Analyze these emails and provide a JSON array of objects. Each object should have a "summary" property with a brief summary of the email's content, and a "priority" property with a number from 1-5 indicating importance (1 being highest priority).\n\n` +
			`Return only the JSON array with no formatting characters, quotes, or additional text. For example:\n` +
			`[{"summary":"Meeting request from CEO","priority":1},{"summary":"Newsletter subscription","priority":4}]`;

		const response = await fetch(`${API_URL}?key=${API_KEY}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				contents: [
					{
						parts: [
							{
								text: prompt,
							},
						],
					},
				],
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: GeminiResponse = await response.json();

		const parsedData = JSON.parse(data.candidates[0].content.parts[0].text);
		return parsedData.sort(
			(a: { priority: number }, b: { priority: number }) =>
				a.priority - b.priority
		);
	} catch (error) {
		console.error('Error calling Gemini API:', error);
		throw error;
	}
};
