'use strict';

(function () {
  var timeInSelect = window.util.adForm.querySelector('#timein');
  var timeOutSelect = window.util.adForm.querySelector('#timeout');

  // Устанавливает значение placeholder поля "Цена за ночь" при загрузке страницы
  // в соответствии с типом жилья
  window.util.setsDependenceOfPrice();

  window.util.housingTypeSelect.addEventListener('change', function () {
    window.util.setsDependenceOfPrice();
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
