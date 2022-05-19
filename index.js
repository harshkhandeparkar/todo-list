class TodoListNode {
	/** @type {HTMLUListElement} */
	todo_list;
	/** @type {HTMLParagraphElement} */
	no_todo_msg;

	/**
	 * @param {string} selector
	 */
	constructor(todo_list_selector, no_todo_msg_selector) {
		this.todo_list = document.querySelector(todo_list_selector);
		this.no_todo_msg = document.querySelector(no_todo_msg_selector);
	}

	/**
	 * @param {Todo} todo
	 */
	append_todo(todo) {
		this.todo_list.appendChild(todo.todo_node);

		this.#update_no_todo_msg();
	}

	/**
	 * @param {Todo} todo
	 */
	remove_todo(todo) {
		this.todo_list.removeChild(todo.todo_node);

		this.#update_no_todo_msg();
	}

	#update_no_todo_msg() {
		if (this.todo_list.hasChildNodes()) this.no_todo_msg.style.setProperty('display', 'none');
		else this.no_todo_msg.style.setProperty('display', 'block');
	}

	remove_all_todos() {
		while(this.todo_list.lastChild) this.todo_list.removeChild(this.todo_list.lastChild);
	}
}

const todo_list_node = new TodoListNode('#todo-list', '#no-todo-msg');

class Todo {
	/** @type {number} */
	id;
	/** @type {string} */
	title;

	/** @type {(id: number) => void} */
	on_delete;

	/** @type {HTMLLIElement} */
	todo_node;

	/**
	 * @param id {number}
	 * @param title {string}
	 * @param on_delete {(id: number) => void}
	 * */
	constructor(id, title, on_delete) {
		this.id = id;
		this.title = title;
		this.on_delete = on_delete;

		this.todo_node = this.#create_todo_node(this.title);
	}

	/** @param title {string} */
	#create_todo_node(title) {
		const todo_li = document.createElement('li');

		todo_li.classList.add('todo-entry');
		todo_li.append(this.#create_del_btn_node());
		todo_li.append(this.#create_todo_content_node(title));

		return todo_li;
	}

	#create_del_btn_node() {
		const todo_del_btn = document.createElement('button');

		todo_del_btn.classList.add('todo-del-btn', 'icon-btn');
		todo_del_btn.textContent = '✓';

		todo_del_btn.addEventListener('click', () => {
			this.on_delete(this.id);
		})

		return todo_del_btn;
	}

	/** @param title {string} */
	#create_todo_content_node(title) {
		const todo_content_span = document.createElement('span');

		todo_content_span.textContent = title;
		todo_content_span.classList.add('todo-content');

		return todo_content_span;
	}
}

class TodoList {
	/** @type {number} */
	todo_count = 0;
	/** @type {Todo[]} */
	todos = [];
	/** @type {'id' | 'alphabetical'} */
	sort_order = 'id';

	/** @param todo {Todo} */
	#render_todo(todo) {
		todo_list_node.append_todo(todo);
	}

	/** @param title {string} */
	add_todo(title) {
		this.todo_count++;

		const todo = new Todo(this.todo_count, title, (id) => this.#delete_todo(id));
		this.todos.push(todo);

		this.todos.sort(this.#get_todo_sort_fn());

		this.#rerender_all_todos();
	}

	#delete_todo(id) {
		const todo_to_delete = this.todos.splice(
			this.todos.findIndex((todo) => todo.id === id),
			1
		)[0]

		todo_list_node.remove_todo(todo_to_delete);
	}

	#rerender_all_todos() {
		todo_list_node.remove_all_todos();

		this.todos.forEach(this.#render_todo);
	}

	/**
	 *
	 * @returns {(todo1: Todo, todo2: Todo) => number}
	 */
	#get_todo_sort_fn() {
		switch(this.sort_order) {
			case 'id':
				return (todo1, todo2) => todo1.id - todo2.id;
			case 'alphabetical':
				return (todo1, todo2) => todo1.title.localeCompare(todo2.title);
		}
	}
}

const TODO_LIST = new TodoList();

/** @type {HTMLFormElement} */
const form = document.querySelector('#todo-add-form');
/** @type {HTMLInputElement} */
const todo_content = document.querySelector('#todo-content-textbox');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const content = todo_content.value;
	if (content !== '') TODO_LIST.add_todo(content);

	todo_content.value = '';
})

window.addEventListener('load', () => {
	TODO_LIST.add_todo('Sample TODO');
})