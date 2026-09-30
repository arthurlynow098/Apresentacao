// A aplicação usa apenas APIs do navegador. Não precisa de servidor nem de npm.
const STORAGE_KEY = 'foco-mais-tarefas-v1';
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const filters = document.querySelectorAll('[data-filter]');
let filter = 'all';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let notificationTimer;
function notify(message) {
  const notification = document.querySelector('#notification');
  notification.textContent = message;
  notification.classList.add('visible');
  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => notification.classList.remove('visible'), 2200);
}


function loadTasks() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(data)) return [];
    return data.filter(task => task && typeof task.id === 'string'
      && typeof task.title === 'string' && typeof task.done === 'boolean');
  } catch {
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // O app ainda funciona durante a sessão se o navegador bloquear armazenamento.
  }
}

function makeButton(label, className, text) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-label', label);
  button.textContent = text;
  return button;
}

function render(animatedId = null) {
  const completed = tasks.filter(task => task.done).length;
  const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  document.querySelector('#progress-label').textContent = `${completed} de ${tasks.length} concluídas`;
  document.querySelector('#progress-percent').textContent = `${percent}%`;
  document.querySelector('#progress-fill').style.width = `${percent}%`;
  document.querySelector('#progress-bar').setAttribute('aria-valuenow', String(percent));
  document.querySelector('#task-count').textContent = `${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'}`;

  const visible = tasks.filter(task => filter === 'all'
    || (filter === 'active' && !task.done)
    || (filter === 'completed' && task.done));
  list.replaceChildren();
  emptyState.hidden = visible.length > 0;
  emptyState.querySelector('strong').textContent = tasks.length
    ? 'Nenhuma tarefa neste filtro.' : 'Sua lista está vazia';
  emptyState.querySelector('p').textContent = tasks.length
    ? 'Escolha outro filtro para ver suas tarefas.' : 'Adicione uma tarefa para começar.';

  for (const task of visible) {
    const row = document.createElement('li');
    row.className = `task-item${task.done ? ' done' : ''}`;
    const toggle = makeButton(`${task.done ? 'Marcar pendente' : 'Concluir'}: ${task.title}`, 'task-toggle', '✓');
    toggle.setAttribute('aria-pressed', String(task.done));
    toggle.addEventListener('click', () => {
      task.done = !task.done;
      saveTasks();
      render(task.id);
      notify(task.done ? 'Tarefa concluída' : 'Tarefa reaberta');
    });
    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;
    const remove = makeButton(`Excluir: ${task.title}`, 'delete-button', '×');
    remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5m4-5v5"/></svg>';
    remove.addEventListener('click', () => {
      remove.disabled = true;
      toggle.disabled = true;
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      const finish = () => { render(); notify('Tarefa excluída'); };
      if (reducedMotion.matches || !row.animate) { finish(); return; }
      row.animate([
        { opacity: 1, transform: 'translateX(0)' },
        { opacity: 0, transform: 'translateX(22px)' }
      ], { duration: 180, easing: 'ease-in', fill: 'forwards' }).finished.then(finish, finish);
    });
    row.append(toggle, title, remove);
    list.append(row);
    if (task.id === animatedId && !reducedMotion.matches && row.animate) {
      row.animate([
        { opacity: 0.35, transform: 'translateY(9px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  const id = `t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  tasks.unshift({ id, title, done: false });
  saveTasks();
  render(id);
  notify('Tarefa adicionada');
  form.reset();
  input.focus();
});

for (const button of filters) {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    for (const item of filters) {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    }
    render();
  });
}

document.querySelector('#today').textContent = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long'
}).format(new Date());
render();
