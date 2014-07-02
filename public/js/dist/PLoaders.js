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


/**
 * Loads a new Profile Model which will be resolved, and injected into a controller
 * @param {Angular} $q
 * @param {PUtilities} logger
 * @param {PManagers} ApiManager
 * @param {PManagers} UserContextManager
 */

PLoaders.factory('UserLoader', ['$q', '$state', 'logger', 'ApiManager', 'UserModel', 'UserContextManager',

	function($q, $state, logger, ApiManager, UserModel, UserContextManager) {

		return {

			preLoad : function(username) {

				var loadingUser = $q.defer(),
						userContext = UserContextManager.getActiveUserContext(),
						isActiveUser = false;

				if(username == 'activeUser') isActiveUser = true;
				else if(username == userContext.profile.username) isActiveUser = true;


				var user = UserModel.create(isActiveUser);

				user.load({username: username})
					.then(function() {
						loadingUser.resolve(user);
					})
					.catch(function() {
						$state.go('splash');
					});

				return loadingUser.promise;

			}

		}
	}

]);
