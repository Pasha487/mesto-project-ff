const cardTemplate = document.querySelector('#card-template').content;

// Функция создания карточки
function createCard(cardData, deleteCard, handleLikeClick, handleImagePopup) {
    const card = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = card.querySelector('.card__image');
    const cardTitle = card.querySelector('.card__title');
    const cardDeleteButton = card.querySelector('.card__delete-button');
    const cardLikeButton = card.querySelector('.card__like-button');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    cardImage.addEventListener('click', () => handleImagePopup(cardData));
    cardLikeButton.addEventListener('click', handleLikeClick);
    cardDeleteButton.addEventListener('click', () => {
        deleteCard(card);
    });

    return card;
}

// Функциональность лайка на карточках
function handleLikeClick(evt) {
    evt.target.classList.toggle('card__like-button_is-active');
}

// Функция удаления карточки
function deleteCard(card) {
    card.remove();
}

export { createCard, handleLikeClick, deleteCard };