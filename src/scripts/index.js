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
    apiDeleteCard,
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
    clearValidation(editForm, validationConfig);
    openPopup(editPopup);
});

addCardButton.addEventListener('click', () => {
    addCardForm.reset();
    clearValidation(addCardForm, validationConfig);
    openPopup(addCardPopup);
});

avatarEditButton.addEventListener('click', () => {
    const avatarUrlInput = document.querySelector('#avatar-url-input');
    if (!avatarUrlInput) {
        console.error('Не найдено поле ввода аватара');
        return;
    }
    avatarForm.reset();
    clearValidation(avatarForm, validationConfig);
    openPopup(avatarPopup);
});

// Обработчики закрытие попапов
popupCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
        closePopup(button.closest('.popup'));
    });
});

// Назначение обработчиков событий
editForm.addEventListener('submit', handleEditFormSubmit);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);
avatarForm.addEventListener('submit', handleAvatarFormSubmit);

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
    
    // Получаем элементы из текущей формы
    const form = evt.currentTarget;
    const input = form.querySelector('#avatar-url-input');
    const submitButton = form.querySelector('.popup__button');
    
    if (!input) {
        console.error('Поле ввода не найдено в форме');
        return;
    }

    const originalText = submitButton.textContent;
    submitButton.textContent = 'Сохранение...';
    submitButton.disabled = true;

    updateAvatar(input.value)
        .then(userData => {
            profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
            closePopup(avatarPopup);
        })
        .catch(err => {
            console.error('Ошибка:', err);
            const errorElement = form.querySelector('.avatar-url-input-error');
            if (errorElement) {
                errorElement.textContent = 'Ошибка при обновлении';
            }
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
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
    openPopup(confirmPopup);
    
    const confirmBtn = confirmPopup.querySelector('.popup__button');
    const originalText = confirmBtn.textContent;
    
    // Устанавливаем обработчик
    confirmBtn.onclick = () => {
        confirmBtn.textContent = 'Удаление...';
        confirmBtn.disabled = true;
        
        apiDeleteCard(cardId)
            .then(() => {
                cardElement.remove();
                closePopup(confirmPopup);
            })
            .catch(err => {
                console.error('Ошибка удаления:', err);
            })
            .finally(() => {
                confirmBtn.textContent = originalText;
                confirmBtn.disabled = false;
                confirmBtn.onclick = null; // Очищаем после выполнения
            });
    };
    
    // Очищаем onclick при закрытии попапа (если удаление не подтвердили)
    const closeHandler = () => {
        confirmBtn.onclick = null;
        confirmPopup.removeEventListener('click', closeHandler);
    };
    
    confirmPopup.addEventListener('click', closeHandler);
}
