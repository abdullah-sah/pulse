import { createClient } from '@/lib/utils/supabase/server';
import { google } from 'googleapis';
import type { GeminiResponse } from '@/types/gemini.types';

import { generateObject } from 'ai';
import { google as geminiAi } from '@ai-sdk/google';
import { z } from 'zod';

export const getUnreadGmailMessages = async (limit?: number) => {
	const supabase = await createClient();
	if (limit && limit > 100) {
		throw new Error('Limit must be less than 100');
	}

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
		maxResults: limit || 10,
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
			`Analyze these emails and provide a JSON array of objects. Each object should have a "summary" property with a brief summary of the email's content, and a "priority" property with a number from 1-5 indicating importance (1 being highest priority). Marketing emails should be given a priority of 4 or 5 depending on the content.\n\n`;

		const result = await generateObject({
			model: geminiAi('gemini-1.5-pro', {
				useSearchGrounding: true,
			}),
			schema: z.object({
				emails: z.array(
					z.object({
						summary: z.string(),
						priority: z.number(),
					})
				),
			}),
			prompt,
		});

		return result.object.emails.sort(
			(a: { priority: number }, b: { priority: number }) =>
				a.priority - b.priority
		);
	} catch (error) {
		console.error('Error calling Gemini API:', error);
		throw error;
	}
};
