'use strict';

(function () {
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapPinMainWidth = mapPinMain.offsetWidth;
  var mapPinMainHeight = mapPinMain.offsetHeight;
  var addressInput = window.form.adForm.querySelector('#address');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  // Извлекает числовое значение из строчного элемента и записывает его в поле ввода адреса
  // (с поправкой на то, что в адрес записываются координаты острого конца)
  var extractAndPasteMainPinCoords = function (left, top, widthCorrect, heightCorrect) {
    addressInput.value = (parseInt(left, 10) + widthCorrect) + ', ' + (parseInt(top, 10) + heightCorrect);
    var extractAndPasteMainPinCoordsValue = Math.round(addressInput.value);
    return extractAndPasteMainPinCoordsValue;
  };

  // Записывает в поле ввода координаты главной метки до момента активации (красный круг)
  extractAndPasteMainPinCoords(mapPinMain.style.left, mapPinMain.style.top, 0, 0);

  // Добавляет возможность перемещения метки по карте
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = new Coordinate(evt.clientX, evt.clientY);

    // Задает расчёт координат маркера и их запись в поле адреса
    var calculateCoordMainPin = function (evtName) {
      var shift = new Coordinate(startCoords.x - evtName.clientX, startCoords.y - evtName.clientY);

      startCoords = new Coordinate(evtName.clientX, evtName.clientY);

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

      mapPinMain.style.top = giveFinishCoord(finishCoordY, window.mapSettings.COORDINATE_Y_MIN, window.mapSettings.COORDINATE_Y_MAX) + 'px';
      mapPinMain.style.left = giveFinishCoord(finishCoordX, 0, window.mapSettings.mapWidth - mapPinMainWidth) + 'px';
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
      extractAndPasteMainPinCoords(mapPinMain.style.left, mapPinMain.style.top, mapPinMainWidth / 2, mapPinMainHeight);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
  });

  // Передает параметры отрисовки пина соответствующим элементам в разметке
  var createMapPin = function (offering) {
    var mapPinElement = pinTemplate.cloneNode(true);

    mapPinElement.style.left = offering.location.x + 'px';
    mapPinElement.style.top = offering.location.y + 'px';
    mapPinElement.querySelector('img').src = offering.author.avatar;
    mapPinElement.querySelector('img').alt = offering.offer.type;

    return mapPinElement;
  };

  // Отрисовывает пины на странице
  var drawPins = function () {
    var filteredOffers = window.map.getFilteredOffers();
    filteredOffers.map(function (offer) {
      if (window.util.isNotEmpty(offer.offer)) {
        window.map.fragment.appendChild(createMapPin(offer));
      }
    });
    window.map.mapPins.appendChild(window.map.fragment);
  };

  window.pin = {
    drawPins: drawPins,
    mapPinMain: mapPinMain,
    mapPinMainWidth: mapPinMainWidth,
    mapPinMainHeight: mapPinMainHeight,
    extractAndPasteMainPinCoords: extractAndPasteMainPinCoords
  };
})();
