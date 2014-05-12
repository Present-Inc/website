/*
 * applicationManager.js
 * defines requireJS module
 */

define(['./module'], function(PServices) {

  /*
  * PServices.applicationManager
  * Provides application level properties and methods
  *   @dependency {Present} Application Manager
  */

  return PServices.service('ApplicationManager', [function() {

    //define default application properties
      this.fullscreen = false;
      this.navigation = false;
      this.message = 'this is a test';

      this.fullscreenMode = function(value) {
        if(value)
        this.fullscreen = value;
        else return this.fullscreen;
      };

      this.navigationMode = function(value) {
        if(value)
        this.navigation = value;
        else return this.navigationMode;
      };

  }]);

});
