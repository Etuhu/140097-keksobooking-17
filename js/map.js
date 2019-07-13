'use strict';

(function () {
  var mainPage = document.querySelector('main');
  // var error = document.querySelector('.error');
  // var errorButton = document.querySelector('.error__button');
  var map = document.querySelector('.map');
  var adFormFieldsets = window.form.adForm.querySelectorAll('fieldset');
  var mapFilter = document.querySelector('.map__filters');
  var mapFilterFieldsets = mapFilter.querySelectorAll('fieldset');
  var mapFilterSelects = mapFilter.querySelectorAll('select');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  // Переводит главную страницу и ее элементы в активный режим
  var activateMainPage = function () {
    var isMapDisabled = map.classList.contains('map--faded');
    if (isMapDisabled) {
      map.classList.remove('map--faded');
      window.form.adForm.classList.remove('ad-form--disabled');
      window.util.removeAttrFromFields(adFormFieldsets, 'disabled');
      window.util.removeAttrFromFields(mapFilterFieldsets, 'disabled');
      window.util.removeAttrFromFields(mapFilterSelects, 'disabled');
      window.backend.load(drawingMapPin, drawingErrorMessage);
    }
  };

  // Передает параметры отрисовки пинов соответствующим элементам в разметке
  var renderMapPin = function (offering) {
    var mapPinElement = pinTemplate.cloneNode(true);

    mapPinElement.style.left = offering.location.x + 'px';
    mapPinElement.style.top = offering.location.y + 'px';
    mapPinElement.querySelector('img').src = offering.author.avatar;
    mapPinElement.querySelector('img').alt = offering.offer.type;

    return mapPinElement;
  };

  var drawingMapPin = function (offersArray) {
    for (var i = 0; i < offersArray.length; i++) {
      fragment.appendChild(renderMapPin(offersArray[i]));
    }
    mapPins.appendChild(fragment);
  };

  // Отрисовывает сообщение об ошибке загрузки данных с сервера
  var errorHandler = function () {
    var errorBlock = errorTemplate.cloneNode(true);
    return errorBlock;
  };

  var drawingErrorMessage = function (errorMessage) {
    fragment.appendChild(errorHandler());
    mainPage.appendChild(fragment);
    document.querySelector('.error__message').textContent = errorMessage;
  };

  // var deleteErrorMessage = function () {
  //   mainPage.removeChild('.error');
  // };
  //
  // errorButton.addEventListener('click', function () {
  //   deleteErrorMessage();
  // });

  window.activateMainPage = activateMainPage;
})();
