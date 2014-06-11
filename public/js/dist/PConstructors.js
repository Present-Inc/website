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
										var VideoCell = {
											video    : VideoCellConstructor.Video.create(apiResponse.results[i].object),
											comments : VideoCellConstructor.Comments.create(apiResponse.results[i].object.comments),
											likes    : VideoCellConstructor.Likes.create(apiResponse.results[i].object.likes),
											replies  : VideoCellConstructor.Replies.create(apiResponse.results[i].object.replies)
										};
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
																					 'VideoCellConstructor',
																					 'ProfileConstructor',

	function($q, $state, logger, UserContextManager, VideosApiClient, UsersApiClient, VideoCellConstructor, ProfileConstructor) {

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
