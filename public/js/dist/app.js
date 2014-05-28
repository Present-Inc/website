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

  var PServices = angular.module('PServices', []);
  var PControllers = angular.module('PControllers', []);
  var PDirectives = angular.module('PDirectives', []);

 /**
  * Initialize Angular Application
  *   @dependency {Angular}   Angular      -- It's AngularJS
  *   @dependency {ui-router} ui-router    -- Handles application state and view loading
  *   @dependency {Present}   PControllers -- Module loader for all the applicaiton controllers
  *   @dependency {Present}   PServices    -- Module loader for all the application services
  *   @dependency {Present}   PDirectives  -- Module loader for all the application directives
  */

  var PresentWebApp = angular.module('PresentWebApp',
    ['ui.router', 'LocalStorageModule', 'PControllers', 'PServices', 'PDirectives']);

  /**
   * PresentWebApp State Configureation
   * Define routes with ui-router's $stateProvider
   *   @dependency {ui-router} $stateProvider
   *   @dependency {Angular}   $locationProvider
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
      * State data -- sets properties of the applicationManageer
      *   @property <Boolean> fullscreen  -- When true state is full screen (i.e doens't scroll)
      *   @property <Boolean> navigation  -- When true navigation bar is visible
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
    * PServices.ApiClientResponseHandler
    * Handles the raw API responses from the ApiClients and constructs new objects
    * which are injected into the view controllers
    *   @dependency {Present} logger -- configurable logger for development
    */

  PServices.factory('ApiClientResponseHandler', ['logger',

    function(logger) {

      return {

        /**
         * deserializeVideo
         * Deserialzes the raw api video response object
         *   @params <Object> VideosApiClientResponse -- Raw response object
         */

        deserializeVideo : function(ApiClientResponseObject) {

          function deserializedVideo(rawVideoData) {
            this._id = rawVideoData._id;
            this.title = rawVideoData.title;
            this.isAvailable = rawVideoData.isAvailable;
            this.media = {
             still: rawVideoData.mediaUrls.images['480px'],
             replayPlaylist: rawVideoData.mediaUrls.playlists.replay.master
          }

          //Check to see if the video is live
          if(!rawVideoData.creationTimeRange.endDate) {
             this.isLive = true;
             this.media.livePlaylist = rawVideoData.mediaUrls.playlists.live.master;
             this.timeAgo = 'Present';
           } else {
             this.isLive = false;
             this.timeAgo = '20 minutes ago';
           }

           this.counts = {
             likes    : rawVideoData.likes.count,
             comments : rawVideoData.comments.count,
             replies  : rawVideoData.replies.count
           };

           this.comments = [];

          }

          logger.debug(['PServices.ApiClientResponseHandler -- deserializing new video', ApiClientResponseObject]);

          return new deserializedVideo(ApiClientResponseObject);
        },

        /**
         * deserializeComments
         * Deserialzes the raw api comments response object
         *   @params <Object> ApiClientResponseObject -- Raw response object
         */

        deserializeComments : function(ApiClientResponseObject) {

          function deserializedComment(rawCommentsData) {
            this.body = rawCommentsData.body;
            this.sourceUser = {
              username: rawCommentsData.sourceUser.object.username,
              profilePicture: rawCommentsData.sourceUser.object.profile.picture.url
            };
            this.timeAgo = '5 min';
          }

          var comments = [];

          logger.debug(['PServices.ApiClientResponseHandler.deserializeComments -- raw comments object', ApiClientResponseObject]);

          for(var i=0; i < ApiClientResponseObject.results.length; i++) {
            comments.push(new deserializedComment(ApiClientResponseObject.results[i].object));
          }

          return comments;

        },

        /**
         * deserializeCreator
         * Deserialized the raw creator response object
         *   @params <Object> ApiClientResponseObject -- Raw response object
         */

        deserializeCreator : function(ApiClientResponseObject) {

          function deserializedCreator(rawCreatorData) {
            this._id = rawCreatorData._id;
            this.username = '@' + rawCreatorData.username;
            this.fullName = rawCreatorData.profile.fullName;

            //Set Full name to Display Name, if available
            if(rawCreatorData.profile.fullName) this.displayName = rawCreatorData.profile.fullName;
            else this.displayName = rawCreatorData.username;

            this.profilePicture = rawCreatorData.profile.picture.url;
          }

          return new deserializedCreator(ApiClientResponseObject);

        },

        /**
         * deserializeProfile
         * Deserialized the raw profile response object
         *   @params <Object> ApiClientResponseObject -- Raw response object
         */

        deserializeProfile : function(ApiClientResponseObject) {

          function deserializedProfile(rawUserData) {
            this._id = rawUserData._id;
            this.username = rawUserData.username;
            this.fullName = rawUserData.profile.fullName;
            this.profilePicture = rawUserData.profile.picture.url;
            this.description = rawUserData.profile.description;

            this.counts = {
              videos    : rawUserData.videos.count,
              views     : rawUserData.views.count,
              likes     : rawUserData.likes.count,
              followers : rawUserData.followers.count,
              friends   : rawUserData.friends.count
            }

            this.phoneNumber = rawUserData.phoneNumber ? rawUserData.phoneNumber : '';
            this.email = rawUserData.email ? rawUserData.email : '';
          }

          return new deserializedProfile(ApiClientResponseObject);

        }

      }
    }

  ]);

