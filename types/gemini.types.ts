export type GeminiResponse = {
	candidates: Candidate[];
	usageMetadata: UsageMetadata;
	modelVersion: string;
};

export type Candidate = {
	content: Content;
	finishReason: string;
	avgLogprobs: number;
};

export type Content = {
	parts: Part[];
	role: string;
};

export type Part = {
	text: string;
};

export type UsageMetadata = {
	promptTokenCount: number;
	candidatesTokenCount: number;
	totalTokenCount: number;
	promptTokensDetails: TokensDetail[];
	candidatesTokensDetails: TokensDetail[];
};

export type TokensDetail = {
	modality: string;
	tokenCount: number;
};
