/*
 * Present Web App
 * V - 2.0.0
 * Present Inc.
 * Written by Daniel Lucas
 *
 * app.js
 * PresentWebApp
 */

  /**
   * Define Present Modules
   */

  var PControllers = angular.module('PControllers', []);
  var PDirectives = angular.module('PDirectives', []);
  var PConstructors = angular.module('PConstructors', []);
  var PLoaders = angular.module('PLoaders', []);
  var PManagers = angular.module('PManagers', []);
  var PUtilities = angular.module('PUtilities', []);
  var PApiClient = angular.module('PApiClient', []);

 /**
  * Initialize Angular Application
  *   @dependency {Angular}   Angular       -- It's AngularJS
  *   @dependency {UI-Router} UI-Router     -- Handles all client side routing using a state configuration
  *   @dependency {Present}   PConstructors -- Constructs new client objects from API response objects
  *   @dependency {Present}   PLoaders      -- Loads data which will be injected into the controllers
  *   @dependency {Present}   PManagers     -- Magers that control the state of the application components
  *   @dependency {Present}   PApiClient    -- Handles all requests and responses from the Present API
  *   @dependency {Present}   PControllers  -- Creates view models (MVVVM)
  *   @dependency {Present}   PDirectives   -- Defines the custom HTML elements
  *   @dependency {Present}   PUtilities    -- Utility functions
  */

  var PresentWebApp = angular.module('PresentWebApp',
    ['ui.router', 'LocalStorageModule',
     'PControllers', 'PDirectives', 'PConstructors', 'PLoaders', 'PManagers', 'PApiClient', 'PUtilities']);


  /**
   * PresentWebApp State Configureation
   * Define routes with ui-router's $stateProvider
   *   @dependency {ui-router} $stateProvider
   *   @dependency {Angular}   $locationProvider
   *   @dependency {LStorage}  $localStorageServiceProvider
   */

  PresentWebApp.config(['$stateProvider', '$locationProvider', 'localStorageServiceProvider',

    function($stateProvider, $locationProvider, localStorageServiceProvider) {

    /**
     * Enable client side routing by enabling the html5 history API
     * Removes the '#' from url's
     */

     $locationProvider.html5Mode(true);


     /**
      * Configure localStorage
      * Set the storage type to 'sessionStorage' and define a custom prefix
      */

      localStorageServiceProvider.setPrefix('present');

      localStorageServiceProvider.setStorageType('sessionStorage');

     /**
      * Configure Application states using ui router
      * State data -- sets properties of the ApplicationManager
      *   @property <Boolean> fullscreen          -- When true state is full screen (i.e doens't scroll)
      *   @property <Boolean> navigation          -- When true navigation bar is visible
      *   @property <Boolean> requiresUserContext -- When true user context is required to access state
      */


      $stateProvider

        .state('splash', {
          url: '/',
          templateUrl: 'views/splash',
          controller: 'splashCtrl',
          metaData: {
            fullscreenEnabled: true,
            navigationEnabled: false,
            requireSession: false
          }
        })

        .state('discover', {
          url: '/discover',
          templateUrl: 'views/discover',
          controller: 'discoverCtrl',
          metaData: {
            fullscreenEnabled: false,
            navigationEnabled: true,
            requireSession: false,
          },
          resolve: {
            discoverFeed : function(FeedLoader) {
                return FeedLoader.loadDiscoverFeed();
            }
          }
        })

        .state('login', {
          url: '/login',
          templateUrl: 'views/login',
          controller: 'loginCtrl',
          metaData: {
            fullscreenEnabled: true,
            navigationEnabled: false,
            requireSession: false,
          }
        })

        .state('home', {
          url: '/home',
          templateUrl: 'views/home',
          controller: 'homeCtrl',
          metaData: {
            fullscreenEnabled: false,
            navigationEnabled: true,
            requireSession: true
          },
          resolve: {
            profile  : function(ProfileLoader) {
              return ProfileLoader.loadOwnProfile();
            },
            homeFeed : function(FeedLoader) {
              return FeedLoader.loadHomeFeed();
            }
          }
        });

  }]);

