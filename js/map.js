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
  var housingFeaturesFilter = document.querySelector('#housing-features');

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
    var filterTypeValue = housingTypeFilter.value;
    var filterRoomsValue = housingRoomsFilter.value;
    var filterGuestsValue = housingGuestsFilter.value;
    // var filterFeaturesValues = featureItems[1].hasAttribute('checked');
    // console.log(filterFeaturesValues);
    // var housingPriceValue = housingPriceFilter.value;

    var resultTypeArray =
      filterTypeValue === 'any' ?
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
    //   filterTypeValue === 'any' ?
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
      housingPriceFilter === 'any' ?
        offers :
        offers.filter(function (offering) {
          return housingPriceValue[offering.offer.price] === housingPriceFilter.value;
        });

    var resultFeaturesWifiArray =
      housingFeaturesFilter.querySelector('#filter-wifi').checked === false ?
        offers :
        offers.filter(function (offering) {
          return offering.offer.features.indexOf(housingFeaturesFilter.querySelector('#filter-wifi:checked').value) >= 0;
        });

    var resultFeaturesDishwasherArray =
      housingFeaturesFilter.querySelector('#filter-dishwasher').hasAttribute('checked') === false ?
        offers :
        offers.filter(function (offering) {
          return offering.offer.features.indexOf(housingFeaturesFilter.querySelector('#filter-dishwasher:checked').value) >= 0;
        });

    var resultFeaturesParkingArray =
      housingFeaturesFilter.querySelector('#filter-parking').hasAttribute('checked') === false ?
        offers :
        offers.filter(function (offering) {
          return offering.offer.features.indexOf(housingFeaturesFilter.querySelector('#filter-parking:checked').value) >= 0;
        });

    var resultFeaturesWasherArray =
      housingFeaturesFilter.querySelector('#filter-washer').hasAttribute('checked') === false ?
        offers :
        offers.filter(function (offering) {
          return offering.offer.features.indexOf(housingFeaturesFilter.querySelector('#filter-washer:checked').value) >= 0;
        });

    var resultFeaturesElevatorArray =
      housingFeaturesFilter.querySelector('#filter-elevator').hasAttribute('checked') === false ?
        offers :
        offers.filter(function (offering) {
          return offering.offer.features.indexOf(housingFeaturesFilter.querySelector('#filter-elevator:checked').value) >= 0;
        });

    var resultFeaturesConditionerArray =
      housingFeaturesFilter.querySelector('#filter-conditioner').hasAttribute('checked') === false ?
        offers :
        offers.filter(function (offering) {
          return offering.offer.features.indexOf(housingFeaturesFilter.querySelector('#filter-conditioner:checked').value) >= 0;
        });

    resultTypeArray.concat(resultRoomsArray).concat(resultGuestsArray).concat(resultPriceArray).concat(resultFeaturesWifiArray).concat(resultFeaturesDishwasherArray).concat(resultFeaturesParkingArray).concat(resultFeaturesWasherArray).concat(resultFeaturesElevatorArray).concat(resultFeaturesConditionerArray).slice(0, MAX_PIN_COUNT);

    var sameTypeAndRoomsOffers = resultTypeArray.filter(function (it) {
      return (it.offer.type === housingTypeFilter.value || housingTypeFilter.value === 'any')
      && (parseInt(it.offer.rooms, 10) === parseInt(housingRoomsFilter.value, 10) || housingRoomsFilter.value === 'any')
      && (parseInt(it.offer.guests, 10) === parseInt(housingGuestsFilter.value, 10) || housingGuestsFilter.value === 'any')
      && (housingPriceValue[it.offer.price] === housingPriceFilter.value || housingPriceFilter.value === 'any')
      && (it.offer.features.indexOf(housingFeaturesFilter.querySelector('#filter-wifi').value) >= 0
      || housingFeaturesFilter.querySelector('#filter-wifi').checked === false)
      && (it.offer.features.indexOf(housingFeaturesFilter.querySelector('#filter-dishwasher').value) >= 0
      || housingFeaturesFilter.querySelector('#filter-dishwasher').checked === false)
      && (it.offer.features.indexOf(housingFeaturesFilter.querySelector('#filter-parking').value) >= 0
      || housingFeaturesFilter.querySelector('#filter-parking').checked === false)
      && (it.offer.features.indexOf(housingFeaturesFilter.querySelector('#filter-washer').value) >= 0
      || housingFeaturesFilter.querySelector('#filter-washer').checked === false)
      && (it.offer.features.indexOf(housingFeaturesFilter.querySelector('#filter-elevator').value) >= 0
      || housingFeaturesFilter.querySelector('#filter-elevator').checked === false)
      && (it.offer.features.indexOf(housingFeaturesFilter.querySelector('#filter-conditioner').value) >= 0
      || housingFeaturesFilter.querySelector('#filter-conditioner').checked === false);
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

  // Отображает на странице пины и карточки, в соответствии со значением фильтра по особенностям (wifi),
  // предварительно удаляя результаты предыдущего отображения
  document.querySelector('#filter-wifi').addEventListener('change', function () {
    // if (document.querySelector('#filter-wifi').checked === true) {
    //   document.querySelector('#filter-wifi').setAttribute('checked', true);
    // } else if (document.querySelector('#filter-wifi').checked === false) {
    //   document.querySelector('#filter-wifi').setAttribute('checked', false);
    // }
    window.util.deleteAllElements(mapPins, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(map, '.map__card');
    window.pin.drawPins();
    window.drawCards();
    selectedPin();
  });

  // Отображает на странице пины и карточки, в соответствии со значением фильтра по особенностям (dishwasher),
  // предварительно удаляя результаты предыдущего отображения
  document.querySelector('#filter-dishwasher').addEventListener('click', function () {
    // if (document.querySelector('#filter-dishwasher').checked === true) {
    //   document.querySelector('#filter-dishwasher').setAttribute('checked', true);
    // } else if (document.querySelector('#filter-dishwasher').checked === false) {
    //   document.querySelector('#filter-dishwasher').setAttribute('checked', false);
    // }

    window.util.deleteAllElements(mapPins, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(map, '.map__card');
    window.pin.drawPins();
    window.drawCards();
    selectedPin();
  });

  // Отображает на странице пины и карточки, в соответствии со значением фильтра по особенностям (parking),
  // предварительно удаляя результаты предыдущего отображения
  document.querySelector('#filter-parking').addEventListener('click', function () {
    // if (document.querySelector('#filter-parking').checked === true) {
    //   document.querySelector('#filter-parking').setAttribute('checked', true);
    // } else if (document.querySelector('#filter-parking').checked === false) {
    //   document.querySelector('#filter-parking').setAttribute('checked', false);
    // }

    window.util.deleteAllElements(mapPins, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(map, '.map__card');
    window.pin.drawPins();
    window.drawCards();
    selectedPin();
  });

  // // Отображает на странице пины и карточки, в соответствии со значением фильтра по особенностям (washer),
  // // предварительно удаляя результаты предыдущего отображения
  document.querySelector('#filter-washer').addEventListener('click', function () {
  //   // if (document.querySelector('#filter-washer').checked === true) {
  //   //   document.querySelector('#filter-washer').setAttribute('checked', true);
  //   // } else if (document.querySelector('#filter-washer').checked === false) {
  //   //   document.querySelector('#filter-washer').setAttribute('checked', false);
  //   // }

    window.util.deleteAllElements(mapPins, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(map, '.map__card');
    window.pin.drawPins();
    window.drawCards();
    selectedPin();
  });

  // Отображает на странице пины и карточки, в соответствии со значением фильтра по особенностям (elevator),
  // предварительно удаляя результаты предыдущего отображения
  document.querySelector('#filter-elevator').addEventListener('click', function () {
    // if (document.querySelector('#filter-elevator').checked === true) {
    //   document.querySelector('#filter-elevator').setAttribute('checked', true);
    // } else if (document.querySelector('#filter-elevator').checked === false) {
    //   document.querySelector('#filter-elevator').setAttribute('checked', false);
    // }

    window.util.deleteAllElements(mapPins, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(map, '.map__card');
    window.pin.drawPins();
    window.drawCards();
    selectedPin();
  });

  // Отображает на странице пины и карточки, в соответствии со значением фильтра по особенностям (conditioner),
  // предварительно удаляя результаты предыдущего отображения
  document.querySelector('#filter-conditioner').addEventListener('click', function () {
    // if (document.querySelector('#filter-conditioner').checked === true) {
    //   document.querySelector('#filter-conditioner').setAttribute('checked', true);
    // } else if (document.querySelector('#filter-conditioner').checked === false) {
    //   document.querySelector('#filter-conditioner').setAttribute('checked', false);
    // }

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
