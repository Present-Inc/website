/**
 * PLoaders.FeedLoader
 */

	PLoaders.factory('FeedLoader', ['$q', 'FeedConstructor', function($q, FeedConstructor) {
		return {
			preLoad : function(type, requireUserContext) {

				var preLoadingFeed = $q.defer(),
						Feed = FeedConstructor.create(type, requireUserContext);

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