/**
* PApiClient.ApiClientConfig
* Provides configuration properties and methods to the ApiClient
*/

  PApiClient.factory('ApiConfig', [function(){
   return {
     getAddress : function() {
       return 'https://api.present.tv'
     },
     getVideoQueryLimit: function() {
       return 5;
     }
   }
  }]);

/**
 * PApiClient.UserContextApiClient
 * Creates, updates, and destroys User Context Tokens
 *   @dependency {Angular} $http
 *   @dependency {Angular} $q
 *   @dependency {Present} logger -- Configurable log for development
 *   @dependency {Present} ApiConfig  -- Provides API configuration properties
 */

  PApiClient.factory('UserContextApiClient', ['$http', '$q', 'logger', 'ApiConfig',

   function($http, $q, logger, ApiConfig) {
     return {
       /* Sends a request to the create method on the UserContexts resource
        * Handles successs and error blocks then resolves the api response to the Session Manager
        * @param <String> username
        * @param <String> password
        */

        create : function(username, password) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/user_contexts/create';
          $http({
            method: 'POST',
            url: resourceUrl,
            data: {username: username, password: password}
          })
            .success(function(data, status, headers) {
              logger.debug(['PServices.UserContextApiClient.createNewUserContext', 'http success block', status, data]);
              sendingRequest.resolve(data);
            })
            .error(function(data, status, headers) {
              logger.error(['PServices.UserContextApiClient.createNewUserContext', 'http error block', status, data]);
              sendingRequest.reject(data);
            });

          return sendingRequest.promise;
        },

        destroy: function(userContext) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/user_contexts/destroy';
          if(userContext) {
              $http({
                method: 'POST',
                url: resourceUrl,
                headers: {
                  'Present-User-Context-Session-Token' : userContext.token,
                  'Present-User-Context-User-Id': userContext.userId
                }
              })
              .success(function(data, status, headers) {
                logger.debug(['PServices.UserContextApiClient.destroyUserContext -- http success block', status, headers]);
                sendingRequest.resolve(data);
              })
              .error(function(data, status, headers) {
                logger.error(['PServices.UserContextApiClient.destroyUserContext -- http error block', status, data]);
                sendingRequest.reject(data);
              })
          } else {
            var mockResponse = {
              status: 'ERROR',
              result: 'Please log in and try again',
              mock: true
            };
            logger.error(['PServices.UserContextApiClient.destroyUserContext', 'request not sent: invalid userContext']);
            sendingRequest.reject(mockResponse);
          }

          return sendingRequest.promise;
        }


     }
   }

  ]);

  /**
   * PApiClient.UsersApiClient
   * Sends API requests directed at the Users API resource and handles the raw API response.
   *   @dependency {Angular} $http
   *   @dependency {Angular} $q
   *   @dependency {Present} logger -- Configurable log For development
   *   @dependency {Present} ApiConfig -- Provides API configuration properties
   *
   */

  PApiClient.factory('UsersApiClient', ['$http', '$q', 'logger', 'ApiConfig',

    function($http, $q, logger, ApiConfig) {

      /**
       * Sends a request to the show users resource
       * Handles success and error blocks and then resolves the API response to somewhere...
       *   @param <String> username -- the user whose profile is being requested
       */
      return {

        show: function(username, userContext) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/users/show';

          if(username) {
            $http({
             method: 'GET',
             url: resourceUrl,
             params: {username: username},
             headers: {
               'Present-User-Context-Session-Token' : userContext ? userContext.token : null,
               'Present-User-Context-User-Id': userContext ? userContext.userId : null
             }
            })
             .success(function(data, status, headers) {
               logger.debug(['PServices.UsersApiClient.show -- http success block', status, data]);
               sendingRequest.resolve(data);
             })
             .error(function (data, status, headers) {
               logger.error(['PServices.UsersApiClsdient.show -- http error block', status, data]);
               sendingRequest.reject(data);
             })
          } else {
           var mockApiResponse = {status: "ERROR", mock: true};
           logger.error(['PServices.UsersApiClient.show', 'no valid user provided']);
           sendingRequest.reject(mockApiResponse);
          }
          return sendingRequest.promise;
       },

        showMe: function(userContext) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/users/show_me';

          if(userContext) {
            $http({
             method: 'GET',
             url: resourceUrl,
             headers: {
               'Present-User-Context-Session-Token' : userContext.token,
               'Present-User-Context-User-Id': userContext.userId
             }
            })
              .success(function(data, status, headers) {
                logger.debug(['PServices.UsersApiClient.showMe -- http success block', status, data]);
                sendingRequest.resolve(data);
              })
              .error(function (data, status, headers) {
                logger.error(['PServices.UsersApiClient.showMe -- http error block', status, data]);
                sendingRequest.reject(data);
              });
          } else {
            var mockApiResponse = {status: 'ERROR', mock: true};
            logger.error(['PServices.UsersApiClient.show', 'no valid user context']);
            sendingRequest.reject(mockApiResponse);
          }
          return sendingRequest.promise;
        }

      }

    }

  ]);

