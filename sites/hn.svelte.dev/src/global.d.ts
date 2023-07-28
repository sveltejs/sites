/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Error {
			frame?: string;
		}
	}
}
