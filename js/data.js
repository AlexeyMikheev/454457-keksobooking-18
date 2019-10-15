'use strict';

(function () {
  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

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

  var TypeValue = {
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

  var Price = {
    LOW: {
      min: null,
      max: 10000
    },
    MIDDLE: {
      min: 10000,
      max: 50000
    },
    HIGH: {
      min: 50000,
      max: null
    }
  };

  var Feature = {
    WIFI: 'wifi',
    DISHWASHER: 'dishwasher',
    PARKING: 'parking',
    WASHER: 'washer',
    ELEVATOR: 'elevator',
    CONDITIONER: 'conditioner'
  };

  window.data = {
    TypeValue: TypeValue,
    Room: Room,
    Capacity: Capacity,
    Feature: Feature,
    Features: FEATURES,
    Price: Price
  };
})();
