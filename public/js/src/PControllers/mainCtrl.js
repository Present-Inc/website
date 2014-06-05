/**
 * PControllers.mainCtrl
 * Highest level controller PresentWebApp
 * Acts as a buffer to the rootScope
 *   @dependency {Angular} $scope
 *   @dependency {ui-router} $state
 *   @dependency {Utilities} logger
 *   @dependency {Present} ApplicationManager -- Provides properties and methods to manage the application state
 *   @dependency {Present} UserContextManager -- Provides methods to manage userContexts
 */

  PControllers.controller('mainCtrl', ['$scope', '$location', '$state', 'logger', 'ApplicationManager',

    function($scope, $location, $state, logger, ApplicationManager) {

      $scope.Application = ApplicationManager;

			$scope.$watch('Application');

			$scope.$watch('Application.user.active', function(user) {
				$scope.$broadcast('_newUserLoggedIn', user);
			});

      $scope.$on('$stateChangeStart', function(event, toState) {
				$scope.Application.authorize(event, toState);
				$scope.Application.configure(toState);
      });

    }

 ]);
