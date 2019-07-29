'use strict';

(function () {
  var mapWidth = document.querySelector('.map').offsetWidth;
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapPinMainWidth = mapPinMain.offsetWidth;
  var mapPinMainHeight = mapPinMain.offsetHeight;
  var addressInput = window.adForm.querySelector('#address');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  // Извлекает числовое значение из строчного элемента и записывает его в поле ввода адреса
  // (с поправкой на то, что в адрес записываются координаты острого конца)
  var extractAndPasteMainPinCoordinates = function (left, top, widthCorrector, heightCorrector) {
    addressInput.value = (parseInt(left, 10) + widthCorrector) + ', ' + (parseInt(top, 10) + heightCorrector);
    var extractAndPasteMainPinCoordinatesValue = Math.round(addressInput.value);
    return extractAndPasteMainPinCoordinatesValue;
  };

  // Записывает в поле ввода координаты главной метки до момента активации (красный круг)
  extractAndPasteMainPinCoordinates(mapPinMain.style.left, mapPinMain.style.top, 0, 0);

  // Добавляет возможность перемещения метки по карте
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoordinates = new Coordinate(evt.clientX, evt.clientY);

    // Задает расчёт координат маркера и их запись в поле адреса
    var calculateCoordinatesMainPin = function (evtName) {
      var shift = new Coordinate(startCoordinates.x - evtName.clientX, startCoordinates.y - evtName.clientY);

      startCoordinates = new Coordinate(evtName.clientX, evtName.clientY);

      var finishCoordinateX = mapPinMain.offsetLeft - shift.x;
      var finishCoordinateY = mapPinMain.offsetTop - shift.y;

      // Устанавливает предельные границы размещения маркера
      var givefinishCoordinates = function (finishCoordinate, minLimit, maxLimit) {
        if (finishCoordinate <= minLimit) {
          finishCoordinate = minLimit;
        } else if (finishCoordinate >= maxLimit) {
          finishCoordinate = maxLimit;
        }
        return finishCoordinate;
      };

      mapPinMain.style.top = givefinishCoordinates(finishCoordinateY, window.util.COORDINATE_Y_MIN, window.util.COORDINATE_Y_MAX) + 'px';
      mapPinMain.style.left = givefinishCoordinates(finishCoordinateX, 0, mapWidth - mapPinMainWidth) + 'px';
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      window.map.activateMainPage();
      calculateCoordinatesMainPin(moveEvt);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      calculateCoordinatesMainPin(upEvt);

      // Заполняет поле адреса в соответствии с положением метки на карте
      extractAndPasteMainPinCoordinates(mapPinMain.style.left, mapPinMain.style.top, mapPinMainWidth / 2, mapPinMainHeight);

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
    window.map.pinsBlock.appendChild(window.map.fragment);
  };

  window.pin = {
    drawPoints: drawPins,
    mainPoint: mapPinMain,
    extractAndPasteMainPointCoords: extractAndPasteMainPinCoordinates
  };
})();
