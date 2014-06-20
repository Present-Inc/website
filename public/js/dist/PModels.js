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

  PModels.factory('FeedModel', ['$q', 'UserContextManager', 'ApiManager', 'VideoCellModel',

    function($q, UserContextManager, ApiManager, VideoCellModel) {
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
									loadingFeed.resolve();
								})
								.catch(function() {
									loadingFeed.reject();
								});
						}

						return loadingFeed.promise;

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
				 * Configuration method that is called on the ui router stateChangeStart event
				 * @param {Object} toState Ui-Router object that defines the requested state
				 */

				Navbar.prototype.configure = function(toState) {

					var userContext = UserContextManager.getActiveUserContext();

					if (toState.metaData.navbarEnabled) this.isEnabled = true;
					else this.isEnabled = false;

					if (userContext) this.mode.loggedIn = true;
					else this.mode.loggedIn = false;

				};

				/**
				 * Load the hub data if the user is still logged in when they enter the site
				 * Otherwise, the data is set on the _newUserLoggedIn event
				 */

				Navbar.prototype.loadHub = function() {
					var userContext = UserContextManager.getActiveUserContext();
					var hub = this.hub;
					if (userContext) {
						hub.username = userContext.profile.username;
						hub.profilePicture = userContext.profile.profilePicture;
					}
				};

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

			return new Profile(apiProfileObject);

		}

	}

});
/**
 * Constructs a new Reply Model
 */

PModels.factory('ReplyModel', function() {
	return {
		construct: function(apiReplyObject) {

			function Reply(apiReplyObject) {
				this._id = apiReplyObject._id;
				this.sourceUser = apiReplyObject.sourceUser;
				this.targetVideo = apiReplyObject.targetVideo;
			}

			return new Reply(apiReplyObject);

		}
	}
});

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
 * @namespace
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
					 * Follow / UnFollow a user
					 */

					User.prototype.follow = function() {

						var userContext = UserContextManager.getActiveUserContext();

						if(!userContext) {
							$state.go('login');
						} else if (this.subjectiveMeta.friendship.forward) {
								this.subjectiveMeta.friendship.forward = false;
								ApiManager.friendships('destroy', userContext, {});
						} else {
								this.subjectiveMeta.friendship.forward = true;
								ApiManager.friendships('create', userContext, {});
						}

					};

					/**
					 * Demand a user
					 */

					User.prototype.demand = function() {

						var userContext = UserContextManager.getActiveUserContext();

						if (!userContext) {
							$state.go('login');
						} else {
								this.subjectiveMeta.demand.forward = true;
								ApiManager.demands('create', userContext, {});
						}

					};

					/**
					 *
					 * @param updatedProfile
					 */

					User.prototype.update = function(updatedProfile) {

						var userContext = UserContextManager.getActiveUserContext(),
								updatingProfile = $q.defer();


						if (userContext) {
							ApiManager.users('update', userContext, updatedProfile)
								.then(function(apiResponse) {
									defer.resolve(apiResponse.result);
								})
								.catch(function(apiResponse) {
									defer.reject(apiResponse.result);
								});
						} else {
							defer.reject('Please log in and try again');
						}

						return updatingProfile.promise;

					};

					User.prototype.resetPassword = function(password) {

						var userContext = UserContextManager.getActiveUserContext(),
								resettingPassword = $q.defer();
						ApiManager.users('resetPassword', userContext, password)
							.then(function(apiResponse) {
								resttingPassword.reject();
							})
							.reject(function(apiResponse) {
								resettingPassword.reject();
							});

						return resettingPassword.promise;

					};

					return new User(apiUserObject, subjectiveObjectMeta);

				},

				/**
				 * Class method for registering a new account with the API.
				 * @returns {*}
				 */

				registerNewUserAccount : function(input) {

					deletingAccount = $q.defer();

					ApiManager.users('create', null, input)
						.then(function(apiResponse) {
							registeringAccount.resolve(apiResponse.result);
						})
						.catch(function() {
							registeringAccount.resolve(apiResponse.result);
						});

					return registeringAccount.promise;

				},

				/**
				 * Class method for deleting an account with the API
				 * @returns {*}
				 */

				deleteUserAccount : function() {

					var userContext = UserContextManager.getActiveUserContext(),
							deletingAccount = $q.defer();

					var params = {username: userContext.profile.username, user_id: userContext.userId};

					if(userContext) {
						ApiManager.users('destroy', userContext, params)
							.then(function(apiResponse) {
								deletingAccount.resolve(apiResponse.result);
							})
							.catch(function(apiResponse) {
								deletingAccount.reject(apitResponse.result);
							})
					} else {
						deletingAccount.reject('Please log in and try again');
					}

					return deletingAccount.promise;

				}

			}
 		}
	]);

