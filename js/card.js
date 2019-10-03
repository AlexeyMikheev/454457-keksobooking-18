'use strict';

(function () {
  var dataModule = window.data;

  var createOfferCard = function (offer, author, template) {
    var mapCard = template.content.querySelector('.map__card');

    mapCard.querySelector('.popup__title').textContent = offer.title;
    mapCard.querySelector('.popup__text--address').textContent = offer.address;
    mapCard.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';
    mapCard.querySelector('.popup__type').textContent = dataModule.TypesValues[offer.type.toUpperCase()].text;
    mapCard.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
    mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;

    var popupFeatures = mapCard.querySelector('.popup__features');
    var popupFeature = popupFeatures.querySelector('.popup__feature.popup__feature--' + dataModule.Feature[offer.features.toUpperCase()]);
    popupFeatures.innerHTML = '';
    if (popupFeature !== null) {
      popupFeatures.appendChild(popupFeature.cloneNode(true));
    }

    mapCard.querySelector('.popup__description').textContent = offer.description;
    mapCard.querySelector('.popup__photo').src = offer.photos;
    mapCard.querySelector('.popup__avatar').src = 'img/avatars/user' + author.avatar + '.png';

    return mapCard;
  };

  var populateOfferCard = function (pin) {
    var map = document.querySelector('.map');
    var mapFiltersContainer = document.querySelector('.map__filters-container');

    var template = document.querySelector('#card');

    var offerCardTemplate = createOfferCard(pin.offer, pin.author, template.cloneNode(true));

    map.insertBefore(offerCardTemplate, mapFiltersContainer);
  };

  window.card = {
    populateOfferCard: populateOfferCard,
    createOfferCard: createOfferCard
  };
})();