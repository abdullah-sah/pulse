'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from '@/contexts/session-context';

export default function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = new QueryClient();
	return (
		<SessionProvider>
			<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</ThemeProvider>
		</SessionProvider>
	);
}
