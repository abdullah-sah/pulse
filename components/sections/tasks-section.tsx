'use client';

import LineItem from '@/components/line-item';
import SectionCard from '@/components/section-card';
import { useEffect, useState } from 'react';
import { fetchDailyTasks } from '@/utils/api';
import { MotionTask } from '@/types/motion.types';

const TasksSection = () => {
	const [tasks, setTasks] = useState<MotionTask[]>([]);

	useEffect(() => {
		const fetchTasks = async () => {
			const data = await fetchDailyTasks();
			setTasks(data);
		};
		fetchTasks();
	}, []);

	return (
		<SectionCard
			title='AI-Prioritised Tasks'
			description='These are the tasks that the AI has prioritised for you.'
		>
			<div className='mt-2 space-y-2 flex flex-col gap-2'>
				{tasks.map((task) => (
					<LineItem
						key={task.id}
						title={task.name}
						description={task.description}
					/>
				))}
			</div>
		</SectionCard>
	);
};

export default TasksSection;
