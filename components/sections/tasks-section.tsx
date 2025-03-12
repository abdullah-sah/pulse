'use client';

import LineItem from '@/components/line-item';
import SectionCard from '@/components/section-card';
import { useEffect, useState } from 'react';
import { calendar_v3 } from 'googleapis';
import { fetchDailyTasks } from '@/utils/api/tasks';

const TasksSection = () => {
	const [tasks, setTasks] = useState<calendar_v3.Schema$Event[]>([]);
	console.log('here are the tasks', tasks);

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
						title={task.summary || ''}
						description={task.description || ''}
					/>
				))}
			</div>
		</SectionCard>
	);
};

export default TasksSection;
