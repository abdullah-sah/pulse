import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
	createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

export const getRedirectUrl = () => {
	if (process.env.NODE_ENV === 'development') {
		return 'http://localhost:3000/auth/callback';
	}
	return 'https://pulse-seven-kappa.vercel.app/auth/callback';
};
