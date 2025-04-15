import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Providers from '@/providers';
import { Toaster } from '@/components/ui/toaster';

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: 'http://localhost:3000';

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: 'Next.js and Supabase Starter Kit',
	description: 'The fastest way to build apps with Next.js and Supabase',
};

const geistSans = Geist({
	display: 'swap',
	subsets: ['latin'],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className={geistSans.className} suppressHydrationWarning>
			<body className='relative flex flex-col p-6 pt-0 min-h-screen text-foreground'>
				<div className='fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950 -z-10' />
				<Providers>
					<main className='flex flex-1 flex-col gap-10 w-full'>
						<Header />
						{children}
						<Toaster />
					</main>
				</Providers>
			</body>
		</html>
	);
}
