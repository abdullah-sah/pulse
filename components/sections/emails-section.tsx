import SectionCard from '@/components/section-card';

const EmailsSection = () => {
	return (
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
	);
};

export default EmailsSection;
