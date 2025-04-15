import { NextResponse } from 'next/server';
import { createClient } from '@/lib/utils/supabase/server';

// Handle POST requests to log pulse events
export async function POST(req: Request) {
	try {
		const { device } = await req.json();

		if (!device) {
			return NextResponse.json(
				{ error: 'Missing required field: device' },
				{ status: 400 }
			);
		}

		// Insert pulse event into Supabase
		const supabase = await createClient();
		const { error } = await supabase
			.from('pulse_logs')
			.insert([{ device, created_at: new Date().toISOString() }]);

		if (error) throw error;

		return NextResponse.json(
			{ success: true, message: 'Pulse logged.' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
