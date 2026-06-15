const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let currentTab = 'notes';

// Загрузка заметок
async function loadNotes() {
    tg.sendData(JSON.stringify({ action: "get_notes" }));
}

// Создание заметки
function createNote() {
    tg.showPopup({
        title: 'Новая заметка',
        message: 'Введите название',
        buttons: [
            { type: 'default', text: 'Создать' },
            { type: 'cancel' }
        ]
    }, (btn) => {
        if (btn === 'default') {
            const title = prompt('Название:');
            const content = prompt('Содержимое:');
            if (title) {
                tg.sendData(JSON.stringify({
                    action: "create_note",
                    title: title,
                    content: content || ''
                }));
            }
        }
    });
}

// Удаление заметки
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

// Вкладки
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

// Кнопка добавления
document.getElementById('addBtn').addEventListener('click', () => {
    if (currentTab === 'notes') {
        createNote();
    }
});

// Первая загрузка
loadNotes();