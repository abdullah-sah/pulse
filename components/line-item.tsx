import { cleanAndTruncateHtml, truncateText } from '@/lib/utils';

const LineItem = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	const truncatedTitle = truncateText(title, 50);
	const truncatedDescription = cleanAndTruncateHtml(description, 200);

	return (
		<div className='bg-gray-700 p-3 rounded-lg shadow-md hover:bg-gray-600 transition-colors'>
			<h3 className='text-lg font-semibold text-gray-100'>{truncatedTitle}</h3>
			<p
				className='text-gray-300'
				dangerouslySetInnerHTML={{ __html: truncatedDescription }}
			/>
		</div>
	);
};

export default LineItem;
