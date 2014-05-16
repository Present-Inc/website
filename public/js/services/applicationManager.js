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

  return PServices.factory('ApplicationManager', [function() {

      function ApplicationManager() {
        this.fullscreenEnabled = false;
        this.navigation = false;
        this.status = 'Application is currently running';
      };

      return new ApplicationManager();

  }]);

});
