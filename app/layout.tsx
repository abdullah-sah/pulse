import DeployButton from '@/components/deploy-button';
import { EnvVarWarning } from '@/components/env-var-warning';
import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';

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
			<body className='relative flex flex-col p-6 space-y-6 min-h-screen text-foreground'>
				<div className='fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950 -z-10' />
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
					<main className='min-h-screen flex flex-col items-center'>
						{/* <HeaderAuth /> */}
						{children}
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
