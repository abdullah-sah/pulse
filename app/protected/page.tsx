import {
	getUnreadGmailMessages,
	getUnreadEmailSummaries,
} from '@/app/actions/gmail';
import LineItem from '@/components/line-item';
import SectionCard from '@/components/section-card';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/sign-in');
	}

	const tasks = [
		{
			title: 'Task 1',
			summary: 'This is a brief summary of the task',
			priority: 'High',
		},
		{
			title: 'Task 2',
			summary: 'This is a brief summary of the task',
			priority: 'Medium',
		},
		{
			title: 'Task 3',
			summary: 'This is a brief summary of the task',
			priority: 'Low',
		},
	];
	// const geminiResponse = await getUnreadEmailSummaries();
	// console.log('geminiResponse', geminiResponse);

	return (
		<div className='flex-1 w-full flex flex-col gap-12'>
			<header className='text-3xl font-extrabold text-center text-gray-100 py-6 tracking-wide uppercase'>
				Pulse Dashboard
			</header>

			{/* AI-Prioritized Tasks Section */}
			<SectionCard
				title='AI-Prioritised Tasks'
				description='These are the tasks that the AI has prioritised for you.'
			>
				<div className='mt-2 space-y-2 flex flex-col gap-2'>
					{tasks.map((task, index) => (
						<LineItem
							key={index}
							title={task.title}
							description={task.summary}
						/>
					))}
				</div>
			</SectionCard>

			{/* Upcoming Meetings Section */}
			<SectionCard
				title='Upcoming Meetings'
				description='These are the meetings that are coming up.'
			>
				<ul className='mt-2 space-y-2 text-gray-300'>
					<li className='bg-gray-700 p-3 rounded-lg shadow-md hover:bg-gray-600 transition-colors'>
						Meeting 1 - 10:00 AM
					</li>
					<li className='bg-gray-700 p-3 rounded-lg shadow-md hover:bg-gray-600 transition-colors'>
						Meeting 2 - 2:00 PM
					</li>
				</ul>
			</SectionCard>

			{/* Summarized Emails Section */}
			<SectionCard
				title='Latest Emails'
				description='These are the latest emails that you have received.'
			>
				<ul className='mt-2 space-y-2 text-gray-300'>
					<li className='bg-gray-700 p-3 rounded-lg shadow-md hover:bg-gray-600 transition-colors'>
						Email 1 Summary
					</li>
					<li className='bg-gray-700 p-3 rounded-lg shadow-md hover:bg-gray-600 transition-colors'>
						Email 2 Summary
					</li>
				</ul>
			</SectionCard>

			{/* Settings Section */}
			<SectionCard
				title='Daily Summary Settings'
				description='These are the settings for your daily summary.'
			>
				<div className='mt-4'>
					<label className='block text-gray-300 text-sm font-medium'>
						Delivery Time:
					</label>
					<select className='w-full bg-gray-700 border border-gray-600 rounded-lg p-3 mt-1 text-gray-100 hover:bg-gray-600 transition-colors'>
						<option>Morning</option>
						<option>Midday</option>
						<option>Evening</option>
					</select>
				</div>
				<div className='mt-4'>
					<label className='block text-gray-300 text-sm font-medium'>
						Priority Filtering:
					</label>
					<select className='w-full bg-gray-700 border border-gray-600 rounded-lg p-3 mt-1 text-gray-100 hover:bg-gray-600 transition-colors'>
						<option>All</option>
						<option>Only Urgent</option>
					</select>
				</div>
			</SectionCard>
		</div>
	);
}
