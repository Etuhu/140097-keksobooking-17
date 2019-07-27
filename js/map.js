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
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var housingTypeFilter = document.querySelector('#housing-type');
  // var housingRoomsFilter = document.querySelector('#housing-rooms');

  // Осуществляет фильтрацию массива объявлений в зависимости от выбарнного типа жилья
  var getFilteredOffers = function () {
    var filterValue = housingTypeFilter.value;
    // var filterRoomsValue = housingRoomsFilter.value;
    var resultArray =
      filterValue === 'any' ?
        offers :
        offers.filter(function (offering) {
          return offering.offer.type === housingTypeFilter.value;
        });

    // var resultRoomsArray =
    //   filterRoomsValue === 'any' ?
    //     offers :
    //     offers.filter(function (offering) {
    //       return offering.offer.rooms === housingRoomsFilter.value;
    //     });
    // return resultArray.concat(resultRoomsArray);
    return resultArray.slice(0, MAX_PIN_COUNT);
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
        window.drawPins();
        window.drawCards();
        selectedPin();
      }, drawingErrorMessage, window.util.GET_URL, 'GET');
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

  // Отрисовывает сообщение об успешной отправке данных формы
  var successHandler = function () {
    var successBlock = successTemplate.cloneNode(true);
    return successBlock;
  };

  var drawingSuccessMessage = function () {
    fragment.appendChild(successHandler());
    mainPage.appendChild(fragment);
    // document.querySelector('.success__message').textContent = successMessage;
  };


  /////////////////////

  //   var save = function (data, onLoad, onError) {
  //   var saveAddress = 'https://js.dump.academy/code-and-magick';
  //   var request = createRequest(onLoad, onError);
  //   request.open('POST', saveAddress);
  //   request.send(data);
  // };


  window.form.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.createSendRequest(drawingSuccessMessage, drawingErrorMessage, window.util.POST_URL, 'POST', new FormData(window.form.adForm));
    // window.form.adForm.reset();
    // map.classList.add('map--faded');

    // window.backend.createSendRequest.open('POST', 'https://js.dump.academy/keksobooking');
    // window.backend.createSendRequest.send(new FormData(window.form.adForm));
    // window.backend.createSendRequest.send(new FormData(window.form.adForm));
    // window.backend.createSendRequest(new FormData(adForm), function () {
    //   userDialog.classList.add('hidden');
    // }, window.generateWizards.errorHandler);
  });

///////////

  window.map = {
    activateMainPage: activateMainPage,
    getFilteredOffers: getFilteredOffers,
    fragment: fragment,
    map: map,
    mapPins: mapPins
  };
})();
