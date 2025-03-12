'use client';

import SectionCard from '@/components/section-card';
import { useState, useEffect } from 'react';
import { fetchUnreadEmailSummaries } from '@/utils/api';
import { UnreadEmailSummary } from '@/types/types';
import LineItem from '@/components/line-item';

const EmailsSection = () => {
	const [emails, setEmails] = useState<UnreadEmailSummary[]>([]);

	useEffect(() => {
		const fetchEmails = async () => {
			try {
				const data = await fetchUnreadEmailSummaries();
				setEmails(data);
			} catch (error) {
				console.error('Error fetching unread email summaries:', error);
			}
		};
		fetchEmails();
	}, []);

	return (
		<SectionCard
			title='Latest Unread Emails'
			description='These are the latest unread emails that you have received, based on priority level.'
		>
			<ul className='mt-2 space-y-2 text-gray-300'>
				{emails.map((email, i) => (
					<LineItem
						key={`email summary ${i}`}
						title={email.summary}
						description={`Priority level: ${email.priority}`}
					/>
				))}
			</ul>
		</SectionCard>
	);
};

export default EmailsSection;
