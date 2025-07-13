// Включаем строгий режим выполнения JS
"use strict";

// === 1. Выход из личного кабинета ===
const logoutBtn = new LogoutButton();

logoutBtn.action = function () {
    // Отправляем запрос на выход (logout)
    ApiConnector.logout(function (response) {
        console.log("Результат выхода:", response);

        if (response.success) {
            location.reload(); // Перезагружаем страницу после выхода
        }
    });
};

// === 2. Получение информации о текущем пользователе ===
ApiConnector.current(function (response) {
    console.log("Информация о пользователе:", response);

    if (response.success) {
        ProfileWidget.showProfile(response.data); // Отображаем профиль пользователя
    }
});

// === 3. Получение курсов валют ===
const ratesBoard = new RatesBoard();

// Функция загрузки и отображения курсов валют
function loadStocks() {
    ApiConnector.getStocks(function (response) {
        console.log("Полученные курсы валют:", response);

        if (response.success) {
            ratesBoard.clearTable();         // Очищаем таблицу
            ratesBoard.fillTable(response.data); // Заполняем новыми данными
        }
    });
}

loadStocks(); // Загружаем курсы сразу при загрузке страницы
setInterval(loadStocks, 60000); // Обновляем данные раз в минуту

// === 4. Операции с деньгами ===
const moneyManager = new MoneyManager();

// --- 4.1 Пополнение баланса ---
moneyManager.addMoneyCallback = function (data) {
    ApiConnector.addMoney(data, function (response) {
        console.log("Результат пополнения:", response);

        if (response.success) {
            ProfileWidget.showProfile(response.data); // Обновляем профиль
            moneyManager.setMessage(true, "Баланс успешно пополнен"); // Сообщение об успехе
        } else {
            moneyManager.setMessage(false, response.error || "Ошибка пополнения"); // Сообщение об ошибке
        }
    });
};

// --- 4.2 Конвертация средств ---
moneyManager.conversionMoneyCallback = function (data) {
    ApiConnector.convertMoney(data, function (response) {
        console.log("Результат конвертации:", response);

        if (response.success) {
            ProfileWidget.showProfile(response.data); // Обновляем профиль
            moneyManager.setMessage(true, "Валюта успешно конвертирована"); // Успех
        } else {
            moneyManager.setMessage(false, response.error || "Ошибка конвертации"); // Ошибка
        }
    });
};

// --- 4.3 Перевод средств ---
moneyManager.sendMoneyCallback = function (data) {
    ApiConnector.transferMoney(data, function (response) {
        console.log("Результат перевода:", response);

        if (response.success) {
            ProfileWidget.showProfile(response.data); // Обновляем профиль
            moneyManager.setMessage(true, "Перевод выполнен успешно"); // Успех
        } else {
            moneyManager.setMessage(false, response.error || "Ошибка перевода"); // Ошибка
        }
    });
};

// === 5. Работа с избранным ===
const favoritesWidget = new FavoritesWidget();

// --- 5.1 Загрузка начального списка избранного ---
ApiConnector.getFavorites(function (response) {
    console.log("Список избранного:", response);

    if (response.success) {
        favoritesWidget.clearTable();         // Очищаем таблицу
        favoritesWidget.fillTable(response.data); // Заполняем избранных
        moneyManager.updateUsersList(response.data); // Обновляем список для выпадающего меню
    }
});

// --- 5.2 Добавление пользователя в избранное ---
favoritesWidget.addUserCallback = function (data) {
    ApiConnector.addUserToFavorites(data, function (response) {
        console.log("Добавление в избранное:", response);

        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            MoneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь добавлен в избранное");
        } else {
            favoritesWidget.setMessage(false, response.error || "Ошибка добавления в избранное");
        }
    });
};

// --- 5.3 Удаление пользователя из избранного ---
favoritesWidget.removeUserCallback = function (id) {
    ApiConnector.removeUserFromFavorites(id, function (response) {
        console.log("Удаление из избранного:", response);

        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            MoneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь удален из избранного");
        } else {
            favoritesWidget.setMessage(false, response.error || "Ошибка удаления из избранного");
        }
    });
};