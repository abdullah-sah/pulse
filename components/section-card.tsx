import { Card } from '@/components/ui/card';

interface SectionCardProps {
	title: string;
	description: string;
	children: React.ReactNode;
}

const SectionCard = ({ title, description, children }: SectionCardProps) => {
	return (
		<Card className='bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-700 backdrop-blur-lg bg-opacity-80'>
			<h2 className='text-xl font-semibold text-gray-100 mb-3'>{title}</h2>
			<p className='text-sm text-gray-300'>{description}</p>
			{children}
		</Card>
	);
};

export default SectionCard;
