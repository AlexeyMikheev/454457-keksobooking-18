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

  var getComparedEqual = function (filter, pin, typeOfFilter) {
    return filter[typeOfFilter].value === pin[typeOfFilter];
  };

  var getComparedRange = function (filter, pin, typeOfFilter) {
    var range = filter[typeOfFilter].value;
    var value = pin[typeOfFilter];

    if (!range.min) {
      return value <= range.max;
    } else if (!range.max) {
      return value >= range.min;
    }

    return range.min < value && value < range.max;
  };

  var getComparedArray = function (filter, pin, typeOfFilter) {
    var filtredItems = filter[typeOfFilter].value.filter(function (leftValue) {
      return pin[typeOfFilter].includes(leftValue);
    });

    return filtredItems.length === filter[typeOfFilter].value.length;
  };

  var addFilterComparerProperty = function (filterComparer, typeOfFilter, filterValue, cb) {
    filterComparer[typeOfFilter] = {
      value: filterValue,
      compare: cb
    };

    filterComparer.checkedProperties.push(typeOfFilter);
  };

  var getFilterComparer = function () {
    var filterComparer = {
      checkedProperties: []
    };

    var addFilterComparerPropertyBinded = addFilterComparerProperty.bind(null, filterComparer);

    if (typeFilter.value !== ANY_FILTER_VALUE) {
      addFilterComparerPropertyBinded('type', typeFilter.value, getComparedEqual);
    }

    if (priceFilter.value !== ANY_FILTER_VALUE) {
      var priceCompareValue = dataModule.Price[priceFilter.value.toUpperCase()];
      addFilterComparerPropertyBinded('price', priceCompareValue, getComparedRange);
    }

    if (roomsFilter.value !== ANY_FILTER_VALUE) {
      var roomsCompareValue = parseInt(roomsFilter.value, 10);
      addFilterComparerPropertyBinded('rooms', roomsCompareValue, getComparedEqual);
    }

    if (guestsFilter.value !== ANY_FILTER_VALUE) {
      var guestsCompareValue = parseInt(guestsFilter.value, 10);
      addFilterComparerPropertyBinded('guests', guestsCompareValue, getComparedEqual);
    }

    if (features.length) {
      addFilterComparerPropertyBinded('features', features, getComparedArray);
    }

    return filterComparer.checkedProperties.length ? filterComparer : null;
  };

  var fillCheckedFeatures = function () {
    features = Array.from(featureFilters).filter(function (featureFilter) {
      return featureFilter.checked;
    }).map(function (featureFilterChecked) {
      return featureFilterChecked.value;
    });
  };

  var init = function (cb) {
    mapFilters.addEventListener('change', function (evt) {
      var options = {
        target: evt.target,
        cb: cb
      };

      debounce(onMapFiltersChange, options);
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
