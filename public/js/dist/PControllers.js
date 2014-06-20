

PControllers.controller('EditProfileController', ['$scope', 'logger', 'User',

	function($scope, logger, User) {

		//Initialize Profile
		$scope.User = User;
		$scope.$watch(User);

	}

]);

/**
 * PControllers.FeedController
 * View Controller for the discover state
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency {Present} FeedManager {PManagers}
 *   @dependency {Present} Feed <Object>
 */

  PControllers.controller('FeedController', ['$scope', 'logger', 'Feed',

    function($scope, logger, Feed) {

			$scope.Feed = Feed;
			$scope.$watch(Feed);

    }

  ]);

/*
 * PControllers.homeCtrl
 * View Controller for the home state
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency FeedManager {PManagers}
 *   @dependency Feed <Object>
 *   @dependency Profile <Object>
 */

  PControllers.controller('homeCtrl', ['$scope', 'logger', 'Feed', 'User',

    function($scope, logger, Feed, User) {

      logger.debug('PControllers.homeCtrl -- initializing User Profile', User);
      logger.debug('PControllers.homeCtrl -- initializing the Feed Manager', Feed);

      //Initialize Profile
      $scope.User = User;
			$scope.Feed = Feed;

			$scope.$watch(Feed);

    }

  ]);

/*
 * Application Manager handles all login functionality
 * 	@param {Angular} $scope
 */

  PControllers.controller('LoginController', ['$scope',

		function($scope) {

			$scope.input = {
				username : '',
				password : ''
			};

  	}

	]);

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


/*
 * PControllers.loginCtrl
 * Application Manager handles all login functionality
 * 	@dependency $scope {Angular}
 */

	PControllers.controller('RegisterController', ['$scope', 'UserModel', function($scope, UserModel) {

		$scope.input = {
			username: '',
			password: '',
			verifyPassword: '',
			email: ''
		};

		$scope.feedback = {
			error : {
				missingUsername: 'Your username is required',
				invalidUsername: 'Username must be between 1 and 20 characters'
			}
		};

		$scope.accountSuccessfullyRegistered = false;

		$scope.UserModel = UserModel;

		$scope.submit = function(input) {
			console.log($scope.registerForm.email.$valid);
		};



	}]);

 /*
  * PControllers.splashController
  * Controller for splash state
  *   @dependency  $scope {Angular}
  *   @dependency  logger {PUtilites}
  */

  PControllers.controller('SplashController', ['$scope', 'logger',

    function($scope, logger) {

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

/*
 * View Controller for the home state
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency FeedManager {PManagers}
 *   @dependency Feed <Object>
 *   @dependency Profile <Object>
 */

PControllers.controller('UserProfileController', ['$scope', 'logger', 'Feed', 'User',

	function($scope, logger, Feed, User) {

		//Initialize Profile
		$scope.User = User;
		$scope.Feed = Feed;

		$scope.$watch(Feed);

	}

]);
