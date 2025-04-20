const cardTemplate = document.querySelector('#card-template').content;

// Добавления карточек
function createCard(cardData, deleteCard, handleLikeClick, imageHandler) {
    const card = cardTemplate.querySelector('.card').cloneNode(true);
   
    const cardImage = card.querySelector('.card__image');
    const cardTitle = card.querySelector('.card__title');
    const cardDeleteButton = card.querySelector('.card__delete-button');
    const cardLikeButton = card.querySelector('.card__like-button');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    cardImage.addEventListener('click', () => imageHandler(cardData));
    cardDeleteButton.addEventListener('click', () => deleteCard(card));
    cardLikeButton.addEventListener('click', handleLikeClick);
    return card;
};

// Функциональность лайка на карточках
function handleLikeClick(evt) {
    evt.target.classList.toggle('card__like-button_is-active');
}


// Удаления карточек
function deleteCard(card) {
    card.remove();
};

export { createCard, handleLikeClick, deleteCard };