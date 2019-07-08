'use strict';

(function () {
  var MAP_PIN_MAIN_WIDTH = document.querySelector('.map__pin--main').offsetWidth;
  var MAP_PIN_MAIN_HEIGHT = document.querySelector('.map__pin--main').offsetHeight;
  var COORDINATE_Y_MIN = 130;
  var COORDINATE_Y_MAX = 630;

  var HOUSING_SETTING = {
    'palace': {
      min: 10000,
      placeholder: 10000
    },
    'flat': {
      min: 1000,
      placeholder: 1000
    },
    'house': {
      min: 5000,
      placeholder: 5000
    },
    'bungalo': {
      min: 0,
      placeholder: 0
    }
  };

  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var mapFilter = document.querySelector('.map__filters');
  var mapFilterFieldsets = mapFilter.querySelectorAll('fieldset');
  var mapFilterSelects = mapFilter.querySelectorAll('select');
  var mapWidth = document.querySelector('.map').offsetWidth;
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  window.map = {
    MAP_PIN_MAIN_WIDTH: MAP_PIN_MAIN_WIDTH,
    MAP_PIN_MAIN_HEIGHT: MAP_PIN_MAIN_HEIGHT,
    COORDINATE_Y_MIN: COORDINATE_Y_MIN,
    COORDINATE_Y_MAX: COORDINATE_Y_MAX,
    HOUSING_SETTING: HOUSING_SETTING,
    adForm: adForm,
    mapWidth: mapWidth
  };

  // Удаляет атрибут у нескольких элементов одного типа
  var removeAttrFromFields = function (arrayName, attributeName) {
    for (var i = 0; i < arrayName.length; i++) {
      arrayName[i].removeAttribute(attributeName);
    }
  };

  // Переводит главную страницу и ее элементы в активный режим
  var activateMainPage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    removeAttrFromFields(adFormFieldsets, 'disabled');
    removeAttrFromFields(mapFilterFieldsets, 'disabled');
    removeAttrFromFields(mapFilterSelects, 'disabled');
  };
  window.map.activateMainPage = activateMainPage;

  // Функция-рандомизатор чисел и значений
  var getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Функция, выводящая числа от 0 до max в порядке возрастания
  var getGrowingNumber = function (max) {
    var sum = 0;
    for (var i = 1; i <= max; i++) {
      sum += 1;
    }
    return sum;
  };

  // Генерирует уникальные метки на карте (предложения жилья)
  var createOfferings = function (count) {
    var offerings = [];
    var housingTypes = Object.keys(HOUSING_SETTING);
    for (var i = 0; i < count; i++) {
      offerings.push({
        author: {
          avatar: 'img/avatars/user0' + getGrowingNumber(i + 1) + '.png'
        },
        offer: {
          type: housingTypes[getRandom(0, housingTypes.length - 1)]
        },
        location:
          {
            x: getRandom(MAP_PIN_MAIN_WIDTH, mapWidth - MAP_PIN_MAIN_WIDTH),
            y: getRandom(COORDINATE_Y_MIN, COORDINATE_Y_MAX)
          }
      });
    }
    return offerings;
  };

  // Связывает код с элементами разметки
  var renderMapPin = function (offering) {
    var mapPinElement = pinTemplate.cloneNode(true);

    mapPinElement.style.left = offering.location.x + 'px';
    mapPinElement.style.top = offering.location.y + 'px';
    mapPinElement.querySelector('img').src = offering.author.avatar;
    mapPinElement.querySelector('img').alt = offering.offer.type;

    return mapPinElement;
  };

  // Отрисовывает метки (предложения жилья) на карте
  var drawingMapPin = function () {
    var offersArray = createOfferings(8);
    for (var i = 0; i < offersArray.length; i++) {
      fragment.appendChild(renderMapPin(offersArray[i]));
    }
    mapPins.appendChild(fragment);
  };

  drawingMapPin();
})();
