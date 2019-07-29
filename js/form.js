'use strict';

(function () {
  var MIN_CAPACITY = 0;
  var MAX_ROOM_NUMBER = 100;
  var adForm = document.querySelector('.ad-form');
  var housingTypeSelect = adForm.querySelector('#type');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');
  var roomNumberSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');

  // Устанавливает зависимость стоимости предложения от типа жилья
  var setsDependenceOfPrice = function () {
    var selectedValue = housingTypeSelect.value;
    var selectedHouseSettings = window.util.HOUSING_SETTING[selectedValue];
    var housingPrice = adForm.querySelector('#price');
    for (var key in selectedHouseSettings) {
      if (selectedHouseSettings.hasOwnProperty(key)) {
        var value = selectedHouseSettings[key];
        housingPrice.setAttribute(key, value);
      }
    }
  };

  // Устанавливает значение placeholder поля "Цена за ночь" при загрузке страницы
  // в соответствии с типом жилья
  setsDependenceOfPrice();

  housingTypeSelect.addEventListener('change', function () {
    setsDependenceOfPrice();
  });

  // Устанавливает зависимость значений полей "Время заезда и выезда" между собой
  timeInSelect.addEventListener('change', function () {
    window.util.setDependentValue(timeInSelect, timeOutSelect);
  });

  timeOutSelect.addEventListener('change', function () {
    window.util.setDependentValue(timeOutSelect, timeInSelect);
  });

  // Осуществляет валидацию полей по количеству комнат и количеству мест
  var numberOfRoomValidation = function () {
    var roomNumberSelectValue = parseInt(roomNumberSelect.value, 10);
    var capacitySelectValue = parseInt(capacitySelect.value, 10);

    var handleValidate = function (message) {
      capacitySelect.setCustomValidity(message);
    };

    if (capacitySelectValue <= roomNumberSelectValue && capacitySelectValue > MIN_CAPACITY && roomNumberSelectValue !== MAX_ROOM_NUMBER) {
      handleValidate('');
    } else if (roomNumberSelectValue === MAX_ROOM_NUMBER && capacitySelectValue > MIN_CAPACITY) {
      handleValidate('Жилье с указанными параметрами не предназначено для проживания гостей');
    } else if (capacitySelectValue === MIN_CAPACITY && roomNumberSelectValue === MAX_ROOM_NUMBER) {
      handleValidate('');
    } else {
      handleValidate('Количество комнат не должно быть меньше количества гостей');
    }
  };

  roomNumberSelect.addEventListener('change', function () {
    numberOfRoomValidation();
  });

  capacitySelect.addEventListener('change', function () {
    numberOfRoomValidation();
  });

  // Осуществляет сброс полей формы и возврат страницы к неактивному состоянию
  var resetFormAndDeactivatePage = function () {
    window.map.filter.reset();
    adForm.reset();

    window.util.deleteAllElements(window.map.pinsBlock, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(window.map.cityView, '.map__card');

    setsDependenceOfPrice();
    window.util.setAttributeFromFields(window.map.adFormFieldsets, 'disabled');
    window.util.setAttributeFromFields(window.map.filterFieldsets, 'disabled');
    window.util.setAttributeFromFields(window.map.filterSelects, 'disabled');
    adForm.classList.add('ad-form--disabled');
    window.map.cityView.classList.add('map--faded');

    window.pin.mainPoint.style.left = window.util.MAP_PIN_MAIN_START_COORDINATE_X + 'px';
    window.pin.mainPoint.style.top = window.util.MAP_PIN_MAIN_START_COORDINATE_Y + 'px';
    window.pin.extractAndPasteMainPointCoords(window.pin.mainPoint.style.left, window.pin.mainPoint.style.top, 0, 0);
  };

  // Отрисовывает сообщение об успешной отправке данных формы
  var drawingSuccessMessage = function () {
    window.util.pastePopup(window.map.mainPage, successTemplate, window.map.fragment);
  };

  // Осуществляет отправку данных формы и сброс полей формы с возвратом страницы к неактивному состоянию
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.createSendRequest(drawingSuccessMessage, window.map.drawingErrorMessage, window.util.POST_URL, 'POST', new FormData(adForm));
    resetFormAndDeactivatePage();
  });

  // Осуществляет сброс полей формы с возвратом страницы к неактивному состоянию при нажатии кнопки очистки формы
  adForm.addEventListener('reset', function () {
    resetFormAndDeactivatePage();
  });

  window.adForm = adForm;
})();
