import SectionCard from '@/components/section-card';

const EventsSection = () => {
	return (
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
	);
};

export default EventsSection;
