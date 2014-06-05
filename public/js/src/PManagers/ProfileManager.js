/**
 * PManagers.ProfileManager
 * Provides and interface to the VideosApiClient to the view controllers
 * Parses and prepares the results provided from the UserApiClient
 *   @dependency $q
 *   @dependency logger
 *   @dependency UsersApiClient
 *   @dependency ProfileConstructor
 *   @dependency UserContextManager
 */

PManagers.factory('ProfileManager', ['$q', 'logger', 'UsersApiClient', 'ProfileConstructor', 'UserContextManager',

	function($q, logger, UsersApiClient, ProfileConstructor, UserContextManager) {

		return {

			loadOwnProfile : function() {

				var loadingProfile = $q.defer();
				var userContext = UserContextManager.getActiveUserContext();

				if(userContext) {
					UsersApiClient.showMe(userContext)
						.then(function(apiResponse) {
							var profile = ProfileConstructor.create(apiResponse.result.object);
							loadingProfile.resolve(profile);
						})
						.catch(function() {
							loadingProfile.reject();
						});
				} else loadingProfile.resolve(false);

				return loadingProfile.promise;

			},

			loadUserProfile : function(username) {

				var loadingProfile = $q.defer();
				var userContext = UserContextManager.getActiveUserContext();

				UsersApiClient.show(username, userContext)
					.then(function(apiResponse) {
						var profile = ProfileConstructor.create(apiResponse.result.object);
						loadingProfile.resolve(profile);
					})
					.catch(function() {
						loadingProfile.reject();
					});

				return loadingProfile.promise;

			}

		}
	}

]);
