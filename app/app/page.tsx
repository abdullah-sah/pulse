import EmailsSection from '@/components/sections/emails-section';
import EventsSection from '@/components/sections/events-section';
import SettingsSection from '@/components/sections/settings-section';
import TasksSection from '@/components/sections/tasks-section';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AppPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/sign-in');
	}

	return (
		<div className='flex-1 w-full flex flex-col gap-12'>
			{/* AI-Prioritised Tasks Section */}
			<TasksSection />

			{/* Upcoming Meetings Section */}
			<EventsSection />

			{/* Summarised Emails Section */}
			<EmailsSection />

			{/* Settings Section */}
			<SettingsSection />
		</div>
	);
}
