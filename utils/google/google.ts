import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID!,
	process.env.GOOGLE_CLIENT_SECRET!,
	process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
);

export function getAuthUrl() {
	return oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: ['https://www.googleapis.com/auth/calendar.readonly'],
	});
}

export async function getGoogleAccessToken(code: string) {
	const { tokens } = await oauth2Client.getToken(code);
	oauth2Client.setCredentials(tokens);
	return tokens;
}

export async function fetchCalendarTasks(accessToken: string) {
	oauth2Client.setCredentials({ access_token: accessToken });
	const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

	const now = new Date().toISOString();
	const endOfDay = new Date();
	endOfDay.setHours(23, 59, 59, 999);

	const res = await calendar.events.list({
		calendarId: 'primary',
		timeMin: now,
		timeMax: endOfDay.toISOString(),
		singleEvents: true,
		orderBy: 'startTime',
	});

	return (
		res.data.items?.map((event) => ({
			id: event.id,
			summary: event.summary,
			startTime: event.start?.dateTime || event.start?.date,
		})) || []
	);
}
