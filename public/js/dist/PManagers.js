/**
 * PManagers.ApplicationManager
 * Provides properties and methods to manage the state of the application
 * Only injected one per application, usually on the highest level scope
 */

  PManagers.factory('ApplicationManager', ['logger', '$state', 'UserContextManager',

		function(logger, $state, UserContextManager) {

    function ApplicationManager() {

			this.user = {
				active : ''
			};

    }

		ApplicationManager.prototype.authorize = function(event, toState) {
			var userContext = UserContextManager.getActiveUserContext();
			if (toState.metaData.requireSession && !userContext) {
					event.preventDefault();
					$state.go('login');
			}
		};

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
						alert('username and/or password is incorrect');
					});

			} else {
				$state.go('home');
			}

		};

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
 *   @dependency {Present} logger
 *   @dependency {Present} FeedLoader -- Loads feed data from the Api Client
 */

  PManagers.factory('FeedManager', ['$q', 'logger', 'UserContextManager', 'VideosApiClient', 'FeedConstructor',

    function($q, logger, UserContextManager, VideosApiClient, FeedConstructor) {

       function FeedManager() {
         //Set default properties for the FeedManager
         this.type = '';
         this.activeVideo = null;
         this.cursor = null;
         this.isLoading = false;
         this.errorMessage = '';
         this.videoCells = [];
       }

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


      /* FeedManager.loadMoreVideos
       * Refreshes video feed by mapping the Feed Type to the correct FeedLoader Method
       */

			FeedManager.prototype.loadVideos = function(feedType, requireUserContext) {

				var loadingFeed = $q.defer(),
					userContext = UserContextManager.getActiveUserContext(),
					cursor = this.cursor;

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

			FeedManager.prototype.createLike = function(targetVideo) {

			};

			FeedManager.prototype.createView = function(targetVideo) {

			};

       return new FeedManager();

		}

  ]);

/**
 * PManagers.NavbarManager
 * Provides properties and methods to handle the state of the Navbar
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

		NavbarManager.prototype.configure = function(toState) {

			var userContext = UserContextManager.getActiveUserContext();

			if (toState.metaData.navbarEnabled) this.isEnabled = true;
			else this.isEnabled = false;

			if (userContext) this.mode.loggedIn = true;
			else this.mode.loggedIn = false;

		};

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

		NavbarManager.prototype.showDropdown = function() {
			this.search.dropdownEnabled = true;
		};

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
 *   @dependency {Angular} $q
 *   @dependency {Utilities} logger
 *   @dependency {Present} UsersApiClient
 *   @dependency {Present} Session Manager
 */

PManagers.factory('ProfileManager', ['$q', 'logger', 'UsersApiClient', 'ProfileConstructor', 'UserContextManager',

	function($q, logger, UsersApiClient, ProfileConstructor, UserContextManager) {

		return {

			/**
			 * loadProfile
			 * Prepares the data from UserApiClient.show to be injected into the view PControllers
			 */

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
       * createNewUserContext
       * Sends a request to create a new user context and stores it to local storage on success
       *   @param <String> username -- username in which the user context will be created with
       *   @param <String> password -- password to validate the user
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
       * destroyActiveUserContext
       * Sends a request to delete the user context and clears userContext token from local storage
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
       * getActiveUserContext
       * Returns the userContext token if it exists. Returns false if the userContext token is invalid
       */

      getActiveUserContext : function() {

        var userContext = {
          token : localStorageService.get('token'),
          userId: localStorageService.get('userId')
        };

        if(userContext.token && userContext.userId) return userContext;
        else return undefined;

      }

    }

  }

]);
