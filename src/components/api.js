const config = {
    baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-39',
    headers: {
        authorization: '4a21a4d8-63db-4c80-9c68-44a6c92c99ff',
        'content-type': 'application/json'
    }
}

// Проверка ответа сервера
function checkResponse(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status} ${res.statusText}`);
}

// Универсальная функция запроса с обработкой ошибок
function makeRequest(url, method, body) {
    const options = {
        method,
        headers: config.headers
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    return fetch(`${config.baseUrl}${url}`, options)
        .then(checkResponse)
        .catch(err => {
            console.error(`Ошибка при выполнении запроса: ${err}`);
            throw err;
        });
}

// Загрузка информации о пользователе
export const getUserInfo = () => {
    return makeRequest('/users/me', 'GET');
};

// Загрузка карточек с сервера
export const getInitialCards = () => {
    return makeRequest('/cards', 'GET');
};

// Обновление информации о пользователе
export const updateUserInfo = (name, about) => {
    return makeRequest('/users/me', 'PATCH', { name, about });
};

// Добавление новой карточки
export const addNewCard = (name, link) => {
    return makeRequest('/cards', 'POST', { name, link });
};

// Удаление карточки
export const deleteCard = (cardId) => {
    return makeRequest(`/cards/${cardId}`, 'DELETE');
};

// Постановка лайка
export const likeCard = (cardId) => {
    return makeRequest(`/cards/${cardId}/likes`, 'PUT');
};

// Снятие лайка
export const unlikeCard = (cardId) => {
    return makeRequest(`/cards/${cardId}/likes`, 'DELETE');
};

// Обновление аватара
export const updateAvatar = (avatarUrl) => {
    return makeRequest('/users/me/avatar', 'PATCH', { avatar: avatarUrl });
};