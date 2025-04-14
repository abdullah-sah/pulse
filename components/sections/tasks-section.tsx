'use client';

import LineItem from '@/components/line-item';
import SectionCard from '@/components/section-card';
import { fetchDailyTasks, refreshDailyTasks } from '@/utils/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RefreshCircle from '@/components/svg/refresh-circle';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MotionTask } from '@/types/motion.types';

const TasksSection = () => {
	const queryClient = useQueryClient();
	const [hasMotionApiKey, setHasMotionApiKey] = useState<boolean | null>(null);
	const [apiKeyStatus, setApiKeyStatus] = useState<
		'valid' | 'invalid' | 'missing' | 'checking' | null
	>(null);

	useEffect(() => {
		const checkApiKey = async () => {
			setApiKeyStatus('checking');
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

				if (data && !error && data.motion_api_key) {
					setHasMotionApiKey(true);
					setApiKeyStatus('valid'); // We'll validate it when actually making requests
				} else {
					setHasMotionApiKey(false);
					setApiKeyStatus('missing');
				}
			}
		};

		checkApiKey();
	}, []);

	const {
		data: tasks,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['tasks'],
		queryFn: () =>
			fetchDailyTasks().catch((err) => {
				// Check if the error is due to invalid API key
				if (
					err.message?.includes('Motion API key') ||
					err.message?.includes('401') ||
					err.message?.includes('403') ||
					err.message?.includes('Authentication failed')
				) {
					setApiKeyStatus('invalid');
				}
				throw err;
			}),
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: hasMotionApiKey === true,
	});

	const { mutate: refreshTasks, isPending: isRefreshing } = useMutation({
		mutationFn: () =>
			refreshDailyTasks().catch((err) => {
				// Check if the error is due to invalid API key
				if (
					err.message?.includes('Motion API key') ||
					err.message?.includes('401') ||
					err.message?.includes('403') ||
					err.message?.includes('Authentication failed')
				) {
					setApiKeyStatus('invalid');
				}
				throw err;
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
			setApiKeyStatus('valid');
		},
	});

	// Show CTA if user has no Motion API key
	if (apiKeyStatus === 'missing') {
		return (
			<SectionCard
				title='AI-Prioritised Tasks'
				description='Connect your Motion account to see your prioritised tasks.'
			>
				<div className='mt-4 space-y-4 flex flex-col items-center'>
					<p className='text-center text-sm text-muted-foreground'>
						To access your Motion tasks, you need to connect your Motion account
						by adding your API key in settings.
					</p>
					<Button asChild>
						<Link href='/app/settings'>Add Motion API Key</Link>
					</Button>
				</div>
			</SectionCard>
		);
	}

	// Show error and option to update if API key is invalid
	if (apiKeyStatus === 'invalid') {
		return (
			<SectionCard
				title='AI-Prioritised Tasks'
				description='There was a problem with your Motion API key.'
			>
				<div className='mt-4 space-y-4 flex flex-col items-center'>
					<p className='text-center text-sm text-muted-foreground'>
						We couldn't authenticate with Motion using your current API key. It
						may be invalid or expired.
					</p>
					<Button asChild>
						<Link href='/app/settings'>Update Motion API Key</Link>
					</Button>
				</div>
			</SectionCard>
		);
	}

	// Show generic error state for non-API key related errors
	if (error && apiKeyStatus === 'valid') {
		return (
			<SectionCard
				title='AI-Prioritised Tasks'
				description='These are the tasks that the AI has prioritised for you.'
			>
				<div className='mt-2 space-y-2 flex flex-col gap-2'>
					<p>Error fetching tasks</p>
				</div>
			</SectionCard>
		);
	}

	return (
		<SectionCard
			title='AI-Prioritised Tasks'
			description='These are the tasks that the AI has prioritised for you.'
			actionButton={
				<Button
					variant='outline'
					size='sm'
					onClick={() => refreshTasks()}
					disabled={isRefreshing}
				>
					{isRefreshing ? <RefreshCircle /> : 'Refresh'}
				</Button>
			}
		>
			<div className='mt-2 space-y-2 flex flex-col gap-2'>
				{isLoading || apiKeyStatus === 'checking' ? (
					<>
						<Skeleton className='h-[60px] w-full' />
						<Skeleton className='h-[60px] w-full' />
						<Skeleton className='h-[60px] w-full' />
					</>
				) : error ? (
					<p>Error fetching tasks</p>
				) : (
					tasks?.map((task: MotionTask) => (
						<LineItem
							key={task.id}
							title={task.name}
							description={task.description}
						/>
					))
				)}
			</div>
		</SectionCard>
	);
};

export default TasksSection;
