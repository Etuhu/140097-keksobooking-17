'use strict';

var TYPES_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var COORDINATE_Y_MIN = 130;
var COORDINATE_Y_MAX = 630;

var mapWidth = document.querySelector('.map').offsetWidth;
var mapPinWidth = document.querySelector('.map__pin').offsetWidth;

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var fragment = document.createDocumentFragment();

document.querySelector('.map').classList.remove('map--faded');

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getUniqueNumber = function (max) {
  var sum = 0;
  for (var i = 1; i <= max; i++) {
    sum += 1;
  }
  return sum;
};

var createOfferings = function (count) {
  var offerings = [];

  for (var i = 0; i < count; i++) {
    offerings.push({
      author: {
        avatar: 'img/avatars/user0' + getUniqueNumber(i + 1) + '.png'
      },
      offer: {
        type: TYPES_OF_HOUSING[getRandom(0, TYPES_OF_HOUSING.length - 1)]
      },
      location:
        {
          x: getRandom(mapPinWidth, mapWidth - mapPinWidth),
          y: getRandom(COORDINATE_Y_MIN, COORDINATE_Y_MAX)
        }
    });
  }
  return offerings;
};

var renderMapPin = function (offering) {
  var mapPinElement = pinTemplate.cloneNode(true);

  mapPinElement.style.left = offering.location.x + 'px';
  mapPinElement.style.top = offering.location.y + 'px';
  mapPinElement.querySelector('img').src = offering.author.avatar;
  mapPinElement.querySelector('img').alt = offering.offer.type;

  return mapPinElement;
};

var drawingMapPin = function () {
  var offersArray = createOfferings(8);
  for (var i = 0; i < offersArray.length; i++) {
    fragment.appendChild(renderMapPin(offersArray[i]));
  }
  mapPins.appendChild(fragment);
};

drawingMapPin();
