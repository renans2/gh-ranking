// Shared by the server render and the in-page filter script, so keep it free of heavy imports.
import { LANGUAGE_PARAM } from '../constants/rankings';

/** The language filter param, lowercased, or null when showing every language. */
export function selectedLanguage(params: URLSearchParams) {
	return params.get(LANGUAGE_PARAM)?.trim().toLowerCase() || null;
}

/** Whether a repo written in `language` is shown while filtering by `selected`. */
export function matchesLanguage(language: string | null, selected: string | null) {
	return selected === null || language?.toLowerCase() === selected;
}
