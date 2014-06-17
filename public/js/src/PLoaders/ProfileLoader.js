/**
 * Loads a new Profile Model which will be resolved, and injected into a controller
 * @param {Angular} $q
 * @param {Putilities} logger
 * @param {PManagers} ApiManager
 * @param {PManagers} UserContextManager
 */

PLoaders.factory('ProfileLoader', ['$q', 'logger', 'ApiManager', 'ProfileModel', 'UserContextManager',

	function($q, logger, ApiManager, ProfileModel, UserContextManager) {

		return {

			loadOwnProfile : function() {

				var loadingProfile = $q.defer();
				var userContext = UserContextManager.getActiveUserContext();

				if(userContext) {
					ApiManager.users('showMe', userContext, {})
						.then(function(apiResponse) {
							var Profile = ProfileModel.construct(apiResponse.result.object);
							loadingProfile.resolve(Profile);
						})
						.catch(function() {
							loadingProfile.reject();
						});
				} else loadingProfile.resolve(false);

				return loadingProfile.promise;

			},

			loadUserProfile : function(username) {

				var loadingProfile = $q.defer(),
						userContext = UserContextManager.getActiveUserContext();

				ApiManager.users('show', userContext, {username : username})
					.then(function(apiResponse) {
						var Profile = ProfileModel.construct(apiResponse.result.object);
						loadingProfile.resolve(Profile);
					})
					.catch(function() {
						loadingProfile.reject();
					});

				return loadingProfile.promise;

			}

		}
	}

]);
