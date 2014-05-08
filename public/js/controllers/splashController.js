/*
 * spashController.js
 * Defines requireJS module
 *
 */

define(['./module'], function(PControllers) {

 /*
  * PControllers.splashController
  * Main controller for splashing state
  *   @dependency {Angular} $scope
  *   @dependency {Present} ApplicationManager
  */

  return PControllers.controller('splashCtrl', ['$scope', 'ApplicationManager',  function($scope, ApplicationManager) {

    console.log(ApplicationManager.message);

    $scope.message = 'Present!';
    $scope.staticContent = {
      title: "Present",
      appIcon: {
        source: 'assets/img/app-icon.png',
        alt: 'Present app icon'
      }
    };
  }]);

});