/**
 * PApiClient.VideoApiClient
 * Sends API requests directed at the Videos API Resource and handles the raw API response
 *   @dependency {Angular} $http
 *   @dependency {Angular} $q
 *   @dependency {Present} logger -- Configurable log For development
 *   @dependency {Present} ApiConfig -- Provides API configuration properties
 *
 */

  PApiClient.factory('VideosApiClient', ['$http', '$q', 'logger', 'ApiConfig',

    function($http, $q, logger, ApiConfig) {

      return {

        /**
         * Sends a request to the list_brand_new_videos videos resouce
         * Handles success and error blocks then resolves the api response to the FeedLoader
         *   @param <Number> cursor -- active video cursor
         *   @param <Object> userContext -- user userContext object for methods that require user context or respond with subjective meta data
         *
         */

        listBrandNewVideos: function(cursor, userContext) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/videos/list_brand_new_videos';
          $http({
            method: 'GET',
            url: resourceUrl,
            params: {limit: ApiConfig.getVideoQueryLimit(), cursor: cursor ? cursor : null},
            headers: {
              'Present-User-Context-Session-Token' : userContext ? userContext.token : null,
              'Present-User-Context-User-Id': userContext ? userContext.userId : null
            }
          })
            .success(function(data, status, headers) {
                logger.debug(['PServices.VideosApiClient.listBrandNewVideos -- http success block', status, data]);
                sendingRequest.resolve(data);
            })
            .error(function(data, status, headers) {
                logger.error(['PServices.VideosApiClient.listBrandNewVideos -- http error block', status, data]);
                sendingRequest.reject(data);
            });

          return sendingRequest.promise;
        },

        /**
         * Sends a request to the list_home_videos videos resouce
         * Handles success and error blocks then resolves the api response to the FeedLoader
         */

        listHomeVideos: function(cursor, userContext) {

          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/videos/list_home_videos';

          if(userContext) {
            $http({
              method: 'GET',
              url: resourceUrl,
              params: {limit: ApiConfig.getVideoQueryLimit(), cursor: cursor ? cursor : null},
              headers: {
                'Present-User-Context-Session-Token' : userContext.token,
                'Present-User-Context-User-Id': userContext.userId
              }

            })
            .success(function(data, status, headers) {
                logger.debug(['PServices.VideosApiClient.listHomeVideos -- http success block', status, data]);
                sendingRequest.resolve(data);
            })
            .error(function(data, status, headers) {
                logger.error(['PServices.VideosApiClient.listHomeVideos -- http error block', status, data]);
                sendingRequest.reject(data);
            });
          } else {
            var mockResponse = {
              status: 'ERROR',
              result: 'Please log in and try again',
              mock: true
            };
            logger.error(['PServices.VideosApiClient.listHomeVideos', 'invalid user context']);
            sendingRequest.reject(mockResponse);
          }

          return sendingRequest.promise;
        }

      }
    }

  ]);

/**
 * PConstructors.FeedConstructor
 * Constructs the Feed, which is composed of Video Cells
 *   @dependency {Present} VideoCellConstructor
 */

  PConstructors.factory('FeedConstructor', ['VideoCellConstructor',

    function(VideoCellConstructor) {
      return {
        create: function(apiResponse) {

          var Feed = {
            cursor: apiResponse.nextCursor,
            videoCells: []
          }

          for(var i=0, length=apiResponse.results.length; i < length; i++) {
            var VideoCell = {
              video    : VideoCellConstructor.Video.create(apiResponse.results[i].object),
              comments : VideoCellConstructor.Comments.create(apiResponse.results[i].object.comments),
              likes    : VideoCellConstructor.Likes.create(apiResponse.results[i].object.likes),
              replies  : VideoCellConstructor.Replies.create(apiResponse.results[i].object.replies)
            };
            Feed.videoCells.push(VideoCell);
          }

          return Feed;

        }
      }
    }

  ]);

