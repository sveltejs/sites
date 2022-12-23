<script lang="ts">
	import '../styles.css';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	$: currentFilter = $page.url.searchParams.has('active')
		? 'active'
		: $page.url.searchParams.has('completed')
		? 'completed'
		: 'all';
	$: filtered =
		currentFilter === 'all'
			? data.todos
			: currentFilter === 'completed'
			? data.todos.filter((item) => item.completed)
			: data.todos.filter((item) => !item.completed);
	$: numActive = data.todos.filter((item) => !item.completed).length;
	$: numCompleted = data.todos.filter((item) => item.completed).length;
</script>

<svelte:head>
	<title>Todos</title>
	<meta name="description" content="A todo list app" />
</svelte:head>

<section class="todoapp">
	<header class="header">
		<h1>todos</h1>
		<form method="post" action="?/addTodo">
			<input
				name="title"
				class="new-todo"
				placeholder="What needs to be done?"
				autofocus
				required
			/>
		</form>
	</header>

	{#if data.todos.length > 0}
		<section class="main">
			<form method="post" action="?/toggleAll">
				<input
					type="hidden"
					name="completed"
					value={numCompleted === data.todos.length ? '' : 'true'}
				/>
				<button
					id="toggle-all"
					class="toggle-all {numCompleted === data.todos.length ? 'checked' : ''}"
					aria-label="Mark all as {numCompleted === data.todos.length ? 'not done' : 'done'}"
				/>
			</form>

			<ul class="todo-list">
				{#each filtered as todo (todo.id)}
					<li class:completed={todo.completed}>
						<form action="?/toggleTodo" method="post">
							<input type="hidden" name="id" value={todo.id} />
							<input type="hidden" name="completed" value={todo.completed ? '' : 'true'} />
							<button
								class="toggle"
								aria-label="Mark todo as {todo.completed ? 'not done' : 'done'}"
							/>
						</form>

						<form class="text" action="?/editTodo" method="post">
							<input type="hidden" name="id" value={todo.id} />
							<input
								aria-label="Edit todo"
								type="text"
								name="title"
								class="edit"
								value={todo.title}
								readonly={todo.completed}
								required
							/>
							<button class="save" aria-label="Save todo" />
						</form>

						<form action="?/deleteTodo" method="post">
							<input type="hidden" name="id" value={todo.id} />
							<button class="destroy" aria-label="Delete todo" />
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
