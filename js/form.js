'use strict';

(function () {
  var dataModule = window.data;

  var RoomsCapacity = {};
  RoomsCapacity[dataModule.Room.ONE] = [dataModule.Capacity.ONE];
  RoomsCapacity[dataModule.Room.TWO] = [dataModule.Capacity.TWO, dataModule.Capacity.ONE];
  RoomsCapacity[dataModule.Room.THREE] = [dataModule.Capacity.THREE, dataModule.Capacity.TWO, dataModule.Capacity.ONE];
  RoomsCapacity[dataModule.Room.ONEHUNDRED] = [dataModule.Capacity.EMPTY];

  var MinTypesPrice = {};
  MinTypesPrice[dataModule.TypesValues.BUNGALO.value] = 0;
  MinTypesPrice[dataModule.TypesValues.FLAT.value] = 1000;
  MinTypesPrice[dataModule.TypesValues.HOUSE.value] = 5000;
  MinTypesPrice[dataModule.TypesValues.PALACE.value] = 10000;

  var adForm = document.querySelector('.ad-form');
  var adFormCapacity = adForm.querySelector('.ad-form #capacity');
  var adFormTitle = adForm.querySelector('.ad-form #title');
  var adFormType = adForm.querySelector('.ad-form #type');
  var adFormPrice = adForm.querySelector('.ad-form #price');
  var adFormTimeIn = adForm.querySelector('.ad-form #timein');
  var adFormTimeOut = adForm.querySelector('.ad-form #timeout');
  var adFormRoomNumber = document.querySelector('.ad-form #room_number');
  var adFormCapacityOptions = adFormCapacity.querySelectorAll('option');

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
    }
    adFormTitle.setCustomValidity(message);
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
        case dataModule.Room.ONE:
          message = 'Выберите не более 1 гостя';
          break;
        case dataModule.Room.TWO:
          message = 'Выберите не более 2 гостей';
          break;
        case dataModule.Room.THREE:
          message = 'Выберите не более 3 гостей';
          break;
        case dataModule.Room.ONEHUNDRED:
          message = 'Выберите не для гостей';
          break;

        default: message = 'Неверное колличество гостей';
      }
    }
    adFormCapacity.setCustomValidity(message);
  };

  var validateAdFormPrice = function () {
    var typeValue = adFormType.value;
    var priceValue = +adFormPrice.value;
    var minPriceValue = MinTypesPrice[typeValue];

    var message = '';
    if (priceValue < minPriceValue) {
      switch (typeValue) {
        case dataModule.TypesValues.BUNGALO.value:
          message = 'Выберите не менее 0';
          break;
        case dataModule.TypesValues.FLAT.value:
          message = 'Выберите не менее 1000';
          break;
        case dataModule.TypesValues.HOUSE.value:
          message = 'Выберите не менее 5000';
          break;
        case dataModule.TypesValues.PALACE.value:
          message = 'Выберите не менее 10000';
          break;
      }
    }
    adFormPrice.setCustomValidity(message);
  };

  var checkAdFormTimes = function (target) {
    switch (target.id) {
      case adFormTimeIn.id:
        adFormTimeOut.value = adFormTimeIn.value;
        break;
      case adFormTimeOut.id:
        adFormTimeIn.value = adFormTimeOut.value;
        break;
    }
  };

  var onAdFormSelectInput = function (evt) {
    switch (evt.target.id) {
      case adFormTitle.id:
        validateAdFormTitle();
        break;
      case adFormPrice.id:
        validateAdFormPrice();
        break;
    }
  };

  var onAdFormSelectChange = function (evt) {
    switch (evt.target.id) {
      case adFormType.id:
        validateAdFormPrice();
        break;
      case adFormRoomNumber.id:
        checkAdFormRoomNumberValues();
        validateaAFormCapacity();
        break;
      case adFormCapacity.id:
        validateaAFormCapacity();
        break;
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
    adForm.addEventListener('change', function (evt) {
      onAdFormSelectChange(evt);
    }, true);
    adForm.addEventListener('input', function (evt) {
      onAdFormSelectInput(evt);
    }, true);
    validateaAFormCapacity();
  };

  var setAddress = function (value) {
    adForm.querySelector('#address').value = value;
  };

  var init = function () {
    initValidations();
    checkAdFormRoomNumberValues();
    validateAdFormPrice();
    checkAdFormTimes(adFormTimeIn);
  };

  window.form = {
    init: init,
    setAddress: setAddress
  };
})();
