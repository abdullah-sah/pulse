'use client';

import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { createClient } from '@/utils/supabase/client';

export default function AuthButton() {
	const supabase = createClient();

	const handleSignIn = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
		});
		if (error) {
			console.error('Error signing in:', error);
		} else {
			console.log('Signed in with Google:', data);
		}
	};

	if (!hasEnvVars) {
		return (
			<>
				<div className='flex gap-4 items-center'>
					<div>
						<Badge
							variant={'default'}
							className='font-normal pointer-events-none'
						>
							Please update .env.local file with anon key and url
						</Badge>
					</div>
				</div>
			</>
		);
	}
	return (
		<div className='flex gap-2'>
			<Button size='sm' variant={'outline'} onClick={handleSignIn}>
				Sign in
			</Button>
			<Button asChild size='sm' variant={'default'}>
				<Link href='/sign-up'>Sign up</Link>
			</Button>
		</div>
	);
}
