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

  window.form = {
    adForm: adForm
  };

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
    window.map.mapFilters.reset();
    adForm.reset();

    window.util.deleteAllElements(window.map.mapPins, '.map__pin:not(.map__pin--main)');
    window.util.deleteAllElements(window.map.map, '.map__card');

    setsDependenceOfPrice();
    window.util.setAttrFromFields(window.map.adFormFieldsets, 'disabled');
    window.util.setAttrFromFields(window.map.mapFilterFieldsets, 'disabled');
    window.util.setAttrFromFields(window.map.mapFilterSelects, 'disabled');
    adForm.classList.add('ad-form--disabled');
    window.map.map.classList.add('map--faded');

    window.pin.mapPinMain.style.left = window.mapSettings.MAP_PIN_MAIN_START_COORD_X + 'px';
    window.pin.mapPinMain.style.top = window.mapSettings.MAP_PIN_MAIN_START_COORD_Y + 'px';
    window.pin.extractAndPasteMainPinCoords(window.pin.mapPinMain.style.left, window.pin.mapPinMain.style.top, 0, 0);
  };

  // Отрисовывает сообщение об успешной отправке данных формы
  var drawingSuccessMessage = function () {
    window.util.pastePopup(window.map.mainPage, successTemplate, window.map.fragment);
  };

  // Осуществляет отправку данных формы и сброс полей формы с возвратом страницы к неактивному состоянию
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.createSendRequest(drawingSuccessMessage, window.map.drawingErrorMessage, window.util.POST_URL, 'POST', new FormData(adForm));
    resetFormAndDeactivatePage();
  });

  // Осуществляет сброс полей формы с возвратом страницы к неактивному состоянию при нажатии кнопки очистки формы
  adForm.addEventListener('reset', function () {
    resetFormAndDeactivatePage();
  });
})();
