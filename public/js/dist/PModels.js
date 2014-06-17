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
							ApiManager.videos(resourceMethod, userContext, {cursor: this.cursor, limit: 15})
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
					this.comments.splice(0, 0, Comment);
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
					ApiManager.likes('destroy', userContext, {video_id : this.video_id});
				} else {
						var newLike = LikeModel.create(this.video._id, userContext.profile);
						this.video.counts.likes++;
						this.subjectiveMeta.like.forward = true;
						this.likes.push(newLike);
						ApiManager.likes('create', userContext, {video_id : this.video._id});
					}

			};

			VideoCell.prototype.addComment = function() {

				var userContext = UserContextManager.getActiveUserContext(),
						_this = this;

				if(!userContext) {
					$state.go('login');
				}
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

			VideoCell.prototype.removeComment = function(comment) {
				var userContext = UserContextManager.getActiveUserContext();
				if(!userContext) {
					$state.go('login');
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