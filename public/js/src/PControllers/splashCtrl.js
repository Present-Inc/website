 /*
  * PControllers.splashController
  * Controller for splash state
  *   @dependency  $scope {Angular}
  *   @dependency  logger {PUtilites}
  */

  PControllers.controller('splashCtrl', ['$scope', 'logger',

    function($scope, logger) {

      logger.debug(['PControllers.splashCtrl -- splash controller initialized']);

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
