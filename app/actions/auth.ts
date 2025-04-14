'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signUpAction = async (formData: FormData) => {
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();
	const supabase = await createClient();
	const origin = (await headers()).get('origin');

	if (!email || !password) {
		return encodedRedirect(
			'error',
			'/sign-up',
			'Email and password are required'
		);
	}

	const { data: authData, error: signUpError } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${origin}/auth/callback`,
		},
	});

	if (signUpError) {
		console.error(signUpError.code + ' ' + signUpError.message);
		return encodedRedirect('error', '/sign-up', signUpError.message);
	}

	if (authData.user) {
		const { error: profileError } = await supabase
			.from('user_profiles')
			.insert([{ id: authData.user.id }]);

		if (profileError) {
			console.error('Failed to create user profile:', profileError);
			return encodedRedirect(
				'error',
				'/sign-up',
				'Failed to create user profile'
			);
		}
	}

	return encodedRedirect(
		'success',
		'/sign-up',
		'Thanks for signing up! Please check your email for a verification link.'
	);
};

export const signInAction = async (formData: FormData) => {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return encodedRedirect('error', '/sign-in', error.message);
	}

	// Ensure user profile exists
	if (data.user) {
		await ensureUserProfileExists(supabase, data.user.id);
	}

	return redirect('/app');
};

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

export const forgotPasswordAction = async (formData: FormData) => {
	const email = formData.get('email')?.toString();
	const supabase = await createClient();
	const origin = (await headers()).get('origin');
	const callbackUrl = formData.get('callbackUrl')?.toString();

	if (!email) {
		return encodedRedirect('error', '/forgot-password', 'Email is required');
	}

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${origin}/auth/callback?redirect_to=/app/reset-password`,
	});

	if (error) {
		console.error(error.message);
		return encodedRedirect(
			'error',
			'/forgot-password',
			'Could not reset password'
		);
	}

	if (callbackUrl) {
		return redirect(callbackUrl);
	}

	return encodedRedirect(
		'success',
		'/forgot-password',
		'Check your email for a link to reset your password.'
	);
};

export const resetPasswordAction = async (formData: FormData) => {
	const supabase = await createClient();

	const password = formData.get('password') as string;
	const confirmPassword = formData.get('confirmPassword') as string;

	if (!password || !confirmPassword) {
		encodedRedirect(
			'error',
			'/app/reset-password',
			'Password and confirm password are required'
		);
	}

	if (password !== confirmPassword) {
		encodedRedirect('error', '/app/reset-password', 'Passwords do not match');
	}

	const { error } = await supabase.auth.updateUser({
		password: password,
	});

	if (error) {
		encodedRedirect('error', '/app/reset-password', 'Password update failed');
	}

	encodedRedirect('success', '/app/reset-password', 'Password updated');
};

export const signOutAction = async () => {
	const supabase = await createClient();
	await supabase.auth.signOut();
	return redirect('/sign-in');
};
