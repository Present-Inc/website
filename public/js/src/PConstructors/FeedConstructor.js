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
										var VideoCell = VideoCellConstructor.create(apiResponse.results[i].object);
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
