/**
 * ApiClient.test.js
 * Test suite for the ApiClient
 */

describe('ApiClient', function() {

	var ApiClient, logger, $httpBackend, $q, $rootScope;


	beforeEach(function() {

		angular.mock.module('PresentWebApp');

		inject(function($injector) {

			ApiClient = $injector.get('ApiClient');
			logger = $injector.get('logger');
			$httpBackend = $injector.get('$httpBackend');
			$q = $injector.get('$q');
			$rootScope = $injector.get('$rootScope');

			spyOn(logger, 'debug').and.stub();
			spyOn(logger, 'error').and.stub();

		});

	});

	it('should send API request for list_brand_new_videos', function() {
		$httpBackend.expectGET('https://api.present.tv/v1/videos/list_brand_new_videos')
			.respond(200, {status: 'OK', result: true});
		var request = ApiClient.createRequest('videos', 'listBrandNewVideos', null, {});
		var returnedPromise = request.exec();
		expect(returnedPromise.then).toBeDefined();
		returnedPromise.then(function(apiResponse) {
			expect(apiResponse.status).toBe('OK');
			expect(apiResponse.result).toBeTruthy();
		});
		$httpBackend.flush();
	});

	it('should sent an API request for list_brand_new_videos', function() {
		$httpBackend.expectGET('https://api.present.tv/v1/videos/list_brand_new_videos?limit=5')
			.respond(200, {status: 'OK', result: true});
		var request = ApiClient.createRequest('videos', 'listBrandNewVideos', null, {limit: 5});
		var returnedPromise = request.exec();
		expect(returnedPromise.then).toBeDefined();
		returnedPromise.then(function(apiResponse) {
			expect(apiResponse.status).toBe('OK');
			expect(apiResponse.result).toBeTruthy();
		});
		$httpBackend.flush();
	});

	it('should not send a request for list_home_videos', function() {
		var request = ApiClient.createRequest('videos', 'listHomeVideos', null, {});
		var returnedPromise = request.exec();
		expect(returnedPromise.then).toBeDefined();
		returnedPromise.then(function(data) {
			expect(data.status).toBe('ERROR');
			expect(data.result).toBeDefined();
		});
	});

	it('should send a request for list_home_videos', function() {
		$httpBackend.expectGET('https://api.present.tv/v1/videos/list_home_videos')
			.respond(200, {status: 'OK', result: true});
		var userContext = {userId: '123', token: '456'};
		var request = ApiClient.createRequest('videos', 'listHomeVideos', userContext, {});
		var returnedPromise = request.exec();
		expect(returnedPromise.then).toBeDefined();
		returnedPromise.then(function(data) {
			expect(data.status).toBe('OK');
			expect(data.result).toBeTruthy();
		});
		$httpBackend.flush();
	});


});