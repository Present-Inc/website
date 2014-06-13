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