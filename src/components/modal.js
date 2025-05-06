// Закрытие по Esc
function handleEscClose(evt) {
    if (evt.key === 'Escape') {
        const openPopup = document.querySelector('.popup_is-opened');
        closePopup(openPopup);
    }
};

// Закрытие через Оверлей
function handleOverlayClick(evt) {
    if (evt.target.classList.contains('popup')) {
        closePopup(evt.target);
    }
}

// Функция открытия попапа
function openPopup(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscClose);
    popup.addEventListener('click', handleOverlayClick);
}

// Функция закрытия попапа
function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscClose);
    popup.removeEventListener('click', handleOverlayClick);
}


export { closePopup, openPopup };