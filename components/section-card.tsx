import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
	title: string;
	description: string;
	children: React.ReactNode;
	actionButton?: React.ReactNode;
	className?: string;
	titleClassName?: string;
}

const SectionCard = ({
	title,
	description,
	children,
	actionButton,
	className,
	titleClassName,
}: SectionCardProps) => {
	return (
		<Card
			className={cn(
				'bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-700 backdrop-blur-lg bg-opacity-80',
				className
			)}
		>
			<div className='flex justify-between items-center'>
				<div>
					<h2
						className={cn(
							'text-xl font-semibold text-gray-100 mb-3',
							titleClassName
						)}
					>
						{title}
					</h2>
					<p className='text-sm text-gray-300'>{description}</p>
				</div>
				{actionButton}
			</div>
			{children}
		</Card>
	);
};

export default SectionCard;
