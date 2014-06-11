/**
 * FeedConstructor.test.js
 * Test suite for the PManagers.FeedManager
 */

describe('FeedConstructor', function() {

	var HomeFeed,
			DiscoverFeed,
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
			var FeedConstructor = $injector.get('FeedConstructor');
			DiscoverFeed = FeedConstructor.create('discover', false);
			HomeFeed = FeedConstructor.create('home', true);

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

	describe('load', function() {

		beforeEach(function() {

		});

		it('should load a video feed of the desired type', function() {

		});

		it('should do nothing if the feed requires a user context and the user context is undefined', function() {

		});

	});

});