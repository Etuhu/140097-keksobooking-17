'use strict';

(function () {
  var MAX_PIN_COUNT = 5;
  var offers = [];
  var mainPage = document.querySelector('main');
  var map = document.querySelector('.map');
  var adFormFieldsets = window.form.adForm.querySelectorAll('fieldset');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFilter = document.querySelector('.map__filters');
  var mapFilterFieldsets = mapFilter.querySelectorAll('fieldset');
  var mapFilterSelects = mapFilter.querySelectorAll('select');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  // var cardTemplateFeatures = cardTemplate.content.querySelector('.popup__features');


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
      map.classList.remove('map--faded');
      window.form.adForm.classList.remove('ad-form--disabled');
      window.util.removeAttrFromFields(adFormFieldsets, 'disabled');
      window.util.removeAttrFromFields(mapFilterFieldsets, 'disabled');
      window.util.removeAttrFromFields(mapFilterSelects, 'disabled');
      window.backend.load(function (data) {
        offers = data;
        drawPins();
        drawCards();
      }, drawingErrorMessage);
    }
  };

  // Передает параметры отрисовки пина соответствующим элементам в разметке
  var createMapPin = function (offering) {
    var mapPinElement = pinTemplate.cloneNode(true);

    mapPinElement.style.left = offering.location.x + 'px';
    mapPinElement.style.top = offering.location.y + 'px';
    mapPinElement.querySelector('img').src = offering.author.avatar;
    mapPinElement.querySelector('img').alt = offering.offer.type;

    return mapPinElement;
  };

  // Отрисовывает пины на странице
  var drawPins = function () {
    var filteredOffers = getFilteredOffers();
    filteredOffers.map(function (offer) {
      fragment.appendChild(createMapPin(offer));
    });
    mapPins.appendChild(fragment);
  };

///////////////////////////////КАРТОЧКИ

  var offerTypeValue = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  // Передает параметры отрисовки пина соответствующим элементам в разметке
  var createCard = function (offering) {
    var cardElement = cardTemplate.cloneNode(true);

    cardElement.querySelector('.popup__title').textContent = offering.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = offering.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = offering.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = offerTypeValue[offering.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = offering.offer.rooms + ' комнаты' + ' для ' + offering.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offering.offer.checkin + ', ' + 'выезд до ' + offering.offer.checkout;

    cardElement.querySelector('.popup__features').innerHTML = '';
    offering.offer.features.forEach(function (item, i) {
      var featureItem = document.createElement('li');
      cardElement.querySelector('.popup__features').appendChild(featureItem);
      featureItem.classList.add('popup__feature', 'popup__feature--' + offering.offer.features[i]);
    });

    cardElement.querySelector('.popup__description').textContent = offering.offer.description;

    for (var i = 0; i < offering.offer.photos.length; i++) {
      var photoItem = cardElement.querySelector('.popup__photos').querySelector('.popup__photo').cloneNode(true);
      // cardElement.querySelector('.popup__photos').innerHTML = '';
      cardElement.querySelector('.popup__photos').appendChild(photoItem);
      cardElement.querySelector('.popup__photos').querySelector('.popup__photo').src = offering.offer.photos[i];
      // cardElement.querySelector('.popup__photos').removeChild(cardElement.querySelector('.popup__photos').nthChild(2));
    }

    // offering.offer.photos.forEach(function (item, i) {
    //   var photoItem = cardElement.querySelector('.popup__photos').querySelector('.popup__photo').cloneNode(true);
    //   // cardElement.querySelector('.popup__photos').innerHTML = '';
    //   cardElement.querySelector('.popup__photos').appendChild(photoItem);
    //   cardElement.querySelector('.popup__photos').querySelector('.popup__photo').src = offering.offer.photos[i];
    // });


    cardElement.querySelector('.popup__avatar').src = offering.author.avatar;

    return cardElement;
  };

  // Отрисовывает пины на странице
  var drawCards = function () {
    var filteredOffers = getFilteredOffers();
    filteredOffers.map(function (offer) {
      fragment.appendChild(createCard(offer));
    });
    map.insertBefore(fragment, mapFiltersContainer);
  };

  ///////////////////////////КАРТОЧКИ-end

  // Отображает на странице пины, в соответствии со значением фильтра по типу жилья,
  // предварительно удаляя результаты предыдущего отображения
  housingTypeFilter.addEventListener('change', function () {
    var currentPinsArray = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    currentPinsArray.forEach(function (item) {
      mapPins.removeChild(item);
    });
    drawPins();
  });

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

  window.activateMainPage = activateMainPage;
})();
