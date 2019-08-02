'use strict';

(function () {
  var MAX_PIN_COUNT = 5;
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var offers = [];
  var mainPage = document.querySelector('main');
  var map = document.querySelector('.map');
  var adFormFieldsets = window.adForm.querySelectorAll('fieldset');
  var mapFilter = document.querySelector('.map__filters');
  var mapFilterFieldsets = mapFilter.querySelectorAll('fieldset');
  var mapFilterSelects = mapFilter.querySelectorAll('select');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var mapPinsBlock = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var housingFilters = mapFilter.querySelectorAll('.map__filter');
  var housingFeatures = document.querySelectorAll('.map__checkbox');

  var onMapEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      window.util.deleteAllElements(map, '.map__card');
      if (document.querySelector('.map__pin--active')) {
        document.querySelector('.map__pin--active').classList.remove('map__pin--active');
      }
      document.removeEventListener('keydown', onMapEscPress);
    }
  };

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
            if (parseInt(offerInfo[filterName], 10) < LOW_PRICE) {
              currentValue = 'low';
            } else if (parseInt(offerInfo[filterName], 10) >= LOW_PRICE && parseInt(offerInfo[filterName], 10) < HIGH_PRICE) {
              currentValue = 'middle';
            } else if (parseInt(offerInfo[filterName], 10) >= HIGH_PRICE) {
              currentValue = 'high';
            }
          }
          return currentValue === filterValue;
        });
        return isFeatureMatch && isFilterMatch;
      });
    }
    return filteredOffers.slice(0, MAX_PIN_COUNT);
  };

  // Управляет отображением на карте активных пинов и соответствующих им карточек объявлений
  var showActivePinsAndCards = function () {
    var mapPins = mapPinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');
    document.removeEventListener('keydown', onMapEscPress);

    mapPins.forEach(function (item, i) {
      item.addEventListener('click', function () {
        document.removeEventListener('keydown', onMapEscPress);
        window.util.deleteAllElements(map, '.map__card');
        mapPins.forEach(function (itm) {
          itm.classList.remove('map__pin--active');
        });

        item.classList.add('map__pin--active');
        window.drawCards(i);

        document.querySelector('.popup__close').addEventListener('click', function () {
          window.util.deleteAllElements(map, '.map__card');
          document.querySelector('.map__pin--active').classList.remove('map__pin--active');
          document.removeEventListener('keydown', onMapEscPress);
        });

        document.addEventListener('keydown', onMapEscPress);
      });
    });
  };

  // Управляет предварительным удалением и последующим отображением на странице пинов и карточек
  var clearAndDrawContentHandler = function () {
    window.util.deleteAllElements(mapPinsBlock, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(map, '.map__card');
    window.pin.draw();
    showActivePinsAndCards();
  };

  // Обработчик изменения значений фильтров по типу жилья, количеству комнат, количеству гостей и по стоимости
  housingFilters.forEach(function (filter) {
    filter.addEventListener('change', function () {
      window.util.debounce(clearAndDrawContentHandler);
    });
  });

  // Обработчик изменения значений фильтров по особенностям (features)
  housingFeatures.forEach(function (feature) {
    feature.addEventListener('change', function () {
      window.util.debounce(clearAndDrawContentHandler);
    });
  });

  // Отрисовывает сообщение об ошибке загрузки данных с сервера
  var drawErrorMessage = function (errorMessage) {
    window.util.pastePopup(mainPage, errorTemplate, fragment);
    document.querySelector('.error__message').textContent = errorMessage;
  };

  // Переводит главную страницу и ее элементы в активный режим
  var activateMainPage = function () {
    var isMapDisabled = map.classList.contains('map--faded');
    if (isMapDisabled) {
      map.classList.remove('map--faded');
      window.adForm.classList.remove('ad-form--disabled');
      window.util.removeAttributeFromElements(adFormFieldsets, 'disabled');
      window.util.removeAttributeFromElements(mapFilterFieldsets, 'disabled');
      window.util.removeAttributeFromElements(mapFilterSelects, 'disabled');
      window.createRequest(function (data) {
        offers = data;
        window.pin.draw();
        showActivePinsAndCards();
      }, drawErrorMessage, window.util.GET_URL, 'GET');
    }
  };

  window.map = {
    activateMainPage: activateMainPage,
    getFilteredOffers: getFilteredOffers,
    fragment: fragment,
    city: map,
    pinsBlock: mapPinsBlock,
    filter: mapFilter,
    adFormFieldsets: adFormFieldsets,
    filterFieldsets: mapFilterFieldsets,
    filterSelects: mapFilterSelects,
    mainPage: mainPage,
    drawErrorMessage: drawErrorMessage,
    onMapEscPress: onMapEscPress
  };
})();
