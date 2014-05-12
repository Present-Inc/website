/*
 * applicationManager.js
 * defines requireJS module
 */

define(['./module'], function(PServices) {

  /*
  * PServices.applicationManager
  * Provides properties and methods to manage the state of the application
  * Only injected one per application, usually on the highest level scope
  */

  return PServices.service('ApplicationManager', [function() {

    //define default application properties
      this.fullscreen = false;
      this.navigation = false;
      this.status = 'Application is currently running';

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
