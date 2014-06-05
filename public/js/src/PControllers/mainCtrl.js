/**
 * PControllers.mainCtrl
 * Highest level controller PresentWebApp
 * Acts as a buffer to the rootScope
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency ApplicationManager {PManagers}
 */

  PControllers.controller('mainCtrl', ['$scope', 'logger', 'ApplicationManager',

    function($scope, logger, ApplicationManager) {

      $scope.Application = ApplicationManager;

			$scope.$watch('Application');

			$scope.$watch('Application.user.active', function(user) {
				$scope.$broadcast('_newUserLoggedIn', user);
			});

      $scope.$on('$stateChangeStart', function(event, toState) {
				$scope.Application.authorize(event, toState);
      });

    }

 ]);
