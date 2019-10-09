'use strict';

(function () {
  var ESC_KEY = 27;
  var MAP_PIN_MAIN_AFTER_HEIGHT = 22;

  var MIN_ADDRESS_Y = 130;
  var MAX_ADDRESS_Y = 630;

  var MAX_PINS_COUNT = 6;

  var backendModule = window.backend;
  var pinModule = window.pin;
  var cardModule = window.card;
  var formModule = window.form;
  var notificationModule = window.notification;
  var filterModule = window.filter;

  var isOfferCardOpened = false;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPinMainDefaultCoords = {
    positionTop: mapPinMain.offsetTop,
    positionLeft: mapPinMain.offsetLeft
  };
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

  var mapPinItems = [];
  var mapFiltredPinItems = [];

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

  var hideOfferCard = function () {
    if (isOfferCardOpened) {
      var openedCard = map.querySelector('.map__card.popup');
      if (openedCard) {
        var popupClose = openedCard.querySelector('.popup__close');
        if (popupClose) {
          popupClose.removeEventListener('click', onOfferCardClose);
        }
        openedCard.remove();
        isOfferCardOpened = false;
      }
    }
  };

  var addPinClickEvent = function () {
    mapPins.addEventListener('click', function (evt) {
      if (!draggedMapPinButton) {
        var mapPinButton = null;

        if (evt.target.classList.contains('map__pin') && !evt.target.classList.contains('map__pin--main')) {
          mapPinButton = evt.target;
        } else if (evt.target.parentElement.classList.contains('map__pin') && !evt.target.parentElement.classList.contains('map__pin--main')) {
          mapPinButton = evt.target.parentElement;
        }

        if (mapPinButton && mapPinButton.dataset) {
          var index = mapPinButton.dataset.index;
          showOfferCard(mapFiltredPinItems[index]);
        }
      } else {
        evt.preventDefault();
        draggedMapPinButton = false;
      }
    });
  };

  var renderPins = function () {
    clearPins();

    var countItems = Math.min(mapFiltredPinItems.length, MAX_PINS_COUNT);
    if (countItems) {
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < countItems; i++) {
        var pin = pinModule.createPin(mapFiltredPinItems[i], i, pinTemplate.cloneNode(true));

        fragment.appendChild(pin);
      }

      mapPins.appendChild(fragment);
    }

  };

  var clearPins = function () {
    var pins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = pins.length - 1; i >= 0; i--) {
      pins[i].remove();
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

  var setMapPinMainDefault = function () {
    if (mapPinMainDefaultCoords) {
      var positionTop = mapPinMainDefaultCoords.positionTop;
      var positionLeft = mapPinMainDefaultCoords.positionLeft;

      var address = getAddress(positionLeft, positionTop, mapPinMain.offsetWidth, mapPinMain.offsetHeight);

      mapPinMain.style.top = positionTop + 'px';
      mapPinMain.style.left = positionLeft + 'px';

      if (addressValidate(address)) {
        formModule.setAddress(address.x + ' ' + address.y);
      }
    }
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

      var removeMouseEvents = function () {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
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

          removeMouseEvents();
        }
        mapPinMain.style.top = positionTop + 'px';
        mapPinMain.style.left = positionLeft + 'px';
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        var address = getAddress(mapPinMain.offsetLeft, mapPinMain.offsetTop, mapPinMain.offsetWidth, mapPinMain.offsetHeight);
        if (addressValidate(address)) {
          formModule.setAddress(address.x + ' ' + address.y);
        }

        removeMouseEvents();

      };
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    });
  };

  var initDocumentEvents = function () {
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEY) {
        hideOfferCard();
        notificationModule.hideErrorMessage();
        notificationModule.hideSuccessMessage();
      }
    });
  };

  var onLoadError = function (errorMessage) {
    notificationModule.showErrorMessage(errorMessage, function () {
      loadPins();
    });
  };

  var onSaveFormSuccess = function () {
    adForm.reset();
    clearPins();
    hideOfferCard();

    notificationModule.showSuccessMessage();
    setMapPinMainDefault();
  };

  var onSaveFormError = function (errorMessage) {
    notificationModule.showErrorMessage(errorMessage);
  };

  var loadPins = function () {
    backendModule.load(function (items) {
      mapPinItems = items;
      applayFilters();
    }, onLoadError);
  };

  var filtred = function (comparer, offer) {
    var checkedProperties = comparer.checkedProperties;

    var checkedPropertiesCounter = 0;

    for (var i = 0; i < checkedProperties.length; i++) {
      var propertyName = checkedProperties[i];

      if (comparer[propertyName].compare(comparer, offer, propertyName)) {
        checkedPropertiesCounter++;
      }
    }

    return checkedPropertiesCounter === comparer.checkedProperties.length;
  };

  var applayFilters = function () {
    var filterComparer = filterModule.getFilterComparer();

    mapFiltredPinItems = mapPinItems;

    if (filterComparer) {
      var filtredPins = mapPinItems.filter(function (pin) {
        return filtred(filterComparer, pin.offer);
      });

      mapFiltredPinItems = filtredPins;
    }

    hideOfferCard();
    renderPins();
  };

  var init = function () {
    backendModule.load(loadPins, onLoadError);

    disableMap();

    initMapPinMainEvents();

    initDocumentEvents();

    addPinClickEvent();

    formModule.init(onSaveFormSuccess, onSaveFormError);

    filterModule.init(applayFilters);
  };

  init();
})();
