

PControllers.controller('NavbarController', ['$scope', '$state', 'logger', 'UserContextManager', 'NavbarModel',
	function($scope, $state, logger, UserContextManager, NavbarModel) {

		$scope.Navbar = NavbarModel.create();
		$scope.Navbar.loadHub();

		$scope.$watch('Navbar');

		$scope.$watch('Navbar.search.query', function (query) {
			if (query == 0) {
				$scope.Navbar.hideDropdown();
			} else if (query.length % 3 == 0) {
				$scope.Navbar.showDropdown();
				$scope.Navbar.sendSearchQuery(query);
			}
		});

		$scope.$on('$stateChangeSuccess', function (event, toState, fromState) {
			$scope.Navbar.configure(toState);
		});

		$scope.$on('_newUserLoggedIn', function (event, profile) {
			$scope.Navbar.hub.username = profile.username;
			$scope.Navbar.hub.profilePicture = profile.profilePicture;
		});

	}
]);

