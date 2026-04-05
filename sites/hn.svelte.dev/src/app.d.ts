type HNItem = {
	id: number;
	deleted?: true;
};

declare global {
	namespace App {
		interface Error {
			frame?: string;
		}
	}
	type HNStory = HNItem & {
		by: string;
		descendants: number;
		kids?: number[];
		score: number;
		time: number;
		title: string;
		type: 'story';
		url: string;
	};
	type HNComment = HNItem & {
		by: string;
		id: number;
		kids?: number[];
		parent: number;
		text: string;
		time: number;
		type: 'comment';
	};
	type HNJob = HNItem & {
		by: string;
		id: number;
		score: number;
		text?: string;
		time: number;
		title: string;
		type: 'job';
		url: string;
	};
	type HNPoll = HNItem & {
		by: string;
		descendants: number;
		id: number;
		kids?: number[];
		parts: number[];
		score: number;
		text: string;
		time: number;
		title: string;
		type: 'poll';
	};
	type HNPollOption = HNItem & {
		by: string;
		id: number;
		poll: number;
		score: number;
		text: string;
		time: number;
		type: 'pollopt';
	};
	type HNUser = {
		about: string;
		created: number;
		id: string;
		karma: number;
		submitted: number[];
	};
	type Item = HNStory | HNComment | HNJob | HNPoll | HNPollOption;
}

export {};
