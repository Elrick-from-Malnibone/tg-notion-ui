const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let currentTab = 'notes';

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
        content.innerHTML = '<p style="color: var(--text-secondary); padding: 20px;">Нет заметок</p>';
        return;
    }

    let html = '';
    notes.forEach((note, index) => {
        html += `
            <div class="note-card" onclick="deleteNote(${index})">
                <h3>${escapeHtml(note.title)}</h3>
                <p>${escapeHtml(note.content || '')}</p>
                <span class="note-date">${note.created_at}</span>
            </div>
        `;
    });
    content.innerHTML = html;
}

function renderTasks() {
    const tasks = getTasks();
    const content = document.getElementById('content');
    
    if (tasks.length === 0) {
        content.innerHTML = '<p style="color: var(--text-secondary); padding: 20px;">Нет задач</p>';
        return;
    }

    let html = '';
    tasks.forEach((task, index) => {
        html += `
            <div class="note-card" onclick="deleteTask(${index})">
                <h3>${task.done ? '✅ ' : ''}${escapeHtml(task.title)}</h3>
                <p>${escapeHtml(task.description || '')}</p>
                <span class="note-date">${task.created_at}</span>
            </div>
        `;
    });
    content.innerHTML = html;
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
            <textarea id="noteContent" placeholder="Содержимое" class="textarea" rows="4"></textarea>
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

    document.getElementById('cancelNoteBtn').addEventListener('click', () => {
        renderNotes();
    });
}

function showTaskForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="form">
            <input type="text" id="taskTitle" placeholder="Название задачи" class="input">
            <textarea id="taskDescription" placeholder="Описание" class="textarea" rows="4"></textarea>
            <div class="form-buttons">
                <button class="btn btn-primary" id="saveTaskBtn">Сохранить</button>
                <button class="btn btn-secondary" id="cancelTaskBtn">Отмена</button>
            </div>
        </div>
    `;

    document.getElementById('saveTaskBtn').addEventListener('click', () => {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        if (title) {
            const tasks = getTasks();
            tasks.unshift({
                title: title,
                description: description,
                done: false,
                created_at: new Date().toLocaleString('ru-RU')
            });
            saveTasks(tasks);
            renderTasks();
        }
    });

    document.getElementById('cancelTaskBtn').addEventListener('click', () => {
        renderTasks();
    });
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

// Вкладки
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTab = tab.dataset.tab;
        if (currentTab === 'notes') {
            renderNotes();
        } else {
            renderTasks();
        }
    });
});

// Кнопка добавления
document.getElementById('addBtn').addEventListener('click', () => {
    if (currentTab === 'notes') {
        showNoteForm();
    } else {
        showTaskForm();
    }
});

// Первая загрузка
renderNotes();