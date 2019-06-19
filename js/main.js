'use strict';

var typesOfHousing = ['palace', 'flat', 'house', 'bungalo'];
var mapWidth = document.querySelector('.map').offsetWidth;
document.querySelector('.map').classList.remove('map--faded');
var pin = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');

// var author = {
//   avatar: '../img/avatars/user01.png'
// };
//
// var offer = {
//   type: 'palace'
// };
//
// var location = {
//   x: 200,
//   y: 150
// };
//
// var offerings = [
//   author.avatar,
//   offer.type,
//   location.x,
//   location.y
// ];

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var offerings = [
  {
    author: {avatar: '../img/avatars/user0' + getRandom(1, 8) + '.png'},
    offer: {type: typesOfHousing[getRandom(0, typesOfHousing.length - 1)]},
    location:
      {x: getRandom(0, mapWidth),
        y: getRandom(130, 630)}
  },
  {
    author: {avatar: '../img/avatars/user0' + getRandom(1, 8) + '.png'},
    offer: {type: typesOfHousing[getRandom(0, typesOfHousing.length - 1)]},
    location:
      {x: getRandom(0, mapWidth),
        y: getRandom(130, 630)}
  },
  {
    author: {avatar: '../img/avatars/user0' + getRandom(1, 8) + '.png'},
    offer: {type: typesOfHousing[getRandom(0, typesOfHousing.length - 1)]},
    location:
      {x: getRandom(0, mapWidth),
        y: getRandom(130, 630)}
  },
  {
    author: {avatar: '../img/avatars/user0' + getRandom(1, 8) + '.png'},
    offer: {type: typesOfHousing[getRandom(0, typesOfHousing.length - 1)]},
    location:
      {x: getRandom(0, mapWidth),
        y: getRandom(130, 630)}
  },
  {
    author: {avatar: '../img/avatars/user0' + getRandom(1, 8) + '.png'},
    offer: {type: typesOfHousing[getRandom(0, typesOfHousing.length - 1)]},
    location:
      {x: getRandom(0, mapWidth),
        y: getRandom(130, 630)}
  },
  {
    author: {avatar: '../img/avatars/user0' + getRandom(1, 8) + '.png'},
    offer: {type: typesOfHousing[getRandom(0, typesOfHousing.length - 1)]},
    location:
      {x: getRandom(0, mapWidth),
        y: getRandom(130, 630)}
  },
  {
    author: {avatar: '../img/avatars/user0' + getRandom(1, 8) + '.png'},
    offer: {type: typesOfHousing[getRandom(0, typesOfHousing.length - 1)]},
    location:
      {x: getRandom(0, mapWidth),
        y: getRandom(130, 630)}
  },
  {
    author: {avatar: '../img/avatars/user0' + getRandom(1, 8) + '.png'},
    offer: {type: typesOfHousing[getRandom(0, typesOfHousing.length - 1)]},
    location:
      {x: getRandom(0, mapWidth),
        y: getRandom(130, 630)}
  }
];

var renderMapPin = function () {
  var mapPinElement = pin.cloneNode(true);

  mapPinElement.querySelector('.map__pin').style.left = offerings[0].location.x + 'px';
  mapPinElement.querySelector('.map__pin').style.top = offerings[0].location.y + 'px';
  mapPinElement.querySelector('.map__pin').picture.src = offerings[0].author.avatar;
  mapPinElement.querySelector('.map__pin').picture.alt = offerings[0].offer.type;

  return mapPinElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < offerings.length; i++) {
  fragment.appendChild(renderMapPin(offerings[0]));
}
mapPins.appendChild(fragment);


console.log(offerings);

// var getOfferingsArrive = function () {
//   for (var i = 0; i <= 8; i++) {
//     author: {avatar: '../img/avatars/user0' + getRandom(1, i) + '.png'};
//     offer: {type: typesOfHousing[getRandom(0, typesOfHousing.length - 1)]};
//     location: {x: getRandom(0, mapWidth)};
//     location: {y: getRandom(130, 630)};
//     getOfferingsArrive[i] = i++;
//     return getOfferingsArrive
// }
// };
