export const handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/blog/the-easiest-way-to-get-started') {
		return Response.redirect(`${event.url.origin}/docs/introduction`, 308);
	}
	if (event.url.pathname === '/roadmap') {
		return Response.redirect('https://docs.google.com/document/d/1IA9Z5rcIm_KRxvh_L42d2NDdYRHZ72MfszhyJrsmf5A', 307);
	}
	return await resolve(event);
}
