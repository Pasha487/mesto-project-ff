import "../pages/index.css";
import { initialCards } from "./cards.js";
import { createCard, handleLikeClick } from "../components/card.js";
import { closePopup, openPopup } from "../components/modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import { 
    getUserInfo, 
    getInitialCards, 
    updateUserInfo, 
    addNewCard, 
    deleteCard as apiDeleteCard,
    likeCard,
    unlikeCard,
    updateAvatar
} from "../components/api.js";

// DOM элементы
// Основные элементы
const placesList = document.querySelector('.places__list');
const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const avatarEditButton = document.querySelector('.profile__image-edit-button');
const profileAvatar = document.querySelector('.profile__image');

// Попапы
const editPopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const avatarPopup = document.querySelector('.popup_type_avatar');
const confirmPopup = document.querySelector('.popup_type_confirm');

// Элементы профиля
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Формы
const editForm = document.querySelector('.popup__form[name="edit-profile"]');
const addCardForm = document.querySelector('.popup__form[name="new-place"]');
const avatarForm = document.querySelector('.popup__form[name="avatar"]');

// Инпуты
const nameInput = document.querySelector('.popup__input_type_name');
const descriptionInput = document.querySelector('.popup__input_type_description');
const avatarUrlInput = document.querySelector('.popup__input_type_url');
const placeNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const sourceLinkInput = addCardForm.querySelector('.popup__input_type_url');

// Элементы попапа с изображением
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

// Кнопки закрытия попапов
const popupCloseButtons = document.querySelectorAll('.popup__close');

const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};

let currentUserId = '';

// Включение валидации при загрузке страницы
enableValidation(validationConfig);

// Загрузка данных пользователя и карточек
Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
        currentUserId = userData._id;
        updateProfileInfo(userData);
        renderCards(cards);
    })
    .catch(err => {
        console.error('Ошибка при загрузке данных:', err);
    });

// Функция обновления информации профиля
function updateProfileInfo(userData) {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
}

// Функция отрисовки карточек
function renderCards(cards) {
    cards.forEach(cardData => {
        const card = createCard(
        cardData, 
        (cardElement) => handleDeleteCard(cardElement, cardData._id), 
        (evt) => handleLikeClick(evt, cardData._id), 
        openImage,
        currentUserId
        );
    placesList.append(card);
    });
}

// Обработчики открытия попапов
editProfileButton.addEventListener('click', () => {
    nameInput.value = profileName.textContent;
    descriptionInput.value = profileDescription.textContent;
    if (editForm) clearValidation(editForm, validationConfig);
    openPopup(editPopup);
});

addCardButton.addEventListener('click', () => {
    addCardForm.reset();
    if (addCardForm) clearValidation(addCardForm, validationConfig);
    openPopup(addCardPopup);
});

avatarEditButton.addEventListener('click', () => {
    avatarForm.reset();
    if (avatarForm) clearValidation(avatarForm, validationConfig);
    openPopup(avatarPopup);
});

// Обработчики закрытие попапов
popupCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
        closePopup(button.closest('.popup'));
    });
});

// Обработчик отправки формы редактирования профиля
function handleEditFormSubmit(evt) {
    evt.preventDefault();
    const submitButton = editForm.querySelector('.popup__button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Сохранение...';
    
    updateUserInfo(nameInput.value, descriptionInput.value)
        .then(userData => {
            updateProfileInfo(userData);
            closePopup(editPopup);
        })
        .catch(err => {
            console.error('Ошибка при обновлении профиля:', err);
        })
        .finally(() => {
            submitButton.textContent = originalText;
        });
}

// Обработчик отправки формы добавления карточки
function handleAddCardFormSubmit(evt) {
    evt.preventDefault();
    const submitButton = addCardForm.querySelector('.popup__button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Создание...';
    
    addNewCard(placeNameInput.value, sourceLinkInput.value)
        .then(cardData => {
            const card = createCard(
                cardData, 
                (cardElement) => handleDeleteCard(cardElement, cardData._id), 
                (evt) => handleLikeClick(evt, cardData._id, cardData.likes), 
                openImage,
                currentUserId
            );
            placesList.prepend(card);
            addCardForm.reset();
            closePopup(addCardPopup);
        })
        .catch(err => {
            console.error('Ошибка при добавлении карточки:', err);
        })
        .finally(() => {
            submitButton.textContent = originalText;
        });
}

// Обработчик отправки формы обновления аватара
function handleAvatarFormSubmit(evt) {
    evt.preventDefault();
    const submitButton = avatarForm.querySelector('.popup__button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Сохранение...';

    updateAvatar(avatarUrlInput.value)
        .then(userData => {
            profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
            closePopup(avatarPopup);
        })
        .catch(err => {
            console.error('Ошибка при обновлении аватара:', err);
        })
        .finally(() => {
            submitButton.textContent = originalText;
        });
}

// Открытие попапа с изображением
function openImage(cardData) {
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openPopup(imagePopup);
}

// Обработчик удаления карточки
function handleDeleteCard(cardElement, cardId) {
    // Показываем попап подтверждения
    openPopup(confirmPopup);
    
    // Обработчик для кнопки подтверждения
    const confirmBtn = confirmPopup.querySelector('.popup__button');
    const handleConfirm = () => {
        apiDeleteCard(cardId)
            .then(() => {
                cardElement.remove();
                closePopup(confirmPopup);
                confirmBtn.removeEventListener('click', handleConfirm);
            })
            .catch(err => {
                console.error('Ошибка удаления:', err);
                closePopup(confirmPopup);
            });
    };
    
    confirmBtn.addEventListener('click', handleConfirm);
} 

// Назначение обработчиков событий
editForm.addEventListener('submit', handleEditFormSubmit);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);
avatarForm.addEventListener('submit', handleAvatarFormSubmit);