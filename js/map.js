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
  var housingRoomsFilter = document.querySelector('#housing-rooms');
  var housingGuestsFilter = document.querySelector('#housing-guests');
  var housingPriceFilter = document.querySelector('#housing-price');
  var housingPriceValue = {
    '100': 'low',
    '5000': 'low',
    '9000': 'low',
    '10000': 'low',
    '30000': 'middle',
    '42000': 'middle',
    '50000': 'middle',
    '60000': 'high',
    '90000': 'high',
    '6000000': 'high'
  };

  // offering.offer.price = [100, 5000, 9000, 10000, 30000, 42000, 50000, 60000, 90000, 6000000]

  // for (key in housingPriceValue) {
  //   if (offering.offer.price[i] < 10000) {
  //     housingPriceValue[key] = 'low'
  //   } else if (offering.offer.price[i] >= 10000 && offering.offer.price[i] < 50000) {
  //     housingPriceValue[key] = 'middle'
  //   } else if (offering.offer.price[i] >= 50000) {
  //     housingPriceValue[key] = 'high'
  //   }


  // Осуществляет фильтрацию массива объявлений в зависимости от выбарнного типа жилья
  var getFilteredOffers = function () {
    var filterValue = housingTypeFilter.value;
    var filterRoomsValue = housingRoomsFilter.value;
    var filterGuestsValue = housingGuestsFilter.value;
    // var housingPriceValue = housingPriceFilter.value;

    var resultArray =
      filterValue === 'any' ?
        offers :
        offers.filter(function (offering) {
          return offering.offer.type === housingTypeFilter.value;
        });

    var resultRoomsArray =
      filterRoomsValue === 'any' ?
        offers :
        offers.filter(function (offering) {
          return parseInt(offering.offer.rooms, 10) === parseInt(housingRoomsFilter.value, 10);
        });

    var resultGuestsArray =
      filterGuestsValue === 'any' ?
        offers :
        offers.filter(function (offering) {
          return parseInt(offering.offer.guests, 10) === parseInt(housingGuestsFilter.value, 10);
        });

    // var resultPriceArray =
    //   filterValue === 'any' ?
    //     offers :
    //     offers.filter(function (offering) {
    //       if (housingPriceFilter.value === 'low') {
    //         return offering.offer.price < 10000;
    //       } else if (housingPriceFilter.value === 'middle') {
    //         return offering.offer.price >= 10000 && offering.offer.price < 50000;
    //       } else if (housingPriceFilter.value === 'high') {
    //         return offering.offer.price >= 50000;
    //       } else {
    //         return offering.offer.price >= 0;
    //       }
    //     });

    var resultPriceArray =
      filterValue === 'any' ?
        offers :
        offers.filter(function (offering) {
          return housingPriceValue[offering.offer.price] === housingPriceFilter.value;
        });


    // return resultArray.slice(0, MAX_PIN_COUNT);
    // return resultRoomsArray.slice(0, MAX_PIN_COUNT);
    // return resultArray.concat(resultRoomsArray).slice(0, MAX_PIN_COUNT);
    resultArray.concat(resultRoomsArray).concat(resultGuestsArray).concat(resultPriceArray).slice(0, MAX_PIN_COUNT);

    var sameTypeAndRoomsOffers = resultArray.filter(function (it) {
      return (it.offer.type === housingTypeFilter.value || housingTypeFilter.value === 'any')
      && (parseInt(it.offer.rooms, 10) === parseInt(housingRoomsFilter.value, 10) || housingRoomsFilter.value === 'any')
      && (parseInt(it.offer.guests, 10) === parseInt(housingGuestsFilter.value, 10) || housingGuestsFilter.value === 'any')
      && (housingPriceValue[it.offer.price] === housingPriceFilter.value || housingPriceFilter.value === 'any');
    });
    return sameTypeAndRoomsOffers;

  };

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
        selectedPin();
      }, drawingErrorMessage, window.util.GET_URL, 'GET');
    }
  };

  // Отображает на странице пины и карточки, в соответствии со значением фильтра по типу жилья,
  // предварительно удаляя результаты предыдущего отображения
  housingTypeFilter.addEventListener('change', function () {
    window.util.deleteAllElements(mapPins, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(map, '.map__card');
    window.pin.drawPins();
    window.drawCards();
    selectedPin();
  });

  // Отображает на странице пины и карточки, в соответствии со значением фильтра по количеству комнат,
  // предварительно удаляя результаты предыдущего отображения
  housingRoomsFilter.addEventListener('change', function () {
    window.util.deleteAllElements(mapPins, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(map, '.map__card');
    window.pin.drawPins();
    window.drawCards();
    selectedPin();
  });

  // Отображает на странице пины и карточки, в соответствии со значением фильтра по количеству гостей,
  // предварительно удаляя результаты предыдущего отображения
  housingGuestsFilter.addEventListener('change', function () {
    window.util.deleteAllElements(mapPins, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(map, '.map__card');
    window.pin.drawPins();
    window.drawCards();
    selectedPin();
  });

  // Отображает на странице пины и карточки, в соответствии со значением фильтра по стоимости,
  // предварительно удаляя результаты предыдущего отображения
  housingPriceFilter.addEventListener('change', function () {
    window.util.deleteAllElements(mapPins, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(map, '.map__card');
    window.pin.drawPins();
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
      });
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.util.ESC_KEYCODE) {
          mapCardsArray[i].hidden = true;
          mapPinsArray[i].classList.remove('map__pin--active');
        }
      });
    });
  };

  window.map = {
    activateMainPage: activateMainPage,
    getFilteredOffers: getFilteredOffers,
    fragment: fragment,
    map: map,
    mapPins: mapPins,
    mapFilter: mapFilter,
    adFormFieldsets: adFormFieldsets,
    mapFilterFieldsets: mapFilterFieldsets,
    mapFilterSelects: mapFilterSelects,
    mainPage: mainPage,
    drawingErrorMessage: drawingErrorMessage
  };
})();
