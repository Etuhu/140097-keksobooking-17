'use strict';

(function () {
  var MAX_PIN_COUNT = 5;
  var offers = [];
  var mainPage = document.querySelector('main');
  var map = document.querySelector('.map');
  var adFormFieldsets = window.form.adForm.querySelectorAll('fieldset');
  var mapFilter = document.querySelector('.map__filters');
  var mapFilterFieldsets = mapFilter.querySelectorAll('fieldset');
  var mapFilterSelects = mapFilter.querySelectorAll('select');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var housingTypeFilter = document.querySelector('#housing-type');

  // Осуществляет фильтрацию массива объявлений в зависимости от выбарнного типа жилья
  var getFilteredOffers = function () {
    var filterValue = housingTypeFilter.value;
    var resultArray =
      filterValue === 'any' ?
        offers :
        offers.filter(function (offering) {
          return offering.offer.type === housingTypeFilter.value;
        });
    return resultArray.slice(0, MAX_PIN_COUNT);
  };

  // Переводит главную страницу и ее элементы в активный режим
  var activateMainPage = function () {
    var isMapDisabled = map.classList.contains('map--faded');
    if (isMapDisabled) {
      window.util.removeClass(map, 'map--faded');
      window.form.adForm.classList.remove('ad-form--disabled');
      window.util.removeAttrFromFields(adFormFieldsets, 'disabled');
      window.util.removeAttrFromFields(mapFilterFieldsets, 'disabled');
      window.util.removeAttrFromFields(mapFilterSelects, 'disabled');
      window.backend.load(function (data) {
        offers = data;
        window.drawPins();
        window.drawCards();
        selectedPin();
      }, drawingErrorMessage);
    }
  };

  // Отображает на странице пины и карточки, в соответствии со значением фильтра по типу жилья,
  // предварительно удаляя результаты предыдущего отображения
  housingTypeFilter.addEventListener('change', function () {
    var currentPinsArray = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    var currentCardsArray = map.querySelectorAll('.map__card');
    currentPinsArray.forEach(function (item) {
      mapPins.removeChild(item);
    });
    currentCardsArray.forEach(function (item) {
      map.removeChild(item);
    });
    window.drawPins();
    window.drawCards();
    selectedPin();
  });

  // Управляет отображением на карте активных пинов и соответствующих им карточек объявлений
  var selectedPin = function () {
    var mapPinsArray = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    var mapCardsArray = map.querySelectorAll('.map__card');

    mapPinsArray.forEach(function (item, i) {
      item.addEventListener('click', function () {
        mapPinsArray.forEach(function (itm) {
          window.util.removeClass(itm, 'map__pin--active');
        });
        mapCardsArray.forEach(function (it) {
          window.util.hiddenElement(it, true);
        });
        window.util.addClass(item, 'map__pin--active');
        window.util.hiddenElement(mapCardsArray[i], false);
      });

      mapCardsArray[i].querySelector('.popup__close').addEventListener('click', function () {
        window.util.hiddenElement(mapCardsArray[i], true);
      });
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.util.ESC_KEYCODE) {
          window.util.hiddenElement(mapCardsArray[i], true);
          window.util.removeClass(mapPinsArray[i], 'map__pin--active');
        }
      });
    });
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

  window.map = {
    activateMainPage: activateMainPage,
    getFilteredOffers: getFilteredOffers,
    fragment: fragment,
    map: map,
    mapPins: mapPins
  };
})();
