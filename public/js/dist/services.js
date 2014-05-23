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
   *    @dependency {Present} SessionManager -- Manages the user session data
   */

  PServices.factory('FeedLoader', ['$q', 'logger', 'VideosApiClient', 'ApiClientResponseHandler', 'SessionManager',

     function($q, logger, VideosApiClient, ApiClientResponseHandler, SessionManager) {

       return {

          /**
           * loadDiscoverFeed
           * Prepares the data from VideoApiClient.listBrandNew Videos to be injected into the view controllers
           *   @params <Number> cursor -- video cursor provided to the API
           */

          loadDiscoverFeed : function(cursor) {

            var loadingDiscoverFeed = $q.defer();
            var currentSession = SessionManager.getCurrentSession();

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
            var currentSession = SessionManager.getCurrentSession();

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

PServices.factory('ProfileLoader', ['$q', 'logger', 'UsersApiClient', 'ApiClientResponseHandler', 'SessionManager',

   function($q, logger, UsersApiClient, ApiClientResponseHandler, SessionManager) {

     return {

       /**
        * loadProfile
        * Prepares the data from UserApiClient.show to be injected into the view controllers
        */

        loadOwnProfile : function() {

          var loadingProfile = $q.defer();
          var session = SessionManager.getCurrentSession();

          if(session.token && session.userId) {
              UsersApiClient.showMe(session)
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
          var session = SessionManager.getCurrentSession();

          UsersApiClient.show(username, session)
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
 * PServices.SessionManager
 *   @dependency {Angular} $q
 *   @dependency {Present} logger -- configurable logger for development
 *   @dependency {Present} UserContextApiClient -- interacts directly with the User Contexts Api Client
 */

PServices.factory('SessionManager', ['$q', 'localStorageService', 'logger', 'UserContextApiClient',

  function($q, localStorageService, logger, UserContextApiClient) {

    return {

      /**
       * createNewSession
       * Sends a request to create a new user context and stores it to local storage on success
       *   @param <String> username -- username in which the user context will be created with
       *   @param <String> password -- password to validate the user
       */

      createNewSession : function(username, password) {

        var creatingSession = $q.defer();

        UserContextApiClient.createNewUserContext(username, password)
          .then(function(rawApiResponse) {
            logger.debug(['PServices.SessionManager.creatingNew Session -- creating new session token'], rawApiResponse);
            localStorageService.set('sessionToken', rawApiResponse.result.object.sessionToken);
            localStorageService.set('userId', rawApiResponse.result.object.user.object._id);
            creatingSession.resolve();
          })
          .catch(function() {
            logger.error(['PServices.SessionManager.creatingNewSession -- couldn\'t create session token'])
            creatingSession.reject();
          });

        return creatingSession.promise

      },

      /**
       * destroyCurrentSession
       * Sends a request to delete the user context and clears session token from local storage
       */

      destroyCurrentSession : function() {

        var deletingSession = $q.defer();

        var session = {
          token : localStorageService.get('sessionToken'),
          userId: localStorageService.get('userId')
        };

        if(session.token && session.userId) {

          UserContextApiClient.destroyUserContext(session)
            .then(function() {
              logger.debug(['PServices.SessionManager.destroyCurrentSession', 'User context deleted. Destroying current session']);
              localStorageService.clearAll();
              deletingSession.resolve();
            })
            .catch(function() {
              logger.error(['PServices.SessionManager.destroyCurrentSession', 'User context deletion failed, session data being deleted regardless']);
              localStorageService.clearAll();
              deletingSession.reject();
            });
        } else {
          logger.error(['PServices.SessionManager.destroyCurrentSession -- no session set. ']);
          deletingSession.reject();
        }

        return deletingSession.promise;

      },

      /**
       * getCurrentSession
       * Returns the session token if it exists. Returns false if the session token is invalid
       */

      getCurrentSession : function() {

        var session = {
          token : localStorageService.get('sessionToken'),
          userId: localStorageService.get('userId')
        };

        if(session.token && session.userId) return session;
        else return false;

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

        createNewUserContext : function(username, password) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/user_contexts/create';
          console.log(resourceUrl);
          $http({
            method: 'POST',
            url: resourceUrl,
            data: {username: username, password: password}
          })
            .success(function(data, status, headers) {
              logger.debug(['PServices.UserContextApiClient.createNewUserContext -- http success block', status, data]);
              sendingRequest.resolve(data);
            })
            .error(function(data, status, headers) {
              logger.error(['PServices.UserContextApiClient.createNewUserContext -- http error block', status, data]);
              sendingRequest.reject();
            });

          return sendingRequest.promise;
        },

        destroyUserContext: function(session) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/user_contexts/destroy';
          $http({
            method: 'POST',
            url: resourceUrl,
            headers: {
              'Present-User-Context-Session-Token' : session.token,
              'Present-User-Context-User-Id': session.userId
            }
          })
          .success(function(data, status, headers) {
            logger.debug(['PServices.UserContextApiClient.destroyUserContext -- http success block', status, headers]);
            sendingRequest.resolve();
          })
          .error(function(data, status, headers) {
            logger.error(['PServices.UserContextApiClient.destroyUserContext -- http error block', status, data]);
            sendingRequest.reject();
          })

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

        show: function(userId, session) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/users/show';

          $http({
           method: 'GET',
           url: resourceUrl,
           params: {user_id: userId},
           headers: {
             'Present-User-Context-Session-Token' : session.token,
             'Present-User-Context-User-Id': session.userId
           }
          })
           .success(function(data, status, headers) {
             logger.debug(['PServices.UsersApiClient.show -- http success block', status, data]);
             sendingRequest.resolve(data);
           })
           .error(function (data, status, headers) {
             logger.error(['PServices.UsersApiClient.show -- http error block', status, data]);
             sendingRequest.reject(data);
           })

          return sendingRequest.promise;
       },

        showMe: function(session) {
         var sendingRequest = $q.defer();
         var resourceUrl = ApiConfig.getAddress() + '/v1/users/show_me';

         $http({
          method: 'GET',
          url: resourceUrl,
          headers: {
            'Present-User-Context-Session-Token' : session.token,
            'Present-User-Context-User-Id': session.userId
          }
         })
           .success(function(data, status, headers) {
             logger.debug(['PServices.UsersApiClient.showMe -- http success block', status, data]);
             sendingRequest.resolve(data);
           })
           .error(function (data, status, headers) {
             logger.error(['PServices.UsersApiClient.showMe -- http error block', status, data]);
             sendingRequest.reject(data);
           })

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
         *   @param <Object> session -- user session object for methods that require user context or
         *                              respond with subjective meta data
         */

        listBrandNewVideos: function(cursor, session) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/videos/list_brand_new_videos';
          $http({
            method: 'GET',
            url: resourceUrl,
            params: {limit: ApiConfig.getVideoQueryLimit(), cursor: cursor ? cursor : null},
            headers: {
              'Present-User-Context-Session-Token' : session.token,
              'Present-User-Context-User-Id': session.userId
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

        listHomeVideos: function(session, cursor) {

          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/videos/list_home_videos/';
          $http({
            method: 'GET',
            url: resourceUrl,
            params: {limit: ApiConfig.getVideoQueryLimit()},
            headers: {
              'Present-User-Context-Session-Token' : session.token,
              'Present-User-Context-User-Id': session.userId
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
