// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
// @todo: Функция создания карточки
function createCard(cardData, deleteCard) {
    const card = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = card.querySelector('.card__image');
    const cardTitle = card.querySelector('.card__title');
    const cardDeleteButton = card.querySelector('.card__delete-button');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    cardDeleteButton.addEventListener('click', () => {
        deleteCard(card);
    });

    return card;
}

// @todo: Функция удаления карточки
function deleteCard(card) {
    card.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(cardData => {
    const card = createCard(cardData, deleteCard);
    placesList.append(card);
});
