import { redirect } from '@sveltejs/kit';

export function load({ event }) {
  throw redirect(308, `${event.url.origin}/docs/introduction`);
}
