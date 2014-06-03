/*
 * PDirectives.feed
 * HTML Directive for the video feed
 */

  PDirectives.directive('feed', [function() {
    return {
      restrict: 'EA',
      templateUrl: 'views/partials/feed'
    }
  }]);

/**
 * PDirectives.navbarDirective
 */


	PDirectives.directive('navbar', [function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/partials/navbar',
			replace: true,
			controller: function($scope, $state, logger, UserContextManager) {
				logger.test(['PControllers.navCtrl -- navigation controller initialized']);

				$scope.Navbar = {
					mode: {
						loggedIn: false
					}
				};

				$scope.$on('$stateChangeSuccess', function(event, toState, fromState) {
					$scope.setMode();
				});

				$scope.logout = function() {
					UserContextManager.destroyActiveUserContext()
						.then(function() {
							$state.go('splash');
						});
				};

				$scope.setMode = function() {
					var userContext = UserContextManager.getActiveUserContext();
					if (userContext) $scope.Navbar.mode.loggedIn = true;
					else $scope.Navbar.mode.loggedIn = false;
				}
			},
			link: function(scope, element, attrs) {

			}
		}

	}]);
/**
 * PDirectives.viewContainer
 * Directive that controlles the main view container
 * I.E custom extension for ui-view
 */

  PDirectives.directive('viewContainer', function() {});
