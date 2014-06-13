/**
 * PApiClient.CommentsApiClient
 * Handles all API requests to the Comments resource
 * 	@dependency $http {Angular}
 * 	@dependency $q {Angular}
 * 	@dependency logger {PUtilities} -- Configurable log for development and testing
 * 	@dependency ApiConfig {PApiClient} -- Provides API client configuration properties
 */

	PApiClient.factory('CommentsApiClient', ['$http', '$q', 'logger', 'ApiConfig',

		function($http, $q, logger, ApiConfig) {
			return {

				construct: function(comment, targetVideo, userContext) {

					var sendingRequest = $q.defer(),
							resourceUrl = ApiConfig.getAddress() + '/v1/comments/create';

					if (userContext) {
						$http({
							method: 'POST',
							url: resourceUrl,
							data: {comment: comment, target_video: targetVideo},
							headers: {
								'Present-User-Context-Session-Token' : userContext.token,
								'Present-User-Context-User-Id': userContext.userId
							}
						})
							.success(function(data, status, headers) {
								logger.debug();
								sendingRequest.resolve(data);
							})
							.error(function(data, status, headers) {
								logger.error();
								sendingRequest.reject(data);
							});
					} else {
							logger.error();
							sendingRequest.reject({status: 'ERROR', mock: true});
					}
					return sendingRequest.promise;

				},

				destroy: function(comment, userContext) {

				}

			}
		}

	]);