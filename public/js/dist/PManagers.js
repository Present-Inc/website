/**
 * PManagers.ApplicationManager
 * Provides properties and methods to manage the state of the application
 * Only injected one per application, usually on the highest level scope
 * 	@dependency logger {PUtilities}
 * 	@dependency $state {Ui-Router}
 * 	@dependency UserContextManager {PManager}
 */

  PManagers.factory('ApplicationManager', ['logger', '$state', 'UserContextManager',

		function(logger, $state, UserContextManager) {

    function ApplicationManager() {

			this.user = {
				active : ''
			};

    }

		/**
		 * ApplicationManager.authorize
		 * Checks to make sure the user has access to the requested state
		 * 	@param event -- stateChangeStart event object which contains the preventDefault method
		 * 	@param toState -- the state the the application is transitioning into
		 */

		ApplicationManager.prototype.authorize = function(event, toState) {
			var userContext = UserContextManager.getActiveUserContext();
			if (toState.metaData.requireSession && !userContext) {
					event.preventDefault();
					$state.go('login');
			}
		};

		/**
		 * ApplicationManager.login
		 * Handles user context creation, sets the activeUser property and changes the state to home
		 * 	@param username <String> -- the user provided username
		 * 	@param password <String> -- the user provided password
		 */

		ApplicationManager.prototype.login = function(username, password) {

			var userContext = UserContextManager.getActiveUserContext();
					user = this.user;

			if (!userContext) {
				UserContextManager.createNewUserContext(username, password)
					.then(function (newUserContext) {
						user.active = newUserContext.profile;
						$state.go('home');
					})
					.catch(function () {
						//TODO: better error handling
						alert('username and/or password is incorrect');
					});

			} else {
				$state.go('home');
			}

		};

		/**
		 * ApplicationManager.logout
		 * Handles user context deletion and changes the state to splash
		 */

		ApplicationManager.prototype.logout = function() {
			UserContextManager.destroyActiveUserContext()
				.then(function() {
					$state.go('splash');
				});
		};

    return new ApplicationManager();

  	}

	]);

/*
 * PManagers.FeedManager
 * Provides properties and methods to manage the state of Video Feeds
 *   @dependency $q {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency UserContextManager {PManagers}
 *   @dependency VideosApiClient {PApiClient}
 *   @dependency FeedConstructor {PConstructors}
 */

  PManagers.factory('FeedManager', ['$q', 'logger', 'UserContextManager', 'VideosApiClient', 'FeedConstructor',

    function($q, logger, UserContextManager, VideosApiClient, FeedConstructor) {

       function FeedManager() {
         this.type = '';
         this.activeVideo = null;
         this.cursor = null;
         this.isLoading = false;
         this.errorMessage = '';
         this.videoCells = [];
       }

			/**
			 * Private Method: loadResourceMethod
			 * @param feedType <String> -- defines the feed type [i.e. 'discover']
			 * @returns resourceMethod <String> -- the resource method for the provided feed type
			 */

			var loadResourceMethod = function(feedType) {
				var resourceMethod = '';
				switch (feedType) {
					case 'discover':
						resourceMethod = 'listBrandNewVideos';
						break;
					case 'home':
						resourceMethod = 'listHomeVideos';
						break;
					default:
						resourceMethod = 'listBrandNewVideos';
						break;
				}
				return resourceMethod;
			};

      /**
			 * FeedManager.loadVideos
			 * 	@param feedType <String> -- defines the feed type [i.e. 'discover']
			 * 	@param requireUserContext <Boolean> -- determines if the feed requires a user context to access
			 * 	@returns promise <Object>
       */

			FeedManager.prototype.loadFeed = function(feedType, requireUserContext, cursor) {

				var loadingFeed = $q.defer(),
					userContext = UserContextManager.getActiveUserContext();

				var resourceMethod = loadResourceMethod(feedType);

				if (requireUserContext && !userContext) {
					loadingFeed.reject();
				} else {
					VideosApiClient[resourceMethod](cursor, userContext)
						.then(function (apiResponse) {
							var Feed = FeedConstructor.create(apiResponse);
							loadingFeed.resolve(Feed);
						})
						.catch(function () {
							loadingFeed.reject();
						});
				}

				return loadingFeed.promise;

			};

			/**
			 * FeedManager.createComment
			 * 	@param comment <String> -- the comment body
			 * 	@param targetVideo <String> -- _id for the target video
			 *  @returns promise <Object>
			 */

			FeedManager.prototype.createComment = function(comment, targetVideo) {

				var creatingComment = $q.defer();
						userContext = UserContextManager.getActiveUserContext();


				CommentsApiClient.create(comment, targetVideo, userContext)
					.then(function(apiResponse) {
						creatingComment.resolve();
					})
					.catch(function() {
						creatingComment.reject();
					});

				return creatingComment.promise;

			};

			/**
			 * FeedManager.createLike
			 * @param targetVideo -- _id for the target video
			 */

			FeedManager.prototype.createLike = function(targetVideo) {

			};

			/**
			 * FeedManager.createView
			 * @param targetVideo -- _id for the target video
			 */

			FeedManager.prototype.createView = function(targetVideo) {

			};

      return new FeedManager();

		}

  ]);

