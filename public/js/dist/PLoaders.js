/**
 * Loads a new Feed Model which will be resolved, and injected into a controller
 * @param {Angular} $q
 * @param {PModels} FeedModel
 */

	PLoaders.factory('FeedLoader', ['$q', 'FeedModel', function($q, FeedModel) {

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
						//TODO : better error handling!
						preLoadingFeed.reject();
					});

				return preLoadingFeed.promise;

			}

		}

	}]);

/**
 * Loads a new Profile Model which will be resolved, and injected into a controller
 * @param {Angular} $q
 * @param {PUtilities} logger
 * @param {PManagers} ApiManager
 * @param {PManagers} UserContextManager
 */

PLoaders.factory('UserLoader', ['$q', 'logger', 'ApiManager', 'UserModel', 'UserContextManager',

	function($q, logger, ApiManager, UserModel, UserContextManager) {

		return {

			preLoad : function(method, requiresUserContext, username) {

				var loadingUser = $q.defer();
				var userContext = UserContextManager.getActiveUserContext();

				if(requiresUserContext && !userContext) {
					$state.go('login');
				} else {
					ApiManager.users(method, userContext, {username: username})
						.then(function(apiResponse) {
							var User = UserModel.construct(apiResponse.result.object, apiResponse.result.subjectiveObjectMeta);
							loadingUser.resolve(User);
						})
						.catch(function() {
							loadingUser.reject();
						});
				}

				return loadingUser.promise;

			}

		}
	}

]);
