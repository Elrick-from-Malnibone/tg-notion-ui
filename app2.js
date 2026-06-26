const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let currentTab = 'notes';

// Тема
const savedTheme = localStorage.getItem('tgnotion_theme') || 'dark';
document.body.className = savedTheme;

const themeIcon = document.getElementById('themeIcon');
function updateThemeIcon() {
    if (document.body.className === 'dark') {
        themeIcon.innerHTML = '<circle cx="8" cy="8" r="6" fill="currentColor"/>';
    } else {
        themeIcon.innerHTML = '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/>';
    }
}
updateThemeIcon();

document.getElementById('themeBtn').addEventListener('click', () => {
    const newTheme = document.body.className === 'dark' ? 'light' : 'dark';
    document.body.className = newTheme;
    localStorage.setItem('tgnotion_theme', newTheme);
    updateThemeIcon();
    currentTab === 'notes' ? renderNotes() : renderTasks();
});

function getNotes() {
    const notes = localStorage.getItem('tgnotion_notes');
    return notes ? JSON.parse(notes) : [];
}

function saveNotes(notes) {
    localStorage.setItem('tgnotion_notes', JSON.stringify(notes));
}

function getTasks() {
    const tasks = localStorage.getItem('tgnotion_tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasks(tasks) {
    localStorage.setItem('tgnotion_tasks', JSON.stringify(tasks));
}

function renderNotes() {
    const notes = getNotes();
    const content = document.getElementById('content');
    
    if (notes.length === 0) {
        content.innerHTML = `
            <div class="empty">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="6" width="32" height="38" rx="4" stroke="currentColor" stroke-width="2"/>
                    <line x1="16" y1="18" x2="32" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="16" y1="26" x2="28" y2="26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <br>Нет заметок
            </div>`;
        return;
    }

    let html = '';
    notes.forEach((note, index) => {
        html += `
            <div class="note-item" data-index="${index}">
                <span class="note-title">${escapeHtml(note.title)}</span>
                <span class="note-date">${note.created_at.slice(0, 5)}</span>
            </div>
        `;
    });
    content.innerHTML = html;

    document.querySelectorAll('.note-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            openNote(index);
        });
    });
}

function openNote(index) {
    const notes = getNotes();
    const note = notes[index];
    const content = document.getElementById('content');

    content.innerHTML = `
        <div class="note-full">
            <div class="note-full-header">
                <button class="back-btn" id="backBtn">← Назад</button>
                <button class="del-btn" id="delNoteBtn">✕</button>
            </div>
            <h2>${escapeHtml(note.title)}</h2>
            <div class="note-full-content">${escapeHtml(note.content || '') || '<em style="color:var(--text-secondary)">Пусто</em>'}</div>
            <span class="note-date">${note.created_at}</span>
        </div>
    `;

    document.getElementById('backBtn').addEventListener('click', renderNotes);
    document.getElementById('delNoteBtn').addEventListener('click', () => {
        tg.showConfirm('Удалить заметку?', (ok) => {
            if (ok) {
                const notes = getNotes();
                notes.splice(index, 1);
                saveNotes(notes);
                renderNotes();
            }
        });
    });
}

function renderTasks() {
    const tasks = getTasks();
    const content = document.getElementById('content');
    
    if (tasks.length === 0) {
        content.innerHTML = `
            <div class="empty">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="8" width="32" height="32" rx="6" stroke="currentColor" stroke-width="2"/>
                    <path d="M17 24l5 5 9-10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <br>Нет задач
            </div>`;
        return;
    }

    const active = tasks.filter(t => !t.done);
    const done = tasks.filter(t => t.done);

    let html = '';
    
    active.forEach((task, i) => {
        const realIndex = tasks.indexOf(task);
        html += `
            <div class="todo-item" data-index="${realIndex}">
                <div class="todo-checkbox"></div>
                <span class="todo-title">${escapeHtml(task.title)}</span>
                <button class="del-btn small" data-index="${realIndex}" data-type="task">✕</button>
            </div>
        `;
    });

    done.forEach((task, i) => {
        const realIndex = tasks.indexOf(task);
        html += `
            <div class="todo-item done" data-index="${realIndex}">
                <div class="todo-checkbox checked"></div>
                <span class="todo-title">${escapeHtml(task.title)}</span>
                <button class="del-btn small" data-index="${realIndex}" data-type="task">✕</button>
            </div>
        `;
    });

    content.innerHTML = html;

    document.querySelectorAll('.todo-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('del-btn')) return;
            const index = parseInt(item.dataset.index);
            const tasks = getTasks();
            tasks[index].done = !tasks[index].done;
            saveTasks(tasks);
            renderTasks();
        });
    });

    document.querySelectorAll('.del-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = btn.dataset.index;
            const type = btn.dataset.type;
            if (type === 'note') deleteNote(index);
            else deleteTask(index);
        });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNoteForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="form">
            <input type="text" id="noteTitle" placeholder="Название заметки" class="input">
            <textarea id="noteContent" placeholder="Содержимое (необязательно)" class="textarea" rows="4"></textarea>
            <div class="form-buttons">
                <button class="btn btn-primary" id="saveNoteBtn">Сохранить</button>
                <button class="btn btn-secondary" id="cancelNoteBtn">Отмена</button>
            </div>
        </div>
    `;

    document.getElementById('saveNoteBtn').addEventListener('click', () => {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        if (title) {
            const notes = getNotes();
            notes.unshift({
                title: title,
                content: content,
                created_at: new Date().toLocaleString('ru-RU')
            });
            saveNotes(notes);
            renderNotes();
        }
    });

    document.getElementById('cancelNoteBtn').addEventListener('click', () => renderNotes());
}

function showTaskForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="form">
            <input type="text" id="taskTitle" placeholder="Новая задача" class="input">
            <div class="form-buttons">
                <button class="btn btn-primary" id="saveTaskBtn">Добавить</button>
                <button class="btn btn-secondary" id="cancelTaskBtn">Отмена</button>
            </div>
        </div>
    `;

    document.getElementById('saveTaskBtn').addEventListener('click', () => {
        const title = document.getElementById('taskTitle').value.trim();
        if (title) {
            const tasks = getTasks();
            tasks.unshift({
                title: title,
                done: false,
                created_at: new Date().toLocaleString('ru-RU')
            });
            saveTasks(tasks);
            renderTasks();
        }
    });

    document.getElementById('cancelTaskBtn').addEventListener('click', () => renderTasks());
}

function deleteNote(index) {
    tg.showConfirm('Удалить заметку?', (ok) => {
        if (ok) {
            const notes = getNotes();
            notes.splice(index, 1);
            saveNotes(notes);
            renderNotes();
        }
    });
}

function deleteTask(index) {
    tg.showConfirm('Удалить задачу?', (ok) => {
        if (ok) {
            const tasks = getTasks();
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks();
        }
    });
}

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTab = tab.dataset.tab;
        currentTab === 'notes' ? renderNotes() : renderTasks();
    });
});

document.getElementById('addBtn').addEventListener('click', () => {
    currentTab === 'notes' ? showNoteForm() : showTaskForm();
});

renderNotes();