/**
 * PManagers.NavbarManager
 * Properties and methods to handle the state of the Navbar
 * 	@dependency $q {Angular}
 * 	@dependency $state {Ui-Router}
 * 	@dependency logger {PUtilities}
 * 	@dependency UserContextManager {PManagers}
 * 	@dependency VideosApiClient {PApiClient}
 * 	@dependency UsersApiClient {PApiClient}
 * 	@dependency VideoCellConstructor {PConstructors}
 * 	@dependency ProfileConstructor {PConstructors}
 */

PManagers.factory('NavbarManager', ['$q',
																		'$state',
																		'logger',
																		'UserContextManager',
																		'VideosApiClient',
																		'UsersApiClient',
																		'VideoCellConstructor',
																		'ProfileConstructor',

	function($q, $state, logger, UserContextManager, VideosApiClient, UsersApiClient, VideoCellConstructor, ProfileConstructor) {

		function NavbarManager(){

			this.mode = {
				loggedIn : false
			};

			this.isEnabled = false;

			this.hub = {
				username : '',
				profilePicture : ''
			};

			this.search = {
				dropdownEnabled : false,
				query : '',
				results  : {
					users  : [],
					videos : []
				}
			};

		}

		/**
		 * NavbarManager.configure
		 * Configuration method that is called on the ui router stateChangeStart event
		 *  @param toState <Object> Ui-Router object that defines the requested state
		 */

		NavbarManager.prototype.configure = function(toState) {

			var userContext = UserContextManager.getActiveUserContext();

			if (toState.metaData.navbarEnabled) this.isEnabled = true;
			else this.isEnabled = false;

			if (userContext) this.mode.loggedIn = true;
			else this.mode.loggedIn = false;

		};

		/**
		 * NavbarManager.loadHub
		 * Load the hub data if the user is still logged in when they enter the site
		 * Otherwise, the data is set on the _newUserLoggedIn event
		 */

		NavbarManager.prototype.loadHub = function() {
			var userContext = UserContextManager.getActiveUserContext();
			var hub = this.hub;
			if (userContext) {
				UsersApiClient.showMe(userContext)
					.then(function(apiResponse) {
						hub.username = apiResponse.result.object.username;
						hub.profilePicture = apiResponse.result.object.profile.picture.url;
					});
			}
		};

		/**
		 * NavbarManager.sendSearchQuery
		 * Sends Users and Videos search API requests in parallel and then updates the search result properties
		 * 	@param query <String> the search query string provided by the user
		 * 	@returns promise <Object>
		 */

		NavbarManager.prototype.sendSearchQuery = function(query) {

			var sendingVideosSearch = $q.defer(),
					sendingUsersSearch = $q.defer(),
					videosSearchResults = this.search.results.videos;
					usersSearchResults = this.search.results.users;
				  userContext = UserContextManager.getActiveUserContext(),
				  limit = 5;

			var promises  = [sendingVideosSearch, sendingUsersSearch];

			videosSearchResults.length = 0;
			usersSearchResults.length = 0;

			VideosApiClient.search(query, limit, userContext)
			 .then(function(apiResponse){
				 for (var i = 0;  i < apiResponse.results.length; i++) {
						var Video = VideoCellConstructor.Video.create(apiResponse.results[i].object);
						videosSearchResults.push(Video);
				 }
				 logger.debug(['PManagers.NavbarManager', videosSearchResults]);
				 sendingVideosSearch.resolve();
			 });

			UsersApiClient.search(query, limit, userContext)
			 .then(function(apiResponse) {
					for (var i=0; i < apiResponse.results.length; i++) {
						var Profile = ProfileConstructor.create(apiResponse.results[i].object);
						usersSearchResults.push(Profile);
					}
					logger.debug(['PManagers.NavbarManager', usersSearchResults]);
					sendingUsersSearch.resolve();
			 });

			 return $q.all(promises);

		};

		/**
		 * NavbarManager.showDropdown
		 * Sets the search.dropdownEnabled to true
		 */

		NavbarManager.prototype.showDropdown = function() {
			this.search.dropdownEnabled = true;
		};

		/**
		 * NavbarManager.hideDropdown
		 * Sets the search.dropdownEnabled to false
		 */

		NavbarManager.prototype.hideDropdown = function() {
			this.search.dropdownEnabled = false;
		};

		return new NavbarManager();

	}

]);
/**
 * PManagers.ProfileManager
 * Provides and interface to the VideosApiClient to the view controllers
 * Parses and prepares the results provided from the UserApiClient
 *   @dependency $q
 *   @dependency logger
 *   @dependency UsersApiClient
 *   @dependency ProfileConstructor
 *   @dependency UserContextManager
 */

