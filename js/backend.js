'use strict';

(function () {
  // Удаляет сообщение об ошибке из разметки по клику на элемент-кнопку, клику на произвольную область и нажатию клавиши Esc
  var addDeleteErrorModalListeners = function () {
    var errorModal = document.querySelector('.error');
    var errorButton = document.querySelector('.error__button');

    errorButton.addEventListener('click', function () {
      errorModal.remove();
    });

    document.addEventListener('mousedown', function () {
      errorModal.remove();
    });

    var onPopupEscPress = function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        errorModal.remove();
      }
    };

    document.addEventListener('keydown', onPopupEscPress);
  };

  var addDeleteSuccessModalListeners = function () {
    var successModal = document.querySelector('.success');
    if (successModal) {
      document.addEventListener('mousedown', function () {
        successModal.remove();
      });

      var onPopupEscPress = function (evt) {
        if (evt.keyCode === window.util.ESC_KEYCODE) {
          successModal.remove();
        }
      };

      document.addEventListener('keydown', onPopupEscPress);
    }
  };


  // Загружает информацию о размещенных на карте объявлениях с сервера
  var createSendRequest = function (onLoad, onError, url, method, data) {
    var handleError = function (message) {
      onError(message);
      addDeleteErrorModalListeners();
    };

    var handleSuccess = function () {
      onLoad(xhr.response);
      addDeleteSuccessModalListeners();
    };

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        handleSuccess();
      } else {
        handleError('Ошибка загрузки объявления. Статус ответа сервера: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      handleError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      handleError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    xhr.open(method, url);
    xhr.send(data);
  };

  window.backend = {
    createSendRequest: createSendRequest
  };
})();
