'use strict';

var TYPES_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var mapWidth = document.querySelector('.map').offsetWidth;
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var fragment = document.createDocumentFragment();

document.querySelector('.map').classList.remove('map--faded');

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var createOfferings = function (count) {
  var offerings = [];

  for (var i = 0; i < count; i++) {
    offerings.push({
      author: {avatar: '../img/avatars/user0' + getRandom(1, 8) + '.png'},
      offer: {type: TYPES_OF_HOUSING[getRandom(0, TYPES_OF_HOUSING.length - 1)]},
      location:
        {x: getRandom(0, mapWidth),
          y: getRandom(130, 630)}
    });
  }
  return offerings;
};

var renderMapPin = function (offering) {
  var mapPinElement = pinTemplate.cloneNode(true);

  mapPinElement.querySelector('.map__pin').style.left = offering.location.x + 'px';
  mapPinElement.querySelector('.map__pin').style.top = offering.location.y + 'px';
  mapPinElement.querySelector('img').src = offering.author.avatar;
  mapPinElement.querySelector('img').alt = offering.offer.type;

  return mapPinElement;
};

var drawingMapPin = function () {
  var offers = createOfferings(8);
  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(renderMapPin(createOfferings[i]));
  }
  mapPins.appendChild(fragment);
};

drawingMapPin();
