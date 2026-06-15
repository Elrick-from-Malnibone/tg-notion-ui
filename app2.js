const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let currentTab = 'notes';

function loadNotes() {
    tg.sendData(JSON.stringify({ action: "get_notes" }));
}

function showForm() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const form = document.createElement('div');
    form.className = 'form';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Название заметки';
    titleInput.className = 'input';

    const contentInput = document.createElement('textarea');
    contentInput.placeholder = 'Содержимое';
    contentInput.className = 'textarea';
    contentInput.rows = 4;

    const buttons = document.createElement('div');
    buttons.className = 'form-buttons';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary';
    saveBtn.textContent = 'Сохранить';
    saveBtn.onclick = () => {
        const title = titleInput.value.trim();
        const text = contentInput.value.trim();
        if (title) {
            tg.sendData(JSON.stringify({
                action: "create_note",
                title: title,
                content: text
            }));
        }
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Отмена';
    cancelBtn.onclick = () => loadNotes();

    buttons.appendChild(saveBtn);
    buttons.appendChild(cancelBtn);
    form.appendChild(titleInput);
    form.appendChild(contentInput);
    form.appendChild(buttons);
    content.appendChild(form);
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