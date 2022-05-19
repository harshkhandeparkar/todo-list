/** @type {HTMLFormElement} */
const form = document.querySelector('#todo-add-form');
/** @type {HTMLInputElement} */
const todo_content = document.querySelector('#todo-content-textbox');
/** @type {HTMLUListElement} */
const todo_list = document.querySelector('#todo-list');
/** @type {HTMLParagraphElement} */
const no_todo_msg = document.querySelector('#no-todo-msg');

const update_no_todo_msg = () => {
	if (todo_list.hasChildNodes()) no_todo_msg.style.setProperty('display', 'none');
	else no_todo_msg.style.setProperty('display', 'block');
}

class Todo {
	/** @type {string} */
	title;
	/** @type {HTMLLIElement} */
	todo_node;

	/** @param title {string} */
	constructor(title) {
		this.title = title;
		this.todo_node = this.#create_todo_node(this.title);
	}

	static handle_todo_delete = (e) => {
		e.preventDefault();
		const btn = e.currentTarget;

		btn.parentElement.remove();

		update_no_todo_msg();
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
		todo_del_btn.addEventListener('click', Todo.handle_todo_delete);

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
	/** @param todo {Todo} */
	#render_todo(todo) {
		todo_list.append(todo.todo_node);

		update_no_todo_msg();
	}

	/** @param title {string} */
	add_todo(title) {
		this.#render_todo(new Todo(title));
	}
}

const TODO_LIST = new TodoList();

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const content = todo_content.value;
	if (content !== '') TODO_LIST.add_todo(content);

	todo_content.value = '';
})

window.addEventListener('load', () => {
	TODO_LIST.add_todo('Sample TODO');

	update_no_todo_msg();
})