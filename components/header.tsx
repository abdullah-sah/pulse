import HeaderAuth from '@/components/header-auth';
import Link from 'next/link';

const Header = () => {
	return (
		<header className='flex items-center justify-between mb-6 p-6 w-full sticky top-6 rounded-lg border border-white/10 bg-background/60 shadow-lg shadow-white/10 backdrop-blur-sm z-10 animate-pulse-shadow'>
			<h1 className='text-2xl font-bold text-white uppercase'>
				<Link href='/'>Pulse</Link>
			</h1>
			<div className='flex items-center gap-2'>{/* <ThemeSwitcher /> */}</div>
			<HeaderAuth />
		</header>
	);
};

export default Header;
