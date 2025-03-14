'use client';

import LineItem from '@/components/line-item';
import SectionCard from '@/components/section-card';
import { useEffect, useState } from 'react';
import { fetchDailyTasks } from '@/utils/api';
import { MotionTask } from '@/types/motion.types';
import { Skeleton } from '@/components/ui/skeleton';

const TasksSection = () => {
	const [tasks, setTasks] = useState<MotionTask[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// TODO: move this to a hook
		const fetchTasks = async () => {
			try {
				const data = await fetchDailyTasks();
				setTasks(data);
			} catch (error) {
				console.error('Error fetching tasks:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchTasks();
	}, []);

	return (
		<SectionCard
			title='AI-Prioritised Tasks'
			description='These are the tasks that the AI has prioritised for you.'
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