/**
 * PConstructors.ProfileConstructor
 * Constructs a new Profile Object
 */

  PConstructors.factory('ProfileConstructor', function() {
    return {
     create : function(apiProfileObject) {

       function Profile(apiProfileObject) {
         this._id = apiProfileObject._id;
         this.username = apiProfileObject.username;
         this.fullName = apiProfileObject.profile.fullName;
         this.profilePicture = apiProfileObject.profile.picture.url;
         this.description = apiProfileObject.profile.description;

         this.counts = {
           videos: apiProfileObject.videos.count,
           views: apiProfileObject.views.count,
           likes: apiProfileObject.likes.count,
           followers: apiProfileObject.followers.count,
           friends: apiProfileObject.friends.count
         }

         this.phoneNumber = apiProfileObject.phoneNumber ? apiProfileObject.phoneNumber : null;
         this.email = apiProfileObject.email ? apiProfileObject.email : null;
       }
       return new Profile(apiProfileObject);
     }
    }
 });

/**
 * PConstructors.VideoCellConstructor
 *  Constructs the individial components of a video cell
 */

 PConstructors.factory('VideoCellConstructor', [function() {

   return {

    Video : {
      create : function(apiVideoObject) {

        function Video(apiVideoObject) {
          this._id = apiVideoObject._id;
          this.title = apiVideoObject.title;
          this.isAvailable = apiVideoObject.isAvailable;
          this.media = {
            still          : apiVideoObject.mediaUrls.images['480px'] || null,
            replayPlaylist : apiVideoObject.mediaUrls.playlists.replay.master || null
          };

          //Check to see if the video is live
          if(!apiVideoObject.creationTimeRange.endDate) {
            this.isLive = true;
            this.media.livePlaylist = apiVideoObject.mediaUrls.playlists.live.master;
            this.timeAgo = "Present"
          } else {
            this.isLive = false;
            //TODO: implement momentsjs to generate formatted time from apiVideoObject.creationTimeRange.endDate
            this.timeAgo = '20 minutes ago'
          }

          this.location = {
            name: null,
            lat: null,
            long: null,
          };

          this.creator = {
            _id             : apiVideoObject.creatorUser.object._id,
            profilePicture  : apiVideoObject.creatorUser.object.profile.picture.url,
						displayName     : '',
						altName					: ''
					};

					//Determine the display name(s)
					if(apiVideoObject.creatorUser.object.profile.fullName) {
						this.creator.displayName = apiVideoObject.creatorUser.object.profile.fullName;
						this.creator.altName = apiVideoObject.creatorUser.object.username;
					} else {
						this.creator.displayName = apiVideoObject.creatorUser.object.username;
						this.creator.altName = null;
					}

          this.counts = {
            comments : apiVideoObject.comments.count,
            likes    : apiVideoObject.likes.count,
            replies  : apiVideoObject.replies.count
          };

        }

        return new Video(apiVideoObject);

      }
     },

     Comments: {
      create: function(apiCommentsObject) {

       function Comment(apiCommentObject) {
         this.body = apiCommentObject.body,
         this.sourceUser = {
           username: apiCommentObject.sourceUser.object.username,
           profilePicture: apiCommentObject.sourceUser.object.profile.picture
         }
         //TODO: implement momentsjs to generate formatted time from apiCommentObject
         this.timeAgo = '5 min'
       }

       var comments = [];

       for(var i=0, length=apiCommentsObject.results.length; i < length; i++) {
           var newComment = new Comment(apiCommentsObject.results[i].object);
           comments.push(newComment);
       }

       return comments;

       }
     },

     Replies: {
      create: function(apiRepliesObject) {

        function Reply(apiRepliesObject) {
           this.count = apiRepliesObject.count
        };

        return new Reply(apiRepliesObject);

      }
     },

     Likes: {
      create: function(apiLikesObject) {

       function Likes(apiLikesObject) {
          this.count = apiLikesObject.count
       }

       return new Likes(apiLikesObject);

      }
     }

   }

 }]);

  /**
   * PLoaders.FeedLoader
   * Provides and interface to the VideosApiClint to the view Controllers
   * Parses and prepares the results provided from the VideoApiClient
   *    @dependency {Angular} $q
   *    @dependency {Utilities} logger
   *    @dependency {Present} VideoApiClient -- Provides an interface to the Present API
   *    @dependency {Present} FeedConstructor -- Constructs the new feed object
   *    @dependency {Present} UserContextManager -- Manages the user userContext data
   */

  PLoaders.factory('FeedLoader', ['$q', 'logger', 'VideosApiClient', 'FeedConstructor', 'UserContextManager',

     function($q, logger, VideosApiClient, FeedConstructor, UserContextManager) {

       return {

          /**
           * loadDiscoverFeed
           * Prepares the data from VideoApiClient.listBrandNew Videos to be injected into the view controllers
           *   @params <Number> cursor -- video cursor provided to the API
           */

          loadDiscoverFeed : function(cursor) {

            var loadingDiscoverFeed = $q.defer();
            var userContext = UserContextManager.getActiveUserContext();

            VideosApiClient.listBrandNewVideos(cursor, userContext)
              .then(function(apiResponse) {
                var Feed = FeedConstructor.create(apiResponse);
                loadingDiscoverFeed.resolve(Feed);
              })
              .catch(function(apiResponse) {
                //TODO better error handling
                loadingDiscoverFeed.resolve(false)
              });

            return loadingDiscoverFeed.promise;

          },

          /**
           * loadHomeFeed
           * Prepares the data from UsersApiClient.listHomeVideos
           *   @params <Number> cursor -- video cursor provided to the API
           */

          loadHomeFeed : function(cursor) {

            var loadingHomeFeed = $q.defer();
            var userContext = UserContextManager.getActiveUserContext();

            if(userContext.token && userContext.userId) {

              VideosApiClient.listHomeVideos(cursor, userContext)
                .then(function(apiResponse) {
                  var Feed = FeedConstructor.create(apiResponse);
                  loadingHomeFeed.resolve(Feed);
                })
                .catch(function(rawApiResponse) {
                  //TODO better error handling
                  loadingHomeFeed.resolve(false);
                });

            } else {
                loadingHomeFeed.resolve(false);
            }

            return loadingHomeFeed.promise;

          }
        }
      }

  ]);

