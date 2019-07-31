'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var PIN_WIDTH = 50;
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var POST_URL = 'https://js.dump.academy/keksobookin';
  var COORDINATE_Y_MIN = 130;
  var COORDINATE_Y_MAX = 630;
  var MAP_PIN_MAIN_START_COORDINATE_X = 570;
  var MAP_PIN_MAIN_START_COORDINATE_Y = 375;
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
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout = null;

  var debounce = function (cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
  };

  // Удаляет атрибут у нескольких элементов одного типа
  var removeAttributeFromElements = function (arrayName, attributeName) {
    for (var i = 0; i < arrayName.length; i++) {
      arrayName[i].removeAttribute(attributeName);
    }
  };

  // Добавляет атрибут нескольким элементам одного типа
  var setAttributeFromElements = function (arrayName, attributeName) {
    for (var i = 0; i < arrayName.length; i++) {
      arrayName[i].setAttribute(attributeName, true);
    }
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

  // Генерирует из шаблона всплывающее сообщение
  var popupMessageClone = function (template) {
    var popupBlock = template.cloneNode(true);
    return popupBlock;
  };

  // Добавляет в разметку отрисованное всплывающее сообщение
  var pastePopup = function (parent, template, fragment) {
    fragment.appendChild(popupMessageClone(template));
    parent.appendChild(fragment);
  };

  // Удаляет из разметки и со страницы все найденные дочерние элементы определенного родителя
  var deleteAllElements = function (parent, itemsToDelete) {
    parent.querySelectorAll(itemsToDelete).forEach(function (item) {
      parent.removeChild(item);
    });
  };

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    GET_URL: GET_URL,
    POST_URL: POST_URL,
    HOUSING_SETTING: HOUSING_SETTING,
    PIN_WIDTH: PIN_WIDTH,
    COORDINATE_Y_MIN: COORDINATE_Y_MIN,
    COORDINATE_Y_MAX: COORDINATE_Y_MAX,
    MAP_PIN_MAIN_START_COORDINATE_X: MAP_PIN_MAIN_START_COORDINATE_X,
    MAP_PIN_MAIN_START_COORDINATE_Y: MAP_PIN_MAIN_START_COORDINATE_Y,
    debounce: debounce,
    pastePopup: pastePopup,
    isNotEmpty: isNotEmpty,
    getEndingWord: getEndingWord,
    insertTextContent: insertTextContent,
    removeAttributeFromElements: removeAttributeFromElements,
    setAttributeFromElements: setAttributeFromElements,
    setDependentValue: setDependentValue,
    deleteAllElements: deleteAllElements
  };
})();
