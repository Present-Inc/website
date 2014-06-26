
/**
 * EditProfileController
 * @namespace
 */

PControllers.controller('EditProfileController', ['$scope', 'FeedbackModel', 'User',

	function($scope, FeedbackModel, User) {

		//TODO: finish this.....

		/** Initializes a new User instance on the Controller $scope **/
		$scope.User = User;

		$scope.Input = {
			full_name: User.profile.fullName,
			description: User.profile.description,
			gender: User.profile.gender,
			location: User.profile.location,
			website: User.profile.website,
			email: User.profile.email,
			phone_number: User.profile.phoneNumber
		};

		$scope.Feedback = FeedbackModel.create();

		$scope.genders = ['Male', 'Female'];


		/** Validation **/


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
 * RegisterController
 * @namespace
 */

	PControllers.controller('RegisterController', ['$scope', '$stateParams', 'MessageModel', 'UserModel',

			function($scope, $stateParams, MessageModel, UserModel) {

				/** Initialize the UserModel on the Controller $scope **/
				$scope.UserModel = UserModel;


				/** User Input **/

				$scope.input = {
					username: '',
					password: '',
					confirmPassword: '',
					email: '',
					invite_id: $stateParams.invite_id,
					user_id: $stateParams.invite_user_id
				};


				$scope.messages = {

					success: MessageModel.create('alert', 'primary', {
						title: 'Your account has been successfully created',
						options : [
							{
							 label: 'Download',
							 style: 'primary',
							 link: 'https://itunes.apple.com/us/app/present-share-the-present/id813743986?mt=8'
							}
						]
					}, true),

					error: MessageModel.create('panel', 'error')

				};

				$scope.accountRegistered = false;


				function validateInput(input, error, msg) {
					if(input.$dirty && input.$error[error]) {
						$scope.messages.success.clear();
						$scope.messages[input.$name + '_' + error] = MessageModel.create('panel', 'error', {body: msg}, true);
					} else if($scope.messages[input.$name + '_' + error] && !input.$error[error]) {
						$scope.messages[input.$name + '_' + error].clear();
					}
				}



				/** Watch form fields, passing each through validation when they are modified **/

				$scope.$watchCollection('form.username', function(username) {
					validateInput(username, 'required', 'Username can not be blank');
					validateInput(username, 'maxlength', 'Username must be between 1 - 20 characters');
				});

				$scope.$watchCollection('form.password', function(password) {
					validateInput(password, 'required', 'Password can not be blank');
				});

				$scope.$watchCollection('form.confirmPassword', function(confirmPassword) {
					validateInput(confirmPassword, 'matchPasswords', 'Passwords do not match');
				});

				$scope.$watchCollection('form.email', function(email) {
					validateInput(email, 'required', 'Email can not be blank');
					validateInput(email, 'email', 'Email is invalid');
				});




		}

	]);

/*
 * LoginController
 * @namespace
 */

PControllers.controller('ResetPasswordController', ['$scope', '$stateParams', 'UserModel', 'MessageModel',

	function($scope, $stateParams, UserModel, MessageModel) {


		$scope.UserModel = UserModel;

		$scope.messages = {
			success: MessageModel.create('panel'),
			error: MessageModel.create('panel')
		};

		/** User Input **/

		$scope.input = {
			password: '',
			confirmPassword: '',
			user_id: $stateParams.user_id,
			password_reset_token: $stateParams.password_reset_token
		};



	}
]);

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
