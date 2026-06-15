const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let currentTab = 'notes';

function loadNotes() {
    tg.sendData(JSON.stringify({ action: "get_notes" }));
}

function showForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="form">
            <input type="text" id="noteTitle" placeholder="Название заметки" class="input">
            <textarea id="noteContent" placeholder="Содержимое" class="textarea" rows="4"></textarea>
            <div class="form-buttons">
                <button class="btn btn-primary" onclick="saveNote()">Сохранить</button>
                <button class="btn btn-secondary" onclick="loadNotes()">Отмена</button>
            </div>
        </div>
    `;
}

function saveNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    if (title) {
        tg.sendData(JSON.stringify({
            action: "create_note",
            title: title,
            content: content
        }));
    }
}

function deleteNote(id) {
    tg.showConfirm('Удалить заметку?', (ok) => {
        if (ok) {
            tg.sendData(JSON.stringify({
                action: "delete_note",
                id: id
            }));
        }
    });
}

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTab = tab.dataset.tab;
        if (currentTab === 'notes') {
            loadNotes();
        } else {
            document.getElementById('content').innerHTML = '<p style="color: var(--text-secondary); padding: 20px;">Задачи скоро появятся</p>';
        }
    });
});

document.getElementById('addBtn').addEventListener('click', () => {
    if (currentTab === 'notes') {
        showForm();
    }
});

loadNotes();