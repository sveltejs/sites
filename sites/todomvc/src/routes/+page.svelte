<script lang="ts">
	import '../styles.css';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import type { Todo } from './db.server';

	export let data: PageData;

	let inserting: Todo[] = [];
	let deleting: Todo[] = [];
	let updating: Todo[] = [];

	const pending = (todo: Todo) => {
		return deleting.includes(todo) || inserting.includes(todo) || updating.includes(todo);
	};

	$: todos = data.todos
		.filter((item) => !deleting.includes(item))
		.map((item) => updating.find((u) => u.id === item.id) ?? item)
		.concat(inserting);
	$: currentFilter = $page.url.searchParams.has('active')
		? 'active'
		: $page.url.searchParams.has('completed')
		? 'completed'
		: 'all';
	$: filtered =
		currentFilter === 'all'
			? todos
			: currentFilter === 'completed'
			? todos.filter((item) => item.completed)
			: todos.filter((item) => !item.completed);
	$: numActive = todos.filter((item) => !item.completed).length;
	$: numCompleted = todos.filter((item) => item.completed).length;

	const addTodo: SubmitFunction = ({ data, form }) => {
		const todo = {
			title: data.get('title') as string,
			completed: false,
			id: 'temporary-' + Math.random()
		};
		form.reset();
		inserting.push(todo);
		inserting = inserting;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await update();
			}
			inserting = inserting.filter((item) => item !== todo);
		};
	};

	const toggleTodo: SubmitFunction = ({ data: formData }) => {
		const todo = data.todos.find((item) => item.id === formData.get('id'))!;
		const updated = { ...todo, completed: !todo.completed };
		updating.push(updated);
		updating = updating;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await update();
			}
			updating = updating.filter((item) => item !== updated);
		};
	};

	const editTodo: SubmitFunction = ({ data: formData }) => {
		const todo = data.todos.find((item) => item.id === formData.get('id'))!;
		const updated = { ...todo, title: formData.get('title') as string };
		updating.push(updated);
		updating = updating;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await update();
			}
			updating = updating.filter((item) => item !== updated);
		};
	};

	const deleteTodo: SubmitFunction = ({ data: formData }) => {
		const todo = data.todos.find((item) => item.id === formData.get('id'))!;
		deleting.push(todo);
		deleting = deleting;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await update();
			}
			deleting = deleting.filter((item) => item !== todo);
		};
	};
</script>

<svelte:head>
	<title>Todos</title>
	<meta name="description" content="A todo list app" />
</svelte:head>

<section class="todoapp">
	<header class="header">
		<h1>todos</h1>
		<form method="post" action="?/addTodo" use:enhance={addTodo}>
			<input
				name="title"
				class="new-todo"
				placeholder="What needs to be done?"
				autofocus
				required
			/>
		</form>
	</header>

	{#if todos.length > 0}
		<section class="main">
			<form method="post" action="?/toggleAll">
				<input type="hidden" name="completed" value={numCompleted === todos.length ? '' : 'true'} />
				<button
					id="toggle-all"
					class="toggle-all {numCompleted === todos.length ? 'checked' : ''}"
					aria-label="Mark all as {numCompleted === todos.length ? 'not done' : 'done'}"
				/>
			</form>

			<ul class="todo-list">
				{#each filtered as todo (todo.id + (pending(todo) ? 'pending' : ''))}
					<li class:completed={todo.completed} class:pending={pending(todo)}>
						<form action="?/toggleTodo" method="post" use:enhance={toggleTodo}>
							<input type="hidden" name="id" value={todo.id} />
							<input type="hidden" name="completed" value={todo.completed ? '' : 'true'} />
							<button
								class="toggle"
								disabled={pending(todo)}
								aria-label="Mark todo as {todo.completed ? 'not done' : 'done'}"
							/>
						</form>

						<form class="text" action="?/editTodo" method="post" use:enhance={editTodo}>
							<input type="hidden" name="id" value={todo.id} />
							<input
								aria-label="Edit todo"
								type="text"
								name="title"
								class="edit"
								value={todo.title}
								readonly={todo.completed || pending(todo)}
								required
							/>
							<button class="save" aria-label="Save todo" />
						</form>

						<form action="?/deleteTodo" method="post" use:enhance={deleteTodo}>
							<input type="hidden" name="id" value={todo.id} />
							<button class="destroy" aria-label="Delete todo" disabled={pending(todo)} />
						</form>
					</li>
				{/each}
			</ul>

			<footer class="footer">
				<span class="todo-count">
					<strong>{numActive}</strong>
					{numActive === 1 ? 'item' : 'items'} left
				</span>

				<ul class="filters">
					<li><a class:selected={currentFilter === 'all'} href="/">All</a></li>
					<li>
						<a class:selected={currentFilter === 'active'} href="/?active">Active</a>
					</li>
					<li>
						<a class:selected={currentFilter === 'completed'} href="/?completed">Completed</a>
					</li>
				</ul>

				{#if numCompleted}
					<form method="post" action="?/clearCompleted">
						<button class="clear-completed"> Clear completed </button>
					</form>
				{/if}
			</footer>
		</section>
	{/if}
</section>
