const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

document.addEventListener('click', () => {
    tg.sendData(JSON.stringify({ action: "get_notes" }));
});