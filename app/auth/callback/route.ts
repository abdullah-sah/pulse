import { createClient } from '@/lib/utils/supabase/server';
import { ensureUserProfileExists } from '@/lib/utils/supabase/user-profile';
import { NextResponse } from 'next/server';

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
