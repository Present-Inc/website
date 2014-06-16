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
  	  PModels = angular.module('PModels', []),
			PLoaders = angular.module('PLoaders', []),
  		PManagers = angular.module('PManagers', []),
  		PUtilities = angular.module('PUtilities', []),
  		PApiClient = angular.module('PApiClient', []);

 /**
  * Initialize Angular Application
  *   @dependency {Angular}   Angular       -- It's AngularJS
  *   @dependency {UI-Router} UI-Router     -- Handles all client side routing using a state configuration
  *   @dependency {Present}   PModels       -- Constructs new client objects from API response objects
  *   @dependency {Present}   PManagers     -- Managers that control the state of the application components
  *   @dependency {Present}   PApiClient    -- Handles all requests and responses from the Present API
  *   @dependency {Present}   PControllers  -- Creates view models (MVVVM)
  *   @dependency {Present}   PDirectives   -- Defines the custom HTML elements
  *   @dependency {Present}   PUtilities    -- Utility functions
  */

  var PresentWebApp = angular.module('PresentWebApp',
    ['ui.router', 'LocalStorageModule',
     'PControllers', 'PDirectives', 'PModels', 'PLoaders', 'PManagers', 'PApiClient', 'PUtilities']);


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
 * PApiClient.ApiClient
 */

	PApiClient.factory('ApiClient', ['$http', '$q', 'logger', 'ApiClientConfig', function($http, $q, logger, ApiConfig) {
		return {
			createRequest : function(resource, method, userContext, params) {

				function Request(resource, method, userContext, params) {

					var config = ApiConfig;

					logger.debug('Sending Request: ' + config.resources[resource][method].url);

					this.httpMethod = config.resources[resource][method].httpMethod;
					this.url = config.baseUrl + config.resources[resource][method].url;

					if(this.httpMethod == 'POST') {
						this.data = params;
					}
					else {
						this.params = params;
					}

					if (userContext) {
						this.headers = {
							'Present-User-Context-Session-Token': userContext.token,
							'Present-User-Context-User-Id': userContext.userId
						};
						this.validUserContextHeaders = true;
					} else {
						this.headers = {};
						this.validUserContextHeaders = false;

						this.requiresUserContext = config.resources[resource][method].requiresUserContext;

					}
				}

				Request.prototype.exec = function () {
					var sendingRequest = $q.defer();

					if (this.requiresUserContext && !this.validUserContextHeaders) {
						sendingRequest.reject({status: 'ERROR', result: 'missing required user context headers'});
					} else {
						$http({
							method: this.httpMethod,
							url: this.url,
							params: this.params,
							data: this.data,
							headers: this.headers
						})
							.success(function (data, status, headers) {
								logger.debug(['PApiClient http success block ', status, data]);
								sendingRequest.resolve(data);
							})
							.error(function (data, status, headers) {
								logger.error(['PApiClient http error block', status, data]);
								sendingRequest.reject(data);
							});
					}

					return sendingRequest.promise;

				};

				return new Request(resource, method, userContext, params);
			}
		}
	}]);

	PApiClient.factory('ApiClientConfig', function() {
		return {

			baseUrl : 'https://api.present.tv/v1/',

			videoQueryLimit : 5,

			resources : {

				userContexts : {
					create : {
						httpMethod : 'POST',
						url : 'user_contexts/create',
						requiresUserContext : false
					},
					destroy : {
						httpMethod : 'POST',
						url : 'user_contexts/destroy',
						requiresUserContext : true
					}
				},

				videos : {
					listBrandNewVideos : {
						httpMethod : 'GET',
						url : 'videos/list_brand_new_videos',
						requiresUserContext : false
					},
					listHomeVideos : {
						httpMethod : 'GET',
						url : 'videos/list_home_videos',
						requiresUserContext : true
					},
					search : {
						httpMethod : 'GET',
						url : 'videos/search',
						requiresUserContext : false
					}
				},

				users : {
					show : {
						httpMethod : 'GET',
						url : 'users/show',
						requiresUserContext : false
					},
					showMe : {
						httpMethod : 'GET',
						url : 'users/show_me',
						requiresUserContext : true
					}
				},

				likes : {
					create : {
						httpMethod : 'POST',
						url : 'likes/create',
						requiresUserContext : true
					},
					destroy : {
						httpMethod : 'POST',
						url : 'likes/destroy',
						requiresUserContext : true
					}
				},

				comments : {
					create : {
						httpMethod : 'POST',
						url : 'comments/create',
						requiresUserContext : true
					},
					destroy : {
						httpMethod : 'POST',
						url : 'comments/destroy',
						requiresUserContext : false
					}
				},

				views : {},
				demands : {},
				friendships : {},
				activities : {}

			}
		}
	});

