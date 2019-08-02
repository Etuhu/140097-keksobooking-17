'use strict';

(function () {
  var SUCCESS_LOAD_STATUS = 200;
  var LOAD_TIMEOUT = 10000;

  // Удаляет сообщение об ошибке из разметки по клику на элемент-кнопку, клику на произвольную область и нажатию клавиши Esc
  var addDeleteErrorModalListeners = function () {
    var errorModal = document.querySelector('.error');
    var errorButton = document.querySelector('.error__button');

    if (errorModal) {
      errorButton.addEventListener('click', function () {
        errorModal.remove();
        document.removeEventListener('keydown', onPopupEscPress);
      });

      errorModal.addEventListener('click', function () {
        errorModal.remove();
        document.removeEventListener('keydown', onPopupEscPress);
      });

      var onPopupEscPress = function (evt) {
        if (evt.keyCode === window.util.ESC_KEYCODE) {
          errorModal.remove();
          document.removeEventListener('keydown', onPopupEscPress);
        }
      };

      document.addEventListener('keydown', onPopupEscPress);
    }
  };

  var addDeleteSuccessModalListeners = function () {
    var successModal = document.querySelector('.success');

    if (successModal) {
      successModal.addEventListener('click', function () {
        successModal.remove();
        document.removeEventListener('keydown', onPopupEscPress);
      });

      var onPopupEscPress = function (evt) {
        if (evt.keyCode === window.util.ESC_KEYCODE) {
          successModal.remove();
          document.removeEventListener('keydown', onPopupEscPress);
        }
      };

      document.addEventListener('keydown', onPopupEscPress);
    }
  };

  var createRequest = function (onLoad, onError, url, method, data) {
    var handleError = function (message) {
      onError(message);
      addDeleteErrorModalListeners();
      document.removeEventListener('keydown', window.map.onMapEscPress);
    };

    var handleSuccess = function () {
      onLoad(xhr.response);
      addDeleteSuccessModalListeners();
      document.removeEventListener('keydown', window.map.onMapEscPress);
    };

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_LOAD_STATUS) {
        handleSuccess();
      } else {
        handleError('Ошибка обработки данных. Статус ответа сервера: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      handleError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      handleError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = LOAD_TIMEOUT; // 10s

    xhr.open(method, url);
    xhr.send(data);
  };

  window.createRequest = createRequest;
})();
