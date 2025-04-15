'use client';

import SectionCard from '@/components/section-card';
import { fetchUnreadEmailSummaries } from '@/lib/utils/api';
import LineItem from '@/components/line-item';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import RefreshCircle from '@/components/svg/refresh-circle';

const EmailsSection = () => {
	const {
		data: emails,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ['emails'],
		queryFn: fetchUnreadEmailSummaries,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
	});

	return (
		<SectionCard
			title='Latest Unread Emails'
			description='These are the latest unread emails that you have received, based on priority level.'
			actionButton={
				<Button
					variant='outline'
					size='sm'
					onClick={() => refetch()}
					disabled={isRefetching}
				>
					{isRefetching ? <RefreshCircle /> : 'Refresh'}
				</Button>
			}
		>
			<ul className='mt-2 space-y-2 text-gray-300'>
				{isLoading ? (
					<>
						<Skeleton className='h-[60px] w-full' />
						<Skeleton className='h-[60px] w-full' />
						<Skeleton className='h-[60px] w-full' />
					</>
				) : error ? (
					<p>Error fetching emails</p>
				) : (
					emails?.map((email, i) => (
						<LineItem
							key={`email summary ${i}`}
							title={email.summary}
							description={`Priority level: ${email.priority}`}
						/>
					))
				)}
			</ul>
		</SectionCard>
	);
};

export default EmailsSection;
