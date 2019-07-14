'use strict';

(function () {
  // Удаляет сообщение об ошибке из разметки по клику на элемент-кнопку, клику на произвольную область и нажатию клавиши Esc
  var deleteErrorModal = function () {
    var errorModal = document.querySelector('.error');
    var errorButton = document.querySelector('.error__button');

    errorButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      errorModal.remove();
    });

    document.addEventListener('click', function (evt) {
      evt.preventDefault();
      errorModal.remove();
    });

    var onPopupEscPress = function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        errorModal.remove();
      }
    };

    document.addEventListener('keydown', onPopupEscPress);
  };

  // Загружает информацию о размещенных на карте объявлениях с сервера
  var load = function (onLoad, onError) {
    var loadAddress = 'https://js.dump.academy/keksobooking/dat';

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка загрузки объявления. Статус ответа сервера: ' + xhr.status + ' ' + xhr.statusText);
        deleteErrorModal();
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
      deleteErrorModal();
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      deleteErrorModal();
    });

    xhr.timeout = 10000; // 10s

    xhr.open('GET', loadAddress);
    xhr.send();
  };

  window.backend = {
    load: load
  };
})();
