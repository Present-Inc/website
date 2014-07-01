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

          var mapSourceUser = function(username, videoCells) {
            var mappingSourceUser = $q.defer(),
                _this = this;
            ApiManager.users('show', false, {username: username})
              .then(function(apiResponse) {
                videoCells.map(function(videoCell) {
                  videoCell.video.creator = ProfileModel.construct(apiResponse.result.object);
                });
                mappingSourceUser.resolve();
              })
              .catch(function() {
                mappingSourceUser.reject();
              });
            return mappingSourceUser.promise;
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
									if(_this.type == 'user') mapSourceUser(_this.username, _this.videoCells)
                                            .then(loadingFeed.resolve());
									else loadingFeed.resolve();
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
