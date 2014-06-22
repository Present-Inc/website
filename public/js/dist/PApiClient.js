/**
 * Handles sending and receiving requests from the Present
 * @namespace
 * @param  $http  <Angular>
 * @param  $q <Angular>
 * @param  logger <PUtilities>
 * @param PApiClientConfig <PApiClient>
 * @returns {Function} createRequest
 */

PApiClient.factory('ApiClient', ['$http', '$q', 'logger', 'ApiClientConfig', function($http, $q, logger, ApiConfig) {
	return {

		/**
		 * Factory method that returns a new Request instance
		 * @returns {Request}
		 */

		createRequest : function(resource, method, userContext, params) {

			/**
			 * @constructor
			 * @param {String} resource - API resource being requested ex: 'videos'
			 * @param {String} method - Resource method being requested ex 'listBrandNewVideos'
			 * @param {UserContext} userContext - the active user context
			 * @param {Object} params - Request params, which will either be assigned as body params or query strings
			 *
			 * @property {String} httpMethod - HTTP verb e.g. 'POST
			 * @property {String} url - Url where the resource method is located
			 * @property {Object} data -  Params attached to the request body
			 * @property {Object} params - Params included in the query string
			 * @property {Object} headers - Present user context headers
			 * @property {Boolean} validUserContextHeaders - Indicates whether the user context headers were set
			 * @property {boolean} requiresUserContext - Determines if the request requires a valid user context
			 */

			/**
			 * api.present.tv/v1/videos/list_brand_new_videos
			 */

			function Request(resource, method, userContext, params) {

				var config = ApiConfig;

				logger.debug('Sending Request: ' + config.resources[resource][method].url);

				this.httpMethod = config.resources[resource][method].httpMethod;
				this.url = config.baseUrl + config.resources[resource][method].url;

				if(this.httpMethod == 'POST') {
					this.data = params;
				}
				else {
					this.params = params;
				}

				if (userContext) {
					this.headers = {
						'Present-User-Context-Session-Token': userContext.token,
						'Present-User-Context-User-Id': userContext.userId
					};
					this.validUserContextHeaders = true;
				} else {
						this.headers = {};
						this.validUserContextHeaders = false;
						this.requiresUserContext = config.resources[resource][method].requiresUserContext;
				}
			}

			/**
			 * Executes the XHR call with failure and success blocks
			 * @returns {*}
			 */

			Request.prototype.exec = function () {

				var sendingRequest = $q.defer();

				if (this.requiresUserContext && !this.validUserContextHeaders) {
					sendingRequest.reject({status: 'ERROR', result: 'missing required user context headers'});
				} else {
					$http({
						method: this.httpMethod,
						url: this.url,
						params: this.params,
						data: this.data,
						headers: this.headers
					})
						.success(function (data, status, headers) {
							logger.debug(['PApiClient http success block ', status, data]);
							sendingRequest.resolve(data);
						})
						.error(function (data, status, headers) {
							logger.error(['PApiClient http error block', status, data]);
							sendingRequest.reject(data);
						});
				}

				return sendingRequest.promise;

			};

			return new Request(resource, method, userContext, params);
		}
	}
}]);


/**
 * Api Configuration:
 * @namespace
 * @returns {Object}
 */

PApiClient.factory('ApiClientConfig', function() {
	return {

		baseUrl : 'https://api.present.tv/v1/',

		videoQueryLimit : 5,

		resources : {

			userContexts : {
				create : {
					httpMethod : 'POST',
					url : 'user_contexts/create',
					requiresUserContext : false
				},
				destroy : {
					httpMethod : 'POST',
					url : 'user_contexts/destroy',
					requiresUserContext : true
				}
			},

			videos : {
				listBrandNewVideos : {
					httpMethod : 'GET',
					url : 'videos/list_brand_new_videos',
					requiresUserContext : false
				},
				listHomeVideos : {
					httpMethod : 'GET',
					url : 'videos/list_home_videos',
					requiresUserContext : true
				},
				listUserVideos : {
					httpMethod : 'GET',
					url : 'videos/list_user_videos',
					requiresUserContext : false
				},
				search : {
					httpMethod : 'GET',
					url : 'videos/search',
					requiresUserContext : false
				}
			},

			users : {
				show : {
					httpMethod : 'GET',
					url : 'users/show',
					requiresUserContext : false
				},
				showMe : {
					httpMethod : 'GET',
					url : 'users/show_me',
					requiresUserContext : true
				},
				search : {
					httpMethod : 'GET',
					url : 'users/search',
					requiresUserContext : false
				}
			},

			likes : {
				create : {
					httpMethod : 'POST',
					url : 'likes/create',
					requiresUserContext : true
				},
				destroy : {
					httpMethod : 'POST',
					url : 'likes/destroy',
					requiresUserContext : true
				}
			},

			comments : {
				create : {
					httpMethod : 'POST',
					url : 'comments/create',
					requiresUserContext : true
				},
				destroy : {
					httpMethod : 'POST',
					url : 'comments/destroy',
					requiresUserContext : false
				}
			},

			views : {},
			demands : {},
			friendships : {},
			activities : {}

		}
	}
});
