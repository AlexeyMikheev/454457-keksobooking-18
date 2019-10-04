'use strict';

(function () {
  var errorTemplate = document.querySelector('#error').content;
  var errorMessage = null;
  var mainNode = document.querySelector('main');

  var showErrorMessage = function (errorMessageText, onCloseCallback) {
    errorMessage = errorTemplate.querySelector('.error').cloneNode(true);
    var errorButton = errorMessage.querySelector('.error__button');

    errorButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      if (errorMessage) {
        errorMessage.remove();
      }
      onCloseCallback();
    });
    mainNode.insertAdjacentElement('afterbegin', errorMessage);
  };

  window.notification = showErrorMessage;
})();
