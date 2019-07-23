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

  // Передает параметры отрисовки карточки соответствующим элементам в разметке
  var createCard = function (offering) {
    var cardElement = cardTemplate.cloneNode(true);

    window.util.insertTextContent(cardElement, '.popup__title', offering.offer.title);
    window.util.insertTextContent(cardElement, '.popup__text--address', offering.offer.address);
    window.util.insertTextContent(cardElement, '.popup__text--price', offering.offer.price + '₽/ночь');
    window.util.insertTextContent(cardElement, '.popup__type', offerTypeValue[offering.offer.type]);
    window.util.insertTextContent(cardElement, '.popup__text--capacity', offering.offer.rooms + ' ' + window.util.getEndingWord(offering.offer.rooms) + ' для ' + offering.offer.guests + ' гостей');
    window.util.insertTextContent(cardElement, '.popup__text--time', 'Заезд после ' + offering.offer.checkin + ', ' + 'выезд до ' + offering.offer.checkout);
    window.util.insertTextContent(cardElement, '.popup__description', offering.offer.description);

    cardElement.querySelector('.popup__features').innerHTML = '';
    offering.offer.features.forEach(function (item, i) {
      var featureItem = document.createElement('li');
      cardElement.querySelector('.popup__features').appendChild(featureItem);
      featureItem.classList.add('popup__feature', 'popup__feature--' + offering.offer.features[i]);
    });
    if (offering.offer.features.length === 0) {
      cardElement.querySelector('.popup__features').hidden = true;
    }

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

  window.drawCards = drawCards;
})();
