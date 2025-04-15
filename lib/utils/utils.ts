import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const truncateText = (text: string, maxLength: number) => {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + '...';
};

export const cleanAndTruncateHtml = (html: string, maxLength: number) => {
	// Remove excessive newlines and whitespace
	const cleanHtml = html
		.replace(/(\r\n|\n|\r)/gm, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	return truncateText(cleanHtml, maxLength);
};
