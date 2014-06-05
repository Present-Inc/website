/*
 * PManagers.FeedManager
 * Provides properties and methods to manage the state of Video Feeds
 *   @dependency $q {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency UserContextManager {PManagers}
 *   @dependency VideosApiClient {PApiClient}
 *   @dependency FeedConstructor {PConstructors}
 */

  PManagers.factory('FeedManager', ['$q', 'logger', 'UserContextManager', 'VideosApiClient', 'FeedConstructor',

    function($q, logger, UserContextManager, VideosApiClient, FeedConstructor) {

       function FeedManager() {
         this.type = '';
         this.activeVideo = null;
         this.cursor = null;
         this.isLoading = false;
         this.errorMessage = '';
         this.videoCells = [];
       }

			/**
			 * Private Method: loadResourceMethod
			 * @param feedType <String> -- defines the feed type [i.e. 'discover']
			 * @returns resourceMethod <String> -- the resource method for the provided feed type
			 */

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

      /**
			 * FeedManager.loadVideos
			 * 	@param feedType <String> -- defines the feed type [i.e. 'discover']
			 * 	@returns requireUserContext <Boolean> -- determines if the feed requires a user context to access
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

			/**
			 * FeedManager.createComment
			 * 	@param comment <String> -- the comment body
			 * 	@param targetVideo <String> -- _id for the target video
			 *  @returns promise <Object>
			 */

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

			/**
			 * FeedManager.createLike
			 * @param targetVideo -- _id for the target video
			 */

			FeedManager.prototype.createLike = function(targetVideo) {

			};

			/**
			 * FeedManager.createView
			 * @param targetVideo -- _id for the target video
			 */

			FeedManager.prototype.createView = function(targetVideo) {

			};

      return new FeedManager();

		}

  ]);
