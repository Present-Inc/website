/**
 * FeedManager.test.js
 * Test suite for the PManagers.FeedManager
 */

describe('FeedManager', function() {

	var FeedManager,
			UserContextManager,
			VideosApiClient,
			FeedConstructor,
			logger,
			$q,
			$rootScope;

	beforeEach(function() {

		angular.mock.module('PresentWebApp');

		inject(function($injector) {

			//Service being tested
			FeedManager = $injector.get('FeedManager');

			//Service Dependencies
			UserContextManager = $injector.get('UserContextManager');
			VideosApiClient = $injector.get('VideosApiClient');
			FeedConstructor = $injector.get('FeedConstructor');
			logger = $injector.get('logger');

			//Test Dependencies
			$q = $injector.get('$q');
			$rootScope = $injector.get('$rootScope');

		});

	});

	describe('loadFeed', function() {

		beforeEach(function() {

		});

		it('should load a video feed of the desired type', function() {

		});

		it('should do nothing if the feed requires a user context and the user context is undefined', function() {

		});

	});

	describe('createComment', function() {

		beforeEach(function() {

		});

		it('should call the Comments API client to create a new comment', function() {

		});

	});

	describe('createLike', function() {

		beforeEach(function() {

		});

		it('should call the Likes API Client to create a new like', function() {

		});

	});

	describe('createView', function() {

		beforeEach(function() {

		});

		it('should call the Views API Client to create a new view', function() {

		});

	});

});