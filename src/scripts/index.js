import "../pages/index.css";
import { initialCards } from "../components/cards.js";
import { createCard, handleLikeClick, deleteCard } from "../components/card.js";
import { closePopup, openPopup } from "../components/modal.js";

// DOM элементы
const placesList = document.querySelector('.places__list');
const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const editPopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Инициализация карточек
initialCards.forEach(cardData => {
    const card = createCard(cardData, deleteCard, handleLikeClick, openImage);
    placesList.append(card);
});

// Обработчики открытия попапов
editProfileButton.addEventListener('click', () => {
    nameInput.value = profileName.textContent;
    descriptionInput.value = profileDescription.textContent;
    openPopup(editPopup);
});

addCardButton.addEventListener('click', () => {
    document.querySelector('.popup__form[name="new-place"]').reset();
    openPopup(addCardPopup);
});

// обработчики закрытие попапов
document.querySelectorAll('.popup__close').forEach(button => {
    button.addEventListener('click', () => {
        const popup = button.closest('.popup');
        closePopup(popup);
    });
});

// Редактирование профиля
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const nameInput = document.querySelector('.popup__input_type_name');
const descriptionInput = document.querySelector('.popup__input_type_description');

const editForm = document.querySelector('.popup__form[name="edit-profile"]');
editForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    profileName.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value;
    closePopup(editPopup);
});

// Добавление новой карточки
const addCardForm = document.querySelector('.popup__form[name="new-place"]');
addCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const placeNameInput = addCardForm.querySelector('.popup__input_type_card-name');
    const sourceLinkInput = addCardForm.querySelector('.popup__input_type_url');
    const cardData = {
        name: placeNameInput.value,
        link: sourceLinkInput.value
    };
    placesList.prepend(createCard(cardData, deleteCard, handleLikeClick, openImage));
    addCardForm.reset();
    closePopup(addCardPopup);
});

// Открытие изображения
function openImage(cardData) {
    const popupImage = imagePopup.querySelector('.popup__image');
    const popupCaption = imagePopup.querySelector('.popup__caption');
    
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    
    openPopup(imagePopup);
}


