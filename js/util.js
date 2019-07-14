'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var COORDINATE_Y_MIN = 130;
  var COORDINATE_Y_MAX = 630;
  var PIN_WIDTH = 50;
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
  var mapWidth = document.querySelector('.map').offsetWidth;

  // Удаляет атрибут у нескольких элементов одного типа
  var removeAttrFromFields = function (arrayName, attributeName) {
    for (var i = 0; i < arrayName.length; i++) {
      arrayName[i].removeAttribute(attributeName);
    }
  };

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

  // Устанавливает зависимость между временем заезда и выезда
  var setDependentValue = function (fieldFrom, fieldTo) {
    if (fieldFrom.value !== fieldTo.value) {
      fieldTo.value = fieldFrom.value;
    }
  };

  window.mapSettings = {
    PIN_WIDTH: PIN_WIDTH,
    COORDINATE_Y_MIN: COORDINATE_Y_MIN,
    COORDINATE_Y_MAX: COORDINATE_Y_MAX,
    mapWidth: mapWidth
  };

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    HOUSING_SETTING: HOUSING_SETTING,
    getRandom: getRandom,
    getGrowingNumber: getGrowingNumber,
    removeAttrFromFields: removeAttrFromFields,
    setDependentValue: setDependentValue
  };
})();