/*
* PServices.applicationManager
* Provides properties and methods to manage the state of the application
* Only injected one per application, usually on the highest level scope
*/

  PServices.factory('ApplicationManager', [function() {

    function ApplicationManager() {
      this.fullscreenEnabled = false;
      this.navigation = false;
      this.status = 'Application is currently running';
    };

    return new ApplicationManager();

  }]);


  /**
   * PServices.FeedLoader
   * Provides and interface to the VideosApiClint to the view Controllers
   * Parses and prepares the results provided from the VideoApiClient
   *    @dependency {Angular} $q
   *    @dependency {Utilities} logger
   *    @dependency {Present} VideoApiClient -- Provides an interface to the Present API
   *    @dependency {Present} ApiClientResponseHandler -- Parses the raw api responses
   *    @dependency {Present} UserContextManager -- Manages the user userContext data
   */

  PServices.factory('FeedLoader', ['$q', 'logger', 'VideosApiClient', 'ApiClientResponseHandler', 'UserContextManager',

     function($q, logger, VideosApiClient, ApiClientResponseHandler, UserContextManager) {

       return {

          /**
           * loadDiscoverFeed
           * Prepares the data from VideoApiClient.listBrandNew Videos to be injected into the view controllers
           *   @params <Number> cursor -- video cursor provided to the API
           */

          loadDiscoverFeed : function(cursor) {

            var loadingDiscoverFeed = $q.defer();
            var userContext = UserContextManager.getActiveUserContext();

            VideosApiClient.listBrandNewVideos(cursor, currentSession)
              .then(function(rawApiResponse) {

                var deserializedFeed = {
                  cursor: rawApiResponse.nextCursor,
                  videos: []
                };

                for(var i=0; i < rawApiResponse.results.length; i++) {
                  var deserializedVideo = ApiClientResponseHandler.deserializeVideo(rawApiResponse.results[i].object);
                  deserializedVideo.comments = ApiClientResponseHandler.deserializeComments(rawApiResponse.results[i].object.comments);
                  deserializedVideo.creator = ApiClientResponseHandler.deserializeCreator(rawApiResponse.results[i].object.creatorUser.object);
                  deserializedFeed.videos.push(deserializedVideo);
                };

                logger.debug(['PServices.FeedLoader -- loading the discover feed', deserializedFeed]);
                loadingDiscoverFeed.resolve(deserializedFeed);

              })
              .catch(function(rawApiResponse) {
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
            var currentSession = UserContextManager.getActiveUserContext();

            if(currentSession.token && currentSession.userId) {

              VideosApiClient.listHomeVideos(currentSession, cursor)
                .then(function(rawApiResponse) {

                  var deserializedFeed = {
                    cursor: rawApiResponse.nextCursor,
                    videos: []
                  };

                  for(var i=0; i < rawApiResponse.results.length; i++) {
                    var deserializedVideo = ApiClientResponseHandler.deserializeVideo(rawApiResponse.results[i].object);
                    deserializedVideo.comments = ApiClientResponseHandler.deserializeComments(rawApiResponse.results[i].object.comments);
                    deserializedVideo.creator = ApiClientResponseHandler.deserializeCreator(rawApiResponse.results[i].object.creatorUser.object);
                    deserializedFeed.videos.push(deserializedVideo);
                  };

                  logger.debug(['PServices.FeedLoader -- loading the home feed', deserializedFeed]);
                  loadingHomeFeed.resolve(deserializedFeed);

                })
                .catch(function(rawApiResponse) {
                  //TODO better error handling
                  loadingHomeFeed.resolve(false);
                });

            } else loadingHomeFeed.resolve(false);

            return loadingHomeFeed.promise;

          }
        }
      }

  ]);

/*
 * PServices.FeedManager
 * Provides properties and methods to manage the state of Video Feeds
 *   @dependency {Present} logger
 *   @dependency {Present} FeedLoader -- Loads feed data from the Api Client
 */

  PServices.factory('FeedManager', ['logger', 'FeedLoader',

    function(logger, FeedLoader) {

       function FeedManager() {
         //Set default properties for the FeedManager
         this.type = '';
         this.activeVideo = null;
         this.videos = [];
         this.cursor = -1;
         this.isLoading = false;
         this.errorMessage = '';
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
 * PServices.ProfileLoader
 * Provides and interface to the VideosApiClient to the view controllers
 * Parses and prepares the results provided from the UserApiClient
 *   @dependency {Angular} $q
 *   @dependency {Utilities} logger
 *   @dependency {Present} UsersApiClient
 *   @dependency {Present} Session Manager
 */

PServices.factory('ProfileLoader', ['$q', 'logger', 'UsersApiClient', 'ApiClientResponseHandler', 'UserContextManager',

   function($q, logger, UsersApiClient, ApiClientResponseHandler, UserContextManager) {

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
                .then(function(rawApiResponse) {
                  var deserializedProfile = {};
                  deserializedProfile = ApiClientResponseHandler.deserializeProfile(rawApiResponse.result.object);
                  logger.test(['PServices.ProfileLoader.loadOwnProfile -- loading the profile data', deserializedProfile]);
                  loadingProfile.resolve(deserializedProfile);
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
            .then(function(rawApiResponse) {
              var deserializedProfile = {};
              deserializedProfile = ApiClientResponseHandler.deserializeProfile(rawApiResponse.result.object);
              logger.debug(['PServices.ProfileLoader.loadOwnProfile -- loading the profile data', deserializedProfile]);
              loadingProfile.resolve(deserializedProfile);
            })
            .catch(function() {
              loadingProfile.resolve(false);
            });

          return loadingProfile.promise;

        }

     }
   }

]);


/**
 * PServices.UserContextManager
 *   @dependency {Angular} $q
 *   @dependency {Present} logger -- configurable logger for development
 *   @dependency {Present} UserContextApiClient -- handles present api requests for the user context resource
 */

PServices.factory('UserContextManager', ['$q', 'localStorageService', 'logger', 'UserContextApiClient',

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
* PServices.ApiClientConfig
* Provides configuration properties and methods to the ApiClient
*/

  PServices.factory('ApiConfig', [function(){
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
 * PServices.UserContextApiClient
 * Creates, updates, and destroys User Context Tokens
 *   @dependency {Angular} $http
 *   @dependency {Angular} $q
 *   @dependency {Present} logger -- Configurable log for development
 *   @dependency {Present} ApiConfig  -- Provides API configuration properties
 */

  PServices.factory('UserContextApiClient', ['$http', '$q', 'logger', 'ApiConfig',

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
   * PServices.UsersApiClient
   * Sends API requests directed at the Users API resource and handles the raw API response.
   *   @dependency {Angular} $http
   *   @dependency {Angular} $q
   *   @dependency {Present} logger -- Configurable log For development
   *   @dependency {Present} ApiConfig -- Provides API configuration properties
   *
   */

  PServices.factory('UsersApiClient', ['$http', '$q', 'logger', 'ApiConfig',

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
 * PServices.VideoApiClient
 * Sends API requests directed at the Videos API Resource and handles the raw API response
 *   @dependency {Angular} $http
 *   @dependency {Angular} $q
 *   @dependency {Present} logger -- Configurable log For development
 *   @dependency {Present} ApiConfig -- Provides API configuration properties
 *
 */

  PServices.factory('VideosApiClient', ['$http', '$q', 'logger', 'ApiConfig',

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
   * PUtilities.logger
   * Configurable logger for development
   */

  var debugModeEnabled = true;
  var testModeEnabled  = true;

  PServices.factory('logger', [function() {
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
      $scope.FeedManager.videos = discoverFeed.videos;

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
      $scope.FeedManager.videos = homeFeed.videos;


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
 */

  PControllers.controller('navCtrl', ['$scope', '$state', 'logger', 'UserContextManager',

    function($scope, $state, logger, UserContextManager) {

      logger.test(['PControllers.navCtrl -- navigation controller initialized']);

      $scope.Navbar = {
        mode: 'default'
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
        if(userContext) {
          $scope.Navbar.mode.default = false;
          $scope.Navbar.mode.loggedIn = true;

        } else {
          $scope.Navbar.mode.loggedIn = false;
          $scope.Navbar.mode.default = true;
        }
      }

    }

  ]);

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
 * PDirectives.viewContainer
 * Directive that controlles the main view container
 * I.E custom extension for ui-view
 */

  PDirectives.directive('viewContainer', function() {});
