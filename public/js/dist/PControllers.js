
/**
 * EditProfileController
 * @namespace
 */

PControllers.controller('EditProfileController', ['$scope', 'User',

	function($scope, User) {

		/** Initializes a new User instance on the Controller $scope **/
		$scope.User = User;

		$scope.input = {
			full_name: User.profile.fullName,
			description: User.profile.description,
			gender: User.profile.gender,
			location: User.profile.location,
			website: User.profile.website,
			email: User.profile.email,
			phone_number: User.profile.phoneNumber
		};

		$scope.genders = ['Male', 'Female'];

		$scope.$watch(User);

		$scope.submit = function(input) {
			User.update(input)
				.then(function(msg) {
					console.log(msg);
				});
		};


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
 * LoginController
 * @namespace
 */

	PControllers.controller('RegisterController', ['$scope', 'UserModel', function($scope, UserModel) {

		/** Initialize the UserModel on the Controller $scope **/
		$scope.UserModel = UserModel;


		/** User Input **/
		$scope.input = {
			username: '',
			password: '',
			gender: '',
			verifyPassword: '',
			email: ''
		};



		/** User Feedback **/
		$scope.feedback = {
			error : {
				missingUsername: 'Your username is required',
				invalidUsername: 'Username must be between 1 and 20 characters'
			}
		};

		/** Reveal the download link when true**/
		$scope.accountSuccessfullyRegistered = false;

		$scope.submit = function(input) {
			//TODO: Map controller submit function to the User registerNewAccount method to complete account creation
			console.log(input);
		};

	}]);

 /*
	* SplashController
	* @namespace
  */

  PControllers.controller('SplashController', ['$scope', 'logger',

    function($scope, logger) {

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
 * UserProfileController
 * @namespace
 */

PControllers.controller('UserProfileController', ['$scope', 'logger', 'Feed', 'User',

	function($scope, logger, Feed, User) {

		/** Initialize a new User instance on the Controller scope **/
		$scope.User = User;

		$scope.actions = {
			friendship : '',
			demand : '',
			group : 'Invite'
		};

		/** Initialize a new Feed instance on the Controller $scope **/
		$scope.Feed = Feed;

		$scope.$watch(Feed);

	}

]);
