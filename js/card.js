'use strict';

(function () {
  var offerTypeValue = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  // Передает параметры отрисовки пина соответствующим элементам в разметке
  var createCard = function (offering) {
    var cardElement = cardTemplate.cloneNode(true);

    cardElement.querySelector('.popup__title').textContent = offering.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = offering.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = offering.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = offerTypeValue[offering.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = offering.offer.rooms + ' комнаты' + ' для ' + offering.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offering.offer.checkin + ', ' + 'выезд до ' + offering.offer.checkout;

    cardElement.querySelector('.popup__features').innerHTML = '';
    offering.offer.features.forEach(function (item, i) {
      var featureItem = document.createElement('li');
      cardElement.querySelector('.popup__features').appendChild(featureItem);
      featureItem.classList.add('popup__feature', 'popup__feature--' + offering.offer.features[i]);
    });
    if (offering.offer.features.length === 0) {
      cardElement.querySelector('.popup__features').hidden = true;
    }

    // offering.offer.features.forEach(function (item, i) {
    //   if (!cardElement.querySelector('.popup__features').querySelectorAll('.popup__feature')[i].classList.contains('popup__feature--' + offering.offer.features[i])) {
    //     cardElement.querySelector('.popup__features').querySelectorAll('.popup__feature')[i].style.display = 'none';
    //   }
    // });

    cardElement.querySelector('.popup__description').textContent = offering.offer.description;

    cardElement.querySelector('.popup__photos').innerHTML = '';
    offering.offer.photos.forEach(function (item, i) {
      var photoItem = document.createElement('img');
      cardElement.querySelector('.popup__photos').appendChild(photoItem);
      photoItem.classList.add('popup__photo');
      photoItem.width = 45;
      photoItem.height = 45;
      photoItem.alt = 'Фотография жилья';
      photoItem.src = offering.offer.photos[i];
    });
    if (offering.offer.photos.length === 0) {
      cardElement.querySelector('.popup__photos').hidden = true;
    }


    cardElement.querySelector('.popup__avatar').src = offering.author.avatar;

    return cardElement;
  };

  // Отрисовывает карточки на странице
  var drawCards = function () {
    var filteredOffers = window.map.getFilteredOffers();
    filteredOffers.map(function (offer) {
      window.map.fragment.appendChild(createCard(offer));
    });
    window.map.map.insertBefore(window.map.fragment, mapFiltersContainer);
  };

  window.card = {
    drawCards: drawCards
  };
})();
