import { Database } from '@/types/database.types';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient as createClientClient } from '@/utils/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Ensures a user profile exists for the given user ID
 * @param supabase Supabase client instance
 * @param userId User ID to ensure profile for
 * @returns Boolean indicating if the profile was created or already existed
 */
export const ensureUserProfileExists = async (
	supabase: SupabaseClient<Database>,
	userId: string
): Promise<boolean> => {
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
			return false;
		}

		if (!existingProfile) {
			// Create new profile if it doesn't exist
			const { error: insertError } = await supabase
				.from('user_profiles')
				.insert({ id: userId });

			if (insertError) {
				console.error('Failed to create user profile:', insertError);
				return false;
			}
			return true;
		}

		return true;
	} catch (error) {
		console.error('Error in ensureUserProfileExists:', error);
		return false;
	}
};

/**
 * Gets a user's Motion API key
 * @param serverSide Whether to use server-side or client-side Supabase client
 * @returns The user's Motion API key or null if not found
 */
export const getUserMotionApiKey = async (
	serverSide = true
): Promise<string | null> => {
	try {
		const supabase = serverSide
			? await createServerClient()
			: createClientClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return null;
		}

		const { data, error } = await supabase
			.from('user_profiles')
			.select('motion_api_key')
			.eq('id', user.id)
			.single();

		if (error || !data) {
			return null;
		}

		return data.motion_api_key;
	} catch (error) {
		console.error('Error getting Motion API key:', error);
		return null;
	}
};

/**
 * Updates a user's Motion API key
 * @param apiKey The Motion API key to set
 * @param serverSide Whether to use server-side or client-side Supabase client
 * @returns Success status and any error message
 */
export const updateUserMotionApiKey = async (
	apiKey: string,
	serverSide = false
): Promise<{ success: boolean; error?: string }> => {
	try {
		const supabase = serverSide
			? await createServerClient()
			: createClientClient();
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			return {
				success: false,
				error: 'User not authenticated',
			};
		}

		await ensureUserProfileExists(supabase, user.id);

		const { error: updateError } = await supabase
			.from('user_profiles')
			.update({ motion_api_key: apiKey })
			.eq('id', user.id);

		if (updateError) {
			return {
				success: false,
				error: updateError.message,
			};
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};
