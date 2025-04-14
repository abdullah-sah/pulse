'use client';

import SectionCard from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

const SettingsSection = () => {
	const { toast } = useToast();
	const [apiKey, setApiKey] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Load existing API key when component mounts
	useEffect(() => {
		const loadApiKey = async () => {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				const { data, error } = await supabase
					.from('user_profiles')
					.select('motion_api_key')
					.eq('id', user.id)
					.single();

				if (data && !error) {
					setApiKey(data.motion_api_key || '');
				}
			}
		};

		loadApiKey();
	}, []);

	const handleSave = async () => {
		setIsLoading(true);
		const supabase = createClient();
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			toast({
				title: 'Error saving settings',
				description: 'User not authenticated',
				variant: 'destructive',
			});
			setIsLoading(false);
			return;
		}

		try {
			// Check if user profile exists
			const { data: existingProfile, error: fetchError } = await supabase
				.from('user_profiles')
				.select('id')
				.eq('id', user.id)
				.single();

			if (fetchError && fetchError.code !== 'PGRST116') {
				// PGRST116 is "not found" error
				throw fetchError;
			}

			if (existingProfile) {
				// Update existing profile
				const { error: updateError } = await supabase
					.from('user_profiles')
					.update({ motion_api_key: apiKey })
					.eq('id', user.id);

				if (updateError) throw updateError;
			} else {
				// Create new profile
				const { error: insertError } = await supabase
					.from('user_profiles')
					.insert({ id: user.id, motion_api_key: apiKey });

				if (insertError) throw insertError;
			}

			toast({
				title: '✅ Settings saved',
				description: 'Your Motion API key has been saved successfully.',
			});
		} catch (error) {
			console.error('Error saving settings:', error);
			toast({
				title: 'Error saving settings',
				description:
					error instanceof Error ? error.message : 'Unknown error occurred',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SectionCard
			title='Settings'
			description='This is where you can manage your settings, including adding your Motion API key.'
			titleClassName='text-3xl'
		>
			<div className='mt-4'>
				<label
					htmlFor='motion-calendar-integration'
					className='block text-md font-medium text-gray-300 mb-2'
				>
					Motion Calendar Integration
				</label>
				<div className='flex gap-2'>
					<Input
						type='password'
						id='motion-calendar-integration'
						placeholder='Enter your Motion API key'
						value={apiKey}
						onChange={(e) => setApiKey(e.target.value)}
					/>
					<Button variant='default' onClick={handleSave} disabled={isLoading}>
						{isLoading ? 'Saving...' : 'Save'}
					</Button>
				</div>
			</div>
		</SectionCard>
	);
};

export default SettingsSection;
