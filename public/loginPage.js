// Включаем строгий режим
"use strict";

// Создаем экземпляр класса UserForm — он отвечает за работу форм входа и регистрации
const userForm = new UserForm();

// Назначаем обработчик, который будет вызван при попытке входа пользователя
userForm.loginFormCallback = function (data) {
  // Вызываем статический метод ApiConnector.login, передавая туда данные из формы (login и password)
  ApiConnector.login(data, function (response) {
    // Выводим в консоль ответ от сервера для отладки
    console.log("Ответ от сервера при входе:", response);

    // Проверяем успешность запроса по полю success в ответе
    if (response.success) {
      location.reload();
    } else {
      userForm.setLoginErrorMessage(response.error || "Ошибка авторизации");
    }
  });
};

// Назначаем обработчик, который будет вызван при попытке регистрации нового пользователя
userForm.registerFormCallback = function (data) {
  ApiConnector.register(data, function (response) {
    console.log("Ответ от сервера при регистрации:", response);

    // Проверяем успешность запроса
    if (response.success) {
      location.reload();
    } else {
      userForm.setRegisterErrorMessage(response.error || "Ошибка регистрации");
    }
  });
};
