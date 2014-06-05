/*
 * PManagers.FeedManager
 * Provides properties and methods to manage the state of Video Feeds
 *   @dependency {Present} logger
 *   @dependency {Present} FeedLoader -- Loads feed data from the Api Client
 */

  PManagers.factory('FeedManager', ['$q', 'logger', 'UserContextManager', 'VideosApiClient', 'FeedConstructor',

    function($q, logger, UserContextManager, VideosApiClient, FeedConstructor) {

       function FeedManager() {
         //Set default properties for the FeedManager
         this.type = '';
         this.activeVideo = null;
         this.cursor = null;
         this.isLoading = false;
         this.errorMessage = '';
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


      /* FeedManager.loadMoreVideos
       * Refreshes video feed by mapping the Feed Type to the correct FeedLoader Method
       */

			FeedManager.prototype.loadVideos = function(feedType, requireUserContext) {

				var loadingFeed = $q.defer(),
					userContext = UserContextManager.getActiveUserContext(),
					cursor = this.cursor;

				var resourceMethod = loadResourceMethod(feedType);

				if (requireUserContext && !userContext) {
					loadingFeed.reject();
				} else {
					VideosApiClient[resourceMethod](cursor, userContext)
						.then(function (apiResponse) {
							var Feed = FeedConstructor.create(apiResponse);
							loadingFeed.resolve(Feed);
						})
						.catch(function () {
							loadingFeed.reject();
						});
				}

				return loadingFeed.promise;

			};

			FeedManager.prototype.createComment = function(comment, targetVideo) {

				var creatingComment = $q.defer();
						userContext = UserContextManager.getActiveUserContext();


				CommentsApiClient.create(comment, targetVideo, userContext)
					.then(function(apiResponse) {
						creatingComment.resolve();
					})
					.catch(function() {
						creatingComment.reject();
					});

				return creatingComment.promise;

			};

			FeedManager.prototype.createLike = function(targetVideo) {

			};

			FeedManager.prototype.createView = function(targetVideo) {

			};

       return new FeedManager();

		}

  ]);
