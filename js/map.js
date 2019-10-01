'use strict';

window.map = (function (dataModule, pinModule, cardModule, formModule) {
  var ESC_KEY = 27;

  var ITEMS_COUNT = 8;

  var MAP_PIN_MAIN_AFTER_HEIGHT = 22;

  var isOfferCardOpened = false;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var mapFiltersForm = document.querySelector('.map__filters');
  var cardTemplate = document.querySelector('#card');
  var mapPins = document.querySelector('.map__pins');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var pinTemplate = document.querySelector('#pin');

  var showOfferCard = function (pin) {
    if (isOfferCardOpened) {
      hideOfferCard();
    }
    var offerCardTemplate = cardModule.createOfferCard(pin.offer, pin.author, cardTemplate.cloneNode(true));

    map.insertBefore(offerCardTemplate, mapFiltersContainer);

    isOfferCardOpened = true;
  };

  var addPinClickEvent = function (pins) {
    mapPins.addEventListener('click', function (evt) {
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

  var populatePins = function (values) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < values.length; i++) {
      var pin = pinModule.createPin(values[i], i, pinTemplate.cloneNode(true));

      fragment.appendChild(pin);
    }

    mapPins.appendChild(fragment);

    addPinClickEvent(values);
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
      formModule.setAddress(addressX + ' ' + addressY);
      enableMap();
    });
  };

  var initDocumentEvents = function () {
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEY && isOfferCardOpened) {
        hideOfferCard();
      }
    });
  };

  var init = function () {
    var pins = dataModule.getMokePins(ITEMS_COUNT);

    populatePins(pins);

    disableMap();

    initMapPinMainEvents();

    initDocumentEvents();

    formModule.init();
  };

  return {
    init: init
  };
})(window.data, window.pin, window.card, window.form);

window.map.init();
