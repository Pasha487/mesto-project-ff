import { likeCard, unlikeCard } from './api.js';

// Функция создания карточки
export function createCard(cardData, handleDeleteCard, handleLikeClick, openImage, currentUserId) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCountElement = cardElement.querySelector('.card__like-count');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;
    likeCountElement.textContent = cardData.likes.length;

// Показываем кнопку удаления только для своих карточек
    if (cardData.owner._id === currentUserId) {
        deleteButton.style.display = 'block';
    } else {
        deleteButton.style.display = 'none';
    }

// Проверяем, лайкнул ли текущий пользователь карточку
    const isLiked = cardData.likes.some(user => user._id === currentUserId);
    if (isLiked) {
        likeButton.classList.add('card__like-button_is-active');
    }

// Обработчики событий
    deleteButton.addEventListener('click', () => handleDeleteCard(cardElement, cardData._id));
    likeButton.addEventListener('click', (evt) => handleLikeClick(evt, cardData._id));
    cardImage.addEventListener('click', () => openImage(cardData));

    return cardElement;
}

// Функция удаления карточки
export function deleteCard(cardElement) {
    cardElement.remove();
}

// Функция обработки лайка
export function handleLikeClick(evt, cardId) {
    const likeButton = evt.target;
    const likeMethod = likeButton.classList.contains('card__like-button_is-active') ? unlikeCard : likeCard;
    const likeCountElement = likeButton.closest('.card__like-container').querySelector('.card__like-count');

    likeMethod(cardId)
    .then(cardData => {
        likeButton.classList.toggle('card__like-button_is-active');
        likeCountElement.textContent = cardData.likes.length;
    })
    .catch(err => 
        console.error('Ошибка при обработке лайка:', err)
    );
}