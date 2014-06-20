/**
 * PControllers.discoverCtrl
 * View Controller for the discover state
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency {Present} FeedManager {PManagers}
 *   @dependency {Present} Feed <Object>
 */

  PControllers.controller('discoverCtrl', ['$scope', 'logger', 'Feed',

    function($scope, logger, Feed) {

      logger.debug(['PControllers.discoverCtrl -- initializing the Feed Manager', Feed]);

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

  PControllers.controller('loginCtrl', ['$scope',

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

/*
 * PControllers.loginCtrl
 * Application Manager handles all login functionality
 * 	@dependency $scope {Angular}
 */

	PControllers.controller('registerCtrl', ['$scope', 'UserModel', function($scope, UserModel) {

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

  PControllers.controller('splashCtrl', ['$scope', 'logger',

    function($scope, logger) {

      logger.debug(['PControllers.splashCtrl -- splash controller initialized']);

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

PControllers.controller('userCtrl', ['$scope', 'logger', 'Feed', 'User',

	function($scope, logger, Feed, User) {

		logger.debug('PControllers.homeCtrl -- initializing User Profile', User);
		logger.debug('PControllers.homeCtrl -- initializing the Feed Manager', Feed);

		//Initialize Profile
		$scope.User = User;
		$scope.Feed = Feed;

		$scope.$watch(Feed);

	}

]);
