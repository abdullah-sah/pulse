'use client';

import SectionCard from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
	validateMotionApiKey,
	getUserMotionApiKey,
	updateUserMotionApiKey,
} from '@/lib/utils';
import { useState, useEffect } from 'react';

const SettingsSection = () => {
	const { toast } = useToast();
	const [apiKey, setApiKey] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);

	// Load existing API key when component mounts
	useEffect(() => {
		const loadApiKey = async () => {
			const key = await getUserMotionApiKey(false);
			if (key) {
				setApiKey(key);
			}
		};

		loadApiKey();
	}, []);

	const handleSave = async () => {
		setIsLoading(true);
		setValidationError(null);

		try {
			// Validate the API key
			const validation = await validateMotionApiKey(apiKey);
			if (!validation.isValid) {
				setValidationError(validation.message || 'Invalid API key');
				setIsLoading(false);
				toast({
					title: 'Invalid API Key',
					description: validation.message || 'The provided API key is invalid.',
					variant: 'destructive',
				});
				return;
			}

			// Update user's API key
			const result = await updateUserMotionApiKey(apiKey);

			if (!result.success) {
				throw new Error(result.error);
			}

			toast({
				title: '✅ Settings saved',
				description:
					'Your Motion API key has been validated and saved successfully.',
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
				<div className='flex flex-col gap-2'>
					<div className='flex gap-2'>
						<Input
							type='password'
							id='motion-calendar-integration'
							placeholder='Enter your Motion API key'
							value={apiKey}
							onChange={(e) => setApiKey(e.target.value)}
							className={validationError ? 'border-red-500' : ''}
						/>
						<Button variant='default' onClick={handleSave} disabled={isLoading}>
							{isLoading ? 'Validating...' : 'Save'}
						</Button>
					</div>
					{validationError && (
						<p className='text-sm text-red-500 mt-1'>{validationError}</p>
					)}
				</div>
			</div>
		</SectionCard>
	);
};

export default SettingsSection;
