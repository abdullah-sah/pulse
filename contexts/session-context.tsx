'use client';

import { createContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

export const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
	const supabase = createClient();
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_OUT') {
				setSession(null);
			} else if (session) {
				setSession(session);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	return (
		<SessionContext.Provider value={session}>
			{children}
		</SessionContext.Provider>
	);
}
