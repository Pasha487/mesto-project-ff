import "../pages/index.css";
import { initialCards } from "../components/cards.js";
import { createCard, handleLikeClick, deleteCard } from "../components/card.js";
import { closeModal, openModal } from "../components/modal.js";

// Создание элементов попапов
const elements = {
    placesList: document.querySelector('.places__list'),
    editPopup: document.querySelector('.popup_type_edit'),
    newCardPopup: document.querySelector('.popup_type_new-card'),
    imageTypePopup: document.querySelector('.popup_type_image'),
    imagePopup: document.querySelector('.popup__image'),
    captionPopup: document.querySelector('.popup__caption'),
    editProfileButton: document.querySelector('.profile__edit-button'),
    addCardButton: document.querySelector('.profile__add-button'),
    profileTitle: document.querySelector('.profile__title'),
    profileDescrip: document.querySelector('.profile__description'),
    popupForm: document.forms['edit-profile'],
    popupForm_nameInput: document.forms['edit-profile'].elements['name'],
    popupForm_jobInput: document.forms['edit-profile'].elements['description'],
    newForm: document.forms['new-place'],
    newForm_nameInput: document.forms['new-place'].elements['place-name'],
    newForm_linkInput: document.forms['new-place'].elements['link'],
};

// Слушатели кнопок открытие попапов
elements.editProfileButton.addEventListener('click', () => { handleEditProfile(); });
elements.addCardButton.addEventListener('click', () => { handleAddCard(); });

// Слушатель отправки формы
elements.popupForm.addEventListener('submit', handleEditSubmit);
elements.newForm.addEventListener('submit', handleAddSubmit);

//  Добавление карточек
initialCards.forEach(item => elements.placesList.append(createCard(item, deleteCard, handleLikeClick, handleImagePopup)));
// initialCards.forEach(cardData => {
//     const card = createCard(cardData, deleteCard);
//     placesList.append(card);
// });

// Редактирования профиля
function handleEditProfile() {
    const { name, description } = elements.popupForm.elements;
    name.value = elements.profileTitle.textContent;
    description.value = elements.profileDescrip.textContent;
    openModal(elements.editPopup);
};

// Добавление карточки
function handleAddCard() {
    elements.newForm.reset();
    openModal(elements.newCardPopup);
};

// Увеличение изображения
function handleImagePopup(cardData) {
    elements.imagePopup.src = cardData.link;
    elements.imagePopup.alt = cardData.name;
    elements.captionPopup.textContent = cardData.name;
    openModal(elements.imageTypePopup);
};

//  Отправка формы редактирования профиля
function handleEditSubmit(evt) {
    evt.preventDefault();
    elements.profileTitle.textContent = elements.popupForm_nameInput.value;
    elements.profileDescrip.textContent = elements.popupForm_jobInput.value;
    closeModal(elements.editPopup);
};

//  Отправка формы добавления карточек
function handleAddSubmit(evt) {
    evt.preventDefault();
    const placeNameInput = elements.newForm_nameInput;
    const sourceLinkInput = elements.newForm_linkInput;
    const cardData = {
        name: placeNameInput.value,
        link: sourceLinkInput.value
    };
    elements.placesList.prepend(createCard(cardData, deleteCard, handleLikeClick, handleImagePopup));
    closeModal(elements.newCardPopup);
}