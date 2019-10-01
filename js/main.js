'use strict';

var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var Types = {
  PALACE: {
    text: 'Дворец',
    value: 'palace'
  },
  FLAT: {
    text: 'Квартира',
    value: 'flat'
  },
  HOUSE: {
    text: 'Дом',
    value: 'house'
  },
  BUNGALO: {
    text: 'Бунгало',
    value: 'bungalo'
  }
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

var Feature = {
  WIFI: 'wifi',
  DISWASHER: 'dishwasher',
  PARKING: 'parking',
  WASHER: 'washer',
  ELEVATOR: 'elevator',
  CONDITIONER: 'conditioner'
};

var Room = {
  ONE: '1',
  TWO: '2',
  THREE: '3',
  ONEHUNDRED: '100'
};

var Capacity = {
  ONE: '1',
  TWO: '2',
  THREE: '3',
  EMPTY: '0'
};

var ESC_KEY = 27;

var RoomsCapacity = {};
RoomsCapacity[Room.ONE] = [Capacity.ONE];
RoomsCapacity[Room.TWO] = [Capacity.TWO, Capacity.ONE];
RoomsCapacity[Room.THREE] = [Capacity.THREE, Capacity.TWO, Capacity.ONE];
RoomsCapacity[Room.ONEHUNDRED] = [Capacity.EMPTY];

var MinTypesPrices = {};
MinTypesPrices[Types.BUNGALO.value] = 0;
MinTypesPrices[Types.FLAT.value] = 1000;
MinTypesPrices[Types.HOUSE.value] = 5000;
MinTypesPrices[Types.PALACE.value] = 10000;

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

var MAP_PIN_MAIN_AFTER_HEIGHT = 22;

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

var addPinClickEvent = function (mapPin) {
  mapPin.addEventListener('click', function (evt) {
    var mapPinButton = null;

    if (evt.target.classList.contains('map__pin') && !evt.target.classList.contains('map__pin--main')) {
      mapPinButton = evt.target;
    } else if (evt.target.parentElement.classList.contains('map__pin') && !evt.target.parentElement.classList.contains('map__pin--main')) {
      mapPinButton = evt.target.parentElement;
    }

    if (mapPinButton !== null && mapPinButton.dataset !== null) {
      var index = mapPinButton.dataset.index;
      showOfferCard(pins[index]);
    }
  });
};

var createPin = function (obj, index, template) {
  var mapPin = template.content.querySelector('.map__pin');
  mapPin.style.left = obj.location.x - (PIN_WIDTH / 2) + 'px';
  mapPin.style.top = obj.location.y - PIN_HEIGHT + 'px';
  mapPin.dataset.index = index;

  var img = mapPin.querySelector('img');
  img.src = 'img/avatars/user' + obj.author.avatar + '.png';
  img.alt = obj.offer.title;
  img.setAttribute('tabindex', index + 1);
  img.dataset.index = index;

  return mapPin;
};

var populatePins = function (values) {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var template = document.querySelector('#pin');

  for (var i = 0; i < values.length; i++) {
    var pin = createPin(values[i], i, template.cloneNode(true));

    fragment.appendChild(pin);
  }

  mapPins.appendChild(fragment);

  addPinClickEvent(mapPins);
};

var createOfferCard = function (offer, author, template) {
  var mapCard = template.content.querySelector('.map__card');

  mapCard.querySelector('.popup__title').textContent = offer.title;
  mapCard.querySelector('.popup__text--address').textContent = offer.address;
  mapCard.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';
  mapCard.querySelector('.popup__type').textContent = Types[offer.type.toUpperCase()].text;
  mapCard.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
  var popupFeatures = mapCard.querySelector('.popup__features');
  var popupFeature = popupFeatures.querySelectorAll('.popup__feature:not(.popup__feature--' + Feature[offer.features.toUpperCase()] + ')');
  for (var i = popupFeature.length - 1; i >= 0; i--) {
    popupFeature[i].remove();
  }

  mapCard.querySelector('.popup__description').textContent = offer.description;
  mapCard.querySelector('.popup__photo').src = offer.photos;

  mapCard.querySelector('.popup__close').addEventListener('click', function () {
    hideOfferCard();
  });

  mapCard.querySelector('.popup__avatar').src = 'img/avatars/user' + author.avatar + '.png';

  return mapCard;
};

var map = document.querySelector('.map');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapPinMain = map.querySelector('.map__pin--main');

var adForm = document.querySelector('.ad-form');
var adFormCapacity = adForm.querySelector('.ad-form #capacity');
var adFormTitle = adForm.querySelector('.ad-form #title');
var adFormType = adForm.querySelector('.ad-form #type');
var adFormPrice = adForm.querySelector('.ad-form #price');
var adFormTimeIn = adForm.querySelector('.ad-form #timein');
var adFormTimeOut = adForm.querySelector('.ad-form #timeout');
var adFormRoomNumber = document.querySelector('.ad-form #room_number');
var adFormCapacityOptions = adFormCapacity.querySelectorAll('option');

var mapFiltersForm = document.querySelector('.map__filters');

var isOfferCardOpened = false;

var showOfferCard = function (pin) {
  if (isOfferCardOpened) {
    hideOfferCard();
  }

  var template = document.querySelector('#card');

  var offerCardTemplate = createOfferCard(pin.offer, pin.author, template.cloneNode(true));

  map.insertBefore(offerCardTemplate, mapFiltersContainer);

  isOfferCardOpened = true;
};

var hideOfferCard = function () {
  var openedCard = map.querySelector('.map__card.popup');
  if (openedCard !== null) {
    openedCard.remove();
    isOfferCardOpened = false;
  }
};

var addElementsAttribute = function (parent, selector, attrName, value) {
  var childItems = parent.querySelectorAll(selector);
  for (var i = 0; i < childItems.length; i++) {
    childItems[i].setAttribute(attrName, value);
  }
};

var removeElementsAttribute = function (parent, selector, attrName) {
  var childItems = parent.querySelectorAll(selector);
  for (var i = 0; i < childItems.length; i++) {
    childItems[i].removeAttribute(attrName);
  }
};

var enableMap = function () {
  map.classList.remove('map--faded');

  adForm.classList.remove('ad-form--disabled');
  removeElementsAttribute(adForm, 'fieldset', 'disabled');

  mapFiltersForm.classList.remove('ad-form--disabled');
  removeElementsAttribute(mapFiltersForm, 'select', 'disabled');
  removeElementsAttribute(mapFiltersForm, 'fieldset', 'disabled');
};

var disableMap = function () {
  map.classList.add('map--faded');

  adForm.classList.add('ad-form--disabled');
  addElementsAttribute(adForm, 'fieldset', 'disabled', true);

  mapFiltersForm.classList.add('ad-form--disabled');
  addElementsAttribute(mapFiltersForm, 'select', 'disabled', true);
  addElementsAttribute(mapFiltersForm, 'fieldset', 'disabled', true);
};

var initMapPinMainEvents = function () {
  mapPinMain.addEventListener('mousedown', function (evt) {
    var addressX = Math.round(evt.currentTarget.offsetLeft + (evt.currentTarget.offsetWidth / 2));
    var addressY = Math.round(evt.currentTarget.offsetTop + (evt.currentTarget.offsetHeight + (MAP_PIN_MAIN_AFTER_HEIGHT / 2)));
    adForm.querySelector('#address').value = addressX + ' ' + addressY;
    enableMap();
  });
};

var validateAdFormTitle = function () {
  var message = '';
  if (!adFormTitle.validity.valid) {
    if (adFormTitle.validity.valueMissing) {
      message = 'Это поле обязательное';
    } else if (adFormTitle.validity.tooShort) {
      message = 'Длинна должна быть не менее 30 символов';
    } else if (adFormTitle.validity.tooLong) {
      message = 'Длинна должна быть не более 100 символов';
    }
    adFormTitle.setCustomValidity(message);
  }
};

var checkAdFormRoomNumberValues = function () {
  var roomNumber = adFormRoomNumber.value;
  var optionCapacityOption = null;
  var optionCapacityValue = null;

  for (var i = 0; i < adFormCapacityOptions.length; i++) {
    optionCapacityOption = adFormCapacityOptions[i];
    optionCapacityValue = optionCapacityOption.value;
    optionCapacityOption.disabled = !RoomsCapacity[roomNumber].includes(optionCapacityValue);
  }
};

var validateaAFormCapacity = function () {
  var capacityValue = adFormCapacity.value;
  var roomNumber = adFormRoomNumber.value;
  var message = '';

  if (!RoomsCapacity[roomNumber].includes(capacityValue)) {
    switch (roomNumber) {
      case
        Room.ONE: message = 'Выберите не более 1 гостя';
        break;
      case
        Room.TWO: message = 'Выберите не более 2 гостей';
        break;
      case
        Room.THREE: message = 'Выберите не более 3 гостей';
        break;
      case
        Room.ONEHUNDRED: message = 'Выберите не для гостей';
        break;

      default: message = 'Неверное колличество гостей';
    }
  }
  adFormCapacity.setCustomValidity(message);
};

var validateAdFormPrice = function () {
  var typeValue = adFormType.value;
  var priceValue = +adFormPrice.value;
  var minPriceValue = MinTypesPrices[typeValue];

  var message = '';
  if (priceValue < minPriceValue) {
    switch (typeValue) {
      case
        Types.BUNGALO.value: message = 'Выберите не менее 0';
        break;
      case
        Types.FLAT.value: message = 'Выберите не менее 1000';
        break;
      case
        Types.HOUSE.value: message = 'Выберите не менее 5000';
        break;
      case
        Types.PALACE.value: message = 'Выберите не менее 10000';
        break;
    }
  }
  adFormPrice.setCustomValidity(message);
};

var checkAdFormTimes = function (target) {
  if (target.id === adFormTimeIn.id) {
    adFormTimeOut.value = adFormTimeIn.value;
  } else if (target.id === adFormTimeOut.id) {
    adFormTimeIn.value = adFormTimeOut.value;
  }
};

var onAdFormSelectInput = function (evt) {
  if (evt.target.id === adFormTitle.id) {
    validateAdFormTitle();
  } else if (evt.target.id === adFormPrice.id) {
    validateAdFormPrice();
  }
};

var onAdFormSelectChange = function (evt) {
  if (evt.target.id === adFormRoomNumber.id) {
    checkAdFormRoomNumberValues();
    validateaAFormCapacity();
  } else if (evt.target.id === adFormCapacity.id) {
    validateaAFormCapacity();
  } else if (evt.target.id === adFormType.id) {
    validateAdFormPrice();
  }
  checkAdFormTimes(evt.target);
};

var onAdFormSubmit = function (evt) {
  validateaAFormCapacity();
  if (!adForm.checkValidity()) {
    evt.preventDefault();
  }
};

var initValidations = function () {
  adForm.addEventListener('submit', onAdFormSubmit);
  adForm.addEventListener('input', onAdFormSelectInput, true);
  adForm.addEventListener('change', onAdFormSelectChange, true);
  validateaAFormCapacity();
};

var initDocumentEvents = function () {
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEY && isOfferCardOpened) {
      hideOfferCard();
    }
  });
};

var pins = getMokePins(ITEMS_COUNT);

populatePins(pins);

disableMap();

initMapPinMainEvents();

initDocumentEvents();

initValidations();

checkAdFormRoomNumberValues();

checkAdFormTimes(adFormTimeIn);