/**
 * Provides properties and methods to manage the state of the UserSession
 * @param {PUtilities} logger
 * @param {UIRouter} $state
 * @param {PManagaers} UserContextManager
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
					 * Checks to make sure the user has access to the requested state
					 * @param {Event} event -- stateChangeStart event object which contains the preventDefault method
					 * @param {Object }toState -- the state the the UserSession is transitioning into
					 */

					UserSession.prototype.authorize = function(event, toState) {
						var userContext = UserContextManager.getActiveUserContext();
						if (toState.metaData.requireUserContext && !userContext) {
							event.preventDefault();
							$state.go('login');
						}
					};

					/**
					 * Handles user context creation, sets the activeUser property and changes the state to home
					 * @param {String} username - The user provided username
					 * @param {String} password - The user provided password
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
 * @namespace
 * @param {UIRouter} $state
 * @param {PManagers} UserContextManager
 * @param {PManagers} ApiManager
 * @param {PModels} VideoModel
 * @param {PModels} CommentModel
 * @param {PModels} LikeModel
 * @param {PModels} ReplyModel
 */

 PModels.factory('VideoCellModel', ['$state', 'UserContextManager', 'ApiManager', 'VideoModel',
	 																	'CommentModel', 'LikeModel', 'ReplyModel',

	 function($state, UserContextManager, ApiManager, VideoModel,
						CommentModel, LikeModel, ReplyModel) {

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
						likes : apiVideoObject.likes.results,
						replies : apiVideoObject.replies.results
					};

				 /**
					* Loop through comments likes and replies, creating a new instance of each and then adding it to the VideoCell
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

					for(var k = 0; k < embededResults.replies.length; k++) {
						var Reply = ReplyModel.construct(embededResults.replies[k].object);
						this.replies.push(Reply);
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
						$state.go('login');
					}
					/** Remove the like if the user already has a forward like relationship with the video **/
					else if (this.subjectiveMeta.like.forward) {
						this.video.counts.likes--;
						this.subjectiveMeta.like.forward = false;
						for (var i=0; i < this.likes.length; i ++) {
							if (this.likes[i].sourceUser._id == userContext.userId)
							this.likes.splice(i, 1);
						}
						ApiManager.likes('destroy', userContext, {video_id : this.video_id});
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
						$state.go('login');
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
				 	$state.go('login');
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

	PModels.factory('VideoModel', [function() {
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
						likes    : apiVideoObject.likes.count,
						replies  : apiVideoObject.replies.count
					};

					/**
					 * TODO: use the Profile model to create sourceUser objects
					 */

					if(apiVideoObject.creatorUser.object) {

						this.creator = {
							_id: apiVideoObject.creatorUser.object._id,
							profilePicture: apiVideoObject.creatorUser.object.profile.picture.url,
							username: apiVideoObject.creatorUser.object.username,
							displayName: '',
							altName: ''
						};


						/** Determine the display name(s) **/
						if (apiVideoObject.creatorUser.object.profile.fullName) {
							this.creator.displayName = apiVideoObject.creatorUser.object.profile.fullName;
							this.creator.altName = apiVideoObject.creatorUser.object.username;
						} else {
							this.creator.displayName = apiVideoObject.creatorUser.object.username;
							this.creator.altName = null;
						}

					}


				}

				return new Video(apiVideoObject);

			}
		}
	}]);