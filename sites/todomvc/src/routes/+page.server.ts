import type { Actions, PageServerLoad } from './$types';
import {
	addTodo,
	clearCompleted,
	deleteTodo,
	editTodo,
	getTodos,
	toggleAll,
	toggleTodo
} from './db.server';

const wait = async () => {
	return new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
};

export const load = (() => {
	return { todos: getTodos() };
}) satisfies PageServerLoad;

export const actions = {
	addTodo: async ({ request }) => {
		await wait();
		const form = await request.formData();
		const title = form.get('title') as string;
		addTodo(title);
	},
	deleteTodo: async ({ request }) => {
		await wait();
		const form = await request.formData();
		const id = form.get('id') as string;
		deleteTodo(id);
	},
	editTodo: async ({ request }) => {
		await wait();
		const form = await request.formData();
		const id = form.get('id') as string;
		const title = form.get('title') as string;
		editTodo(id, title);
	},
	toggleTodo: async ({ request }) => {
		await wait();
		const form = await request.formData();
		const id = form.get('id') as string;
		toggleTodo(id);
	},
	toggleAll: async ({ request }) => {
		await wait();
		const form = await request.formData();
		const completed = form.get('completed') === 'true';
		toggleAll(completed);
	},
	clearCompleted: async () => {
		await wait();
		clearCompleted();
	}
} satisfies Actions;
