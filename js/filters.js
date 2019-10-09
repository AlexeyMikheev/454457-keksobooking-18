'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters');
  var houseTypeFilter = mapFilters.querySelector('#housing-type');
  var selectedHouseType = houseTypeFilter.value;

  var addHouseTypeFilterHandler = function (onFilterChangedCallback) {
    houseTypeFilter.addEventListener('change', function (evt) {
      selectedHouseType = evt.target.value;
      if (onFilterChangedCallback) {
        onFilterChangedCallback();
      }
    });
  };

  var init = function (onFilterChangedCallback) {
    addHouseTypeFilterHandler(onFilterChangedCallback);
  };

  window.filters = {
    init: init,
    selectedHouseType: selectedHouseType
  };
})();
