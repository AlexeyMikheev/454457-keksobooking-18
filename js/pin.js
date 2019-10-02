'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var createPin = function (obj, index, template) {
    var mapPin = template.content.querySelector('.map__pin');
    mapPin.style.left = obj.location.x - (PIN_WIDTH / 2) + 'px';
    mapPin.style.top = obj.location.y - PIN_HEIGHT + 'px';
    mapPin.dataset.index = index;

    var img = mapPin.querySelector('img');
    img.src = 'img/avatars/user' + obj.author.avatar + '.png';
    img.alt = obj.offer.title;
    img.setAttribute('tabindex', index + 1);
    img.dataset.index = index;

    return mapPin;
  };

  window.pin = {
    createPin: createPin
  };
})();
