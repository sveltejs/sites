type HNBaseItem = {
	id: number;
	deleted?: true;
};
type AlgoliaBaseItem = {
	id: number;
	author: string;
	created_at: string;
	created_at_i: number;
};

declare global {
	namespace App {
		interface Error {
			frame?: string;
		}
	}
	type HNStory = HNBaseItem & {
		by: string;
		descendants: number;
		kids?: number[];
		score: number;
		time: number;
		title: string;
		type: 'story';
		url: string;
	};
	type HNComment = HNBaseItem & {
		by: string;
		id: number;
		kids?: number[];
		parent: number;
		text: string;
		time: number;
		type: 'comment';
	};
	type HNJob = HNBaseItem & {
		by: string;
		id: number;
		score: number;
		text?: string;
		time: number;
		title: string;
		type: 'job';
		url: string;
	};
	type HNPoll = HNBaseItem & {
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
	type HNPollOption = HNBaseItem & {
		by: string;
		id: number;
		poll: number;
		score: number;
		text: string;
		time: number;
		type: 'pollopt';
	};
	type HNUser = {
		about?: string;
		created: number;
		id: string;
		karma: number;
		submitted?: number[];
	};
	type HNItem = HNStory | HNComment | HNJob | HNPoll | HNPollOption;

	type AlgoliaComment = AlgoliaBaseItem & {
		type: 'comment';
		url: null;
		options: never[];
		parent_id: number;
		points: null | number;
		story_id: number;
		text: string;
		title: null;
		url: null;
		children: AlgoliaComment[];
	};
	type AlgoliaStory = AlgoliaBaseItem & {
		type: 'story';
		options: never[];
		parent_id: null;
		points: null | number;
		story_id: number;
		text: null | string;
		title: string;
		url: null | string;
		children: AlgoliaComment[];
	};
	type AlgoliaJob = AlgoliaBaseItem & {
		type: 'job';
		children: never[];
		options: never[];
		parent_id: null;
		points: null;
		story_id: null;
		text: null | string;
		title: string;
		url: string;
	};
	/**
	 * Algolia does not parse poll options properly, so all the contents are empty
	 */
	type AlgoliaPollOption = AlgoliaBaseItem & {
		type: 'pollopt';
		children: never[];
		options: never[];
		text: null;
		parent_id: null;
		story_id: null;
		points: number;
		title: null;
		url: null;
	};
	type AlgoliaPoll = AlgoliaBaseItem & {
		type: 'poll';
		options: number[];
		parent_id: null;
		points: null | number;
		story_id: null;
		text: null | string;
		title: string;
		url: null;
		children: AlgoliaComment[];
	};
	type AlgoliaItem = AlgoliaComment | AlgoliaStory | AlgoliaJob | AlgoliaPoll | AlgoliaPollOption;
}

export {};
