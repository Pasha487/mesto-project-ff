// Закрытие попапа через Esc
function handleEscClose(evt) {
    if (evt.key === 'Escape') {
        const currentPopup = document.querySelector('.popup_is-opened');
        closeModal(currentPopup);
    }
};

// Закрытие попапа через клик
function handleClickClose(evt) {
    if (evt.target.classList.contains('popup__close') || 
    evt.target.classList.contains('popup')) {
        const currentPopup = document.querySelector('.popup_is-opened');
        closeModal(currentPopup);
    }
};

// Закрытие попапа
function closeModal(popup) {
    document.removeEventListener('keydown', handleEscClose)
    popup.classList.remove('popup_is-opened');
};

// Открытие попапа
function openModal(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscClose);
    popup.addEventListener('click', handleClickClose);
};

export { closeModal, openModal };