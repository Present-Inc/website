/**
 * Loads a new Feed Model which will be resolved, and injected into a controller
 * @param {Angular} $q
 * @param {PModels} FeedModel
 */

	PLoaders.factory('FeedLoader', ['$q', '$state', 'FeedModel', function($q, $state, FeedModel) {

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
						$state.go('splash');
					});

				return preLoadingFeed.promise;

			}

		}

	}]);
