'use client';
import { GOOGLE_AUTH_SCOPES } from '@/utils/constants';
import { createClient, getRedirectUrl } from '@/utils/supabase/client';
import { encodedRedirect } from '@/utils';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

type Props = {
	variant?: 'sign-in' | 'sign-up';
};

const GoogleOAuthButton = ({ variant = 'sign-in' }: Props) => {
	const handleGoogleSignIn = async () => {
		const supabase = createClient();
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: getRedirectUrl(),
					scopes: GOOGLE_AUTH_SCOPES,
				},
			});
			if (error) throw error;
			encodedRedirect('success', '/app', 'Signed in successfully');
		} catch (error) {
			console.error('Authentication error:', error);
			encodedRedirect('error', '/sign-in', 'Failed to sign in');
		}
	};
	return (
		<Button
			type='submit'
			className='gap-2'
			variant='outline'
			onClick={handleGoogleSignIn}
		>
			<FcGoogle />{' '}
			{variant === 'sign-in' ? 'Sign in with Google' : 'Sign up with Google'}
		</Button>
	);
};

export default GoogleOAuthButton;
