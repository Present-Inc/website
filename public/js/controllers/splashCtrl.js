/*
 * spashController.js
 * Defines requireJS module for SplashCtrl Controller
 *
 */

define(['./module'], function(PControllers) {

 /*
  * PControllers.splashController
  * Controller for splashing state
  *   @dependency {Angular} $scope
  *   @dependency {Present} ApplicationManager
  */

  return PControllers.controller('splashCtrl', ['$scope', 'ApplicationManager',

    function($scope, ApplicationManager) {

      $scope.message = 'Present!';
      $scope.staticContent = {
        title: "Present",
        appIcon: {
          source: 'assets/img/app-icon.png',
          alt: 'Present app icon'
        }
      };
    }

  ]);

});
