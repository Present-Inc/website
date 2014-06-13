/**
 * PLoader.ProfileManager
 * Provides and interface to the VideosApiClient to the view controllers
 * Parses and prepares the results provided from the UserApiClient
 *   @dependency $q {Angular}
 *   @dependency logger {PUtilities}
 *   @dependency UsersApiClient {PApiClient}
 *   @dependency UserContextManager {PManagers}
 */

PLoaders.factory('ProfileLoader', ['$q', 'logger', 'UsersApiClient', 'ProfileModel', 'UserContextManager',

	function($q, logger, UsersApiClient, ProfileModel, UserContextManager) {

		return {

			loadOwnProfile : function() {

				var loadingProfile = $q.defer();
				var userContext = UserContextManager.getActiveUserContext();

				if(userContext) {
					UsersApiClient.showMe(userContext)
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

				UsersApiClient.show(username, userContext)
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
