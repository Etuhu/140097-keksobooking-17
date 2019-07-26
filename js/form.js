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
})();
