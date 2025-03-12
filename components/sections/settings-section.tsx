import SectionCard from '@/components/section-card';

const SettingsSection = () => {
	return (
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
	);
};

export default SettingsSection;
