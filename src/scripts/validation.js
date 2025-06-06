// Функция показа ошибки валидации
function showInputError(formElement, inputElement, errorMessage, config) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    if (!errorElement) return;

    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
}

// Функция скрытия ошибки валидации
function hideInputError(formElement, inputElement, config) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    if (!errorElement) return;

    inputElement.classList.remove(config.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
}

// Проверка валидности поля
function checkInputValidity(formElement, inputElement, config) {
    // Всегда сначала сбрасываем кастомные сообщения
    inputElement.setCustomValidity("");

    // Проверка только для полей с паттерном
    if (inputElement.pattern && !new RegExp(inputElement.pattern).test(inputElement.value)) {
        inputElement.setCustomValidity(inputElement.dataset.errorMessage || 'Неверный формат');
    }

    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage, config);
    } else {
        hideInputError(formElement, inputElement, config);
    }
}

// Переключение состояния кнопки
function toggleButtonState(inputList, buttonElement, inactiveButtonClass) {
    const hasInvalidInput = inputList.some(inputElement => !inputElement.validity.valid);
    if (hasInvalidInput) {
        buttonElement.classList.add(inactiveButtonClass);
        buttonElement.disabled = true;
    } else {
        buttonElement.classList.remove(inactiveButtonClass);
        buttonElement.disabled = false;
    }
}

// Установка слушателей событий
function setEventListeners(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
    
    toggleButtonState(inputList, buttonElement, config.inactiveButtonClass);
    
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', function () {
            checkInputValidity(formElement, inputElement, config);
            toggleButtonState(inputList, buttonElement, config.inactiveButtonClass);
        });
    });
}

// Включение валидации всех форм
function enableValidation(config) {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    
    formList.forEach((formElement) => {
        setEventListeners(formElement, config);
    });
}

// Очистка ошибок валидации
function clearValidation(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
    
    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, config);
        inputElement.setCustomValidity("");
    });

    toggleButtonState(inputList, buttonElement, config.inactiveButtonClass);
}

export { enableValidation, clearValidation };