/**
 * PLoaders.ProfileLoader
 * Provides and interface to the VideosApiClient to the view controllers
 * Parses and prepares the results provided from the UserApiClient
 *   @dependency {Angular} $q
 *   @dependency {Utilities} logger
 *   @dependency {Present} UsersApiClient
 *   @dependency {Present} Session Manager
 */

PLoaders.factory('ProfileLoader', ['$q', 'logger', 'UsersApiClient', 'ProfileConstructor', 'UserContextManager',

   function($q, logger, UsersApiClient, ProfileConstructor, UserContextManager) {

     return {

       /**
        * loadProfile
        * Prepares the data from UserApiClient.show to be injected into the view controllers
        */

        loadOwnProfile : function() {

          var loadingProfile = $q.defer();
          var userContext = UserContextManager.getActiveUserContext();

          if(userContext.token && userContext.userId) {
              UsersApiClient.showMe(userContext)
                .then(function(apiResponse) {
                  var profile = ProfileConstructor.create(apiResponse.result.object);
                  loadingProfile.resolve(profile);
                })
                .catch(function() {
                  loadingProfile.resolve(false);
                });
          }

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
              //TODO:
              loadingProfile.resolve(false);
            });

          return loadingProfile.promise;

        }

     }
   }

]);

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

/**
 * PUtilities.logger
 * Configurable logger for development
 */

  var debugModeEnabled = true;
  var testModeEnabled  = true;

  PUtilities.factory('logger', [function() {
    return {
      debug: function(content) {
        if(debugModeEnabled) {
          console.log(content);
        }
      },
      test: function(content) {
        console.log(content);
      },
      error: function(content) {
        console.warn(content);
      }
    }
  }]);

