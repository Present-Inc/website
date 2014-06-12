/*
 * Present Web App
 * Version - 2.0.0
 * Present Inc.
 * Written by Daniel Lucas
 *
 * app.js
 * PresentWebApp
 */

  /**
   * Define Present Modules
   */

  var PControllers = angular.module('PControllers', []),
  		PDirectives = angular.module('PDirectives', []),
  	  PConstructors = angular.module('PConstructors', []),
			PLoaders = angular.module('PLoaders', []),
  		PManagers = angular.module('PManagers', []),
  		PUtilities = angular.module('PUtilities', []),
  		PApiClient = angular.module('PApiClient', []);

 /**
  * Initialize Angular Application
  *   @dependency {Angular}   Angular       -- It's AngularJS
  *   @dependency {UI-Router} UI-Router     -- Handles all client side routing using a state configuration
  *   @dependency {Present}   PConstructors -- Constructs new client objects from API response objects
  *   @dependency {Present}   PManagers     -- Managers that control the state of the application components
  *   @dependency {Present}   PApiClient    -- Handles all requests and responses from the Present API
  *   @dependency {Present}   PControllers  -- Creates view models (MVVVM)
  *   @dependency {Present}   PDirectives   -- Defines the custom HTML elements
  *   @dependency {Present}   PUtilities    -- Utility functions
  */

  var PresentWebApp = angular.module('PresentWebApp',
    ['ui.router', 'LocalStorageModule',
     'PControllers', 'PDirectives', 'PConstructors', 'PLoaders', 'PManagers', 'PApiClient', 'PUtilities']);


  /**
   * PresentWebApp State Configuration
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
      *   @property fullscreenEnabled <Boolean> -- When true state is full screen (i.e doens't scroll)
      *   @property navbarEnabled <Boolean> -- When true navigation bar is visible
      *   @property requireUserContext <Boolean> -- When true user context is required to access state
      */


      $stateProvider

        .state('splash', {
          url: '/',
          templateUrl: 'views/splash',
          controller: 'splashCtrl',
          metaData: {
            fullscreenEnabled: true,
            navbarEnabled: false,
            requireUserContext: false
          }
        })

        .state('discover', {
          url: '/discover',
          templateUrl: 'views/discover',
          controller: 'discoverCtrl',
          metaData: {
            fullscreenEnabled: false,
            navbarEnabled: true,
            requireUserContext: false
          },
          resolve: {
						Feed : function(FeedLoader) {
							return FeedLoader.preLoad('discover', false);
						}
          }
        })

        .state('login', {
          url: '/login',
          templateUrl: 'views/login',
          controller: 'loginCtrl',
          metaData: {
            fullscreenEnabled: true,
            navbarEnabled: false,
            requireUserContext: false
          }
        })

        .state('home', {
          url: '/home',
          templateUrl: 'views/home',
          controller: 'homeCtrl',
          metaData: {
            fullscreenEnabled: false,
            navbarEnabled: true,
            requireUserContext: true
          },
          resolve: {
            Profile  : function(ProfileLoader) {
             	return ProfileLoader.loadOwnProfile();
            },
            Feed : function(FeedLoader) {
              return FeedLoader.preLoad('home', true);
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
 * PApiClient.CommentsApiClient
 * Handles all API requests to the Comments resource
 * 	@dependency $http {Angular}
 * 	@dependency $q {Angular}
 * 	@dependency logger {PUtilities} -- Configurable log for development and testing
 * 	@dependency ApiConfig {PApiClient} -- Provides API client configuration properties
 */

	PApiClient.factory('CommentsApiClient', ['$http', '$q', 'logger', 'ApiConfig',

		function($http, $q, logger, ApiConfig) {
			return {

				create: function(comment, targetVideo, userContext) {

					var sendingRequest = $q.defer(),
							resourceUrl = ApiConfig.getAddress() + '/v1/comments/create';

					if (userContext) {
						$http({
							method: 'POST',
							url: resourceUrl,
							data: {comment: comment, target_video: targetVideo},
							headers: {
								'Present-User-Context-Session-Token' : userContext.token,
								'Present-User-Context-User-Id': userContext.userId
							}
						})
							.success(function(data, status, headers) {
								logger.debug();
								sendingRequest.resolve(data);
							})
							.error(function(data, status, headers) {
								logger.error();
								sendingRequest.reject(data);
							});
					} else {
							logger.error();
							sendingRequest.reject({status: 'ERROR', mock: true});
					}
					return sendingRequest.promise;

				},

				destroy: function(comment, userContext) {

				}

			}
		}

	]);
/**
 * PApiClient.LikesApiClient
 * Handles all API requests to the Comments resource
 * 	@dependency $http {Angular}
 * 	@dependency $q {Angular}
 * 	@dependency logger {PUtilities} -- Configurable log for development and testing
 * 	@dependency ApiConfig {PApiClient} -- Provides API client configuration properties
 */

PApiClient.factory('LikesApiClient', ['$http', '$q', 'logger', 'ApiConfig',

	function($http, $q, logger, ApiConfig) {
		return {

			create: function(targetVideo, userContext) {

				var sendingRequest = $q.defer(),
					  resourceUrl = ApiConfig.getAddress() + '/v1/likes/create';

				if (userContext) {
					$http({
						method: 'POST',
						url: resourceUrl,
						data: {video_id: targetVideo},
						headers: {
							'Present-User-Context-Session-Token' : userContext.token,
							'Present-User-Context-User-Id': userContext.userId
						}
					})
						.success(function(data, status, headers) {
							logger.debug(['PApiClient.LikesApiClient.create', 'http success block', data]);
							sendingRequest.resolve(data);
						})
						.error(function(data, status, headers) {
							logger.error(['PApiClient.LikesApiClient.create', 'http error block', data]);
							sendingRequest.reject(data);
						});
				} else {
					logger.error(['PApiClient.LikesApiClient.create', 'invalid user context']);
					sendingRequest.reject({status: 'ERROR', mock: true});
				}

				return sendingRequest.promise;

			},

			destroy: function(targetVideo, userContext) {
				var sendingRequest = $q.defer(),
					  resourceUrl = ApiConfig.getAddress() + '/v1/likes/destroy';

				if (userContext) {
					$http({
						method: 'POST',
						url: resourceUrl,
						data: {video_id: targetVideo},
						headers: {
							'Present-User-Context-Session-Token' : userContext.token,
							'Present-User-Context-User-Id': userContext.userId
						}
					})
						.success(function(data, status, headers) {
							logger.debug(['PApiClient.LikesApiClient.destroy', 'http success block', data]);
							sendingRequest.resolve(data);
						})
						.error(function(data, status, headers) {
							logger.error(['PApiClient.LikesApiClient.create', 'http error block', data]);
							sendingRequest.reject(data);
						});
				} else {
					logger.error(['PApiClient.LikesApiClient.destroy', 'invalid user context']);
					sendingRequest.reject({status: 'ERROR', mock:true});
				}

				return sendingRequest.promise;
			}

		}
	}

]);
/**
 * PApiClient.UserContextApiClient
 * Creates, updates, and destroys User Context Tokens
 *   @dependency $http {Angular}
 *   @dependency $q {Angular}
 *   @dependency logger {PUtilities} -- Configurable log for development
 *   @dependency ApiConfig {PApiClient} -- Provides API configuration properties
 */

  PApiClient.factory('UserContextApiClient', ['$http', '$q', 'logger', 'ApiConfig',

   function($http, $q, logger, ApiConfig) {
     return {

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
                logger.debug(['PServices.UserContextApiClient.destroyUserContext -- http success block', status, data]);
                sendingRequest.resolve(data);
              })
              .error(function(data, status, headers) {
                logger.error(['PServices.UserContextApiClient.destroyUserContext -- http error block', status, data]);
                sendingRequest.reject(data);
              })
          } else {
            logger.error(['PApiClient.UserContextApiClient.destroyUserContext', 'request not sent: invalid userContext']);
						sendingRequest.reject({status: 'ERROR', mock:true});
          }
          return sendingRequest.promise;
        }

     }
   }

  ]);

  /**
   * PApiClient.UsersApiClient
   * Handles all API requests to the Users resource.
	 * 	@dependency $http {Angular}
	 * 	@dependency $q {Angular}
	 * 	@dependency logger {PUtilities} -- Configurable log for development and testing
	 * 	@dependency ApiConfig {PApiClient} -- Provides API client configuration properties
   */

  PApiClient.factory('UsersApiClient', ['$http', '$q', 'logger', 'ApiConfig',

    function($http, $q, logger, ApiConfig) {

      return {

        show: function(username, userContext) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/users/show';
          if (username) {
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
               logger.debug(['PApiClient.UsersApiClient.show -- http success block', status, data]);
               sendingRequest.resolve(data);
             })
             .error(function (data, status, headers) {
               logger.error(['PApiClient.UsersApiClsdient.show -- http error block', status, data]);
               sendingRequest.reject(data);
             })
          } else {
           logger.error(['PServices.UsersApiClient.show', 'no valid user provided']);
           sendingRequest.reject({status: "ERROR", mock: true});
          }
          return sendingRequest.promise;
       },

        showMe: function(userContext) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/users/show_me';
          if (userContext) {
            $http({
             method: 'GET',
             url: resourceUrl,
             headers: {
               'Present-User-Context-Session-Token' : userContext.token,
               'Present-User-Context-User-Id': userContext.userId
             }
            })
              .success(function(data, status, headers) {
                logger.debug(['PApiClient.UsersApiClient.showMe -- http success block', status, data]);
                sendingRequest.resolve(data);
              })
              .error(function (data, status, headers) {
                logger.error(['PApiClient.UsersApiClient.showMe -- http error block', status, data]);
                sendingRequest.reject(data);
              });
          } else {
            	logger.error(['PApiClient.UsersApiClient.show', 'no valid user context']);
            	sendingRequest.reject({status: 'ERROR', mock: true});
          }
          return sendingRequest.promise;
        },

				search : function(query, limit, userContext) {
					var sendingRequest  = $q.defer();
					var resourceUrl = ApiConfig.getAddress() + '/v1/users/search';
					if (query) {
						$http({
							method: 'GET',
							url: resourceUrl,
							params: {query: query, limit: limit ? limit : null},
							headers: {
								'Present-User-Context-Session-Token' : userContext ? userContext.token : null,
								'Present-User-Context-User-Id': userContext ? userContext.token : null
							}
						})
							.success(function(data, status, headers) {
								logger.debug(['PApiClient.UsersApiClient.search', 'http success block', status, data]);
								sendingRequest.resolve(data);
							})
							.error(function(data, status, headers) {
								logger.error(['PApiClient.UsersApiClient.search', 'http error block',  status, data]);
								sendingRequest.reject(data);
							});
					} else {
							logger.error(['PApiClient.UsersApiClient', 'query is undefined']);
							sendingRequest.reject({status: 'ERROR', mock: true});
					}
					return sendingRequest.promise;
				}

      }

    }

  ]);

