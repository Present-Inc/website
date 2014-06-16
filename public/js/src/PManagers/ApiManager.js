/**
 * PManagers.ApiManager.js
 */

PManagers.factory('ApiManager', ['ApiClient', function(ApiClient) {
	return {
		userContexts: function(method, userContext, params) {
			return ApiClient.createRequest('userContexts', method, userContext, params).exec();
		},
		videos: function(method, userContext, params) {
			return ApiClient.createRequest('videos', method, userContext, params).exec();
		},
		users: function(method, userContext, params) {
			return ApiClient.createRequest('users', method, userContext, params).exec();
		},
		comments: function(method, userContext, params) {
			return ApiClient.createRequest('comments', method, userContext, params).exec();
		},
		likes: function(method, userContext, params) {
			return ApiClient.createRequest('likes', method, userContext, params).exec();
		},
		views: function(method, userContext, params) {
			return ApiClient.createRequest('views', method, userContext, params).exec();
		},
		demands: function(method, userContext, params) {
			return ApiClient.createRequest('demands', method, userContext, params).exec();
		},
		friendships: function(method, userContext, params) {
			return ApiClient.createRequest('friendships', method, userContext, params).exec();
		},
		activities: function(method, userContext, params) {
			return ApiClient.createRequest('activities', method, userContext, params).exec();
		}
	}
}]);