'use strict';

(function () {
  var ESC_KEY = 27;
  var ITEMS_COUNT = 8;
  var MAP_PIN_MAIN_AFTER_HEIGHT = 22;

  var MIN_ADDRESS_Y = 130;
  var MAX_ADDRESS_Y = 630;

  var dataModule = window.data;
  var pinModule = window.pin;
  var cardModule = window.card;
  var formModule = window.form;

  var isOfferCardOpened = false;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var mapFiltersForm = document.querySelector('.map__filters');
  var cardTemplate = document.querySelector('#card');

  var mapPins = document.querySelector('.map__pins');

  var minMapX = 0;
  var maxMapX = mapPins.offsetWidth;

  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var pinTemplate = document.querySelector('#pin');

  var isMapEnabled = false;
  var draggedMapPinButton = false;

  var onOfferCardClose = function () {
    hideOfferCard();
  };

  var showOfferCard = function (pin) {
    if (isOfferCardOpened) {
      hideOfferCard();
    }
    var offerCardTemplate = cardModule.createOfferCard(pin.offer, pin.author, cardTemplate.cloneNode(true));

    var popupClose = offerCardTemplate.querySelector('.popup__close');
    popupClose.addEventListener('click', onOfferCardClose);

    map.insertBefore(offerCardTemplate, mapFiltersContainer);

    isOfferCardOpened = true;
  };


  var addPinClickEvent = function (pins) {
    mapPins.addEventListener('click', function (evt) {
      if (!draggedMapPinButton) {
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
      } else {
        evt.preventDefault();
        draggedMapPinButton = false;
      }
    });
  };

  var populatePins = function (pins) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pins.length; i++) {
      var pin = pinModule.createPin(pins[i], i, pinTemplate.cloneNode(true));

      fragment.appendChild(pin);
    }

    mapPins.appendChild(fragment);

    addPinClickEvent(pins);
  };

  var hideOfferCard = function () {
    var openedCard = map.querySelector('.map__card.popup');
    if (openedCard !== null) {
      var popupClose = openedCard.querySelector('.popup__close');
      if (popupClose !== null) {
        popupClose.removeEventListener('click', onOfferCardClose);
      }
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
    isMapEnabled = true;
    map.classList.remove('map--faded');

    adForm.classList.remove('ad-form--disabled');
    removeElementsAttribute(adForm, 'fieldset', 'disabled');

    mapFiltersForm.classList.remove('ad-form--disabled');
    removeElementsAttribute(mapFiltersForm, 'select', 'disabled');
    removeElementsAttribute(mapFiltersForm, 'fieldset', 'disabled');
  };

  var disableMap = function () {
    isMapEnabled = false;
    map.classList.add('map--faded');

    adForm.classList.add('ad-form--disabled');
    addElementsAttribute(adForm, 'fieldset', 'disabled', true);

    mapFiltersForm.classList.add('ad-form--disabled');
    addElementsAttribute(mapFiltersForm, 'select', 'disabled', true);
    addElementsAttribute(mapFiltersForm, 'fieldset', 'disabled', true);
  };

  var getAddress = function (left, top, width, height) {
    var addressX = Math.round(left + (width / 2));
    var addressY = Math.round(top + (height + (MAP_PIN_MAIN_AFTER_HEIGHT / 2)));
    return {
      x: addressX,
      y: addressY
    };
  };

  var addressValidate = function (address) {
    return address.x >= minMapX && address.x <= maxMapX && address.y >= MIN_ADDRESS_Y && address.y <= MAX_ADDRESS_Y;
  };

  var initMapPinMainEvents = function () {
    mapPinMain.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      if (!isMapEnabled) {
        enableMap();
      }

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        draggedMapPinButton = true;

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        var positionTop = mapPinMain.offsetTop - shift.y;
        var positionLeft = mapPinMain.offsetLeft - shift.x;

        var address = getAddress(positionLeft, positionTop, mapPinMain.offsetWidth, mapPinMain.offsetHeight);

        if (addressValidate(address)) {
          formModule.setAddress(address.x + ' ' + address.y);
        } else {
          positionTop = mapPinMain.offsetTop;
          positionLeft = mapPinMain.offsetLeft;
        }

        mapPinMain.style.top = positionTop + 'px';
        mapPinMain.style.left = positionLeft + 'px';
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        var address = getAddress(mapPinMain.offsetLeft, mapPinMain.offsetTop, mapPinMain.offsetWidth, mapPinMain.offsetHeight);
        formModule.setAddress(address.x + ' ' + address.y);

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

      };
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
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

  init();
})();
