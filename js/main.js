'use strict';

var TYPES_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var TIME = ['12:00', '13:00', '14:00'];
var COORDINATE_Y_MIN = 130;
var COORDINATE_Y_MAX = 630;

var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var addressInput = adForm.querySelector('#address');
var mapFilters = document.querySelector('.map__filters');
var mapFiltersFieldsets = mapFilters.querySelectorAll('fieldset');
var mapFiltersSelects = mapFilters.querySelectorAll('select');
var mapPinMain = document.querySelector('.map__pin--main');
var housingTypeSelect = adForm.querySelector('#type');
var housingPrice = adForm.querySelector('#price');
var timeInSelect = adForm.querySelector('#timein');
var timeOutSelect = adForm.querySelector('#timeout');

var mapWidth = document.querySelector('.map').offsetWidth;
var mapPinMainWidth = document.querySelector('.map__pin--main').offsetWidth;

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var fragment = document.createDocumentFragment();

// Удаляет атрибут у нескольких элементов одного типа
var removeDisabledAttr = function (arrayName, attributeName) {
  for (var i = 0; i < arrayName.length; i++) {
    arrayName[i].removeAttribute(attributeName);
  }
};

// Извлекает числовое значение из строчного элемента и записывает его в поле ввода
var extractNumber = function () {
  addressInput.value = parseInt(mapPinMain.style.left, 10) + ', ' + parseInt(mapPinMain.style.top, 10);
  var extractNumberValue = addressInput.value;
  return extractNumberValue;
};
extractNumber();

// Переводит главную страницу и ее элементы в активный режим
var activateMainPage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  removeDisabledAttr(adFormFieldsets, 'disabled');
  removeDisabledAttr(mapFiltersFieldsets, 'disabled');
  removeDisabledAttr(mapFiltersSelects, 'disabled');
};

mapPinMain.addEventListener('click', function () {
  activateMainPage();
});

// Заполняет поле адреса в соответствии с положением метки на карте
mapPinMain.addEventListener('mouseup', function () {
  activateMainPage();
  extractNumber();
});

// Функция-рандомизатор чисел и значений
var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция-генератор случайных чисел и значений
var getUniqueNumber = function (max) {
  var sum = 0;
  for (var i = 1; i <= max; i++) {
    sum += 1;
  }
  return sum;
};

// Генерирует уникальные метки на карте (предложения жилья)
var createOfferings = function (count) {
  var offerings = [];

  for (var i = 0; i < count; i++) {
    offerings.push({
      author: {
        avatar: 'img/avatars/user0' + getUniqueNumber(i + 1) + '.png'
      },
      offer: {
        type: TYPES_OF_HOUSING[getRandom(0, TYPES_OF_HOUSING.length - 1)]
      },
      location:
        {
          x: getRandom(mapPinMainWidth, mapWidth - mapPinMainWidth),
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

// Устанавливает зависимость стоимости предложения от типа жилья
var setsDependenceOfPrice = function () {
  if (housingTypeSelect.value === TYPES_OF_HOUSING[3]) {
    housingPrice.min = 0;
    housingPrice.placeholder = 0;
  } else if (housingTypeSelect.value === TYPES_OF_HOUSING[1]) {
    housingPrice.min = 1000;
    housingPrice.placeholder = 1000;
  } else if (housingTypeSelect.value === TYPES_OF_HOUSING[2]) {
    housingPrice.min = 5000;
    housingPrice.placeholder = 5000;
  } else if (housingTypeSelect.value === TYPES_OF_HOUSING[0]) {
    housingPrice.min = 10000;
    housingPrice.placeholder = 10000;
  }
};

// Устанавливает значение placeholder поля "Цена за ночь" при загрузке страницы
// в соответствии с типом жилья
setsDependenceOfPrice();

housingTypeSelect.addEventListener('change', function () {
  setsDependenceOfPrice();
});

// Устанавливает зависимость времени выезда от времени заезда
var setsDependenceOfTimeIn = function () {
  for (var i = 0; i < TIME.length; i++) {
    if (timeInSelect.value === TIME[i]) {
      timeOutSelect.value = timeInSelect.value;
    }
  }
};

timeInSelect.addEventListener('change', function () {
  setsDependenceOfTimeIn();
});

// Устанавливает зависимость времени заезда от времени выезда
var setsDependenceOfTimeOut = function () {
  for (var i = 0; i < TIME.length; i++) {
    if (timeOutSelect.value === TIME[i]) {
      timeInSelect.value = timeOutSelect.value;
    }
  }
};

timeOutSelect.addEventListener('change', function () {
  setsDependenceOfTimeOut();
});
