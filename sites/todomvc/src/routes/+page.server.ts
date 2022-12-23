import type { Actions, PageServerLoad } from './$types';

export interface Todo {
	id?: string;
	title: string;
	completed: boolean;
}

export const load = (async ({ cookies }) => {
	const todos = JSON.parse(cookies.get('todos') || '[]') as Todo[];
	return { todos };
}) satisfies PageServerLoad;

// todos are managed inside a cookie, so we don't need to have a database - don't do this at home

export const actions = {
	addTodo: async ({ request, cookies }) => {
		const form = await request.formData();
		const title = form.get('title') as string;
		const todos = JSON.parse(cookies.get('todos') || '[]');
		todos.push({ id: 'id-' + Math.random(), title, completed: false });
		cookies.set('todos', JSON.stringify(todos));
	},
	deleteTodo: async ({ request, cookies }) => {
		const form = await request.formData();
		const id = form.get('id') as string;
		const todos = JSON.parse(cookies.get('todos') || '[]');
		cookies.set('todos', JSON.stringify(todos.filter((todo: any) => todo.id !== id)));
	},
	editTodo: async ({ request, cookies }) => {
		const form = await request.formData();
		const id = form.get('id') as string;
		const title = form.get('title') as string;
		const todos = JSON.parse(cookies.get('todos') || '[]');
		cookies.set(
			'todos',
			JSON.stringify(todos.map((todo: any) => (todo.id === id ? { ...todo, title } : todo)))
		);
	},
	toggleTodo: async ({ request, cookies }) => {
		const form = await request.formData();
		const id = form.get('id') as string;
		const todos = JSON.parse(cookies.get('todos') || '[]');
		cookies.set(
			'todos',
			JSON.stringify(
				todos.map((todo: any) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
			)
		);
	},
	toggleAll: async ({ request, cookies }) => {
		const form = await request.formData();
		const completed = form.get('completed') === 'true';
		const todos = JSON.parse(cookies.get('todos') || '[]');
		cookies.set('todos', JSON.stringify(todos.map((todo: any) => ({ ...todo, completed }))));
	},
	clearCompleted: async ({ cookies }) => {
		const todos = JSON.parse(cookies.get('todos') || '[]');
		cookies.set('todos', JSON.stringify(todos.filter((todo: any) => !todo.completed)));
	}
} satisfies Actions;
