const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Вкладки
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('content').innerHTML = `<p style="color: var(--text-secondary); padding: 20px;">Здесь будут ${tab.dataset.tab === 'notes' ? 'заметки' : 'задачи'}</p>`;
    });
});

// Кнопка добавления
document.getElementById('addBtn').addEventListener('click', () => {
    tg.showPopup({
        title: 'Новая заметка',
        message: 'Форма создания скоро появится'
    });
});