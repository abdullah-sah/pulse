'use client';

import LineItem from '@/components/line-item';
import SectionCard from '@/components/section-card';
import { useEffect, useState } from 'react';
import { fetchDailyTasks, refreshDailyTasks } from '@/utils/api';
import { MotionTask } from '@/types/motion.types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const TasksSection = () => {
	const [tasks, setTasks] = useState<MotionTask[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	// Move fetchTasks outside useEffect so we can reuse it
	const fetchTasks = async () => {
		setLoading(true);
		try {
			const data = await fetchDailyTasks();
			setTasks(data);
		} catch (error) {
			console.error('Error fetching tasks:', error);
		} finally {
			setLoading(false);
		}
	};

	// Handle refresh button click
	const handleRefresh = async () => {
		await refreshDailyTasks();
		setRefreshTrigger((prev) => prev + 1);
	};

	useEffect(() => {
		fetchTasks();
	}, [refreshTrigger]);

	return (
		<SectionCard
			title='AI-Prioritised Tasks'
			description='These are the tasks that the AI has prioritised for you.'
			actionButton={
				<Button variant='outline' size='sm' onClick={handleRefresh}>
					Refresh
				</Button>
			}
		>
			<div className='mt-2 space-y-2 flex flex-col gap-2'>
				{loading ? (
					<>
						<Skeleton className='h-[60px] w-full' />
						<Skeleton className='h-[60px] w-full' />
						<Skeleton className='h-[60px] w-full' />
					</>
				) : (
					tasks.map((task) => (
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
