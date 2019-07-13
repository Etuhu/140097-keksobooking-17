'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var housingTypeSelect = adForm.querySelector('#type');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');

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

})();
