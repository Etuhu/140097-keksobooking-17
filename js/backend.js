'use strict';

(function () {
  var load = function (onLoad, onError) {
    var loadAddress = 'https://js.dump.academy/keksobooking/data';

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError();
      }
    });
    xhr.addEventListener('error', function () {
      onError();
    });
    xhr.addEventListener('timeout', function () {
      onError();
    });

    xhr.timeout = 10000; // 10s

    xhr.open('GET', loadAddress);
    xhr.send();
  };

  window.backend = {
    load: load
  };
})();
