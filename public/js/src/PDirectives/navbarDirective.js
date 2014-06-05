/**
 * PDirectives.navbarDirective
 * HTML Directive for the main Navbar
 */


	PDirectives.directive('navbar', [function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/partials/navbar',
			replace: true,

			controller: function($scope, $state, logger, UserContextManager, NavbarManager) {

				logger.test(['PDirectives -- Navbar initialized']);
				$scope.Navbar = NavbarManager;

				$scope.$watch('Navbar');

				$scope.$watch('Navbar.search.query', function(query) {
					if(query == 0) {
						$scope.Navbar.hideDropdown();
					} else if (query.length % 3 == 0) {
						$scope.Navbar.showDropdown();
						$scope.Navbar.sendSearchQuery(query);
					}
				});

				$scope.$on('$stateChangeSuccess', function(event, toState, fromState) {
					$scope.Navbar.configure(toState);
				});

				$scope.$on('_newUserLoggedIn', function(event, profile) {
					$scope.Navbar.hub.username = profile.username;
					$scope.Navbar.hub.profilePicture = profile.profilePicture;
				});

				$scope.Navbar.loadHub();

			},

			link: function(scope, element, attrs) {

			}

		}

	}]);