PManagers.factory('ProfileManager', ['$q', 'logger', 'UsersApiClient', 'ProfileConstructor', 'UserContextManager',

	function($q, logger, UsersApiClient, ProfileConstructor, UserContextManager) {

		return {

			loadOwnProfile : function() {

				var loadingProfile = $q.defer();
				var userContext = UserContextManager.getActiveUserContext();

				if(userContext) {
					UsersApiClient.showMe(userContext)
						.then(function(apiResponse) {
							var profile = ProfileConstructor.create(apiResponse.result.object);
							loadingProfile.resolve(profile);
						})
						.catch(function() {
							loadingProfile.reject();
						});
				} else loadingProfile.resolve(false);

				return loadingProfile.promise;

			},

			loadUserProfile : function(username) {

				var loadingProfile = $q.defer();
				var userContext = UserContextManager.getActiveUserContext();

				UsersApiClient.show(username, userContext)
					.then(function(apiResponse) {
						var profile = ProfileConstructor.create(apiResponse.result.object);
						loadingProfile.resolve(profile);
					})
					.catch(function() {
						loadingProfile.reject();
					});

				return loadingProfile.promise;

			}

		}
	}

]);

/**
 * PManagers.UserContextManager
 *   @dependency {Angular} $q
 *   @dependency {Present} logger -- configurable logger for development
 *   @dependency {Present} UserContextApiClient -- handles present api requests for the user context resource
 */

PManagers.factory('UserContextManager', ['$q', 'localStorageService', 'logger', 'UserContextApiClient', 'ProfileConstructor',

  function($q, localStorageService, logger, UserContextApiClient, ProfileConstructor) {

    return {

      /**
       * UserContextManager.createNewUserContext
       * Sends a request to create a new user context and stores it to local storage on success
       *   @param username <String> -- username in which the user context will be created with
       *   @param password <String> -- password to validate the user
			 *   @returns promise <Object>
       */

      createNewUserContext : function(username, password) {

        var creatingNewUserContext = $q.defer();

        UserContextApiClient.create(username, password)
          .then(function(apiResponse) {
            var userContext = {
              token   : apiResponse.result.object.sessionToken,
              userId  : apiResponse.result.object.user.object._id,
							profile : ProfileConstructor.create(apiResponse.result.object.user.object)
            };
            localStorageService.clearAll();
            localStorageService.set('token', userContext.token);
            localStorageService.set('userId', userContext.userId);
						logger.debug(['PServices.UserContextManager.createNewUserContext', 'creating new user context', userContext]);
            creatingNewUserContext.resolve(userContext);
          })
          .catch(function(error) {
            logger.error(['PServices.UserContextManager.createNewUserContext', 'couldn\'t create user context']);
            creatingNewUserContext.reject(error);
          });

        return creatingNewUserContext.promise

      },

      /**
       * UserContextManager.destroyActiveUserContext
       * Sends a request to delete the user context and clears userContext token from local storage
			 * @returns promise <Object>
       */

      destroyActiveUserContext : function() {

        var destroyingUserContext = $q.defer();

        var userContext = {
          token  : localStorageService.get('token'),
          userId : localStorageService.get('userId')
        };

        if(userContext.token && userContext.userId) {

          UserContextApiClient.destroy(userContext)
            .then(function() {
              logger.debug(['PServices.UserContextManager.destroyActiveUserContext',
                            'User context deleted. User context data being deleted from local storage']);
              localStorageService.clearAll();
              destroyingUserContext.resolve();
            })
            .catch(function(error) {
              logger.error(['PServices.UserContextManager.destroyActiveUserContext',
                            'User context deletion failed. User context data being deleted from local storage']);
              localStorageService.clearAll();
              destroyingUserContext.resolve();
            });

        } else {
          logger.error(['PServices.UserContextManager.destroyActiveUserContext', 'no user context defined']);
          destroyingUserContext.reject('The user context is not defined');
        }

        return destroyingUserContext.promise;

      },

      /**
       * UserContextManager.getActiveUserContext
       * @returns userContext <Object> token if it exists
			 * @returns null <Null> if the userContext token is invalid
       */

      getActiveUserContext : function() {

        var userContext = {
          token : localStorageService.get('token'),
          userId: localStorageService.get('userId')
        };

        if(userContext.token && userContext.userId) return userContext;
        else return null;

      }

    }

  }

]);
