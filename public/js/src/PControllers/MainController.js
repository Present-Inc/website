/**
 * PControllers.mainCtrl
 * Highest level controller PresentWebApp
 * Acts as a buffer to the rootScope
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency ApplicationManager {PManagers}
 */

  PControllers.controller('mainCtrl', ['$scope', 'logger', 'SessionModel',

    function($scope, logger, SessionModel) {

      $scope.Session = SessionModel.create();

			$scope.$watch('Session');

			$scope.$watch('Session.user.active', function(user) {
				$scope.$broadcast('_newUserLoggedIn', user);
			});

      $scope.$on('$stateChangeStart', function(event, toState, toParams) {
				$scope.Session.authorize(event, toState, toParams);
      });

    }

  ]);