/**
 * PApiClient.CommentsApiClient
 * Handles all API requests to the Comments resource
 * 	@dependency $http {Angular}
 * 	@dependency $q {Angular}
 * 	@dependency logger {PUtilities} -- Configurable log for development and testing
 * 	@dependency ApiConfig {PApiClient} -- Provides API client configuration properties
 */

  PApiClient.factory('VideosApiClient', ['$http', '$q', 'logger', 'ApiConfig',

    function($http, $q, logger, ApiConfig) {

      return {

        listBrandNewVideos: function(cursor, userContext) {

					var sendingRequest = $q.defer(),
          		resourceUrl = ApiConfig.getAddress() + '/v1/videos/list_brand_new_videos';

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

        listHomeVideos: function(cursor, userContext) {

          var sendingRequest = $q.defer(),
          		resourceUrl = ApiConfig.getAddress() + '/v1/videos/list_home_videos';

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

        },

				search : function(query, limit, userContext ) {

					var sendingRequest  = $q.defer(),
							resourceUrl = ApiConfig.getAddress() + '/v1/videos/search';

					if (query) {
						$http({
							method: 'GET',
							url: resourceUrl,
							params: {query: query, limit: limit ? limit : null},
							headers: {
								'Present-User-Context-Session-Token' : userContext ? userContext.token : null,
								'Present-User-Context-User-Id': userContext ? userContext.token : null
							}
						})
							.success(function(data, status, headers) {
								logger.debug(['PApiClient.UsersApiClient.search', 'http success block', status, data]);
								sendingRequest.resolve(data);
							})
							.error(function(data, status, headers) {
								logger.error(['PApiClient.UsersApiClient.search', 'http error block',  status, data]);
								sendingRequest.reject(data);
							});
					} else {
						logger.error(['PApiClient.UsersApiClient', 'query is undefined']);
						sendingRequest.reject({status: 'ERROR', mock: true});
					}

					return sendingRequest.promise;

				}

      }
    }

  ]);

/**
 * PConstructors.ApplicationConstructor
 * Provides properties and methods to manage the state of the application
 * Only injected one per application, usually on the highest level scope
 * 	@dependency logger {PUtilities}
 * 	@dependency $state {Ui-Router}
 * 	@dependency UserContextManager {PManager}
 */

  PConstructors.factory('ApplicationConstructor', ['logger', '$state', 'UserContextManager', 'ProfileConstructor',

		function(logger, $state, UserContextManager, ProfileConstructor) {
			return {
				create : function() {

					function Application() {

						this.user = {
							active : ''
						};

					}

					/**
					 * Application.authorize
					 * Checks to make sure the user has access to the requested state
					 * 	@param event -- stateChangeStart event object which contains the preventDefault method
					 * 	@param toState -- the state the the application is transitioning into
					 */

					Application.prototype.authorize = function(event, toState) {
						var userContext = UserContextManager.getActiveUserContext();
						if (toState.metaData.requireUserContext && !userContext) {
							event.preventDefault();
							$state.go('login');
						}
					};

					/**
					 * Application.login
					 * Handles user context creation, sets the activeUser property and changes the state to home
					 * 	@param username <String> -- the user provided username
					 * 	@param password <String> -- the user provided password
					 */

					Application.prototype.login = function(username, password) {

						var userContext = UserContextManager.getActiveUserContext();
						user = this.user;

						if (!userContext) {
							UserContextManager.createNewUserContext(username, password)
								.then(function (newUserContext) {
									user.active = ProfileConstructor.create(newUserContext.profile);
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
					 * Application.logout
					 * Handles user context deletion and changes the state to splash
					 */

					Application.prototype.logout = function() {
						UserContextManager.destroyActiveUserContext()
							.then(function() {
								$state.go('splash');
							});
					};

					return new Application();

				}
			};
  	}

	]);

/**
 * PConstructors.CommentConstructor.js
 */

	PConstructors.factory('CommentConstructor', function() {
		return{
			create : function(apiCommentObject) {

				function Comment(apiCommentObject) {
					this._id = apiCommentObject._id;
					this.body = apiCommentObject.body;
					this.sourceUser = {
						username: apiCommentObject.sourceUser.object.username,
						profilePicture: apiCommentObject.sourceUser.object.profile.picture
					};
					this.timeAgo = '5 min'
				}

				return new Comment(apiCommentObject);

			}
		}
	});

/**
 * PConstructors.FeedConstructor
 * Constructs the Feed, which is composed of Video Cells
 *   @dependency {Present} VideoCellConstructor
 */

  PConstructors.factory('FeedConstructor', ['$q', 'UserContextManager', 'VideosApiClient', 'VideoCellConstructor',

    function($q, UserContextManager, VideosApiClient, VideoCellConstructor) {
      return {
        create: function(type, requireUserContext) {

          function Feed(type, requireUserContext) {
						this.type = type;
						this.requireUserContext = requireUserContext;
						this.activeVideo = null;
						this.cursor = null;
						this.isLoading = false;
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

					Feed.prototype.load = function() {

						var loadingFeed = $q.defer(),
								userContext = UserContextManager.getActiveUserContext();

						var resourceMethod = loadResourceMethod(this.type);

						if(this.requireUserContext && !userContext) {
							loadingFeed.reject();
						} else {
							var _this = this;
							VideosApiClient[resourceMethod](this.cursor, userContext)
								.then(function(apiResponse) {
									for(var i=0, length=apiResponse.results.length; i < length; i++) {
										var VideoCell = VideoCellConstructor
											.create(apiResponse.results[i].object, apiResponse.results[i].subjectiveObjectMeta);
										_this.videoCells.push(VideoCell);
									}
									loadingFeed.resolve();
								})
								.catch(function() {
									loadingFeed.reject();
								});
						}

					return loadingFeed.promise;

					};

          return new Feed(type, requireUserContext);

        }
      }
    }

  ]);

/**
 * PConstructors.LikeConstructor
 */

	PConstructors.factory('LikeConstructor', function() {
		return {
			create: function(apiLikeObject) {

				function Like(apiLikeObject) {
					this._id = apiLikeObject._id;
					this.sourceUser = {
						_id : apiLikeObject.sourceUser.object._id,
						username : apiLikeObject.sourceUser.object.username
					};
					this.targetVideo = apiLikeObject.targetVideo;
					//TODO: implement a momentjs utility service
					this.timeAgo = '2 minutes'
				}

				return new Like(apiLikeObject);

			}
		}
	});

/**
 * PConstructors.NavbarConstructor
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

PConstructors.factory('NavbarConstructor', ['$q',
																					 '$state',
																					 'logger',
																					 'UserContextManager',
																					 'VideosApiClient',
																					 'UsersApiClient',
																					 'VideoConstructor',
																					 'ProfileConstructor',

	function($q, $state, logger, UserContextManager, VideosApiClient, UsersApiClient, VideoConstructor, ProfileConstructor) {

		return {
			create : function() {

				function Navbar(){

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
				 * Navbar.configure
				 * Configuration method that is called on the ui router stateChangeStart event
				 *  @param toState <Object> Ui-Router object that defines the requested state
				 */

				Navbar.prototype.configure = function(toState) {

					var userContext = UserContextManager.getActiveUserContext();

					if (toState.metaData.navbarEnabled) this.isEnabled = true;
					else this.isEnabled = false;

					if (userContext) this.mode.loggedIn = true;
					else this.mode.loggedIn = false;

				};

				/**
				 * Navbar.loadHub
				 * Load the hub data if the user is still logged in when they enter the site
				 * Otherwise, the data is set on the _newUserLoggedIn event
				 */

				Navbar.prototype.loadHub = function() {
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
				 * Navbar.sendSearchQuery
				 * Sends Users and Videos search API requests in parallel and then updates the search result properties
				 * 	@param query <String> the search query string provided by the user
				 * 	@returns promise <Object>
				 */

				Navbar.prototype.sendSearchQuery = function(query) {

					var sendingVideosSearch = $q.defer(),
						 sendingUsersSearch = $q.defer(),
						 videosSearchResults = this.search.results.videos,
						 usersSearchResults = this.search.results.users,
						 userContext = UserContextManager.getActiveUserContext(),
						 limit = 5;

					var promises  = [sendingVideosSearch, sendingUsersSearch];

					videosSearchResults.length = 0;
					usersSearchResults.length = 0;

					VideosApiClient.search(query, limit, userContext)
						.then(function(apiResponse){
							for (var i = 0;  i < apiResponse.results.length; i++) {
								var Video = VideoConstructor.create(apiResponse.results[i].object);
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

				Navbar.prototype.showDropdown = function() {
					this.search.dropdownEnabled = true;
				};

				/**
				 * NavbarManager.hideDropdown
				 * Sets the search.dropdownEnabled to false
				 */

				Navbar.prototype.hideDropdown = function() {
					this.search.dropdownEnabled = false;
				};

				return new Navbar();

			}
		};

	}

]);
/**
 * PConstructors.ProfileConstructor
 */

  PConstructors.factory('ProfileConstructor', ['$q', 'logger', 'UsersApiClient', function() {
    return {
     create : function(apiProfileObject) {

       function Profile(apiProfileObject) {
         this._id = apiProfileObject._id;
         this.username = apiProfileObject.username;
         this.fullName = apiProfileObject.profile.fullName || '';
         this.profilePicture = apiProfileObject.profile.picture.url;
         this.description = apiProfileObject.profile.description;

         this.counts = {
           videos: apiProfileObject.videos.count,
           views: apiProfileObject.views.count,
           likes: apiProfileObject.likes.count,
           followers: apiProfileObject.followers.count,
           friends: apiProfileObject.friends.count
         };

         this.phoneNumber = apiProfileObject.phoneNumber ? apiProfileObject.phoneNumber : null;
         this.email = apiProfileObject.email ? apiProfileObject.email : null;
       }

			 Profile.prototype.follow = function() {

			 };

			 Profile.prototype.demand = function() {

			 };

       return new Profile(apiProfileObject);

		 }
    }
 }]);

/**
 * PConstructors.ReplyConstructor
 */

PConstructors.factory('ReplyConstructor', function() {
	return {
		create: function(apiLikesObject) {

			function Reply(apiLikeObject) {
				this._id = apiLikeObject._id;
				this.sourceUser = apiLikeObject.sourceUser;
				this.targetVideo = apiLikeObject.targetVideo;
			}

			return new Reply(apiLikeObject);

		}
	}
});

/**
 * PConstructors.VideoCellConstructor
 *  Constructs the individual components of a video cell
 */

 PConstructors.factory('VideoCellConstructor', ['$state',
	 																							'UserContextManager',
	 																							'LikesApiClient',
	 																							'CommentsApiClient',
	 																							'VideoConstructor',
	 																							'CommentConstructor',
	 																							'LikeConstructor',
	 																							'ReplyConstructor',

	 function($state, UserContextManager, LikesApiClient, CommentsApiClient,
						VideoConstructor, CommentConstructor, LikeConstructor, ReplyConstructor) {

   return {
		create: function(apiVideoObject, subjectiveMeta) {

			function VideoCellConstructor(apiVideoObject, subjectiveMeta) {
				this.video = VideoConstructor.create(apiVideoObject);
				this.subjectiveMeta = subjectiveMeta;
				this.comments = [];
				this.likes = [];
				this.replies = [];

				var embededResults = {
					comments : apiVideoObject.comments.results,
					likes : apiVideoObject.likes.results,
					replies : apiVideoObject.replies.results
				};

				for(var i = 0;  i < embededResults.comments.length; i++) {
					var Comment = CommentConstructor.create(embededResults.comments[i].object);
					this.comments.push(Comment);
				}

				for(var j = 0; j < embededResults.likes.length;  j++) {
					var Like = LikeConstructor.create(embededResults.likes[j].object);
					this.likes.push(Like);
				}

				for(var k = 0; k < embededResults.replies.length; k++) {
					var Reply = ReplyConstructor.create(embededResults.replies[k].object);
					this.replies.push(Reply);
				}

			}

			VideoCellConstructor.prototype.addLike = function(apiResponse) {
				if(apiResponse.status == 'OK') {
					console.log('hi');
					this.likes.push(LikeConstructor.create(apiResponse.result.object));
				}
			};

			VideoCellConstructor.prototype.removeLike = function(apiResponse, userContext) {
				if(apiResponse.status == 'OK') {
					for (var i=0; i < this.likes.length; i ++) {
						if (this.likes[i].sourceUser._id == userContext.userId);
						this.likes.splice(i, 1);
					}
				}
			};

			VideoCellConstructor.prototype.toggleLike = function() {

				var userContext = UserContextManager.getActiveUserContext(),
						_this = this;

				if(!userContext) {
					$state.go('login');
				}
				else if (this.subjectiveMeta.like.forward) {
					this.video.counts.likes--;
					this.subjectiveMeta.like.forward = false;
					LikesApiClient.destroy(this.video._id, userContext)
						.then(function(apiResponse) {
							_this.removeLike(apiResponse, userContext);
						})
						.catch(function(apiResponse) {
							_this.removeLike(apiResponse, userContext);
						})
				} else {
					this.video.counts.likes++;
					this.subjectiveMeta.like.forward = true;
					LikesApiClient.create(this.video._id, userContext)
						.then(function(apiResponse) {
							_this.addLike(apiResponse);
						})
						.catch(function(apiResponse) {
							_this.addLike(apiResponse);
						});
				}

			};

			return new VideoCellConstructor(apiVideoObject, subjectiveMeta);
		}
   }

 }]);

/**
 * PConstructors.VideoConstructor
 */

	PConstructors.factory('VideoConstructor', function() {
		return {
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
						long: null
					};

					this.creator = {
						_id             : apiVideoObject.creatorUser.object._id,
						profilePicture  : apiVideoObject.creatorUser.object.profile.picture.url,
						username				: apiVideoObject.creatorUser.object.username,
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
		}
	});
/**
 * PLoaders.FeedLoader
 */

	PLoaders.factory('FeedLoader', ['$q', 'FeedConstructor', function($q, FeedConstructor) {
		return {
			preLoad : function(type, requireUserContext) {

				var preLoadingFeed = $q.defer(),
						Feed = FeedConstructor.create(type, requireUserContext);

				Feed.load()
					.then(function() {
						preLoadingFeed.resolve(Feed);
					})
					.catch(function() {
						//TODO : better error handling!
						preLoadingFeed.reject();
					});

				return preLoadingFeed.promise;

			}
		}
	}]);
/**
 * PLoader.ProfileManager
 * Provides and interface to the VideosApiClient to the view controllers
 * Parses and prepares the results provided from the UserApiClient
 *   @dependency $q {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency UsersApiClient {PApiClient}
 *   @dependency UserContextManager {PManagers}
 */

PLoaders.factory('ProfileLoader', ['$q', 'logger', 'UsersApiClient', 'ProfileConstructor', 'UserContextManager',

	function($q, logger, UsersApiClient, ProfileConstructor, UserContextManager) {

		return {

			loadOwnProfile : function() {

				var loadingProfile = $q.defer();
				var userContext = UserContextManager.getActiveUserContext();

				if(userContext) {
					UsersApiClient.showMe(userContext)
						.then(function(apiResponse) {
							var Profile = ProfileConstructor.create(apiResponse.result.object);
							loadingProfile.resolve(Profile);
						})
						.catch(function() {
							loadingProfile.reject();
						});
				} else loadingProfile.resolve(false);

				return loadingProfile.promise;

			},

			loadUserProfile : function(username) {

				var loadingProfile = $q.defer(),
						userContext = UserContextManager.getActiveUserContext();

				UsersApiClient.show(username, userContext)
					.then(function(apiResponse) {
						var Profile = ProfileConstructor.create(apiResponse.result.object);
						loadingProfile.resolve(Profile);
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

PManagers.factory('UserContextManager', ['$q', 'localStorageService', 'logger', 'UserContextApiClient',

  function($q, localStorageService, logger, UserContextApiClient) {

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
							profile : apiResponse.result.object.user.object
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



PUtilities.directive('registerElement', function() {
	return {
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink(scope, iElement, iAttrs, controller) {
					scope[iAttrs.registerElement] = iElement;
				}
			}
		}
	}
});
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

  PControllers.controller('homeCtrl', ['$scope', 'logger', 'Feed', 'Profile',

    function($scope, logger, Feed, Profile) {

      logger.debug('PControllers.homeCtrl -- initializing Profile Data', Profile);
      logger.debug('PControllers.homeCtrl -- initializing the Feed Manager', Feed);

      //Initialize Profile
      $scope.Profile = Profile;
			$scope.Feed = Feed;

			$scope.$watch(Feed);

    }

  ]);

/*
 * PControllers.loginCtrl
 * Application Manager handles all login functionality
 * 	@dependency $scope {Angular}
 */

  PControllers.controller('loginCtrl', ['$scope', function($scope) {
      $scope.username = '';
      $scope.password = '';
  }]);

/**
 * PControllers.mainCtrl
 * Highest level controller PresentWebApp
 * Acts as a buffer to the rootScope
 *   @dependency $scope {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency ApplicationManager {PManagers}
 */

  PControllers.controller('mainCtrl', ['$scope', 'logger', 'ApplicationConstructor',

    function($scope, logger, ApplicationConstructor) {

      $scope.Application = ApplicationConstructor.create();

			$scope.$watch('Application');

			$scope.$watch('Application.user.active', function(user) {
				$scope.$broadcast('_newUserLoggedIn', user);
			});

      $scope.$on('$stateChangeStart', function(event, toState) {
				$scope.Application.authorize(event, toState);
      });

    }

  ]);

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
 * PDirectives.feedDirective
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
 * HTML Directive for the main Navbar
 */


	PDirectives.directive('navbar', [function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/partials/navbar',
			replace: true,

			controller: function($scope, $state, logger, UserContextManager, NavbarConstructor) {

				logger.test(['PDirectives -- Navbar initialized']);
				$scope.Navbar = NavbarConstructor.create();
				$scope.Navbar.loadHub();

				$scope.$watch('Navbar');

				$scope.$watch('Navbar.search.query', function(query) {
					if(query == 0) {
						$scope.Navbar.hideDropdown();
					} else if (query.length % 3 == 0) {
						$scope.Navbar.showDropdown();
						$scope.Navbar.sendSearchQuery(query);
					}
				});

				$scope.$on('$stateChangeSuccess', function(event, toState, fromState) {
					$scope.Navbar.configure(toState);
				});

				$scope.$on('_newUserLoggedIn', function(event, profile) {
					$scope.Navbar.hub.username = profile.username;
					$scope.Navbar.hub.profilePicture = profile.profilePicture;
				});

			},

			link: function(scope, element, attrs) {

			}

		}

	}]);
/**
 * VideoCellDirective.js
 */

PDirectives.directive('videoCell', function() {
	return {
		restrict : 'EA',
		link : function(scope, element, attrs) {

			scope.$watch('videoCell.subjectiveMeta.like.forward', function(newValue) {
				if (newValue) scope.likesElem.css({'color' : '#FF557F'});
				else scope.likesElem.css({'color' : '#47525D'});
			});

		}
	}
});
/**
 * PDirectives.viewContainerDirective
 * HTML Directive that controls the main view container
 * I.E custom extension for ui-view
 */

  PDirectives.directive('viewContainer', function() {});
