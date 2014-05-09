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

  return PServices.factory('ApplicationManager', [function() {

    //define default application properties 
    function ApplicationManager() {
      this.fullscreen = false;
      this.navigation = false;
    };

    ApplicationManager.prototype.fullscreenMode = function(value) {
      if(value)
      this.fullscreen = value;
      else return this.fullscreen;
    };

    ApplicationManager.prototype.navigationMode = function(value) {
      if(value)
      this.navigation = value;
      else return this.navigationMode;
    };

    var newApplicationManager = new ApplicationManager();

    return newApplicationManager;

  }]);

});
