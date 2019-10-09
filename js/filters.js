'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters');
  var houseTypeFilter = mapFilters.querySelector('#housing-type');

  var getHouseType = function () {
    return houseTypeFilter.value;
  };

  var init = function (filterChangeCallback) {
    houseTypeFilter.addEventListener('change', function () {
      if (filterChangeCallback) {
        filterChangeCallback();
      }
    });
  };

  window.filters = {
    init: init,
    getHouseType: getHouseType
  };
})();
