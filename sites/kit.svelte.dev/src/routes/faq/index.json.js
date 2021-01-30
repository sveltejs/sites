import { dev } from '$app/env';
import get_faqs from './_faqs.js';

let body;

export function get() {
	if (!body || dev) {
		const faqs = get_faqs()
			.map(faq => {
				return {
					fragment: faq.fragment,
					answer: faq.answer,
					metadata: faq.metadata
				};
			});

		body = JSON.stringify(faqs);
	}

	return {
		body
	};
}
