'use strict';

(function () {
  var addressInput = window.map.adForm.querySelector('#address');
  var mapPinMain = document.querySelector('.map__pin--main');

  // Извлекает числовое значение из строчного элемента и записывает его в поле ввода адреса
  // (с поправкой на то, что в адрес записываются координаты острого конца)
  var extractNumber = function (left, top, widthCorrect, heightCorrect) {
    addressInput.value = (parseInt(left, 10) + widthCorrect) + ', ' + (parseInt(top, 10) + heightCorrect);
    var extractNumberValue = addressInput.value;
    return extractNumberValue;
  };

  // Записывает в поле ввода координаты главной метки до момента активации (красный круг)
  extractNumber(mapPinMain.style.left, mapPinMain.style.top, 0, 0);

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

      mapPinMain.style.top = giveFinishCoord(finishCoordY, window.map.COORDINATE_Y_MIN, window.map.COORDINATE_Y_MAX) + 'px';
      mapPinMain.style.left = giveFinishCoord(finishCoordX, 0, window.map.mapWidth - window.map.MAP_PIN_MAIN_WIDTH) + 'px';
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      window.map.activateMainPage();
      calculateCoordMainPin(moveEvt);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      calculateCoordMainPin(upEvt);

      // Заполняет поле адреса в соответствии с положением метки на карте
      extractNumber(mapPinMain.style.left, mapPinMain.style.top, window.map.MAP_PIN_MAIN_WIDTH / 2, window.map.MAP_PIN_MAIN_HEIGHT);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
