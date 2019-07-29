'use strict';

(function () {
  var MAX_PIN_COUNT = 5;
  var offers = [];
  var mainPage = document.querySelector('main');
  var map = document.querySelector('.map');
  var adFormFieldsets = window.form.adForm.querySelectorAll('fieldset');
  var mapFilters = document.querySelector('.map__filters');
  var mapFilterFieldsets = mapFilters.querySelectorAll('fieldset');
  var mapFilterSelects = mapFilters.querySelectorAll('select');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var housingFilters = mapFilters.querySelectorAll('.map__filter');
  var housingFeatures = document.querySelectorAll('.map__checkbox');

  var getFilteredOffers = function () {
    var selects = Array.from(mapFilterSelects);
    var activeSelects = selects.filter(function (select) {
      return select.value && select.value !== 'any';
    });
    var activeCheckboxes = document.querySelectorAll('.map__checkbox:checked');
    var selectedFeatures = Array.from(activeCheckboxes).map(function (checkbox) {
      return checkbox.value;
    });

    var selectedFilters = activeSelects.map(function (select) {
      var name = select.name.split('-').pop();
      var value = select.value;
      var result = {};
      result[name] = value;

      return result;
    });

    if (offers) {
      var filteredOffers = offers.filter(function (offer) {
        var offerInfo = offer.offer;
        var isFeatureMatch = selectedFeatures.every(function (feature) {
          return offerInfo.features.indexOf(feature) >= 0;
        });

        var isFilterMatch = selectedFilters.every(function (filterObject) {
          var filterName = Object.keys(filterObject)[0];
          var filterValue = filterObject[filterName];
          var currentValue = offerInfo[filterName];
          if (filterName === 'price') {
            if (parseInt(offerInfo[filterName], 10) < parseInt('10000', 10)) {
              currentValue = 'low';
            } else if (parseInt(offerInfo[filterName], 10) >= parseInt('10000', 10) && parseInt(offerInfo[filterName], 10) < parseInt('50000', 10)) {
              currentValue = 'middle';
            } else if (parseInt(offerInfo[filterName], 10) >= parseInt('50000', 10)) {
              currentValue = 'high';
            }
          }
          return String(currentValue) === String(filterValue);
        });
        return isFeatureMatch && isFilterMatch;
      });
    }
    return filteredOffers.slice(0, MAX_PIN_COUNT);
  };

  // Управляет отображением на карте активных пинов и соответствующих им карточек объявлений
  var showActivePinsAndCards = function () {
    var mapPinsArray = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    var mapCardsArray = map.querySelectorAll('.map__card');

    mapPinsArray.forEach(function (item, i) {
      item.addEventListener('click', function () {
        mapPinsArray.forEach(function (itm) {
          itm.classList.remove('map__pin--active');
        });
        mapCardsArray.forEach(function (it) {
          it.hidden = true;
        });
        item.classList.add('map__pin--active');
        mapCardsArray[i].hidden = false;
      });

      mapCardsArray[i].querySelector('.popup__close').addEventListener('click', function () {
        mapCardsArray[i].hidden = true;
        mapPinsArray[i].classList.remove('map__pin--active');
      });
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.util.ESC_KEYCODE) {
          mapCardsArray[i].hidden = true;
          mapPinsArray[i].classList.remove('map__pin--active');
        }
      });
    });
  };

  // Управляет предварительным удалением и последующим отображением на странице пинов и карточек
  var clearAndDrawContentHandler = function () {
    window.util.deleteAllElements(mapPins, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(map, '.map__card');
    window.pin.drawPins();
    window.drawCards();
    showActivePinsAndCards();
  };

  // Обработчик изменения значений фильтров по типу жилья, количеству комнат, количеству гостей и по стоимости
  housingFilters.forEach(function (filter) {
    filter.addEventListener('change', function () {
      clearAndDrawContentHandler();
    });
  });

  // Обработчик изменения значений фильтров по особенностям (features)
  housingFeatures.forEach(function (feature) {
    feature.addEventListener('change', function () {
      clearAndDrawContentHandler();
    });
  });

  // Отрисовывает сообщение об ошибке загрузки данных с сервера
  var drawingErrorMessage = function (errorMessage) {
    window.util.pastePopup(mainPage, errorTemplate, fragment);
    document.querySelector('.error__message').textContent = errorMessage;
  };

  // Переводит главную страницу и ее элементы в активный режим
  var activateMainPage = function () {
    var isMapDisabled = map.classList.contains('map--faded');
    if (isMapDisabled) {
      map.classList.remove('map--faded');
      window.form.adForm.classList.remove('ad-form--disabled');
      window.util.removeAttrFromFields(adFormFieldsets, 'disabled');
      window.util.removeAttrFromFields(mapFilterFieldsets, 'disabled');
      window.util.removeAttrFromFields(mapFilterSelects, 'disabled');
      window.backend.createSendRequest(function (data) {
        offers = data;
        window.pin.drawPins();
        window.drawCards();
        showActivePinsAndCards();
      }, drawingErrorMessage, window.util.GET_URL, 'GET');
    }
  };

  window.map = {
    activateMainPage: activateMainPage,
    getFilteredOffers: getFilteredOffers,
    fragment: fragment,
    map: map,
    mapPins: mapPins,
    mapFilters: mapFilters,
    adFormFieldsets: adFormFieldsets,
    mapFilterFieldsets: mapFilterFieldsets,
    mapFilterSelects: mapFilterSelects,
    mainPage: mainPage,
    drawingErrorMessage: drawingErrorMessage
  };
})();
