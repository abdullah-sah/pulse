import { NextResponse } from 'next/server';
import { getUnreadEmailSummaries } from '@/app/actions/gmail';

export async function GET() {
	try {
		const summaries = await getUnreadEmailSummaries();
		return NextResponse.json(summaries);
	} catch (error) {
		console.error('Error fetching unread email summaries:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch unread email summaries' },
			{ status: 500 }
		);
	}
}
