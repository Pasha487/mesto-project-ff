import "../pages/index.css";
import { initialCards } from "./cards.js";
import { createCard, handleLikeClick, deleteCard } from "../components/card.js";
import { closePopup, openPopup } from "../components/modal.js";
import { enableValidation, clearValidation } from "./validation.js";

// DOM элементы
// Основные элементы
const placesList = document.querySelector('.places__list');
const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
// Попапы
const editPopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
// Элементы профиля
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
// Форма редактирования профиля
const nameInput = document.querySelector('.popup__input_type_name');
const descriptionInput = document.querySelector('.popup__input_type_description');
const editForm = document.querySelector('.popup__form[name="edit-profile"]');
// Форма добавления карточки
const addCardForm = document.querySelector('.popup__form[name="new-place"]');
const placeNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const sourceLinkInput = addCardForm.querySelector('.popup__input_type_url');
// Элементы попапа с изображением
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
// Кнопки закрытие попапов
const popupCloseButtons = document.querySelectorAll('.popup__close');

const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
}

// Включение валидации при загрузке страницы
enableValidation(validationConfig);

// Инициализация карточек
initialCards.forEach(cardData => {
    const card = createCard(cardData, deleteCard, handleLikeClick, openImage);
    placesList.append(card);
});

// Обработчики открытия попапов
editProfileButton.addEventListener('click', () => {
    nameInput.value = profileName.textContent;
    descriptionInput.value = profileDescription.textContent;
    clearValidation(editForm, validationConfig);
    openPopup(editPopup);
});

addCardButton.addEventListener('click', () => {
    addCardForm.reset();
    clearValidation(addCardForm, validationConfig);
    openPopup(addCardPopup);
});

// Обработчики закрытие попапов
popupCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
        closePopup(button.closest('.popup'));
    });
});

// Отправка формы редактирования профиля
editForm.addEventListener('submit', handleEditFormSubmit);
// Отправка формы добавления карточки
addCardForm.addEventListener('submit', handleAddCardFormSubmit);

// Обработчик отправки формы редактирования профиля
function handleEditFormSubmit(evt) {
    evt.preventDefault();
    profileName.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value;
    closePopup(editPopup);
};

// Обработчик отправки формы добавления карточки

function handleAddCardFormSubmit(evt) {
    evt.preventDefault();
    const cardData = {
        name: placeNameInput.value,
        link: sourceLinkInput.value
    };
    placesList.prepend(createCard(cardData, deleteCard, handleLikeClick, openImage));
    addCardForm.reset();
    closePopup(addCardPopup);
};

// Открытие попапа с изображением
function openImage(cardData) {
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openPopup(imagePopup);
}