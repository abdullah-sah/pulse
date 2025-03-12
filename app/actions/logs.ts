import { createClient } from '@/utils/supabase/server';

export const fetchPulseLogs = async () => {
	const supabase = await createClient();
	const { data, error } = await supabase.from('pulse_logs').select();
	console.log('data', data);
	if (error) {
		throw new Error(`Failed to fetch pulse logs: ${error.message}`);
	}
	return data;
};

export const writePulseLog = async (deviceName: string) => {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from('pulse_logs')
		.insert({ device: deviceName });
	if (error) {
		throw new Error(`Failed to write pulse log: ${error.message}`);
	}
	return data;
};
