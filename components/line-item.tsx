const LineItem = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	return (
		<div className='bg-gray-700 p-3 rounded-lg shadow-md hover:bg-gray-600 transition-colors'>
			<h3 className='text-lg font-semibold text-gray-100'>{title}</h3>
			<p className='text-gray-300'>{description}</p>
		</div>
	);
};

export default LineItem;
