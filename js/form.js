'use strict';

(function () {
  var dataModule = window.data;
  var backEndModule = window.backend;

  var RoomsCapacity = {};
  RoomsCapacity[dataModule.Room.ONE] = [dataModule.Capacity.ONE];
  RoomsCapacity[dataModule.Room.TWO] = [dataModule.Capacity.TWO, dataModule.Capacity.ONE];
  RoomsCapacity[dataModule.Room.THREE] = [dataModule.Capacity.THREE, dataModule.Capacity.TWO, dataModule.Capacity.ONE];
  RoomsCapacity[dataModule.Room.ONEHUNDRED] = [dataModule.Capacity.EMPTY];

  var MinTypesPrice = {};
  MinTypesPrice[dataModule.TypeValue.BUNGALO.value] = 0;
  MinTypesPrice[dataModule.TypeValue.FLAT.value] = 1000;
  MinTypesPrice[dataModule.TypeValue.HOUSE.value] = 5000;
  MinTypesPrice[dataModule.TypeValue.PALACE.value] = 10000;

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
        case dataModule.TypeValue.BUNGALO.value:
          message = 'Выберите не менее 0';
          break;
        case dataModule.TypeValue.FLAT.value:
          message = 'Выберите не менее 1000';
          break;
        case dataModule.TypeValue.HOUSE.value:
          message = 'Выберите не менее 5000';
          break;
        case dataModule.TypeValue.PALACE.value:
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

  var initValidations = function () {
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

  var initFormEvents = function (onSuccess, onError) {
    adForm.addEventListener('submit', function (evt) {
      evt.preventDefault();

      validateaAFormCapacity();

      if (adForm.checkValidity()) {
        backEndModule.save(new FormData(adForm), onSuccess, onError);
      }
    });
  };

  var init = function (onSaveSuccess, onSaveError) {
    initValidations();
    checkAdFormRoomNumberValues();
    validateAdFormPrice();
    checkAdFormTimes(adFormTimeIn);
    initFormEvents(onSaveSuccess, onSaveError);
  };

  window.form = {
    init: init,
    setAddress: setAddress
  };
})();
