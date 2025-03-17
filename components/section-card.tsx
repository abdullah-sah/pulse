import { Card } from '@/components/ui/card';

interface SectionCardProps {
	title: string;
	description: string;
	children: React.ReactNode;
	actionButton?: React.ReactNode;
}

const SectionCard = ({
	title,
	description,
	children,
	actionButton,
}: SectionCardProps) => {
	return (
		<Card className='bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-700 backdrop-blur-lg bg-opacity-80'>
			<div className='flex justify-between items-center'>
				<div>
					<h2 className='text-xl font-semibold text-gray-100 mb-3'>{title}</h2>
					<p className='text-sm text-gray-300'>{description}</p>
				</div>
				{actionButton}
			</div>
			{children}
		</Card>
	);
};

export default SectionCard;
