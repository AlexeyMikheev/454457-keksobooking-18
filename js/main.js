'use strict';

var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var TYPES_ENUM = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var FEATURES_ENUM = {
  wifi: 'wifi',
  dishwasher: 'dishwasher',
  parking: 'parking',
  washer: 'washer',
  elevator: 'elevator',
  conditioner: 'conditioner'
};

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var ITEMS_COUNT = 8;

var AVATAR_MIN = 1;
var AVATAR_MAX = 8;

var LOCATION_MIN = 130;
var LOCATION_MAX = 630;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var randomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.abs(Math.round(rand));
};

var getRandomValue = function (values) {
  var randomIndex = randomInteger(0, values.length - 1);
  return values[randomIndex];
};

var getRandomItem = function () {
  var item = {
    author: {
      avatar: '0' + randomInteger(AVATAR_MIN, AVATAR_MAX)
    },
    offer: {
      title: 'Заголовок объявления',
      address: '600, 350',
      price: 500,
      type: getRandomValue(TYPES),
      rooms: 3,
      guests: 5,
      checkin: getRandomValue(TIMES),
      checkout: getRandomValue(TIMES),
      features: getRandomValue(FEATURES),
      description: 'Описание',
      photos: getRandomValue(PHOTOS)
    },
    location: {
      x: randomInteger(LOCATION_MIN, LOCATION_MAX),
      y: randomInteger(LOCATION_MIN, LOCATION_MAX)
    }
  };

  return item;
};

var getMokePins = function (count) {
  var items = [];
  for (var i = 0; i < count; i++) {
    items.push(getRandomItem());
  }
  return items;
};

var createPin = function (obj, template) {
  var mapPin = template.content.querySelector('.map__pin');
  mapPin.style.left = obj.location.x - (PIN_WIDTH / 2) + 'px';
  mapPin.style.top = obj.location.y - PIN_HEIGHT + 'px';

  var img = mapPin.querySelector('img');
  img.src = 'img/avatars/user' + obj.author.avatar + '.png';
  img.alt = obj.offer.title;

  return mapPin;
};

var populatePins = function (values) {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var template = document.querySelector('#pin');

  for (var i = 0; i < values.length; i++) {
    var pin = createPin(values[i], template.cloneNode(true));
    fragment.appendChild(pin);
  }

  mapPins.appendChild(fragment);
};


var createOfferCard = function (offer, author, template) {
  var mapCard = template.content.querySelector('.map__card');
  // var mapCardPhotos = mapCard.querySelector('.popup__photos');
  // var mapCardPhoto = mapCardPhotos.querySelector('.popup__photos');

  mapCard.querySelector('.popup__title').textContent = offer.title;
  mapCard.querySelector('.popup__text--address').textContent = offer.address;
  mapCard.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';
  mapCard.querySelector('.popup__type').textContent = TYPES_ENUM[offer.type];
  mapCard.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
  var popupFeatures = mapCard.querySelector('.popup__features');
  var popupFeature = popupFeatures.querySelectorAll('.popup__feature:not(.popup__feature--' + FEATURES_ENUM[offer.features] + ')');
  for (var i = popupFeature.length - 1; i >= 0; i--) {
    popupFeature[i].remove();
  }
  mapCard.querySelector('.popup__description').textContent = offer.description;
  mapCard.querySelector('.popup__photo').src = offer.photos;

  // for (var i = 0; i < offer.photos.length; i++) {
  //   mapCardPhoto.src = offer.photos[i];
  //   if (i > 0) {
  //     mapCardPhotos.appendChild(mapCardPhoto.cloneNode());
  //   }
  // }

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

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pins = getMokePins(ITEMS_COUNT);

populatePins(pins);

populateOfferCard(pins[0]);
