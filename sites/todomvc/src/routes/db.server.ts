// Todos are managed managed in memory, so we don't need a database. We can't deploy this
// to the edge/serverless environments for that reason, but it's fine for local development.

export interface Todo {
	id: string;
	title: string;
	completed: boolean;
}

let todos: Todo[] = [];

export function getTodos() {
	return todos;
}

export function addTodo(title: string) {
	todos.push({ id: 'id-' + Math.random(), title, completed: false });
}

export function deleteTodo(id: string) {
	todos = todos.filter((todo) => todo.id !== id);
}

export function editTodo(id: string, title: string) {
	const todo = todos.find((todo) => todo.id === id);
	if (todo) {
		todo.title = title;
	}
}

export function toggleTodo(id: string) {
	const todo = todos.find((todo) => todo.id === id);
	if (todo) {
		todo.completed = !todo.completed;
	}
}

export function toggleAll(completed: boolean) {
	todos.forEach((todo) => (todo.completed = completed));
}

export function clearCompleted() {
	todos = todos.filter((todo) => !todo.completed);
}
