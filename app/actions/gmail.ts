import { createClient } from '@/utils/supabase/server';
import { google } from 'googleapis';
import type { GeminiResponse } from '@/types/gemini.types';

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
