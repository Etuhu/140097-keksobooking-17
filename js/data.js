'use strict';

(function () {
  // Генерирует уникальные метки на карте (предложения жилья)
  var createOfferings = function (count) {
    var offerings = [];
    var housingTypes = Object.keys(window.util.HOUSING_SETTING);
    for (var i = 0; i < count; i++) {
      offerings.push({
        author: {
          avatar: 'img/avatars/user0' + window.util.getGrowingNumber(i + 1) + '.png'
        },
        offer: {
          type: housingTypes[window.util.getRandom(0, housingTypes.length - 1)]
        },
        location:
          {
            x: window.util.getRandom(window.mapSettings.PIN_WIDTH, window.mapSettings.mapWidth - window.mapSettings.PIN_WIDTH),
            y: window.util.getRandom(window.mapSettings.COORDINATE_Y_MIN, window.mapSettings.COORDINATE_Y_MAX)
          }
      });
    }
    return offerings;
  };

  window.data = {
    createOfferings: createOfferings
  };
})();
