/**
 * PApiClient.LikesApiClient
 * Handles all API requests to the Comments resource
 * 	@dependency $http {Angular}
 * 	@dependency $q {Angular}
 * 	@dependency logger {PUtilities} -- Configurable log for development and testing
 * 	@dependency ApiConfig {PApiClient} -- Provides API client configuration properties
 */

PApiClient.factory('LikesApiClient', ['$http', '$q', 'logger', 'ApiConfig',

	function($http, $q, logger, ApiConfig) {
		return {

			create : function(targetVideo, userContext) {

				var sendingRequest = $q.defer(),
					  resourceUrl = ApiConfig.getAddress() + '/v1/likes/create';

				if (userContext) {
					$http({
						method: 'POST',
						url: resourceUrl,
						data: {video_id: targetVideo},
						headers: {
							'Present-User-Context-Session-Token' : userContext.token,
							'Present-User-Context-User-Id': userContext.userId
						}
					})
						.success(function(data, status, headers) {
							logger.debug(['PApiClient.LikesApiClient.create', 'http success block', data]);
							sendingRequest.resolve(data);
						})
						.error(function(data, status, headers) {
							logger.error(['PApiClient.LikesApiClient.create', 'http error block', data]);
							sendingRequest.reject(data);
						});
				} else {
					logger.error(['PApiClient.LikesApiClient.create', 'invalid user context']);
					sendingRequest.reject({status: 'ERROR', mock: true});
				}

				return sendingRequest.promise;

			},

			destroy: function(targetVideo, userContext) {
				var sendingRequest = $q.defer(),
					  resourceUrl = ApiConfig.getAddress() + '/v1/likes/destroy';

				if (userContext) {
					$http({
						method: 'POST',
						url: resourceUrl,
						data: {video_id: targetVideo},
						headers: {
							'Present-User-Context-Session-Token' : userContext.token,
							'Present-User-Context-User-Id': userContext.userId
						}
					})
						.success(function(data, status, headers) {
							logger.debug(['PApiClient.LikesApiClient.destroy', 'http success block', data]);
							sendingRequest.resolve(data);
						})
						.error(function(data, status, headers) {
							logger.error(['PApiClient.LikesApiClient.create', 'http error block', data]);
							sendingRequest.reject(data);
						});
				} else {
					logger.error(['PApiClient.LikesApiClient.destroy', 'invalid user context']);
					sendingRequest.reject({status: 'ERROR', mock:true});
				}

				return sendingRequest.promise;
			}

		}
	}

]);