/**
 * Truncates text to a specified max length
 */
export const truncateText = (text: string, maxLength: number) => {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + '...';
};

/**
 * Cleans and truncates HTML content
 */
export const cleanAndTruncateHtml = (html: string, maxLength: number) => {
	// Remove excessive newlines and whitespace
	const cleanHtml = html
		.replace(/(\r\n|\n|\r)/gm, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	return truncateText(cleanHtml, maxLength);
};
