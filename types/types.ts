import { calendar_v3 } from 'googleapis';

export type CalendarEvent = calendar_v3.Schema$Event;

export type TasksApiResponse = CalendarEvent[];

export type UnreadEmailSummary = {
	summary: string;
	priority: number;
};

export type UnreadEmailSummariesApiResponse = UnreadEmailSummary[];
