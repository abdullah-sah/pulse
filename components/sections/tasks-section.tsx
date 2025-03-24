'use client';

import LineItem from '@/components/line-item';
import SectionCard from '@/components/section-card';
import { fetchDailyTasks, refreshDailyTasks } from '@/utils/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RefreshCircle from '@/components/svg/refresh-circle';

const TasksSection = () => {
	const queryClient = useQueryClient();
	const {
		data: tasks,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['tasks'],
		queryFn: fetchDailyTasks,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
	});

	const { mutate: refreshTasks, isPending: isRefreshing } = useMutation({
		mutationFn: refreshDailyTasks,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
		},
	});

	if (error) {
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
				{isLoading ? (
					<>
						<Skeleton className='h-[60px] w-full' />
						<Skeleton className='h-[60px] w-full' />
						<Skeleton className='h-[60px] w-full' />
					</>
				) : error ? (
					<p>Error fetching tasks</p>
				) : (
					tasks?.map((task) => (
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
