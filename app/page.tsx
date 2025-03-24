import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
	return (
		<>
			<section className='flex flex-col items-center gap-6 px-4'>
				<h1 className='text-4xl font-extrabold mt-12 mb-6'>Welcome to Pulse</h1>
				<p className='text-lg text-gray-400 max-w-2xl'>
					Pulse is your AI-powered productivity assistant, integrating with
					Motion, Google Calendar, Gmail, and more to automate your workflow and
					help you stay on top of your tasks effortlessly.
				</p>
				<div className='mt-6'>
					<Button asChild className='text-lg' size='lg'>
						<Link href='/sign-up'>Sign up to get started</Link>
					</Button>
				</div>
			</section>
		</>
	);
}
