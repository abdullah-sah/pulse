'use client';

import { getDailyTasks } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { createClient, getRedirectUrl } from '@/utils/supabase/client';

export default function Home() {
	const supabase = createClient();

	const handleSignIn = async () => {
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: getRedirectUrl(),
					scopes:
						'email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
				},
			});
			if (error) throw error;
			window.location.href = data.url;
		} catch (error) {
			// Proper error handling with user feedback
			console.error('Authentication error:', error);
			// Show user-friendly error message
		}
	};

	return (
		<>
			<section className='flex-1 flex flex-col gap-6 px-4'>
				<Button onClick={handleSignIn}>just some test text</Button>
			</section>
		</>
	);
}
