/*
 * applicationManager.js
 * defines requireJS module
 */

define(['./module'], function(PServices) {

  /*
  * PServices.applicationManager
  * Provides application level properties and methods
  */

  return PServices.factory('ApplicationManager', [function() {

    var ApplicationManager = {
      fullscreen: true,
      navigation: false,
      message: 'Hello there...'
    }

    return ApplicationManager;

  }]);

});
