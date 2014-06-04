/*
* PManagers.applicationManager
* Provides properties and methods to manage the state of the application
* Only injected one per application, usually on the highest level scope
*/

  PManagers.factory('ApplicationManager', [function() {

    function ApplicationManager() {
      this.fullscreenEnabled = false;
      this.navigation = false;
      this.status = 'Application is currently running';
    };

    return new ApplicationManager();

  }]);

/*
 * PManagers.FeedManager
 * Provides properties and methods to manage the state of Video Feeds
 *   @dependency {Present} logger
 *   @dependency {Present} FeedLoader -- Loads feed data from the Api Client
 */

  PManagers.factory('FeedManager', ['logger', 'FeedLoader',

    function(logger, FeedLoader) {

       function FeedManager() {
         //Set default properties for the FeedManager
         this.type = '';
         this.activeVideo = null;
         this.cursor = -1;
         this.isLoading = false;
         this.errorMessage = '';
         this.videoCells = [];
       };

      /* FeedManager.loadMoreVideos
       * Refreshes video feed by mapping the Feed Type to the correct FeedLoader Method
       */

       FeedManager.prototype.loadMoreVideos = function(feedType, cursor, username) {

         this.videos = [];
         this.isLoading = true;

         logger.test(['PServices.FeedManager -- refreshing feed' , feedType, cursor, username]);

         if(feedType == 'discover') return FeedLoader.loadDiscoverFeed(cursor);

         else if(feedType == 'home') return FeedLoader.loadHomeFeed(cursor, username);

         else if(feedType == 'profile') return FeedLoader.loadProfileFeed(cursor, username);

         else  logger.error('PServices.FeedManager -- no feed type provided');

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

			this.searchResults = {
				users : [],
				videos : []
			};

		}

		NavbarManager.prototype.configure = function(toState) {
			var userContext = UserContextManager.getActiveUserContext();

			if(toState.metaData.navbarEnabled) this.isEnabled = true;
			else this.isEnabled = false;

			if(userContext) this.mode.loggedIn = true;
			else this.mode.loggedIn = false;

		};

		NavbarManager.prototype.logout = function() {
			UserContextManager.destroyActiveUserContext()
				.then(function() {
					$state.go('splash');
				});
		};

		NavbarManager.prototype.showDropdown = function() {
			this.search.dropdownEnabled = true;
		};

		NavbarManager.prototype.hideDropdown = function() {
			this.search.dropdownEnabled = false;
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
				 for(var i = 0;  i < apiResponse.results.length; i++) {
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

		return new NavbarManager();

	}

]);
/**
 * PManagers.UserContextManager
 *   @dependency {Angular} $q
 *   @dependency {Present} logger -- configurable logger for development
 *   @dependency {Present} UserContextApiClient -- handles present api requests for the user context resource
 */

PManagers.factory('UserContextManager', ['$q', 'localStorageService', 'logger', 'UserContextApiClient',

  function($q, localStorageService, logger, UserContextApiClient) {

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
          .then(function(rawApiResponse) {
            var userContext = {
              token  : rawApiResponse.result.object.sessionToken,
              userId : rawApiResponse.result.object.user.object._id
            };
            logger.debug(['PServices.UserContextManager.createNewUserContext', 'creating new user context', userContext]);
            localStorageService.clearAll();
            localStorageService.set('token', userContext.token);
            localStorageService.set('userId', userContext.userId);
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
