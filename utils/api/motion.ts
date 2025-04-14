import { MOTION_BASE_URL } from '../constants';

/**
 * Validates a Motion API key by making a test request to the Motion API
 * @param apiKey The Motion API key to validate
 * @returns An object with success status and optional error message
 */
export const validateMotionApiKey = async (
	apiKey: string
): Promise<{
	isValid: boolean;
	message?: string;
}> => {
	if (!apiKey || apiKey.trim() === '') {
		return {
			isValid: false,
			message: 'API key cannot be empty',
		};
	}

	try {
		// Using the projects endpoint for validation, including required workspaceId
		// TODO: In production, this should be fetched from user settings if available
		const queryParams = new URLSearchParams({
			workspaceId: 'ujTIYIqg-dfqKYrz8KQZJ',
		});

		const response = await fetch(`${MOTION_BASE_URL}/projects?${queryParams}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': apiKey,
			},
		});

		if (!response.ok) {
			// Check for specific error status codes
			if (response.status === 401 || response.status === 403) {
				return {
					isValid: false,
					message: 'Invalid API key. Please check your API key and try again.',
				};
			}

			// Handle other errors
			const errorText = await response.text();
			return {
				isValid: false,
				message: `API request failed with status ${response.status}: ${errorText}`,
			};
		}

		// If we get here, the key is valid
		return { isValid: true };
	} catch (error) {
		console.error('Error validating Motion API key:', error);
		return {
			isValid: false,
			message:
				error instanceof Error
					? error.message
					: 'Network error occurred while validating API key',
		};
	}
};
