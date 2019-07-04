'use strict';

var MAP_PIN_MAIN_WIDTH = document.querySelector('.map__pin--main').offsetWidth;
var MAP_PIN_MAIN_HEIGHT = document.querySelector('.map__pin--main').offsetHeight;

var COORDINATE_Y_MIN = 130;
var COORDINATE_Y_MAX = 630;

var TYPES_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];

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
var addressInput = adForm.querySelector('#address');
var mapFilter = document.querySelector('.map__filters');
var mapFilterFieldsets = mapFilter.querySelectorAll('fieldset');
var mapFilterSelects = mapFilter.querySelectorAll('select');
var mapPinMain = document.querySelector('.map__pin--main');
var housingTypeSelect = adForm.querySelector('#type');
var housingPrice = adForm.querySelector('#price');
var timeInSelect = adForm.querySelector('#timein');
var timeOutSelect = adForm.querySelector('#timeout');

var mapWidth = document.querySelector('.map').offsetWidth;

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var fragment = document.createDocumentFragment();

// Удаляет атрибут у нескольких элементов одного типа
var removeAttrFromFields = function (arrayName, attributeName) {
  for (var i = 0; i < arrayName.length; i++) {
    arrayName[i].removeAttribute(attributeName);
  }
};

// Извлекает числовое значение из строчного элемента и записывает его в поле ввода адреса
// (с поправкой на то, что в адрес записываются координаты острого конца)
var extractNumber = function (left, top, widthCorrect, heightCorrect) {
  addressInput.value = (parseInt(left, 10) + widthCorrect) + ', ' + (parseInt(top, 10) + heightCorrect);
  var extractNumberValue = addressInput.value;
  return extractNumberValue;
};

// Записывает в поле ввода координаты главной метки до момента активации (красный круг)
extractNumber(mapPinMain.style.left, mapPinMain.style.top, 0, 0);

// Переводит главную страницу и ее элементы в активный режим
var activateMainPage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  removeAttrFromFields(adFormFieldsets, 'disabled');
  removeAttrFromFields(mapFilterFieldsets, 'disabled');
  removeAttrFromFields(mapFilterSelects, 'disabled');
};

// Добавляет возможность перемещения метки по карте
mapPinMain.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  // Задает расчёт координат маркера и их запись в поле адреса
  var calculateCoordMainPin = function (evtName) {
    var shift = {
      x: startCoords.x - evtName.clientX,
      y: startCoords.y - evtName.clientY
    };

    startCoords = {
      x: evtName.clientX,
      y: evtName.clientY
    };

    var finishCoordX = mapPinMain.offsetLeft - shift.x;
    var finishCoordY = mapPinMain.offsetTop - shift.y;

    // Устанавливает предельные границы размещения маркера
    var giveFinishCoord = function (finishCoord, minLimit, maxLimit) {
      if (finishCoord <= minLimit) {
        finishCoord = minLimit;
      } else if (finishCoord >= maxLimit) {
        finishCoord = maxLimit;
      }
      return finishCoord;
    };

    mapPinMain.style.top = giveFinishCoord(finishCoordY, COORDINATE_Y_MIN, COORDINATE_Y_MAX) + 'px';
    mapPinMain.style.left = giveFinishCoord(finishCoordX, 0, mapWidth - MAP_PIN_MAIN_WIDTH) + 'px';
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    activateMainPage();
    calculateCoordMainPin(moveEvt);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    calculateCoordMainPin(upEvt);

    // Заполняет поле адреса в соответствии с положением метки на карте
    extractNumber(mapPinMain.style.left, mapPinMain.style.top, MAP_PIN_MAIN_WIDTH / 2, MAP_PIN_MAIN_HEIGHT);

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
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
  var housingTypes = Object.keys(HOUSING_SETTING);
  for (var i = 0; i < count; i++) {
    offerings.push({
      author: {
        avatar: 'img/avatars/user0' + getUniqueNumber(i + 1) + '.png'
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

  // var selectedValue = housingTypeSelect.value;
  // var selectedHouseSettings = HOUSING_SETTING[selectedValue];
  //
  // for (var key in selectedHouseSettings) {
  //   var value = selectedHouseSettings[key];
  //   housingPrice.setAttribute(key, value)
};

// Устанавливает значение placeholder поля "Цена за ночь" при загрузке страницы
// в соответствии с типом жилья
setsDependenceOfPrice();

housingTypeSelect.addEventListener('change', function () {
  setsDependenceOfPrice();
});

// Устанавливает зависимость между временем заезда и выезда
var setDependentValue = function (fieldFrom, fieldTo) {
  if (fieldFrom.value !== fieldTo.value) {
    fieldTo.value = fieldFrom.value;
  }
};

timeInSelect.addEventListener('change', function () {
  setDependentValue(timeInSelect, timeOutSelect);
});

timeOutSelect.addEventListener('change', function () {
  setDependentValue(timeOutSelect, timeInSelect);
});
