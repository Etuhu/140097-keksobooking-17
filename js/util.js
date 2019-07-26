'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
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

  // Проверяет объект на наличие ключей и подтверждает, что объект не пустой
  var isNotEmpty = function (obj) {
    return Object.keys(obj).length > 0;
  };

  // Заменяет текстовое содержимое DOM-элемента
  var insertTextContent = function (parentEl, childEl, fieldValue) {
    parentEl.querySelector(childEl).textContent = fieldValue;
  };

  // Определяет верное окончание существительного в зависимости от согласующегося с ним числа
  var getEndingWord = function (number, one, two, five) {
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) {
      return five;
    }
    number %= 10;
    if (number === 1) {
      return one;
    }
    if (number >= 2 && number <= 4) {
      return two;
    }
    return five;
  };

  window.mapSettings = {
    PIN_WIDTH: PIN_WIDTH,
    COORDINATE_Y_MIN: COORDINATE_Y_MIN,
    COORDINATE_Y_MAX: COORDINATE_Y_MAX,
    mapWidth: mapWidth
  };

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    GET_URL: GET_URL,
    HOUSING_SETTING: HOUSING_SETTING,
    isNotEmpty: isNotEmpty,
    getRandom: getRandom,
    getEndingWord: getEndingWord,
    insertTextContent: insertTextContent,
    getGrowingNumber: getGrowingNumber,
    removeAttrFromFields: removeAttrFromFields,
    setDependentValue: setDependentValue
  };
})();