/**
 * PControllers.discoverCtrl
 * View Controller for the discover state
 *   @dependency {Angular} $scope
 *   @dependency {Present} logger   -- Configurable log for development
 *   @dependency {Present} FeedManager -- Provides properties and methods to manage the video feed
 *   @dependency {Present} discoverFeed -- Data resolved from FeedLoader.loadDiscoverFeed
 */

  PControllers.controller('discoverCtrl', ['$scope', 'logger', 'FeedManager', 'discoverFeed',

    function($scope, logger, FeedManager, discoverFeed) {
      //Check whether resolved dependencies resolved successfully
      if(!discoverFeed) alert('Sorry, it appears that the application has lost connection, please try again');

      logger.debug(['PControllers.discoverCtrl -- initializing the Feed Manager', discoverFeed]);

      //Initialize Feed Manager on the controller scope
      $scope.FeedManager = FeedManager;
      $scope.FeedManager.type = 'discover';
      $scope.FeedManager.cursor = discoverFeed.cursor;
      $scope.FeedManager.videoCells = discoverFeed.videoCells;

      //Refreshes the discoverFeed
      $scope.refreshFeed = function() {
        $scope.FeedManager.loadMoreVideos($scope.FeedManager.type, $scope.FeedManager.cursor)
          .then(function(newDiscoverFeed) {
            $scope.FeedManager.videos = newDiscoverFeed.videos;
            $scope.FeedManager.cursor = newDiscoverFeed.cursor;
          });
      }

    }

  ]);

/*
 * PControllers.homeCrtl
 * View Controller for the home state
 *   @dependency {Angular} $scope
 *   @dependency {Utilities} logger -- Configurable logger for development
 *   @dependency {Present} FeedManager -- Provides properties and methods to manage the video feed
 *   @dependency {Present} discoverFeed -- Data resolved from FeedLoader.loadDiscoverFeed
 */

  PControllers.controller('homeCtrl', ['$scope', 'logger', 'FeedManager', 'homeFeed', 'profile',

    function($scope, logger, FeedManager, homeFeed, profile) {

      //Check whether resolved dedpendencies resolved successfully
      if(!homeFeed) alert('the home feed could not be loaded');

      logger.debug(['PControllers.homeCtrl -- initializing Profile Data', profile]);
      logger.debug(['PControllers.homeCtrl -- initializing the Feed Manager', homeFeed]);

      //Initialize Profile
      $scope.Profile = profile;

      //Initialize Feed Manager on the controller scope
      $scope.FeedManager = FeedManager;
      $scope.FeedManager.type = 'home';
      $scope.FeedManager.cursor = homeFeed.cursor;
      $scope.FeedManager.videoCells = homeFeed.videoCells;

      $scope.refreshFeed = function() {
        $scope.FeedManager.loadMoreVideos($scope.FeedManager.type, $scope.FeedManager.cursor)
          .then(function(newHomeFeed) {
            $scope.FeedManager.videos = newHomeFeed.videos;
            $scope.FeedManager.cursor = newHomeFeed.cursor;
          })
      }


    }

  ]);

/*
 * PControllers.loginCtrl
 *   @dependency {Angular} $scope
 *   @dependency {ui-router} $state
 *   @dependency {Utilities} logger -- configurable logger for development
 *   @dependency {Present} UserContextManager
 */

  PControllers.controller('loginCtrl', ['$scope', '$state', 'logger', 'UserContextManager',

    function($scope, $state, logger, UserContextManager) {

      $scope.username = '';
      $scope.password = '';

      $scope.login = function() {
        UserContextManager.createNewUserContext($scope.username, $scope.password)
          .then(function(newUserContext) {
              logger.debug(['PControllers.loginCtrl -- userContext created', newUserContext]);
              $state.go('home');
          })
          .catch(function() {
            alert('username and/or password is incorrect');
          });
      }

    }

  ]);

