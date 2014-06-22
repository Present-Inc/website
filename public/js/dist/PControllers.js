
/**
 * EditProfileController
 * @namespace
 */

PControllers.controller('EditProfileController', ['$scope', 'User',

	function($scope, User) {

		/** Initializes a new User instance on the Controller $scope **/
		$scope.User = User;
		$scope.$watch(User);

	}

]);

/**
 * FeedController
 * @namespace
 */

  PControllers.controller('FeedController', ['$scope', 'Feed',

		function($scope, Feed) {

			/** Initializes a new Feed instance on the Controller $scope **/
			$scope.Feed = Feed;
			$scope.$watch(Feed);

    }

  ]);

/*
 * HomeController
 * @namespace
 */

  PControllers.controller('homeCtrl', ['$scope', 'Feed', 'User',

    function($scope, Feed, User) {

			/** Initializes a new User instance on the Controller $scope **/
			$scope.User = User;

			/** Initializes a new Feed instance on the Controller $scope **/
			$scope.Feed = Feed;

			//Potentially useless......
			$scope.$watch(Feed);

    }

  ]);

/*
 * LoginController
 * @namespace
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
 * MainController
 * @namespace
 */

  PControllers.controller('MainController', ['$scope', 'logger', 'SessionModel',

    function($scope, logger, SessionModel) {

      /** Initializes the SessionModel on the Controller $scope **/
			$scope.SessionModel = SessionModel;


			/** The active session needs to be authorized before each state change **/

			$scope.$on('$stateChangeStart', function(event, toState, toParams) {
				$scope.SessionModel.authorize(event, toState, toParams);
      });

    }

  ]);

/**
 * NavbarController
 * @namespace
 */

PControllers.controller('NavbarController', ['$scope', '$state', 'logger', 'UserContextManager', 'NavbarModel',
	function($scope, $state, logger, UserContextManager, NavbarModel) {

		/** Initialize a new Navbar instance on the Controller $scope **/
		$scope.Navbar = NavbarModel.create();

		$scope.$watch('Navbar');


		/**
		 * Watch the user search query and send a request when the query length is divisible by 3
		 */


		$scope.$watch('Navbar.search.query', function (query) {
			//TODO: Enable search for a single character
			//TODO: Fix bug where search results are sometimes duplicated
			if (query == 0) {
				$scope.Navbar.hideDropdown();
			} else if (query.length % 3 == 0) {
				$scope.Navbar.showDropdown();
				$scope.Navbar.sendSearchQuery(query);
			}
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
