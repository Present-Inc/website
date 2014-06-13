/**
 * PControllers.mainCtrl
 * Highest level controller PresentWebApp
 * Acts as a buffer to the rootScope
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency ApplicationManager {PManagers}
 */

  PControllers.controller('mainCtrl', ['$scope', 'logger', 'UserSessionModel',

    function($scope, logger, UserSessionModel) {

      $scope.UserSession = UserSessionModel.create();

			$scope.$watch('UserSession');

			$scope.$watch('UserSession.user.active', function(user) {
				$scope.$broadcast('_newUserLoggedIn', user);
			});

      $scope.$on('$stateChangeStart', function(event, toState) {
				$scope.UserSession.authorize(event, toState);
      });

    }

  ]);
