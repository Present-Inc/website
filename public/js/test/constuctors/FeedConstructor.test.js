/**
 * FeedConstructor.test.js
 * Test suite for the PManagers.FeedManager
 */

describe('FeedConstructor', function() {

	var FeedConstructor,
			UserContextManager,
			VideosApiClient,
			VideoCellConstructor,
			logger,
			$q,
			$rootScope;

	beforeEach(function() {

		angular.mock.module('PresentWebApp');

		inject(function($injector) {

			//Service being tested
			FeedConstructor = $injector.get('FeedConstructor');

			//Service Dependencies
			UserContextManager = $injector.get('UserContextManager');
			VideosApiClient = $injector.get('VideosApiClient');
			VideoCellConstructor = $injector.get('VideoCellConstructor');
			logger = $injector.get('logger');

			//Test Dependencies
			$q = $injector.get('$q');
			$rootScope = $injector.get('$rootScope');

		});

	});

	describe('create', function() {

		it('should create a new Feed Object', function() {

		});

	});

	describe('Feed.prototype.load', function() {

		beforeEach(function() {

		});

		it('should load a video feed of the desired type', function() {

		});

	});

});