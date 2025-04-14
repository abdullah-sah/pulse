import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Helper function to ensure a user profile exists
const ensureUserProfileExists = async (supabase: any, userId: string) => {
	try {
		// Check if user profile exists
		const { data: existingProfile, error: fetchError } = await supabase
			.from('user_profiles')
			.select('id')
			.eq('id', userId)
			.single();

		if (fetchError && fetchError.code !== 'PGRST116') {
			// PGRST116 is "not found" error
			console.error('Error checking user profile:', fetchError);
			return;
		}

		if (!existingProfile) {
			// Create new profile if it doesn't exist
			const { error: insertError } = await supabase
				.from('user_profiles')
				.insert({ id: userId });

			if (insertError) {
				console.error('Failed to create user profile:', insertError);
			}
		}
	} catch (error) {
		console.error('Error in ensureUserProfileExists:', error);
	}
};

export async function GET(request: Request) {
	// The `/auth/callback` route is required for the server-side auth flow implemented
	// by the SSR package. It exchanges an auth code for the user's session.
	// https://supabase.com/docs/guides/auth/server-side/nextjs
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get('code');
	const origin = requestUrl.origin;
	const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString();

	if (code) {
		const supabase = await createClient();
		await supabase.auth.exchangeCodeForSession(code);

		// Get the user and ensure profile exists
		const { data } = await supabase.auth.getUser();
		if (data?.user) {
			await ensureUserProfileExists(supabase, data.user.id);
		}
	}

	if (redirectTo) {
		return NextResponse.redirect(`${origin}${redirectTo}`);
	}

	// URL to redirect to after sign up process completes
	return NextResponse.redirect(`${origin}/app`);
}
