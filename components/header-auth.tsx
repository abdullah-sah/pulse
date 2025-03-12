'use client';

import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { SessionContext } from '@/contexts/session-context';
import { useContext } from 'react';

export default function HeaderAuth() {
	const supabase = createClient();
	const session = useContext(SessionContext);

	const handleSignOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error signing out:', error);
		}
		redirect('/sign-in');
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
			{session ? (
				<>
					<Button size='sm' variant='outline' onClick={handleSignOut}>
						Sign out
					</Button>
					{/* insert user avatar here */}
				</>
			) : (
				<>
					<Button asChild size='sm'>
						<Link href='/sign-up'>Sign up</Link>
					</Button>
					<Button size='sm' variant='outline'>
						<Link href='/sign-in'>Sign in</Link>
					</Button>
				</>
			)}
		</div>
	);
}
