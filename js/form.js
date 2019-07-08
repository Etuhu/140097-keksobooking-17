'use strict';

(function () {
  var housingTypeSelect = window.map.adForm.querySelector('#type');
  var housingPrice = window.map.adForm.querySelector('#price');
  var timeInSelect = window.map.adForm.querySelector('#timein');
  var timeOutSelect = window.map.adForm.querySelector('#timeout');

  // Устанавливает зависимость стоимости предложения от типа жилья
  var setsDependenceOfPrice = function () {
    var selectedValue = housingTypeSelect.value;
    var selectedHouseSettings = window.map.HOUSING_SETTING[selectedValue];
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
})();
