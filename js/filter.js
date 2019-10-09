'use strict';

(function () {
  var ANY_FILTER_VALUE = 'any';

  var dataModule = window.data;
  var debounce = window.debounce;

  var mapFilters = document.querySelector('.map__filters');

  var typeFilter = mapFilters.querySelector('#housing-type');
  var priceFilter = mapFilters.querySelector('#housing-price');
  var roomsFilter = mapFilters.querySelector('#housing-rooms');
  var guestsFilter = mapFilters.querySelector('#housing-guests');
  var featureFilters = mapFilters.querySelectorAll('.map__checkbox');
  var features = [];

  var compareEqual = function (filter, pin, propertyName) {
    return filter[propertyName].value === pin[propertyName];
  };

  var compareRange = function (filter, pin, propertyName) {
    var range = filter[propertyName].value;
    var value = pin[propertyName];

    if (range.min === null) {
      return value <= range.max;
    } else if (range.max === null) {
      return value >= range.min;
    }

    return range.min < value && value < range.max;
  };

  var compareArray = function (filter, pin, propertyName) {
    var includesCounter = 0;
    filter[propertyName].value.forEach(function (leftValue) {
      if (pin[propertyName].includes(leftValue)) {
        includesCounter++;
      }
    });

    return includesCounter === filter[propertyName].value.length;
  };


  var addFilterComparerProperty = function (filterComparer, propertyName, compareValue, compareFn) {
    filterComparer[propertyName] = {
      value: compareValue,
      compare: compareFn
    };

    filterComparer.checkedProperties.push(propertyName);
  };

  var getFilterComparer = function () {
    var filterComparer = {
      checkedProperties: []
    };

    if (typeFilter.value !== ANY_FILTER_VALUE) {
      addFilterComparerProperty(filterComparer, 'type', typeFilter.value, compareEqual);
    }

    if (priceFilter.value !== ANY_FILTER_VALUE) {
      var priceCompareValue = dataModule.Price[priceFilter.value.toUpperCase()];
      addFilterComparerProperty(filterComparer, 'price', priceCompareValue, compareRange);

    }

    if (roomsFilter.value !== ANY_FILTER_VALUE) {
      var roomsCompareValue = parseInt(roomsFilter.value, 10);
      addFilterComparerProperty(filterComparer, 'rooms', roomsCompareValue, compareEqual);
    }

    if (guestsFilter.value !== ANY_FILTER_VALUE) {
      var guestsCompareValue = parseInt(guestsFilter.value, 10);
      addFilterComparerProperty(filterComparer, 'guests', guestsCompareValue, compareEqual);
    }

    if (features.length > 0) {
      addFilterComparerProperty(filterComparer, 'features', features, compareArray);
    }

    return filterComparer.checkedProperties.length ? filterComparer : null;
  };

  var fillCheckedFeatures = function () {
    features = [];
    for (var i = 0; i < featureFilters.length; i++) {
      var featureFilter = featureFilters[i];
      if (featureFilter.checked) {
        features.push(featureFilter.value);
      }
    }
  };

  var init = function (cb) {
    mapFilters.addEventListener('change', function (evt) {
      var args = {
        target: evt.target,
        cb: cb
      };

      debounce(onMapFiltersChange, args);
    });
  };

  var onMapFiltersChange = function (args) {
    if (args.target.classList.contains('map__checkbox')) {
      fillCheckedFeatures();
    }

    if (args.cb) {
      args.cb();
    }
  };

  window.filter = {
    init: init,
    getFilterComparer: getFilterComparer
  };
})();