/**
 * PModels.CommentModel.js
 */

	PModels.factory('CommentModel', function() {
		return{

			construct : function(apiCommentObject) {

				function Comment(apiCommentObject) {
					this._id = apiCommentObject._id;
					this.body = apiCommentObject.body;
					this.sourceUser = {
						username: apiCommentObject.sourceUser.object.username,
						profilePicture: apiCommentObject.sourceUser.object.profile.picture.url
					};
					this.targetVideo = apiCommentObject.targetVideo;
					this.timeAgo = '5 min'
				}

				return new Comment(apiCommentObject);

			},

			create : function(body, targetVideo, sourceUser) {

				function Comment(body, targetVideo, sourceUser) {
					this._id = "";
					this.body = body;
					this.sourceUser = {
						username: sourceUser.username,
						profilePicture: sourceUser.profilePicture
					};
					this.targetVideo = targetVideo;
					this.timeAgo = '5 min';
				}

				return new Comment(body, targetVideo, sourceUser)

			}

		}
	});

/**
 * PModels.FeedModel
 * Constructs the Feed, which is composed of Video Cells
 *   @dependency {Present} VideoCellModel
 */

  PModels.factory('FeedModel', ['$q', 'UserContextManager', 'ApiManager', 'VideoCellModel',

    function($q, UserContextManager, ApiManager, VideoCellModel) {
      return {
        construct: function(type, requireUserContext) {

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
							ApiManager.videos(resourceMethod, userContext, {cursor: this.cursor, limit: 5})
								.then(function(apiResponse) {
									for(var i=0, length=apiResponse.results.length; i < length; i++) {
										var VideoCell = VideoCellModel
											.construct(apiResponse.results[i].object, apiResponse.results[i].subjectiveObjectMeta);
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
 * PModels.LikeModel
 */

	PModels.factory('LikeModel', function() {
		return {

			construct: function(apiLikeObject) {

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

			},

			create : function(targetVideo, sourceUser) {

				function Like(targetVideo, sourceUser) {
					this._id = "";
					this.sourceUser = {
						_id : sourceUser._id,
						username : sourceUser.username
					};
					this.targetVideo = targetVideo;
					//TODO: implement a momentjs utility service
					this.timeAgo = 'Just now'
				}

				return new Like(targetVideo, sourceUser);

			}

		}
	});

/**
 * PModels.NavbarModel
 * Properties and methods to handle the state of the Navbar
 * 	@dependency $q {Angular}
 * 	@dependency $state {Ui-Router}
 * 	@dependency logger {PUtilities}
 * 	@dependency UserContextManager {PManagers}
 * 	@dependency VideosApiClient {PApiClient}
 * 	@dependency UsersApiClient {PApiClient}
 * 	@dependency VideoModel {PModels}
 * 	@dependency ProfileModel {PModels}
 */

PModels.factory('NavbarModel', ['$q',
																					 '$state',
																					 'logger',
																					 'UserContextManager',
																					 'ApiManager',
																					 'VideoModel',
																					 'ProfileModel',

	function($q, $state, logger, UserContextManager, ApiManager, VideoModel, ProfileModel) {

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
						ApiManager.users('showMe', userContext, {})
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

					ApiManager.videos('search', userContext, {query: query, limit: 5})
						.then(function(apiResponse){
							for (var i = 0;  i < apiResponse.results.length; i++) {
								var Video = VideoModel.construct(apiResponse.results[i].object);
								videosSearchResults.push(Video);
							}
							logger.debug(['PManagers.NavbarManager', videosSearchResults]);
							sendingVideosSearch.resolve();
						});

					ApiManager.users('search', userContext, {query: query, limit: 5})
						.then(function(apiResponse) {
							for (var i=0; i < apiResponse.results.length; i++) {
								var Profile = ProfileModel.construct(apiResponse.results[i].object);
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
 * PModels.ProfileModel
 */

  PModels.factory('ProfileModel', function() {
    return {
     construct : function(apiProfileObject) {

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
 });

/**
 * PModels.ReplyModel
 */

PModels.factory('ReplyModel', function() {
	return {
		construct: function(apiLikesObject) {

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
 * PModels.UserContextConstructor
 */

	PModels.factory('UserContextModel', ['ProfileModel', function(ProfileModel) {
		return {

			construct: function(apiResponseObject) {

				function UserContext (apiResponseObject) {
					this.token  = apiResponseObject.sessionToken;
					this.userId = apiResponseObject.user.object._id;
					this.profile = ProfileModel.construct(apiResponseObject.user.object);
				}

				return new UserContext(apiResponseObject);

			},

			create: function(token, userId, profile) {

				function UserContext () {
					this.token = token;
					this.userId = userId;
					this.profile = profile;
				}

				return new UserContext(token, userId, profile);

			}

		}
	}]);
/**
 * PModels.UserSessionModel
 * Provides properties and methods to manage the state of the UserSession
 * Only injected one per UserSession, usually on the highest level scope
 * 	@dependency logger {PUtilities}
 * 	@dependency $state {Ui-Router}
 * 	@dependency UserContextManager {PManager}
 */

  PModels.factory('UserSessionModel', ['logger', '$state', 'UserContextManager',

		function(logger, $state, UserContextManager) {
			return {
				create : function() {

					function UserSession() {

						this.user = {
							active : ''
						};

					}

					/**
					 * UserSession.authorize
					 * Checks to make sure the user has access to the requested state
					 * 	@param event -- stateChangeStart event object which contains the preventDefault method
					 * 	@param toState -- the state the the UserSession is transitioning into
					 */

					UserSession.prototype.authorize = function(event, toState) {
						var userContext = UserContextManager.getActiveUserContext();
						if (toState.metaData.requireUserContext && !userContext) {
							event.preventDefault();
							$state.go('login');
						}
					};

					/**
					 * UserSession.login
					 * Handles user context creation, sets the activeUser property and changes the state to home
					 * 	@param username <String> -- the user provided username
					 * 	@param password <String> -- the user provided password
					 */

					UserSession.prototype.login = function(username, password) {

						var userContext = UserContextManager.getActiveUserContext(),
								_this = this;

						if (!userContext) {
							UserContextManager.createNewUserContext(username, password)
								.then(function (newUserContext) {
									_this.user.active = newUserContext.profile;
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
					 * UserSession.logout
					 * Handles user context deletion and changes the state to splash
					 */

					UserSession.prototype.logout = function() {
						UserContextManager.destroyActiveUserContext()
							.then(function() {
								$state.go('splash');
							});
					};

					return new UserSession();

				}
			};
  	}

	]);

/**
 * PModels.VideoCellModel
 * Constructs the individual components of a video cell
 */

 PModels.factory('VideoCellModel', ['$state', 'UserContextManager', 'ApiManager',
	 																				'VideoModel', 'CommentModel', 'LikeModel', 'ReplyModel',

	 function($state, UserContextManager, ApiManager,
						VideoModel, CommentModel, LikeModel, ReplyModel) {

   return {
		construct: function(apiVideoObject, subjectiveMeta) {

			function VideoCell(apiVideoObject, subjectiveMeta) {
				this.video = VideoModel.construct(apiVideoObject);
				this.subjectiveMeta = subjectiveMeta;
				this.comments = [];
				this.likes = [];
				this.replies = [];
				this.input = {
					comment : ''
				};

				var embededResults = {
					comments : apiVideoObject.comments.results,
					likes : apiVideoObject.likes.results,
					replies : apiVideoObject.replies.results
				};

				for(var i = 0;  i < embededResults.comments.length; i++) {
					var Comment = CommentModel.construct(embededResults.comments[i].object);
					this.comments.push(Comment);
				}

				for(var j = 0; j < embededResults.likes.length;  j++) {
					var Like = LikeModel.construct(embededResults.likes[j].object);
					this.likes.push(Like);
				}

				for(var k = 0; k < embededResults.replies.length; k++) {
					var Reply = ReplyModel.construct(embededResults.replies[k].object);
					this.replies.push(Reply);
				}
			}

			VideoCell.prototype.toggleLike = function() {

				var userContext = UserContextManager.getActiveUserContext(),
						_this = this;

				if(!userContext) {
					$state.go('login');
				}
				else if (this.subjectiveMeta.like.forward) {
					this.video.counts.likes--;
					this.subjectiveMeta.like.forward = false;
					for (var i=0; i < this.likes.length; i ++) {
						if (this.likes[i].sourceUser._id == userContext.userId)
						this.likes.splice(i, 1);
					}
					//ApiManager.likes('destroy', userContext, {targetVideo : this.video_id});
				} else {
						var newLike = LikeModel.create(this.video._id, userContext.profile);
						this.video.counts.likes++;
						this.subjectiveMeta.like.forward = true;
						this.likes.push(newLike);
						//ApiManager.likes('create', userContext, {targetVideo : this.video._id});
					}

			};

			VideoCell.prototype.addComment = function() {
				var userContext = UserContextManager.getActiveUserContext();

				if(!userContext) {
					$state.go('login');
				} else {
					var newComment = CommentModel.create(this.input.comment, this.video._id, userContext.profile);
					this.video.counts.comments++;
					this.input.comment = '';
					this.comments.push(newComment);
					//ApiManager.comments.('create', userContext, {body : newComment.body, targetVideo: newComment.targetVideo});
				}

			};

			VideoCell.prototype.removeComment = function(comment) {
				var userContext = UserContextManager.getActiveUserContext();

				if(!userContext) {
					$state.go('login');
				} else {
					this.video.counts.comments--;
					for (var i = 0; i < this.comments.length; i ++) {
						if (this.comments[i]._id == comment._id) {
							this.comments.splice(i, 1);
						}
					}
					//ApiManager.comments('destroy', userContext, {id : comment._id});
				}

			};

			return new VideoCell(apiVideoObject, subjectiveMeta);
		}
   }

 }]);

/**
 * PModels.VideoModel
 */

	PModels.factory('VideoModel', function() {
		return {
			construct : function(apiVideoObject) {

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

	PLoaders.factory('FeedLoader', ['$q', 'FeedModel', function($q, FeedModel) {
		return {
			preLoad : function(type, requireUserContext) {

				var preLoadingFeed = $q.defer(),
						Feed = FeedModel.construct(type, requireUserContext);

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

PLoaders.factory('ProfileLoader', ['$q', 'logger', 'ApiManager', 'ProfileModel', 'UserContextManager',

	function($q, logger, ApiManager, ProfileModel, UserContextManager) {

		return {

			loadOwnProfile : function() {

				var loadingProfile = $q.defer();
				var userContext = UserContextManager.getActiveUserContext();

				if(userContext) {
					ApiManager.users('showMe', userContext, {})
						.then(function(apiResponse) {
							var Profile = ProfileModel.construct(apiResponse.result.object);
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

				APiManger.users('show', userContext, {})
					.then(function(apiResponse) {
						var Profile = ProfileModel.construct(apiResponse.result.object);
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
 * PManagers.ApiManager.js
 */

PManagers.factory('ApiManager', ['ApiClient', function(ApiClient) {
	return {
		userContexts: function(method, userContext, params) {
			return ApiClient.createRequest('userContexts', method, userContext, params).exec();
		},
		videos: function(method, userContext, params) {
			return ApiClient.createRequest('videos', method, userContext, params).exec();
		},
		users: function(method, userContext, params) {
			return ApiClient.createRequest('users', method, userContext, params).exec();
		},
		comments: function(method, userContext, params) {
			return ApiClient.createRequest('comments', method, userContext, params).exec();
		},
		likes: function(method, userContext, params) {
			return ApiClient.createRequest('likes', method, userContext, params).exec();
		},
		views: function(method, userContext, params) {
			return ApiClient.createRequest('views', method, userContext, params).exec();
		},
		demands: function(method, userContext, params) {
			return ApiClient.createRequest('demands', method, userContext, params).exec();
		},
		friendships: function(method, userContext, params) {
			return ApiClient.createRequest('friendships', method, userContext, params).exec();
		},
		activities: function(method, userContext, params) {
			return ApiClient.createRequest('activities', method, userContext, params).exec();
		}
	}
}]);
/**
 * PManagers.UserContextManager
 *   @dependency {Angular} $q
 *   @dependency {Present} logger -- configurable logger for development
 *   @dependency {Present} UserContextApiClient -- handles present api requests for the user context resource
 */

PManagers.factory('UserContextManager', ['$q', 'localStorageService', 'logger', 'ApiManager',
																				 'UserContextModel',

  function($q, localStorageService, logger, ApiManager, UserContextModel) {

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

        ApiManager.userContexts('create', null, {username : username, password: password})
          .then(function(apiResponse) {
          	var userContext = UserContextModel.construct(apiResponse.result.object);
            localStorageService.clearAll();
            localStorageService.set('token', userContext.token);
            localStorageService.set('userId', userContext.userId);
						localStorageService.set('profile', JSON.stringify(userContext.profile));
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

				if (localStorageService.get('token') && localStorageService.get('userId') && localStorageService.get('profile')) {

					var userContext = UserContextModel.create(
						localStorageService.get('token'),
						localStorageService.get('userId'),
						localStorageService.get('profile')
					);

					ApiManager.userContexts('destroy', userContext, {})
            .then(function(apiResponse) {
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

        if (localStorageService.get('token') && localStorageService.get('userId') && localStorageService.get('profile')) {
					return userContext = UserContextModel.create(
						localStorageService.get('token'),
						localStorageService.get('userId'),
						localStorageService.get('profile')
					);
				} else return null;

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

			controller: function($scope, $state, logger, UserContextManager, NavbarModel) {

				logger.test(['PDirectives -- Navbar initialized']);
				$scope.Navbar = NavbarModel.create();
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

PDirectives.directive('pEnter', function() {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.pEnter);
				});

				event.preventDefault();
			}
		});
	};
});
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

			scope.$watchCollection('videoCell.likes', function(){});

		}
	}
});
/**
 * PDirectives.viewContainerDirective
 * HTML Directive that controls the main view container
 * I.E custom extension for ui-view
 */

  PDirectives.directive('viewContainer', function() {});