/**
 * PControllers.mainCtrl
 * Highest level controller PresentWebApp
 * Acts as a buffer to the rootScope
 *   @dependency {Angular} $scope
 *   @dependency {ui-router} $state
 *   @dependency {Utilities} logger
 *   @dependency {Present} ApplicationManager -- Provides properties and methods to manage the application state
 *   @dependency {Present} UserContextManager -- Provides methods to manage userContexts
 */

  PControllers.controller('mainCtrl', ['$scope', '$location', 'logger', 'ApplicationManager', 'UserContextManager',

    function($scope, $location, logger, ApplicationManager, UserContextManager) {

      $scope.ApplicationManager = ApplicationManager;

      $scope.$on('$stateChangeStart', function(event, toState, fromState) {

        //Check to see if requested state requires a valid userContext
        if(toState.metaData.requireSession) {
          var userContext = UserContextManager.getActiveUserContext();
          if(!userContext) {
            logger.debug(['PControllers.mainCtrl on $stateChangeStart -- userContext is invalid', userContext]);
            $location.path('/login');
          }
          else logger.debug(['PControllers.mainCtrl on $stateChangeStart -- userContext is valid', userContext]);
        }

      });

      $scope.$on('$stateChangeSuccess', function(event, toState, fromState) {

        //Apply state data to the Application Manager on the stateChangeStart event
        if(toState.metaData.fullscreenEnabled) $scope.ApplicationManager.fullscreenEnabled = true;
        else $scope.ApplicationManager.fullscreenEnabled = false;

        if(toState.metaData.navigationEnabled) $scope.ApplicationManager.navigationEnabled = true;
        else $scope.ApplicationManager.navigationEnabled = false;

      });

    }

 ]);

/**
 * PControllers.navCtrl
 * Controller for the navigation bar
 *   @dependency {Angular} $scope
 *   @dependency {ui-router} $state
 *   @dependency {Utilities} logger
 *   @dependency {Present} UserContextManager -- Provides methods for userContext management


  PControllers.controller('navCtrl', ['$scope', '$state', 'logger', 'UserContextManager',

    function($scope, $state, logger, UserContextManager) {

      logger.test(['PControllers.navCtrl -- navigation controller initialized']);

      $scope.Navbar = {
        mode: {
					loggedIn: false
				}
      };

      $scope.$on('$stateChangeSuccess', function(event, toState, fromState) {
        $scope.setMode();
      });

      $scope.logout = function() {
        UserContextManager.destroyActiveUserContext()
          .then(function() {
              $state.go('splash');
          });
      };

      $scope.setMode = function() {
        var userContext = UserContextManager.getActiveUserContext();
        if (userContext) $scope.Navbar.mode.loggedIn = true;
        else $scope.Navbar.mode.loggedIn = false;
      }

    }

  ]);
*/
 /*
  * PControllers.splashController
  * Controller for splashing state
  *   @dependency {Angular} $scope
  *   @dependency {Utilities} logger
  *   @dependency {Present} ApplicationManager
  */

  PControllers.controller('splashCtrl', ['$scope', 'logger', 'ApplicationManager',

    function($scope, logger, ApplicationManager) {

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
 * PDirectives.feed
 * HTML Directive for the video feed
 */

  PDirectives.directive('feed', [function() {
    return {
      restrict: 'EA',
      templateUrl: 'views/partials/feed'
    }
  }]);

/**
 * PDirectives.navbarDirective
 */


	PDirectives.directive('navbar', [function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/partials/navbar',
			replace: true,
			controller: function($scope, $state, logger, UserContextManager) {
				logger.test(['PControllers.navCtrl -- navigation controller initialized']);

				$scope.Navbar = {
					mode: {
						loggedIn: false
					}
				};

				$scope.$on('$stateChangeSuccess', function(event, toState, fromState) {
					$scope.setMode();
				});

				$scope.logout = function() {
					UserContextManager.destroyActiveUserContext()
						.then(function() {
							$state.go('splash');
						});
				};

				$scope.setMode = function() {
					var userContext = UserContextManager.getActiveUserContext();
					if (userContext) $scope.Navbar.mode.loggedIn = true;
					else $scope.Navbar.mode.loggedIn = false;
				}
			},
			link: function(scope, element, attrs) {

			}
		}

	}]);
/**
 * PDirectives.viewContainer
 * Directive that controlles the main view container
 * I.E custom extension for ui-view
 */

  PDirectives.directive('viewContainer', function() {});
