'use strict';

(function () {
  var mapModule = null;

  var mapFilters = document.querySelector('.map__filters');
  var houseTypeFilter = mapFilters.querySelector('#housing-type');
  var selectedHouseType = houseTypeFilter.value;

  var addHouseTypeFilterHandler = function () {
    houseTypeFilter.addEventListener('change', function (evt) {
      selectedHouseType = evt.target.value;
      mapModule.onFilterTypesChanged(selectedHouseType);
    });
  };

  var init = function (map) {
    mapModule = map;
    addHouseTypeFilterHandler();
  };

  window.filters = {
    init: init,
    selectedHouseType: selectedHouseType
  };
})();
