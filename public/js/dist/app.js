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
			 * @property fullscreenEnabled <Boolean> -- When true state is full screen (i.e doens't scroll)
			 * @property navbarEnabled <Boolean> -- When true navigation bar is visible
			 * @property requireUserContext <Boolean> -- When true user context is required to access state
			 */

      $stateProvider

        .state('splash', {
          url: '/',
          templateUrl: 'views/splash',
          controller: 'SplashController',
          meta: {availability: 'public'}
        })

				.state('discover', {
					abstract: true,
					templateUrl: 'views/discover'
				})

				.state('discover.default', {
					url: '/discover',
					views: {
						'navbar@' : {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'feed@discover': {templateUrl: 'views/partials/feed', controller: 'FeedController'}
					},
					resolve: {
						Feed: function(FeedLoader) {
							return FeedLoader.preLoad('discover', false);
						}
					},
					meta: {availability: 'public'}
				})

				.state('present', {
					url: '/p/:video',
					views: {
						'navbar@' : {templateUrl: 'views/partials/navbar', controller: 'NavbarController'}
					},
					meta: {availability: 'public'}
				})

				.state('home', {
					abstract: true,
					templateUrl: 'views/home'
				})

				.state('home.default', {
					url: '/home',
					views: {
						'navbar@': {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'feed@home': {templateUrl: 'views/partials/feed', controller: 'FeedController'},
						'profile@home': {templateUrl: 'views/partials/home_profile', controller: 'UserProfileController'}
					},
					resolve: {
						Feed: function(FeedLoader) {
							return FeedLoader.preLoad('home', true)
						},
						User: function(UserLoader) {
							return UserLoader.preLoad('showMe', true)
						}
					},
					meta: {availability: 'private'}
				})

				.state('home.group', {
					url: '/home/:group',
					views: {
						'navbar@': {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'feed@home': {templateUrl: 'views/partials/feed', controller: 'FeedController'},
						'profile@home': {templateUrl: 'views/partials/home_profile', controller: 'UserProfileController'}
					},
					resolve: {
						Feed: function(FeedLoader) {
							return FeedLoader.preLoad('home', true)
						},
						User: function(UserLoader) {
							return UserLoader.preLoad('showMe', true)
						}
					},
					meta: {availability: 'private'}
				})

				.state('user', {
					abstract: true,
					templateUrl: 'views/user'
				})

				.state('user.profile', {
					url: '/:user',
					views: {
						'navbar@': {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'profile@user': {templateUrl: 'views/partials/user_profile', controller: 'UserProfileController'},
						'feed@user': {templateUrl: 'views/partials/feed', controller: 'FeedController'}
					},
					resolve: {
						Feed: function(FeedLoader, $stateParams) {
							return FeedLoader.preLoad('user', false, $stateParams.user)
						},
						User: function(UserLoader, $stateParams) {
							return UserLoader.preLoad('show', false, $stateParams.user)
						}
					},
					meta: {availability: 'public'}
				})

				.state('account', {
					abstract: true,
					templateUrl: 'views/account'
				})

				.state('account.login', {
					url: '/account/login',
					views: {
						'navbar@' : {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'login@account' : {templateUrl:  'views/partials/login', controller: 'LoginController'}
					},
					meta: {availability: 'public'}
				})

				.state('account.register', {
					url: '/account/register?invite_id&invite_user_id',
					views: {
						'navbar@' : {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'register@account' : {templateUrl:  'views/partials/register', controller: 'RegisterController'}
					},
					meta: {availability: 'public'}
				})

				.state('account.requestPasswordReset', {
					url: '/account/request_password_reset',
					views: {
						'navbar@' : {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'requestPasswordReset@account' : {
							templateUrl: 'views/partials/request_password_reset',
							controller: 'RequestPasswordResetController'
							}
					},
					meta: {availability: 'public'}
				})

				.state('account.resetPassword', {
					url: '/account/reset_password?user_id&password_reset_token',
					views: {
						'navbar@' : {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'resetPassword@account' : {templateUrl:  'views/partials/reset_password', controller: 'ResetPasswordController'}
					},
					meta: {availability: 'public'}
				})

				.state('account.edit', {
					url: '/account/edit',
					views: {
						'navbar@': {templateUrl: 'views/partials/navbar', controller: 'NavbarController'},
						'edit@account': {templateUrl: 'views/partials/edit_profile', controller: 'EditProfileController'}
					},
					resolve: {
						User : function(UserLoader) {
							return UserLoader.preLoad('showMe', false);
						}
					},
					meta: {availability: 'private'}
				})


  }]);


/**
 * Handles sending and receiving requests from the Present
 * @namespace
 * @param  $http  <Angular>
 * @param  $q <Angular>
 * @param  logger <PUtilities>
 * @param PApiClientConfig <PApiClient>
 * @returns {Function} createRequest
 */

PApiClient.factory('ApiClient', ['$http', '$q', 'logger', 'ApiClientConfig', function($http, $q, logger, ApiConfig) {
	return {

		/**
		 * Factory method that returns a new Request instance
		 * @returns {Request}
		 */

		createRequest : function(resource, method, userContext, params) {

			/**
			 * @constructor
			 * @param {String} resource - API resource being requested ex: 'videos'
			 * @param {String} method - Resource method being requested ex 'listBrandNewVideos'
			 * @param {UserContext} userContext - the active user context
			 * @param {Object} params - Request params, which will either be assigned as body params or query strings
			 *
			 * @property {String} httpMethod - HTTP verb e.g. 'POST
			 * @property {String} url - Url where the resource method is located
			 * @property {Object} data -  Params attached to the request body
			 * @property {Object} params - Params included in the query string
			 * @property {Object} headers - Present user context headers
			 * @property {Boolean} validUserContextHeaders - Indicates whether the user context headers were set
			 * @property {boolean} requiresUserContext - Determines if the request requires a valid user context
			 */

			/**
			 * api.present.tv/v1/videos/list_brand_new_videos
			 */

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

			/**
			 * Executes the XHR call with failure and success blocks
			 * @returns {*}
			 */

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


/**
 * Api Configuration:
 * @namespace
 * @returns {Object}
 */

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
				listUserVideos : {
					httpMethod : 'GET',
					url : 'videos/list_user_videos',
					requiresUserContext : false
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
				},
				search : {
					httpMethod : 'GET',
					url : 'users/search',
					requiresUserContext : false
				},
				update : {
					httpMethod: 'POST',
					url: 'users/update',
					requiresUserContext: true
				},
				create : {
					httpMethod : 'POST',
					url : 'users/create',
					requiresUserContext : false
				},
				destroy : {
					httpMethod : 'POST',
					url : 'users/destroy',
					requiresUserContext : true
				},
				resetPassword : {
					httpMethod: 'POST',
					url : 'users/reset_password',
					requiresUserContext: false
				},
				requestPasswordReset : {
					httpMethod: 'POST',
					url: 'users/request_password_reset',
					requiresUserContest: false
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

			views : {
				create: {
					httpMethod: 'POST',
					url: 'views/create',
					requiresUserContext: true
				}
			},

			demands : {
				create: {
					httpMethod: 'POST',
					url: 'demands/create',
					requireUserContext : true
				}
			},

			friendships : {
				create : {
					httpMethod: 'POST',
					url: 'friendships/create',
					requiresUserContext : true
				},
				destroy : {
					httpMethod : 'POST',
					url : 'friendships/destroy',
					requiresUserContext : true
				}
			},

			activities : {}

		}
	}
});

/**
 * Constructs a new Comment Object
 * @namespace
 */



	PModels.factory('CommentModel', function() {
		return{

			/**
			 * Factory method that returns a new Comment instance from an API response object
			 * @param {Object} apiCommentObject - Comment result object returned from the API
			 * @returns {Comment}
			 */
			construct : function(apiCommentObject) {

				/**
				 * @constructor
				 * @param {Object} apiCommentObject - Like result object returned from the API
				 *
				 * @property {String} _id - Unique _id for the Comment
				 * @property {Object} sourceUser - User who created the Comment
				 * @property {String} targetVideo - String representing the _id of the target video
				 * @property {String} timeAgo - Time elapsed since the like was created
				 */

				function Comment(apiCommentObject) {
					this._id = apiCommentObject._id;
					this.body = apiCommentObject.body;
					this.sourceUser = {
						_id: apiCommentObject.sourceUser.object._id,
						username: apiCommentObject.sourceUser.object.username,
						profilePicture: apiCommentObject.sourceUser.object.profile.picture.url
					};
					this.targetVideo = apiCommentObject.targetVideo;
					this.timeAgo = '5 min'
				}

				return new Comment(apiCommentObject);

			},

			create : function(body, targetVideo, sourceUser) {

				/**
				 * 'Overloaded' constructor for creating new comment objects
				 * @constructor
				 * @param {String} targetVideo
				 * @param {Object} sourceUser
				 * @see construct method for property overview
				 */

				function Comment(body, targetVideo, sourceUser) {
					this._id = "";
					this.body = body;
					this.sourceUser = {
						_id: sourceUser._id,
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
 * Constructs the Feed, which is composed of Video Cells
 * @param {Angular} $Q
 * @param {PManagers} UserContextManager
 * @param {PManagers} ApiManager
 * @param {PModels} VideoCellModel
 * @param {PModels} VideoCellModel
 */

  PModels.factory('FeedModel', ['$q', 'UserContextManager', 'ApiManager', 'VideoCellModel', 'ProfileModel',

    function($q, UserContextManager, ApiManager, VideoCellModel, ProfileModel) {
      return {

				/**
				 * Factory method that returns a new Feed instance constructed from an API response
				 * @returns {Feed}
				 */

        construct: function(type, requireUserContext, username) {

					/**
					 * @constructor
					 * @param {String} type - defines the type of feed being instantiated
					 * @param {Boolean} requireUserContext - sets the availability of the feed
					 *
					 * @property {String} type - Determines the type of feed such as 'discover'
					 * @property {Boolean} requireUserContext - Sets the availability of the feed
					 * @property {String} activeVideo - String representing the id of the actively playing video
					 * @property {Number} cursor - Current cursor for the feed
					 * @property {Boolean} isLoading - Indicates whether the feed is loading more videos
					 * @property {VideoCell[]} videoCells - Array of video cells which make the feed
					 */

          function Feed(type, requireUserContext, username) {
						this.type = type;
						this.requireUserContext = requireUserContext;
						this.activeVideo = null;
						this.cursor = null;
						this.isLoading = false;
						this.videoCells = [];

						/**
						 * TODO : determine if there is a better way add a user to a feed
						 */

						if(username) this.username = username

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
							case 'user':
								resourceMethod = 'listUserVideos';
								break;
							default:
								resourceMethod = 'listBrandNewVideos';
								break;
						}
						return resourceMethod;
					};

 					/**
					 * Loads a segment of a video feed
					 * @returns {*}
					 */

					Feed.prototype.load = function() {

						var loadingFeed = $q.defer(),
								userContext = UserContextManager.getActiveUserContext();

						var resourceMethod = loadResourceMethod(this.type);
						var params = {
									cursor: this.cursor,
									limit: 15
								};

						if (this.type == 'user') params.username = this.username;

						if (this.requireUserContext && !userContext) {
							loadingFeed.reject();
						} else {
							var _this = this;
							ApiManager.videos(resourceMethod, userContext, params)
								.then(function(apiResponse) {
									for(var i=0, length=apiResponse.results.length; i < length; i++) {
										var VideoCell = VideoCellModel
																			.construct(apiResponse.results[i].object, apiResponse.results[i].subjectiveObjectMeta);
										_this.videoCells.push(VideoCell);
									}
									if(_this.type == 'user') _this.mapSourceUser().then(loadingFeed.resolve());
									else loadingFeed.resolve();
								})
								.catch(function() {
									loadingFeed.reject();
								});
						}

						return loadingFeed.promise;

					};

					Feed.prototype.mapSourceUser = function() {
						var mappingSourceUser = $q.defer(),
								_this = this;
						ApiManager.users('show', false, {username: this.username})
							.then(function(apiResponse) {
								_this.videoCells.map(function(videoCell) {
									videoCell.video.creator = ProfileModel.construct(apiResponse.result.object);
								});
								mappingSourceUser.resolve();
							})
							.catch(function() {
								mappingSourceUser.reject();
							});
						return mappingSourceUser.promise;
					};

          return new Feed(type, requireUserContext, username);

        }
      }
    }

  ]);

/**
 * Constructs a new likes object
 * @namespace
 */

	PModels.factory('LikeModel', function() {
		return {

			/**
			 * Factory method that returns a new like instance constructed from an API response
			 * @returns {Like}
			 */

			construct: function(apiLikeObject) {

				/**
				 * @constructor
				 * @param {Object} apiLikeObject - Like result object returned from the API
				 *
				 * @property {String} _id - Unique _id for the Like
				 * @property {Object} sourceUser - User who created the Like
				 * @property {String} targetVideo - String representing the _id of the target video
				 * @property {String} timeAgo - Time elapsed since the like was created
				 */

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

			/**
			 * Factory method that returns a new Like instance created within the app
			 * @returns {Like}
			 */

			create : function(targetVideo, sourceUser) {

				/**
				 * 'Overloaded' constructor for creating new like objects
				 * @constructor
				 * @param {String} targetVideo
				 * @param {Object} sourceUser
				 * @see construct method for property overview
				 */

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
 * FeedbackModel
 * @class
 */

PModels.factory('MessageModel', function() {
	return {
		create : function(type, style, content, visible) {

			/**
			 * @constructor
			 * @oaram {String} type - determines the Message type e.g. modal
			 * @param {String} style - Sets the css class for the Message
			 * @param {Boolean} visible - Sets the visibility of the Message
			 * @param {Object} content - The Message content
			 */

			function Message(type, style, content, visible) {
				if (!style) style = 'primary';
				this.style = [type, style];
				this.visible = visible || false;
				this.title = content ? content.title : '';
				this.body = content ? content.body : '';
				this.options = content ? content.options : [];
			}

			Message.prototype.show = function(content, style) {

				if(content) {
					this.style = style || this.style;
					this.body = content.body;
					this.title = content.title;
					this.options = content.options;
				}

				this.visible = true;

			};

			Message.prototype.clear = function() {
				this.visible = false;
				this.body = '';
				this.title = '';
				this.options = []
			};

			return new Message(type, style, content, visible);

		}
	}
});
/**
 * Properties and methods to handle the state of the Navbar
 * 	@param $q {Angular}
 * 	@param $state {Ui-Router}
 * 	@param logger {PUtilities}
 * 	@param UserContextManager {PManagers}
 * 	@param VideosApiClient {PApiClient}
 * 	@param UsersApiClient {PApiClient}
 * 	@param VideoModel {PModels}
 * 	@param ProfileModel {PModels}
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

			/**
			 * Factory method that returns a new Navbar instance
			 * @returns {Navbar}
			 */
			create : function() {

				/**
				 * @constructor
				 *
				 * @property {Object} mode
				 * @property {Boolean} isEnabled - Indicates whether the current view has the navbar enabled (visible)
				 * @property {Object} hub - Contains the profile information of the active user
				 * @property {Object search - Contains the properties and results of the search bar
				 */

				function Navbar() {

					var userContext = UserContextManager.getActiveUserContext();

					this.mode = {loggedIn: false};

					if (userContext) this.mode = {loggedIn : true};

					this.hub = {
						username : '',
						profilePicture : ''
					};

					if (userContext) {
						this.hub.username = userContext.profile.username;
						this.hub.profilePicture = userContext.profile.profilePicture;
					}

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
				 * Sends Users and Videos search API requests in parallel and then updates the search result properties
				 * @param {String} query the search query string provided by the user
				 * @returns {*}
				 */

				Navbar.prototype.sendSearchQuery = function(query) {

					var sendingVideosSearch = $q.defer(),
						 sendingUsersSearch = $q.defer(),
						 videosSearchResults = this.search.results.videos,
						 usersSearchResults = this.search.results.users,
						 userContext = UserContextManager.getActiveUserContext();

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
				 * Sets the search.dropdownEnabled to true
				 */

				Navbar.prototype.showDropdown = function() {
					this.search.dropdownEnabled = true;
				};

				/**
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

PModels.factory('ProfileModel', function() {

	return {

		construct : function(apiProfileObject) {

			function Profile(apiProfileObject) {

				this._id = apiProfileObject._id;
				this.username = apiProfileObject.username;
				this.fullName = apiProfileObject.profile.fullName || '';
				this.profilePicture = apiProfileObject.profile.picture.url;
				this.description = apiProfileObject.profile.description;
				this.gender = apiProfileObject.profile.gender;
				this.location = apiProfileObject.profile.location;
				this.website = apiProfileObject.profile.website;


				this.counts = {
					videos: apiProfileObject.videos.count,
					views: apiProfileObject.views.count,
					likes: apiProfileObject.likes.count,
					followers: apiProfileObject.followers.count,
					friends: apiProfileObject.friends.count
				};

				this.phoneNumber = apiProfileObject.phoneNumber ? apiProfileObject.phoneNumber : null;
				this.email = apiProfileObject.email ? apiProfileObject.email : null;

				/** Determine the display name(s) **/
				if (apiProfileObject.profile.fullName) {
					this.displayName = apiProfileObject.profile.fullName;
					this.altName = '@' + apiProfileObject.username;
				} else {
					this.displayName = apiProfileObject.username;
					this.altName = null;
				}

			}

			return new Profile(apiProfileObject);

		}

	}

});
/**
 * Provides properties and methods to manage the state of the UserSession
 * @param {PUtilities} logger
 * @param {UIRouter} $state
 * @param {PManagaers} UserContextManager
 */

  PModels.factory('SessionModel', ['$rootScope', '$state', 'logger', 'UserContextManager',

		function($rootScope, $state, logger, UserContextManager) {
			return {

				/**
				 * Ensure the user has access to the requested state
				 * @param {Event} event -- stateChangeStart event object which contains the preventDefault method
				 * @param {Object }toState -- the state the the UserSession is transitioning into
				 */

				authorize : function(event, toState) {

					var userContext = UserContextManager.getActiveUserContext();
					if (toState.meta.availability == 'private' && !userContext) {
						event.preventDefault();
						$state.go('account.login');
					}

				},


				/**
				 * Handles user context creation, sets the activeUser property and changes the state to home.default
				 * @param {String} username - The user provided username
				 * @param {String} password - The user provided password
				 */

				login: function(options) {

					var userContext = UserContextManager.getActiveUserContext();

					if (!userContext) {
						UserContextManager.createNewUserContext(options.input.username, options.input.password)
							.then(function () {
								$rootScope.$broadcast('_newUserLoggedIn');
								$state.go('home.default');
							})
							.catch(function () {
								//TODO: Implement better user feedback for failed login
								alert('username and/or password is incorrect');
							});

					} else {
						$state.go('home.default');
					}

				},

				/**
				 * Handles user context deletion and changes the state to splash
				 */

				logout: function() {
					UserContextManager.destroyActiveUserContext()
						.then(function () {
							$state.go('splash');
						});
				}

			};

  	}

	]);

/**
 * Constructs a new UserContext Model
 * @namespace
 */

	PModels.factory('UserContextModel', ['ProfileModel', function(ProfileModel) {
		return {

			/**
			 * Factory method that returns a new UserContext instance constructed from an API response
			 * @param {Object} apiResponseObject - UserContext result object returned from the API
			 * @returns {UserContext}
			 */

			construct: function(apiResponseObject) {

				/**
				 * @constructor
				 * @param {Object} apiResponseObject
				 */

				function UserContext (apiResponseObject) {
					this.token  = apiResponseObject.sessionToken;
					this.userId = apiResponseObject.user.object._id;
					this.profile = ProfileModel.construct(apiResponseObject.user.object);
				}

				return new UserContext(apiResponseObject);

			},

			/**
			 * Factory method that returns a new UserContext instance created within the app.
			 * @param {String} token - Session token associated with the user context
			 * @param {String} userId - String representing the _id of the user
			 * @param {Profile} profile - Profile of user
			 * @returns {UserContext}
			 */

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
 * Constructs a new Profile Model
 * @class UserModel
 */

PModels.factory('UserModel', ['$q', 'logger', '$state', 'ProfileModel', 'UserContextManager', 'ApiManager',

	function($q, logger, $state, ProfileModel, UserContextManager, ApiManager) {

			return {

			/**
			 * Factory method that returns a new instance of the Profile Model
			 * @param {Object} apiUserObject
			 * @param {Object} subjectiveObjectMeta
			 * @returns {Profile}
			 */

				construct : function(apiUserObject, subjectiveObjectMeta) {

				/**
				 * @constructor
				 * @param {Object} subjectiveObjectMeta
				 * @param {Object} apiProfileObject
				 */

					function User(apiProfileObject, subjectiveObjectMeta) {
						this.profile = ProfileModel.construct(apiProfileObject, subjectiveObjectMeta);
						this.subjectiveMeta = subjectiveObjectMeta;
					}


					/**
					 * Either follows or un-follows the user based on the current relationship
					 */

					User.prototype.follow = function() {

						var userContext = UserContextManager.getActiveUserContext();
								params = {
									user_id : this.profile._id,
									username : this.profile.username
								};

						if(!userContext) {
							$state.go('login');
						} else if (this.subjectiveMeta.friendship.forward) {
								this.subjectiveMeta.friendship.forward = false;
								ApiManager.friendships('destroy', userContext, params);
						} else {
								this.subjectiveMeta.friendship.forward = true;
								ApiManager.friendships('create', userContext, params);
						}

					};

				//TODO : Add `exec` method to Profile Controllers and remove User Context Manager from Models

					/**
					 * Demand the user
					 */


					User.prototype.demand = function() {

						var userContext = UserContextManager.getActiveUserContext(),
								params = {
									user_id : this.profile._id,
									username : this.profile.username
								};

						if (!userContext) {
							$state.go('login');
						} else if (!subjectiveObjectMeta.demand.forward) {
								this.subjectiveMeta.demand.forward = true;
								ApiManager.demands('create', userContext, params);
						}

					};

					/**
					 * Updates the user's profile
					 * @param {Object} options
					 */

					User.prototype.update = function(options) {
						ApiManager.users('update', userContext, options.input)
							.then(function() {
								options.messages.error.clear();
								options.messages.success.show({body: 'Profile successfully updated!'});
							})
							.catch(function(apiResponse) {
								options.messages.error.show({body: apiResponse.result});
							});
					};

					return new User(apiUserObject, subjectiveObjectMeta);

				},

				/**
				 * Registers a new user account with the API.
				 * @returns {*}
				 */

				registerNewAccount : function(options) {

					var params = {
						username: options.input.username,
						email: options.input.email,
						password: options.input.password,
						invite_id : options.input.invite_id,
						invite_user_id: options.input.invite_id
					};

					ApiManager.users('create', null, params)
						.then(function() {
							options.messages.error.clear();
							options.messages.success.show();
						})
						.catch(function(apiResponse) {
							options.messages.error.show({body: apiResponse.result});
						});

				},

				/**
				 * Sends an email to the provided user email
				 */

				requestPasswordReset : function(options) {
					ApiManager.users('requestPasswordReset', null, options.input)
						.then(function(apiResponse) {
							options.messages.error.clear();
							options.messages.success.show({body: 'Please check your email for reset link.'});
						})
						.catch(function(apiResposne) {
							options.messages.error.show({body: apiResposne.result});
						});
				},

				/**
				 * Resets the account password
				 */

				resetAccountPassword : function(options) {
					ApiManager.users('resetPassword', userContext, options.input)
						.then(function() {
							options.messages.error.clear();
							options.messages.success.show({body: 'Password successfully reset.'});
						})
						.catch(function(apiResponse) {
							options.messages.error.show({body: apiResponse.result});
						});
				}

			}
 		}
	]);

/**
 * VideoCellModel
 * @namespace
 * @param {UIRouter} $state
 * @param {PManagers} UserContextManager
 * @param {PManagers} ApiManager
 * @param {PModels} VideoModel
 * @param {PModels} CommentModel
 * @param {PModels} LikeModel
 */

 PModels.factory('VideoCellModel', ['$state', 'UserContextManager', 'ApiManager', 'VideoModel',
	 																	'CommentModel', 'LikeModel',

	 function($state, UserContextManager, ApiManager, VideoModel,
						CommentModel, LikeModel) {

   return {

		 /**
			* Factory method that returns a new Request instance constructed from an API response
			* @returns {VideoCell}
			*/

	 	 construct: function(apiVideoObject, subjectiveMeta) {

			 /**
				* @constructor
				* @param {Object} apiVideoObject - Video result object returned from the API
				* @param subjectiveMeta - Subjective meta data for the video result object
				*
				* @property {Video} video - Video contained within the cell
				* @property {Comments[]} comments -  Array of comments associated with the video
				* @property {Likes[]} likes - Array of likes associated with the video
				* @property {Replies[]} replies - Array of replies associated with the video
				* @property {Object} input - Object containing bindable text input values
				*/

				function VideoCell(apiVideoObject, subjectiveMeta) {
					this.video = VideoModel.construct(apiVideoObject);
					this.comments = [];
					this.likes = [];
					this.replies = [];

				 //TODO: Extract this out of the videoCell Model
					this.input = {
						comment : ''
					};

				  //TODO: Move this subjective meta to the video model instead
					this.subjectiveMeta = subjectiveMeta;

					var embededResults = {
						comments : apiVideoObject.comments.results,
						likes : apiVideoObject.likes.results
					};

				 /**
					* Loop through comments and likes, creating a new instance of each and then adding it to the VideoCell
					*
					*/

					for(var i = 0;  i < embededResults.comments.length; i++) {
						var Comment = CommentModel.construct(embededResults.comments[i].object);
						this.comments.splice(0, 0, Comment);
					}

					for(var j = 0; j < embededResults.likes.length;  j++) {
						var Like = LikeModel.construct(embededResults.likes[j].object);
						this.likes.push(Like);
					}

				}

			 /**
				* Either adds or removes a like depending on the user's current relationship with the video
				* NOTE: Like create and destroy methods are stubbed intentionally
				*/

			 VideoCell.prototype.toggleLike = function() {

					var userContext = UserContextManager.getActiveUserContext(),
							_this = this;

				  /** Redirect the user to log in if there is no active user context **/
					if(!userContext) {
						$state.go('account.login');
					}
					/** Remove the like if the user already has a forward like relationship with the video **/
					else if (this.subjectiveMeta.like.forward) {
						this.video.counts.likes--;
						this.subjectiveMeta.like.forward = false;
						for (var i=0; i < this.likes.length; i ++) {
							if (this.likes[i].sourceUser._id == userContext.userId)
							this.likes.splice(i, 1);
						}
						ApiManager.likes('destroy', userContext, {video_id : this.video._id});
					/** Add a like if there is no forward like relationship with the video **/
					} else {
							var newLike = LikeModel.create(this.video._id, userContext.profile);
							this.video.counts.likes++;
							this.subjectiveMeta.like.forward = true;
							this.likes.push(newLike);
							ApiManager.likes('create', userContext, {video_id : this.video._id});
						}

			 };

			 /**
				* Adds a comment to the video cell, and informs the API
				*/

			 //TODO: pass in the new comment input, since it is no longer an instance property
			 VideoCell.prototype.addComment = function() {

					var userContext = UserContextManager.getActiveUserContext(),
							_this = this;

				 /** Redirect the user to log in if there is no active user context **/
				 if(!userContext) {
						$state.go('account.login');
					}
				 /** Add the comment to the video cell **/
				 else if (this.input.comment.length >= 1) {
						var newComment = CommentModel.create(this.input.comment, this.video._id, userContext.profile);
						this.video.counts.comments++;
						this.input.comment = '';
						ApiManager.comments('create', userContext, {body : newComment.body, video_id: newComment.targetVideo})
							.then(function(apiResponse) {
								newComment._id = apiResponse.result.object._id;
								_this.comments.push(newComment);
							});
				 }

			 };

			 /**
				* Deletes the selected comment from the video cell and informs the API
				* @param {Comment} comment - The comment to be deleted
				*/

			 VideoCell.prototype.removeComment = function(comment) {

				 var userContext = UserContextManager.getActiveUserContext();

				 /** Redirect the user if there is no active user context **/
				 if(!userContext) {
				 	$state.go('account.login');
				 /** Remove the comment if the active user is the source user of the comment **/
				 } else if(comment.sourceUser._id == userContext.userId) {
						this.video.counts.comments--;
						for (var i = 0; i < this.comments.length; i ++) {
							if (this.comments[i]._id == comment._id) {
								this.comments.splice(i, 1);
							}
						}
						ApiManager.comments('destroy', userContext, {comment_id : comment._id});
				 }

			 };

			 return new VideoCell(apiVideoObject, subjectiveMeta);

		 }
   }

 }]);

/**
 * Constructs a new Video Model
 * @namespace
 */

	PModels.factory('VideoModel', ['ProfileModel', function(ProfileModel) {
		return {

			/**
			 * Factory method that returns a new Video instance constructed from an API response.
			 * @param apiVideoObject
			 * @returns {Video}
			 */

			construct : function(apiVideoObject) {

				/**
				 * @constructor
				 * @param {Object} apiVideoObject
				 */

				function Video(apiVideoObject) {
					this._id = apiVideoObject._id;
					this.title = apiVideoObject.title;
					this.isAvailable = apiVideoObject.isAvailable;
					this.media = {
						still          : apiVideoObject.mediaUrls.images['480px'] || null,
						replayPlaylist : apiVideoObject.mediaUrls.playlists.replay.master || null
					};

					/** Check to see if the video is live **/
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

					this.counts = {
						comments : apiVideoObject.comments.count,
						likes    : apiVideoObject.likes.count
					};

					if (apiVideoObject.creatorUser.object)
					this.creator = ProfileModel.construct(apiVideoObject.creatorUser.object);

				}

				return new Video(apiVideoObject);

			}
		}
	}]);
/**
 * Loads a new Feed Model which will be resolved, and injected into a controller
 * @param {Angular} $q
 * @param {PModels} FeedModel
 */

	PLoaders.factory('FeedLoader', ['$q', 'FeedModel', function($q, FeedModel) {

		return {

			/**
			 * @param type
			 * @param {String} requireUserContext - Determines whether or not
			 * @param {String} [username] -- Optional username for user feeds
			 * @returns {*}
			 */

			preLoad : function(type, requireUserContext, username) {

				var preLoadingFeed = $q.defer(),
						Feed = FeedModel.construct(type, requireUserContext, username);

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
 * Loads a new Profile Model which will be resolved, and injected into a controller
 * @param {Angular} $q
 * @param {PUtilities} logger
 * @param {PManagers} ApiManager
 * @param {PManagers} UserContextManager
 */

PLoaders.factory('UserLoader', ['$q', 'logger', 'ApiManager', 'UserModel', 'UserContextManager',

	function($q, logger, ApiManager, UserModel, UserContextManager) {

		return {

			preLoad : function(method, requiresUserContext, username) {

				var loadingUser = $q.defer();
				var userContext = UserContextManager.getActiveUserContext();

				if(requiresUserContext && !userContext) {
					$state.go('login');
				} else {
					ApiManager.users(method, userContext, {username: username})
						.then(function(apiResponse) {
							var User = UserModel.construct(apiResponse.result.object, apiResponse.result.subjectiveObjectMeta);
							loadingUser.resolve(User);
						})
						.catch(function() {
							loadingUser.reject();
						});
				}

				return loadingUser.promise;

			}

		}
	}

]);

/**
 * Provides an interface to the API client to be used throughout the App
 * @namespace
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
 * Manages the user context for the active user session
 * @namespace
 * @param {Angular} $q
 * @param {LStorage} localStorageService
 * @param {PUtilties} logger
 * @param {PManager} ApiManager
 * @param {PModel} UserContextModel
 */

PManagers.factory('UserContextManager', ['$q', 'localStorageService', 'logger', 'ApiManager',
																				 'UserContextModel',

  function($q, localStorageService, logger, ApiManager, UserContextModel) {

		/**
		 * @static service for managing user context
		 */

    return {

      /**
       * Sends a request to create a new user context and stores it to local storage on success
       * @param {String} username - username in which the user context will be created with
       * @param {String} password - password to validate the user
			 * @returns {*}
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
       * Sends a request to delete the user context and clears userContext token from local storage
			 * @returns {*}
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
       * Retrieves the active user context from session storage
       * @return {UserContext} [userContext]
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
 * Invoke
 */

	PUtilities.factory('invoke', ['UserContextManager', function(UserContextManager) {
		return function (model, method, params, requiresUserContext) {

			var userContext = UserContextManager.getActiveUserContext();

			if (requiresUserContext && !userContext) {
				$state.go('login');
			} else {
				model[method](params);
			}

		}
	}]);
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
 * EditProfileController
 * @namespace
 */

PControllers.controller('EditProfileController', ['$scope', 'invoke', 'MessageModel', 'UserContextManager', 'User',

	function($scope, invoke, MessageModel, UserContextManager, User) {

		/** Initializes a new User instance on the Controller $scope **/
		$scope.user = User;

		$scope.input = {
			full_name: User.profile.fullName,
			description: User.profile.description,
			gender: User.profile.gender,
			location: User.profile.location,
			website: User.profile.website,
			email: User.profile.email,
			phone_number: User.profile.phoneNumber
		};

		$scope.messages = {
			success: MessageModel.create('alert', 'success', {body: 'Saved!'})    ,
			error: MessageModel.create('alert', 'error')
		};

		$scope.genders = ['Male', 'Female'];

		$scope.invoke = invoke;

		function validateInput(input, error, msg) {
			if(input.$dirty && input.$error[error]) {
				$scope.messages.success.clear();
				$scope.messages[input.$name + '_' + error] = MessageModel.create('alert', 'error', {body: msg}, true);
			} else if($scope.messages[input.$name + '_' + error] && !input.$error[error]) {
				$scope.messages[input.$name + '_' + error].clear();
			}
		}

		$scope.$watchCollection('form.email', function(email) {
			validateInput(email, 'required', 'Email can not be blank');
			validateInput(email, 'email', 'Email is invalid');
		});

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

  PControllers.controller('LoginController', ['$scope', 'invoke', 'SessionModel',

		function($scope, invoke, SessionModel) {

			$scope.input = {
				username : '',
				password : ''
			};

			$scope.invoke = invoke;
			$scope.SessionModel = SessionModel;

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

	PControllers.controller('RegisterController', ['$scope', '$stateParams', 'invoke', 'MessageModel', 'UserModel', 'UserContextManager',

			function($scope, $stateParams, invoke, MessageModel, UserModel, UserContextManager) {

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
					}, false),

					error: MessageModel.create('alert', 'error')

				};

				$scope.invoke = invoke;


				function validateInput(input, error, msg) {
					if(input.$dirty && input.$error[error]) {
						$scope.messages[input.$name + '_' + error] = MessageModel.create('alert', 'error', {body: msg}, true);
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

/**
 * RequestPasswordResetController
 * @class
 */

PControllers.controller('RequestPasswordResetController', [ '$scope', 'invoke', 'UserModel', 'MessageModel',
	function($scope, invoke, UserModel, MessageModel) {

		$scope.UserModel = UserModel;
		$scope.input = {
			username: ''
		};
		$scope.messages = {
			success: MessageModel.create('alert', 'success', {body: 'Check your inbox!'}),
			error: MessageModel.create('alert', 'error')
		};
		$scope.invoke = invoke;

	}
]);
/*
 * LoginController
 * @namespace
 */

PControllers.controller('ResetPasswordController', ['$scope', '$stateParams', 'invoke', 'UserModel', 'MessageModel',

	function($scope, $stateParams, invoke, UserModel, MessageModel) {


		$scope.UserModel = UserModel;

		$scope.messages = {
			success: MessageModel.create('alert', 'success', {body: 'Password successfully reset.'}),
			error: MessageModel.create('alert', 'error')
		};

		$scope.invoke = invoke;


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



	PDirectives.directive('matchPasswords', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				scope.$watch('input.confirmPassword', function(newValue, oldValue) {
					 if(newValue == scope.input.password) {
						 ngModel.$setValidity('matchPasswords', true)
					 } else ngModel.$setValidity('matchPasswords', false);
				});
			}
		}
	});

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


PDirectives.directive('pMessage', function() {
	return {
		restrict: 'EA',
		templateUrl: 'views/partials/message',
		scope : {
			pMessage : '='
		},
		link: function(scope, element, attrs) {
			console.log(scope.pMessage);
		}
	}
});
/**
 * pUser
 * @namespace
 */


	PDirectives.directive('pUser', function() {
		return {
			restrict: 'EA',
			link: function(scope, element, attr) {

				scope.$watch('User.subjectiveMeta.friendship.forward', function(newValue) {
					if (newValue) {
						scope.followBtn.css({
							'background-color': '#8E73FF',
							'border': 'solid 1px' +  '#8E73FF',
							'color': '#FFF'
						});
						scope.actions.friendship = 'Following';
					} else {
						scope.followBtn.css({
							'background-color': '#7BD4EB',
							'border': 'solid 1px' +  '#7BD4EB',
							'color': '#FFF'
						});
						scope.actions.friendship = 'Follow';
					}
				});

				scope.$watch('User.subjectiveMeta.demand.forward', function(newValue) {
					if (newValue) {
						scope.demandBtn.css({
							'background-color': '#8E73FF',
							'border': 'solid 1px' + '#8E73FF',
							'color': '#FFF'
						});
						scope.actions.demand = 'Demanded';
					} else {
						scope.demandBtn.css({
							'background-color': '#7BD4EB',
							'border': 'solid 1px' + '#7BD4EB',
							'color': '#FFF'
						});
						scope.actions.demand = 'Demand';
					}
				});

			}
		}

	});
/**
 * HTML directive for a video cell element
 */

PDirectives.directive('pVideoCell', function() {
	return {
		restrict : 'EA',
		link : function(scope, element, attrs) {
			scope.$watch('videoCell.subjectiveMeta.like.forward', function(newValue) {
				if (newValue) scope.likesElem.css({'color' : '#FF557F'});
				else scope.likesElem.css({'color' : '#47525D'});
			});

			scope.$watchCollection('videoCell.likes', function(){});

			scope.$watchCollection('videoCell.comments', function(){});

		}
	}
});
/**
 * PDirectives.viewContainerDirective
 * HTML Directive that controls the main view container
 * I.E custom extension for ui-view
 */

  PDirectives.directive('pViewContainer', function() {});



PDirectives.directive('registerElement', function() {
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