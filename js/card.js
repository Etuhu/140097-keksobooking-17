'use strict';

(function () {
  var PHOTO_ITEM_WIDTH = 45;
  var PHOTO_ITEM_HEIGHT = 45;
  var PHOTO_ITEM_ALT = 'Фотография жилья';

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

    // Скрывает элемент в случае поступления с сервера неполных данных
    var checkCompletenessOfData = function (data, element) {
      cardElement.querySelector(element).hidden = data === '';
    };

    // Отображает текстовый элемент карточки на странице, если с сервера поступили полные данные
    var checkAndPasteElement = function (data, element) {
      if (!checkCompletenessOfData(data, element)) {
        window.util.insertTextContent(cardElement, element, data);
      }
    };

    checkAndPasteElement(offering.offer.title, '.popup__title');
    checkAndPasteElement(offering.offer.address, '.popup__text--address');
    checkAndPasteElement(offering.offer.price + '₽/ночь', '.popup__text--price');
    checkAndPasteElement(offering.offer.description, '.popup__description');

    if (!checkCompletenessOfData(offering.offer.type, '.popup__type')) {
      window.util.insertTextContent(cardElement, '.popup__type', offerTypeValue[offering.offer.type]);
    }
    if (!checkCompletenessOfData(offering.offer.rooms || offering.offer.guests, '.popup__text--capacity')) {
      window.util.insertTextContent(cardElement, '.popup__text--capacity', offering.offer.rooms + ' ' + window.util.getEndingWord(offering.offer.rooms, 'комната', 'комнаты', 'комнат') + ' для ' + offering.offer.guests + ' ' + window.util.getEndingWord(offering.offer.guests, 'гостя', 'гостей', 'гостей'));
    }
    if (!checkCompletenessOfData(offering.offer.checkin || offering.offer.checkout, '.popup__text--time')) {
      window.util.insertTextContent(cardElement, '.popup__text--time', 'Заезд после ' + offering.offer.checkin + ', ' + 'выезд до ' + offering.offer.checkout);
    }
    if (!checkCompletenessOfData(offering.author.avatar, '.popup__avatar')) {
      cardElement.querySelector('.popup__avatar').src = offering.author.avatar;
    }


    cardElement.querySelector('.popup__features').innerHTML = '';
    if (offering.offer.features.length === 0) {
      cardElement.querySelector('.popup__features').hidden = true;
    } else {
      offering.offer.features.forEach(function (item) {
        var featureItem = document.createElement('li');
        cardElement.querySelector('.popup__features').appendChild(featureItem);
        featureItem.classList.add('popup__feature', 'popup__feature--' + item);
      });
    }

    cardElement.querySelector('.popup__photos').innerHTML = '';
    if (offering.offer.photos.length === 0) {
      cardElement.querySelector('.popup__photos').hidden = true;
    } else {
      offering.offer.photos.forEach(function (item) {
        var photoItem = document.createElement('img');
        cardElement.querySelector('.popup__photos').appendChild(photoItem);
        photoItem.classList.add('popup__photo');
        photoItem.width = PHOTO_ITEM_WIDTH;
        photoItem.height = PHOTO_ITEM_HEIGHT;
        photoItem.alt = PHOTO_ITEM_ALT;
        photoItem.src = item;
      });
    }

    cardElement.hidden = true;
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
